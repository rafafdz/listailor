import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as OriginalPostHogProvider } from 'posthog-js/react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'always',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug();
        },
      });
    }
  }, []);

  const renderProvider = () => {
    return OriginalPostHogProvider({ client: posthog, children });
  };

  return renderProvider();
}