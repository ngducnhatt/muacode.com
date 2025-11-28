import { Metadata } from "next";
import AccountGameClient from "./AccountGameClient";
import { fetchProductDetail } from "@/lib/data";

const categoryId = "accountgame";

export async function generateMetadata(): Promise<Metadata> {
	const data = await fetchProductDetail(categoryId);

	if (!data) {
		return {
			title: "Tài khoản Game Giá Rẻ - Muacode.com",
		};
	}

	return {
		title: `${data.title} - Giá Rẻ, Uy Tín, Bảo Hành | Muacode.com`,
		description: `Mua bán ${data.title} uy tín, giá rẻ. Bảo hành đầy đủ, hỗ trợ thay đổi thông tin.`,
		openGraph: {
			title: `${data.title} - Giá Rẻ | Muacode.com`,
			description: `Mua ${data.title} chất lượng, bảo hành uy tín.`,
			images: [data.image || "/assets/placeholder-card.svg"],
		},
	};
}

export default async function AccountGamePage() {
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
					name: "Game Account",
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
			<AccountGameClient />
		</>
	);
}