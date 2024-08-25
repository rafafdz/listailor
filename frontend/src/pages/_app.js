import dynamic from "next/dynamic";
import '@/styles/globals.css';
import { Inter as FontSans } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ListsProvider } from '@/contexts/ListsContext';  // Import the provider

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const queryClient = new QueryClient()

function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ListsProvider> {/* Wrap your app with the ListsProvider */}
        <div
          className={`
            min-h-screen bg-background font-sans antialiased
            ${fontSans.variable}
          `}
        >
          <Component {...pageProps} />
        </div>
      </ListsProvider>
    </QueryClientProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

