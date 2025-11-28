const ProductSkeleton = () => {
	return (
		<div className="px-4 space-y-6 animate-pulse">
			{/* Product Image Skeleton */}
			<div className="box overflow-hidden">
				<div className="relative h-52 w-full md:h-64 bg-surface-600"></div>
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				{/* Variants Skeleton */}
				<div className="space-y-4 lg:col-span-2">
					<div className="box p-5 bg-surface-700 h-[300px]">
						<div className="h-6 w-1/3 bg-surface-600 rounded mb-4"></div>
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="h-24 rounded-xl bg-surface-600"></div>
							))}
						</div>
					</div>
				</div>

				{/* Order Form / Summary Skeleton */}
				<div className="space-y-4 lg:col-span-1">
					<div className="box p-5 bg-surface-700 h-[350px]">
						<div className="h-6 w-1/2 bg-surface-600 rounded mb-6"></div>
						<div className="space-y-4">
							<div className="h-10 w-full bg-surface-600 rounded-2xl"></div>
							<div className="h-10 w-full bg-surface-600 rounded-2xl"></div>
							<div className="h-12 w-full bg-surface-500 rounded-3xl mt-6"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Description Skeleton */}
			<div className="grid gap-5 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<div className="box p-5 bg-surface-700 h-[200px]">
						<div className="h-6 w-1/4 bg-surface-600 rounded mb-4"></div>
						<div className="space-y-2">
							<div className="h-4 w-full bg-surface-600 rounded"></div>
							<div className="h-4 w-5/6 bg-surface-600 rounded"></div>
							<div className="h-4 w-4/6 bg-surface-600 rounded"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductSkeleton;
