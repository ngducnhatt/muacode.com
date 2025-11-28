import { Metadata } from "next";
import SteamClient from "./SteamClient";
import { fetchProductDetail } from "@/lib/data";

// 1. Tạo Metadata động cho SEO
export async function generateMetadata(): Promise<Metadata> {
	const data = await fetchProductDetail("steam");

	if (!data) {
		return {
			title: "Steam Wallet Code - Mua ngay tại Muacode.com",
		};
	}

	return {
		title: `${data.title} - Giá Rẻ, Uy Tín, Tự Động | Muacode.com`,
		description: `Mua ${data.title} giá rẻ, nhận code ngay lập tức. Hỗ trợ thanh toán đa dạng, bảo hành uy tín. ${data.description.slice(0, 100)}...`,
		openGraph: {
			title: `${data.title} - Giá Rẻ | Muacode.com`,
			description: `Mua ${data.title} nhận ngay trong vài giây.`,
			images: [data.image || "/assets/placeholder-card.svg"],
		},
	};
}

// 2. Server Component chính
export default async function SteamPage() {
	// Fetch dữ liệu để tạo JSON-LD (Structured Data)
	const data = await fetchProductDetail("steam");

	// Schema.org cho sản phẩm
	const jsonLd = data
		? {
				"@context": "https://schema.org",
				"@type": "Product",
				name: data.title,
				image: data.image,
				description: data.description,
				brand: {
					"@type": "Brand",
					name: "Steam",
				},
				offers: {
					"@type": "AggregateOffer",
					priceCurrency: "VND",
					lowPrice:
						Math.min(
							...(data.variants?.map((v) => v.price || 0) || [0]),
						) || 50000,
					offerCount: data.variants?.length || 1,
					availability: "https://schema.org/InStock",
				},
		  }
		: null;

	return (
		<>
			{/* Chèn JSON-LD vào trang để Google đọc hiểu sản phẩm */}
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd),
					}}
				/>
			)}
			<SteamClient />
		</>
	);
}