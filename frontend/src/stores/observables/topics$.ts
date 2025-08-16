import { from } from 'rxjs';
import { switchMap, tap, distinctUntilChanged, map, catchError, startWith } from 'rxjs/operators';
import { TopicService } from '@/services/topicService';
import { useTopicStore } from '@/stores/topicStore';
import { useAdminStore } from '@/stores/adminStore';
import { storeToObservable } from '@/stores/utils/observables';

// Create observable from the store
const store$ = storeToObservable(useTopicStore);

// Create observable from the refetch trigger
const refetchTrigger$ = store$.pipe(
  map(state => state.refetchTrigger),
  distinctUntilChanged(),
  startWith(0) // Trigger initial fetch
);

// Main topics observable that fetches topics when triggered
export const topics$ = refetchTrigger$.pipe(
  tap(() => {
    // Clear any previous errors
    useAdminStore.getState().clearError();
  }),
  switchMap(() =>
    from(TopicService.getTopics()).pipe(
      tap(topics => {
        // Update the store with fetched topics
        useTopicStore.getState().setTopics(topics);
      }),
      catchError(error => {
        // Handle error without breaking the stream
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch topics';
        useAdminStore.getState().setError(errorMessage);
        console.error('Failed to fetch topics:', error);
        // Return empty array to keep stream alive
        return from([[]]);
      })
    )
  )
);