import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sản phẩm",
	description: "Khám phá danh mục game, giftcard và dịch vụ số.",
};

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
