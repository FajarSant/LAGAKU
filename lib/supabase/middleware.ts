import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Refresh session
    const { data: { session } } = await supabase.auth.getSession();

    // Daftar route yang perlu authentication (admin routes)
    const adminRoutes = [
      '/dashboard',
      '/acara',
      '/tim',
      '/peserta',
      '/pertandingan',
      '/bracket',
      '/pengguna',
      '/statistik',
      '/pengaturan',
    ];

    const isAdminRoute = adminRoutes.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );

    // Jika route admin
    if (isAdminRoute) {
      // Tidak ada session = redirect ke login
      if (!session) {
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Cek role admin di tabel pengguna
      const { data: pengguna, error } = await supabase
        .from("pengguna")
        .select("peran, is_verified")
        .eq("email", session.user.email)
        .single();

      // Jika error atau tidak ditemukan, redirect ke unauthorized
      if (error || !pengguna) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Jika bukan admin atau tidak verified
      if (pengguna.peran !== 'admin' || !pengguna.is_verified) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    // Jika sudah login tapi mengakses login page, redirect ke dashboard
    if (session && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};