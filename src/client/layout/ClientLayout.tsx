import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/client/components/header/Header";
import IceGlassBackground from "@/client/components/background/IceGlassBackground";
import Footer from "@/client/components/footer/Footer";
import ToastProvider from "@/client/context/ToastProvider";
import CurrencyProvider from "@/client/context/CurrencyProvider";
import ErrorBoundary from "@/client/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: false },
  },
});

export default function ClientLayout() {
  const { pathname } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Must be inside the query provider. */}
      <CurrencyProvider>
        <ToastProvider>
          <IceGlassBackground />
          <Header />
          <main className="min-h-screen">
            {/* Keyed by path so leaving a crashed page resets the boundary. */}
            <ErrorBoundary key={pathname}>
              <Outlet />
            </ErrorBoundary>
          </main>
          <Footer />
        </ToastProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}
