import { createRootRoute, Outlet } from '@tanstack/react-router';
import { StoreProvider } from '@/context/Store';
import { Layout } from '@/components/Layout';
import React from 'react';

const ScrollToTop = () => {
  // Use tanstack router's useRouter or similar if needed, or simply let the browser handle it.
  // We can hook into router events if needed. For now a simple layout wrap works.
  return null;
}

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <StoreProvider>
      <Layout>
        <ScrollToTop />
        <Outlet />
      </Layout>
    </StoreProvider>
  );
}
