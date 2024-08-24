"use client"

import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { ReactNode } from "react";

const queryClinet = new QueryClient();
const TanStackProvider = ({children}:{children:ReactNode}) => {
    return (
        <QueryClientProvider client={queryClinet}>
            {children}
        </QueryClientProvider>
    )
    
}

export default TanStackProvider;