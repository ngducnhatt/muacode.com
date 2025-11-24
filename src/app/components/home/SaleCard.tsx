import duelData from "@/data/products/duel.json";
import empireData from "@/data/products/empire.json";
import faceitData from "@/data/products/faceit.json";
import mobilecardsData from "@/data/products/mobilecards.json";
import steamData from "@/data/products/steam.json";

type Variant = { id: string; label: string; save?: string; tag?: string };
type SourceData = { title: string; variants: Variant[] };
type Deal = { id: string; title: string; rate: string; tag: string; color: string };

const parseSave = (save?: string) => {
	const numeric = parseFloat(save ?? "0");
	return Number.isNaN(numeric) ? 0 : numeric;
};

const pickBestVariant = (variants: Variant[]) => {
	if (!variants?.length) return null;
	return variants.reduce((best, current) =>
		parseSave(current.save) < parseSave(best.save) ? current : best,
		variants[0],
	);
};

const buildDeals = (): Deal[] => {
	const sources: SourceData[] = [
		duelData as SourceData,
		empireData as SourceData,
		faceitData as SourceData,
		mobilecardsData as SourceData,
		steamData as SourceData,
	];

	const colors = [
		"from-primary-800 via-primary-800 to-primary-700",
		"from-info-500 to-info-300",
		"from-warning-500 to-warning-300",
		"from-success-500 to-success-300",
		"from-danger-500 to-danger-300",
	];

	return sources
		.map((source, idx) => {
			const best = pickBestVariant(source.variants);
			if (!best) return null;
			return {
				id: best.id,
				title: `${source.title}: ${best.label}`,
				rate: best.save ?? "0%",
				tag: best.tag ?? "Ưu đãi",
				color: colors[idx % colors.length],
			};
		})
		.filter(Boolean) as Deal[];
};

const SaleCard = () => {
	const deals = buildDeals();

	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">
					Ưu đãi độc quyền
				</h2>
			</div>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
				{deals.map((deal) => (
					<div
						key={deal.id}
						className={`rounded-3xl bg-gradient-to-r border border-primary-800 hover:border-primary-900  from-primary-900/60 via-primary-800 to-primary-700 p-3 shadow-soft `}>
						<div className="rounded-lg px-2 py-2 text-ink-50">
							<p className="mt-1 text-sm font-bold">
								{deal.title}
							</p>
							<p className="text-sm font-thin">{deal.rate}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default SaleCard;
