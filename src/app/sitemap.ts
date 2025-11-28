import { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://muacode.com";

	// 1. Các trang tĩnh
	const staticRoutes = [
		"",
		"/services",
		"/contact",
		"/news",
		"/products",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	// 2. Các trang danh mục sản phẩm (dynamic)
	const categories = await fetchCategories();
	const productRoutes = categories.map((cat) => ({
		url: `${baseUrl}/products/${cat.id}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.9,
	}));

	return [...staticRoutes, ...productRoutes];
}
