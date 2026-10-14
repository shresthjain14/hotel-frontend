import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Footer, Header, WhatsAppButton } from "@/components/site";

function NotFoundComponent() { return <main className="status-page"><h1>404</h1><h2>Page not found</h2><p>The page you’re looking for doesn’t exist or has moved.</p><Link className="button button-gold" to="/">Go home</Link></main>; }
function ErrorComponent({ error, reset }: ErrorComponentProps) { const router = useRouter(); useEffect(() => reportLovableError(error, { boundary: "root" }), [error]); return <main className="status-page"><h1>Something went wrong</h1><p>Please try again.</p><button className="button button-gold" onClick={() => { router.invalidate(); reset(); }}>Try again</button></main>; }
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { name: "author", content: "Al Hayat Hotel Sharjah" }], links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.png", type: "image/png" }] }),
  shellComponent: RootShell, component: RootComponent, notFoundComponent: NotFoundComponent, errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) { return <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>; }
function RootComponent() { const { queryClient } = Route.useRouteContext(); return <QueryClientProvider client={queryClient}><Header /><div className="route-view"><Outlet /></div><Footer /><WhatsAppButton /></QueryClientProvider>; }
