import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { Toaster, TOAST_MAX_DURATION_MS } from '@/lib/toast';
import '@/i18n';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        expand={true}
        richColors
        theme="dark"
        closeButton
        dir="auto"
        mobileOffset={{ top: 76, left: 12, right: 12 }}
        toastOptions={{
          duration: TOAST_MAX_DURATION_MS,
          classNames: {
            toast:
              "relative !min-h-0 !w-[calc(100vw-1.5rem)] !max-w-[360px] !items-start !gap-3 !rounded-xl !p-4 !ps-4 !pe-12",
            content: "!min-w-0 !gap-1",
            title: "!whitespace-normal !break-normal !text-base !font-bold !leading-6",
            description: "!whitespace-normal !break-normal !text-sm !leading-5",
            closeButton:
              "!absolute !left-3 !right-auto !top-3 !h-7 !w-7 !translate-x-0 !translate-y-0",
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
