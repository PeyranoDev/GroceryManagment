import { useState, useEffect } from "react";

export function useAuthStorage(storageKey = "app_user") {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
      }
    }
    setLoading(false);
  }, [storageKey]);

  const saveUser = (user, remember = true) => {
    setUser(user);
    if (remember) {
      localStorage.setItem(storageKey, JSON.stringify(user));
      sessionStorage.removeItem(storageKey);
    } else {
      sessionStorage.setItem(storageKey, JSON.stringify(user));
      localStorage.removeItem(storageKey);
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
  };

  return { user, saveUser, clearUser, loading };
}
