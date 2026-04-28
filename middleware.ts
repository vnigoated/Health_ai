import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "healthai-fallback-secret-change-in-production"
)

const protectedPrefixes = ["/dashboard"]
const authOnlyPrefixes = ["/signin", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, secret)
      isAuthenticated = true
    } catch {}
  }

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  const isAuthOnly = authOnlyPrefixes.some((p) => pathname.startsWith(p))

  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/signin"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
