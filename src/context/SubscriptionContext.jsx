import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { subscriptionApi } from "../lib/subscriptionApi";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    subscriptionApi
      .getMySubscription()
      .then((data) => {
        if (isMounted) {
          setSubscription(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Subscription fetch error:", err);
          setError(err);
          setSubscription(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.id]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, error }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// ✅ This is the missing export
export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return ctx;
}
