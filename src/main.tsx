import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import { router } from "./routes/router";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

useAuthStore.getState().hydrate();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position='bottom-center' />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
