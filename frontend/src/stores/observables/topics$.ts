import { switchMap, tap, distinctUntilChanged, map } from 'rxjs/operators';
import { TopicService } from '@/services/topicService';
import { useTopicStore } from '@/stores/topicStore';
import { useAdminStore } from '@/stores/adminStore';
import { storeToObservable } from '@/stores/utils/observables';

// Create observable from the store
const store$ = storeToObservable(useTopicStore);

// Create observable from the refetch trigger
const refetchTrigger$ = store$.pipe(
  map(state => state.refetchTrigger),
  distinctUntilChanged()
);

// Main topics observable that fetches topics when triggered
export const topics$ = refetchTrigger$.pipe(
  tap(() => {
    // Clear any previous errors
    const { clearError } = useAdminStore.getState();
    clearError();
  }),
  switchMap(async () => {
    try {
      const topics = await TopicService.getTopics();
      // Update the store with fetched topics
      const { setTopics } = useTopicStore.getState();
      setTopics(topics);
      return topics;
    } catch (error) {
      // Handle error without breaking the stream
      const { setError } = useAdminStore.getState();
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch topics';
      setError(errorMessage);
      console.error('Failed to fetch topics:', error);
      // Return empty array to keep stream alive
      return [];
    }
  })
);