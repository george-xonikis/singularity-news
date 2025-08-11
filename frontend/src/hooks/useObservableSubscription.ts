import { useEffect, useRef } from 'react';
import { Subscription, Observable } from 'rxjs';

/**
 * Generic hook that subscribes to any observable and manages the subscription lifecycle.
 *
 * What it does:
 * 1. On mount: Creates subscription to the provided observable
 * 2. On observable changes: Automatically handles new subscriptions
 * 3. On unmount: Cleans up subscription
 *
 * @param observable$ - The observable to subscribe to
 * @returns The active subscription (mainly for debugging)
 */
export function useObservableSubscription<T>(observable$: Observable<T>) {
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    subscriptionRef.current = observable$.subscribe();

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [observable$]); // Re-subscribe when observable changes

  return subscriptionRef.current;
}