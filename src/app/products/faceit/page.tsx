import { Metadata } from "next";
import FaceitClient from "./FaceitClient";
import { fetchProductDetail } from "@/lib/data";

const categoryId = "faceit";

export async function generateMetadata(): Promise<Metadata> {
	const data = await fetchProductDetail(categoryId);

	if (!data) {
		return {
			title: "Faceit Premium & Points - Mua ngay tại Muacode.com",
		};
	}

	return {
		title: `${data.title} - Giá Rẻ, Uy Tín, Tự Động | Muacode.com`,
		description: `Mua ${data.title} giá rẻ, nhận ngay lập tức. Hỗ trợ thanh toán đa dạng, bảo hành uy tín. ${data.description.slice(
			0,
			100,
		)}...`,
		openGraph: {
			title: `${data.title} - Giá Rẻ | Muacode.com`,
			description: `Mua ${data.title} nhận ngay trong vài giây.`,
			images: [data.image || "/assets/placeholder-card.svg"],
		},
	};
}

export default async function FaceitPage() {
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
					name: "Faceit",
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
			<FaceitClient />
		</>
	);
}