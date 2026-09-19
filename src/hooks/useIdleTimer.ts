import { useEffect, useRef } from 'react';
import { isAuthenticated, logout } from '../services/authService';

interface UseIdleTimerOptions {
  enabled: boolean;
  timeoutMinutes: number;
  onTimeout?: () => void;
}

const STORAGE_LAST_ACTIVITY_KEY = 'phatlada_last_user_activity';

/**
 * Hook to automatically log out when user is inactive (idle)
 * for the configured duration, invalidating tokens and clearing cookies.
 */
export function useIdleTimer({ enabled, timeoutMinutes, onTimeout }: UseIdleTimerOptions): void {
  const lastActivityRef = useRef<number>(Date.now());
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    // If auto logout is disabled or invalid minutes, do not run timer
    if (!enabled || timeoutMinutes <= 0) return;

    // Reset last activity timestamp on mount
    lastActivityRef.current = Date.now();

    const updateActivity = () => {
      const now = Date.now();
      // Throttle event handling to at most once per 2 seconds
      if (now - throttleRef.current > 2000) {
        throttleRef.current = now;
        lastActivityRef.current = now;
        try {
          localStorage.setItem(STORAGE_LAST_ACTIVITY_KEY, String(now));
        } catch {
          // Ignore storage quota or access issues
        }
      }
    };

    // Cross-tab synchronization: update timer if active in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_LAST_ACTIVITY_KEY && e.newValue) {
        const remoteTime = parseInt(e.newValue, 10);
        if (!isNaN(remoteTime) && remoteTime > lastActivityRef.current) {
          lastActivityRef.current = remoteTime;
        }
      }
    };

    const events: (keyof WindowEventMap)[] = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, updateActivity, { passive: true });
    });
    window.addEventListener('storage', handleStorageChange);

    const timeoutMs = timeoutMinutes * 60 * 1000;

    // Check idle status every 10 seconds
    const intervalId = window.setInterval(async () => {
      // Only trigger if user is currently authenticated
      if (!isAuthenticated()) return;

      const idleDuration = Date.now() - lastActivityRef.current;
      if (idleDuration >= timeoutMs) {
        window.clearInterval(intervalId);

        if (onTimeout) {
          onTimeout();
        } else {
          await logout();
          window.location.href = `/login?reason=idle_timeout&mins=${timeoutMinutes}`;
        }
      }
    }, 10000);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, updateActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      window.clearInterval(intervalId);
    };
  }, [enabled, timeoutMinutes, onTimeout]);
}

