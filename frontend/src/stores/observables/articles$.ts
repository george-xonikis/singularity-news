import { Observable, combineLatest } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  switchMap,
  tap,
  catchError,
  startWith
} from 'rxjs/operators';
import { storeToObservable } from '../utils/observables';
import { useArticleStore, createInitialFilters } from '../articleStore';
import { useAdminStore } from '../adminStore';
import { ArticleService } from '@/services/articleService';
import type { ArticleFilters } from '@singularity-news/shared';

/**
 * The Articles observable emits whenever filters, sorting, pagination, or refetch trigger changes
 */
const store$ = storeToObservable(useArticleStore);

const search$ = store$.pipe(
  map(state => state.filters.search),
  distinctUntilChanged(),
  debounceTime(500) // Debounce search input
);

const nonSearchFilters$ = store$.pipe(
  map(state => {
    const { search, ...nonSearchFilters } = state.filters;
    return nonSearchFilters;
  }),
  distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  debounceTime(50) // Small debounce for UI interactions
);

// Watch for refetch trigger changes
const refetchTrigger$ = store$.pipe(
  map(state => state.refetchTrigger),
  distinctUntilChanged()
);

// Combine filters with refetch trigger
const filters$: Observable<{ filters: ArticleFilters; trigger: number }> = combineLatest([
  combineLatest([search$, nonSearchFilters$]).pipe(
    map(([search, otherFilters]) => ({
      ...otherFilters,
      ...(search ? { search } : {}) // Only include search if it has a value
    }))
  ),
  refetchTrigger$
]).pipe(
  map(([filters, trigger]) => ({ filters, trigger })),
  startWith({ filters: createInitialFilters(), trigger: 0 }),
  distinctUntilChanged((a, b) =>
    JSON.stringify(a.filters) === JSON.stringify(b.filters) && a.trigger === b.trigger
  )
);

/**
 * Creates a complete reactive pipeline:
 * Filters/Refetch changes → Fetch articles → Store results
 */
export const articles$ =
  filters$.pipe(
    // Set loading state
    tap(() => {
      useAdminStore.getState().setLoading(true);
      useAdminStore.getState().clearError();
    }),

    // Fetch articles (switchMap cancels previous requests)
    switchMap(({ filters }) => {
      return ArticleService.getArticles(filters);
    }),

    // Store results
    tap(result => {
      useArticleStore.setState({
        articles: result.data,
        pagination: result.pagination,
      });
      useAdminStore.getState().setLoading(false);
    }),

    // Handle errors
    catchError(error => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles';
      useAdminStore.getState().setError(errorMessage);
      useAdminStore.getState().setLoading(false);
      console.error('Failed to fetch articles:', error);

      // Return empty array to keep stream alive
      return [];
    })
  );