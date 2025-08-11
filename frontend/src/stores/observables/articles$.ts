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
import { log } from 'node:util';

/**
 * The Articles observable emits whenever filters, sorting, or pagination changes
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

const filters$: Observable<ArticleFilters> = combineLatest([search$, nonSearchFilters$]).pipe(
    map(([search, otherFilters]) => ({
      ...otherFilters,
      ...(search ? { search } : {}) // Only include search if it has a value
    })),
    startWith(createInitialFilters()),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

/**
 * Creates a complete reactive pipeline:
 * Filters changes → Fetch articles → Store results
 */
export const articles$ =
  filters$.pipe(
    tap(v => console.log(v)),
    // Remove duplicates - this is critical to prevent double requests
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),

    // Set loading state
    tap(() => {
      useAdminStore.getState().setLoading(true);
      useAdminStore.getState().clearError();
    }),

    // Fetch articles (switchMap cancels previous requests)
    switchMap(filters => {
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