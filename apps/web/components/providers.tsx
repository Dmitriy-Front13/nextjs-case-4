"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { SWRConfig } from "swr";
export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ClerkProvider>
      <SWRConfig value={{ fetcher }}>{children}</SWRConfig>
    </ClerkProvider>
  );
}