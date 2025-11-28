import { Metadata } from "next";
import DuelClient from "./DuelClient";
import { fetchProductDetail } from "@/lib/data";

const categoryId = "duel";

export async function generateMetadata(): Promise<Metadata> {
	const data = await fetchProductDetail(categoryId);

	if (!data) {
		return {
			title: "Duelbits Balance - Mua ngay tại Muacode.com",
		};
	}

	return {
		title: `${data.title} - Giá Rẻ, Uy Tín, Tự Động | Muacode.com`,
		description: `Mua ${data.title} giá rẻ, nhận balance ngay lập tức. Hỗ trợ thanh toán đa dạng, bảo hành uy tín. ...`,
		openGraph: {
			title: `${data.title} - Giá Rẻ | Muacode.com`,
			description: `Mua ${data.title} nhận ngay trong vài giây.`,
			images: [data.image || "/assets/placeholder-card.svg"],
		},
	};
}

export default async function DuelPage() {
	const data = await fetchProductDetail(categoryId);

	const jsonLd = data
		? {
				"@context": "https://schema.org",
				"@type": "Product",
				name: data.title,
				image: data.image,
				description: data.description,
				brand: {
					"@type": "Brand",
					name: "Duelbits",
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
			<DuelClient />
		</>
	);
}
