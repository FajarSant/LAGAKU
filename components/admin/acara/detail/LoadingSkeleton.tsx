import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Komponen Shimmer Effect untuk Skeleton
const ShimmerEffect = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent dark:via-white/5" />
);

// Komponen Skeleton Reusable dengan Shimmer
const CardSkeletonWithShimmer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <Card className={`relative bg-card/50 backdrop-blur-sm border rounded-2xl shadow-lg overflow-hidden ${className}`}>
    <ShimmerEffect />
    {children}
  </Card>
);

const SkeletonWithShimmer = ({ className = "" }: { className?: string }) => (
  <div className="relative overflow-hidden">
    <ShimmerEffect />
    <Skeleton className={`bg-secondary ${className}`} />
  </div>
);

const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <div className="relative overflow-hidden">
        <ShimmerEffect />
        <Skeleton className="w-12 h-12 bg-secondary rounded-xl" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="relative overflow-hidden">
          <ShimmerEffect />
          <Skeleton className="h-9 w-64 bg-secondary" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden">
            <ShimmerEffect />
            <Skeleton className="w-2 h-2 bg-muted rounded-full" />
          </div>
          <div className="relative overflow-hidden">
            <ShimmerEffect />
            <Skeleton className="h-4 w-48 bg-secondary" />
          </div>
          <div className="relative overflow-hidden">
            <ShimmerEffect />
            <Skeleton className="w-7 h-7 bg-secondary rounded" />
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      <div className="relative overflow-hidden">
        <ShimmerEffect />
        <Skeleton className="w-12 h-12 bg-secondary rounded-xl" />
      </div>
      <div className="relative overflow-hidden">
        <ShimmerEffect />
        <Skeleton className="h-12 w-24 bg-primary/10 rounded-xl" />
      </div>
      <div className="relative overflow-hidden">
        <ShimmerEffect />
        <Skeleton className="h-12 w-24 bg-destructive/10 rounded-xl" />
      </div>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="group relative">
    <div className="absolute inset-0 bg-linear-to-br from-secondary/10 to-muted/10 rounded-xl blur-lg"></div>
    <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-5 text-center overflow-hidden">
      <ShimmerEffect />
      <div className="relative">
        <Skeleton className="w-12 h-12 mx-auto mb-3 bg-secondary rounded-xl" />
      </div>
      <div className="relative">
        <Skeleton className="h-8 w-16 mx-auto mb-2 bg-secondary" />
      </div>
      <div className="relative">
        <Skeleton className="h-3 w-20 mx-auto bg-secondary" />
      </div>
    </div>
  </div>
);

const ActionButtonSkeleton = () => (
  <div className="w-full justify-between bg-secondary border text-foreground rounded-xl h-12 flex items-center px-4 relative overflow-hidden">
    <ShimmerEffect />
    <div className="flex items-center gap-3 relative">
      <Skeleton className="w-10 h-10 bg-muted rounded-lg" />
      <Skeleton className="h-5 w-32 bg-muted" />
    </div>
    <Skeleton className="w-4 h-4 bg-muted-foreground/50 rounded-full relative" />
  </div>
);

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-3xl dark:from-blue-600/10 dark:to-purple-600/10"></div>
          
          <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-6 shadow-2xl overflow-hidden">
            <ShimmerEffect />
            <HeaderSkeleton />
            
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="relative overflow-hidden">
                <ShimmerEffect />
                <Skeleton className="w-32 h-10 bg-secondary rounded-xl" />
              </div>
              <div className="relative overflow-hidden">
                <ShimmerEffect />
                <Skeleton className="w-28 h-10 bg-secondary rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deskripsi Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl dark:from-blue-500/5 dark:to-purple-500/5"></div>
              <CardSkeletonWithShimmer>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                    </div>
                    <div className="relative">
                      <Skeleton className="h-6 w-48 bg-secondary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 relative">
                  <SkeletonWithShimmer className="h-4 w-full" />
                  <SkeletonWithShimmer className="h-4 w-5/6" />
                  <SkeletonWithShimmer className="h-4 w-4/6" />
                  <SkeletonWithShimmer className="h-4 w-3/4" />
                </CardContent>
              </CardSkeletonWithShimmer>
            </div>

            {/* Grid Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waktu Section */}
              <CardSkeletonWithShimmer>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                    </div>
                    <div className="relative">
                      <Skeleton className="h-6 w-40 bg-secondary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <SkeletonWithShimmer className="h-4 w-24" />
                        <SkeletonWithShimmer className="h-5 w-48" />
                      </div>
                    </div>
                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <SkeletonWithShimmer className="h-4 w-24" />
                        <SkeletonWithShimmer className="h-5 w-48" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardSkeletonWithShimmer>

              {/* Lokasi Section */}
              <CardSkeletonWithShimmer>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                    </div>
                    <div className="relative">
                      <Skeleton className="h-6 w-40 bg-secondary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <SkeletonWithShimmer className="h-4 w-16" />
                        <SkeletonWithShimmer className="h-5 w-36" />
                      </div>
                    </div>
                    <div className="h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Skeleton className="w-4 h-4 bg-secondary rounded" />
                          </div>
                          <div className="relative">
                            <Skeleton className="h-4 w-32 bg-secondary" />
                          </div>
                        </div>
                        <div className="relative">
                          <Skeleton className="h-4 w-20 bg-secondary" />
                        </div>
                      </div>
                      <Progress value={0} className="h-2 bg-secondary" />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <SkeletonWithShimmer className="h-3 w-8" />
                        <SkeletonWithShimmer className="h-3 w-16" />
                        <SkeletonWithShimmer className="h-3 w-8" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CardSkeletonWithShimmer>
            </div>

            {/* Statistik Section */}
            <CardSkeletonWithShimmer>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-6 w-40 bg-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <StatCardSkeleton key={index} />
                  ))}
                </div>
              </CardContent>
            </CardSkeletonWithShimmer>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <CardSkeletonWithShimmer>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-6 w-32 bg-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ActionButtonSkeleton key={index} />
                ))}
              </CardContent>
            </CardSkeletonWithShimmer>

            {/* Sistem Info */}
            <CardSkeletonWithShimmer>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-6 w-40 bg-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-secondary/50 rounded-xl border border-border/50">
                  <div className="space-y-2">
                    <SkeletonWithShimmer className="h-4 w-full" />
                    <SkeletonWithShimmer className="h-4 w-5/6" />
                    <SkeletonWithShimmer className="h-4 w-4/6" />
                  </div>
                </div>
              </CardContent>
            </CardSkeletonWithShimmer>

            {/* Metadata */}
            <CardSkeletonWithShimmer>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Skeleton className="w-10 h-10 bg-secondary rounded-lg" />
                  </div>
                  <div className="relative">
                    <Skeleton className="h-6 w-40 bg-secondary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <SkeletonWithShimmer className="h-4 w-24" />
                  <SkeletonWithShimmer className="h-4 w-48" />
                </div>
                <div className="space-y-2">
                  <SkeletonWithShimmer className="h-4 w-20" />
                  <div className="flex items-center justify-between bg-secondary/50 border border-border/50 p-3 rounded-xl">
                    <SkeletonWithShimmer className="h-4 w-32" />
                    <Skeleton className="w-8 h-8 bg-muted rounded relative" />
                  </div>
                </div>
              </CardContent>
            </CardSkeletonWithShimmer>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-border/50">
          <div className="relative overflow-hidden">
            <ShimmerEffect />
            <Skeleton className="h-12 w-48 bg-secondary rounded-xl" />
          </div>
          <div className="space-y-2 text-center md:text-right">
            <div className="relative overflow-hidden">
              <ShimmerEffect />
              <Skeleton className="h-4 w-36 bg-secondary" />
            </div>
            <div className="relative overflow-hidden">
              <ShimmerEffect />
              <Skeleton className="h-4 w-24 bg-secondary" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tambahkan CSS untuk animasi shimmer di globals.css */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}