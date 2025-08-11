import { Observable } from 'rxjs';
import { StoreApi } from 'zustand';

/**
 * Converts a Zustand store to an RxJS Observable
 * This allows us to use all RxJS operators with our Zustand stores
 *
 * @param store - The Zustand store API
 * @returns An RxJS Observable that emits store state changes
 */
export function storeToObservable<T>(store: StoreApi<T>): Observable<T> {
  return new Observable(subscriber => {
    // Emit the current state immediately
    subscriber.next(store.getState());

    // Subscribe to all state changes
    const unsubscribe = store.subscribe((state) => {
      subscriber.next(state);
    });

    // Cleanup function when Observable is unsubscribed
    return () => {
      unsubscribe();
    };
  });
}

/**
 * Helper to get store API from hook
 * Zustand hooks have the store API attached as a property
 */
export function getStoreApi<T>(useStore: StoreApi<T> & { getState: () => T }): StoreApi<T> {
  return useStore;
}