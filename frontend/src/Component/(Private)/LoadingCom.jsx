
export const Skeleton = ({ className }) => (
    <div className={`bg-gray-300 animate-pulse rounded ${className}`} aria-hidden="true" />
);


export const CardSkeleton = () => (
    <div className="p-5 shadow shim  bg-white rounded-lg space-y-4">
        <div className="flex gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="bg-gray-300 w-full h-10">

        </div>
    </div>
);
