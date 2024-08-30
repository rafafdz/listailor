import dynamic from "next/dynamic";
import Head from "next/head"; // Import Head from next/head
import '@/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ListsProvider } from '@/contexts/ListsContext';  // Import the provider
import { Analytics } from "@vercel/analytics/react";
import { PostHogProvider } from '@/components/PostHogProvider';  // Import the new component

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ListsProvider>
        <PostHogProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
          </Head>
          <Analytics />
          <div
            className={`
              min-h-screen flex flex-col font-sans antialiased
              ${fontSans.variable}
            `}
          >
            <Component {...pageProps} />
          </div>
        </PostHogProvider>
      </ListsProvider>
    </QueryClientProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

