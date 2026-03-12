import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin") && nextUrl.pathname !== "/admin-login"
    const isTeknisiRoute = nextUrl.pathname.startsWith("/teknisi") && nextUrl.pathname !== "/teknisi/login"
    const isLoginPage = nextUrl.pathname === "/admin-login" || nextUrl.pathname === "/teknisi/login"

    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    if (isAdminRoute || isTeknisiRoute) {
        if (!isLoggedIn && !isLoginPage) {
            let callbackUrl = nextUrl.pathname;
            if (nextUrl.search) {
                callbackUrl += nextUrl.search;
            }
            const encodedCallbackUrl = encodeURIComponent(callbackUrl);

            return NextResponse.redirect(
                new URL(isAdminRoute ? `/admin-login?callbackUrl=${encodedCallbackUrl}` : `/teknisi/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
            );
        }

        // Role based authorization
        const userRole = req.auth?.user?.role
        if (isAdminRoute && userRole === "TEKNISI") {
            return NextResponse.redirect(new URL("/teknisi/dashboard", nextUrl))
        }

        if (isTeknisiRoute && userRole !== "TEKNISI") {
            return NextResponse.redirect(new URL("/admin/dashboard", nextUrl))
        }
    }

    return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
