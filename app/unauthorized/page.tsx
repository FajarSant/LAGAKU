export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-secondary/20 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 animate-pulse rounded-full bg-destructive/5 blur-3xl delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 animate-pulse rounded-full bg-blue-500/5 blur-3xl delay-500" />
      </div>

      <div className="relative w-full max-w-lg animate-fade-in">
        {/* Card Container */}
        <div className="rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-8 shadow-2xl shadow-primary/5">
          {/* Icon with animation */}
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-destructive/10 to-destructive/5 p-6">
              <div className="relative">
                <svg
                  className="h-12 w-12 text-destructive animate-bounce"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-destructive" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 text-center">
            <div>
              <h1 className="bg-linear-to-r from-foreground to-destructive bg-clip-text text-3xl font-bold tracking-tight text-transparent animate-fade-in">
                Akses Ditolak
              </h1>
              <div className="mx-auto mt-2 h-1 w-20 animate-pulse rounded-full bg-linear-to-r from-transparent via-primary to-transparent" />
            </div>

            <p className="text-lg text-muted-foreground animate-fade-in delay-100">
              Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>

            <div className="rounded-xl bg-muted/30 p-4 animate-fade-in delay-200">
              <p className="text-sm text-muted-foreground">
                Halaman ini hanya dapat diakses oleh pengguna dengan hak akses administrator.
                Silakan hubungi administrator sistem jika Anda merasa ini adalah kesalahan.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 animate-fade-in delay-300 sm:flex-row">
              <a
                href="/"
                className="group flex-1 rounded-xl bg-linear-to-r from-primary to-primary/80 px-6 py-3 text-center text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Kembali ke Beranda
                </span>
              </a>

              <a
                href="/login"
                className="group flex-1 rounded-xl border-2 border-primary/30 bg-background px-6 py-3 text-center text-sm font-medium text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:bg-primary/5 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  Masuk ke Akun Lain
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>
            </div>

            {/* Additional help */}
            <div className="pt-6 animate-fade-in delay-500">
              <p className="text-xs text-muted-foreground">
                Masih mengalami masalah?{" "}
                <a
                  href="mailto:support@ligaku.com"
                  className="font-medium text-primary underline-offset-4 hover:text-primary/80 hover:underline"
                >
                  Hubungi Dukungan
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 animate-bounce rounded-full bg-primary/30"
              style={{
                animationDelay: `${i * 200}ms`,
                animationDuration: `${1000 + i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-6 left-0 right-0 text-center animate-fade-in delay-700">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LIGAKU - Tournament Manager
        </p>
      </div>
    </div>
  );
}