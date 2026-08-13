import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const TestProvidersWrapper = ({ children }) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
