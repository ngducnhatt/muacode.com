import { Metadata } from "next";
import CsgoEmpireClient from "./CsgoEmpireClient";
import { fetchProductDetail } from "@/lib/data";

const categoryId = "csgoempire";

export async function generateMetadata(): Promise<Metadata> {
	const data = await fetchProductDetail(categoryId);

	if (!data) {
		return {
			title: "CSGO Empire Coins - Mua ngay tại CS2Prime.store",
		};
	}

	return {
		title: `${data.title} - Giá Rẻ, Uy Tín, Tự Động | CS2Prime.store`,
		description: `Mua ${data.title} giá rẻ, nhận coins ngay lập tức. Hỗ trợ thanh toán đa dạng, bảo hành uy tín. ...`,
		openGraph: {
			title: `${data.title} - Giá Rẻ | CS2Prime.store`,
			description: `Mua ${data.title} nhận ngay trong vài giây.`,
			images: [data.image || "/assets/placeholder-card.svg"],
		},
	};
}

export default async function CsgoEmpirePage() {
	const data = await fetchProductDetail(categoryId);

	const jsonLd = data
		? {
				"@context": "https://schema.org",
				"@type": "Product",
				name: data.title,
				image: data.image,
				description: data.description ?? "",
				brand: {
					"@type": "Brand",
					name: "CSGO Empire",
				},
				offers: {
					"@type": "AggregateOffer",
					priceCurrency: "VND",
					lowPrice:
						Math.min(
							...(data.variants?.map((v) => v.price || 0) || [0]),
						) || 0,
					offerCount: data.variants?.length || 1,
					availability: "https://schema.org/InStock",
				},
		  }
		: null;

	return (
		<>
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd),
					}}
				/>
			)}
			<CsgoEmpireClient />
		</>
	);
}
