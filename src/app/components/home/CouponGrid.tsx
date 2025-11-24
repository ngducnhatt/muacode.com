type Coupon = {
	id: string;
	title: string;
	status: string;
};

type CouponGridProps = {
	coupons: Coupon[];
};

const CouponGrid = ({ coupons }: CouponGridProps) => {
	return (
		<section className="space-y-3">
			<h2 className="text-lg font-semibold text-ink-50">
				Mã giảm giá có sẵn
			</h2>
			<div className="grid gap-3 md:grid-cols-3">
				{coupons.map((coupon) => (
					<div
						key={coupon.id}
						className="flex items-center justify-between rounded-xl border border-surface-600 bg-white p-4 text-ink-900 shadow-soft">
						<div>
							<p className="text-sm font-semibold">
								{coupon.title}
							</p>
							<p className="text-xs text-ink-500">
								Ưu đãi giới hạn
							</p>
						</div>
						<button className="rounded-full bg-surface-700 px-3 py-1 text-xs font-semibold text-ink-50">
							{coupon.status}
						</button>
					</div>
				))}
			</div>
		</section>
	);
};

export default CouponGrid;
