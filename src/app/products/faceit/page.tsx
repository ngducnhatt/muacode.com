"use client";

import { useEffect, useMemo, useState } from "react";

import ProductDescription from "@/app/components/products/ProductDescription";
import ProductHero from "@/app/components/products/ProductImage";
import ProductSummary from "@/app/components/products/ProductOrder";
import ProductVariants from "@/app/components/products/ProductList";
import { useCart } from "@/app/context/CartContext";
import { fetchProductDetail } from "@/lib/data";
import type {
	ProductSection,
	ProductSource,
	ProductVariant,
} from "@/lib/types";

const CACHE_TTL = 60_000;
const placeholderImg = "/assets/placeholder-card.svg";
const categoryId = "faceit";

type Detail = {
	hero: {
		title: string;
		region?: string;
		guarantee?: string;
		image?: string;
		notes?: string[];
	};
	variants: (ProductVariant & { status?: boolean })[];
	description: string;
};

const toBooleanStatus = (value: unknown) => {
	if (typeof value === "boolean") return value;
	if (typeof value === "number") return value > 0;
	if (typeof value === "string") return value === "1" || value === "true";
	return true;
};

const normalizeDetail = (data: ProductSource | null): Detail | null => {
	if (!data) return null;
	return {
		hero: {
			title: data.title,
			guarantee: data.guarantee,
			image: data.image,
			notes: data.notes || [],
		},
		variants: (data.variants || []).map((variant) => ({
			...variant,
			status: toBooleanStatus(variant.status ?? true),
		})),
		description: data.description || "",
	};
};

const readCacheDetail = (): Detail | null => {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(`cache_detail_${categoryId}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL) return null;
		return parsed.data as Detail;
	} catch {
		return null;
	}
};

const writeCacheDetail = (value: Detail) => {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(
			`cache_detail_${categoryId}`,
			JSON.stringify({ ts: Date.now(), data: value }),
		);
	} catch {
		// ignore storage error
	}
};

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const SteamPage = () => {
	const { addToCart } = useCart();
	const initialDetail = readCacheDetail();
	const [detail, setDetail] = useState<Detail | null>(initialDetail);
	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState(
		initialDetail?.variants[0]?.id ?? "",
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("Không tìm thấy sản phẩm");
					return;
				}
				setDetail(normalized);
				setSelected(normalized.variants[0]?.id ?? "");
				writeCacheDetail(normalized);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err?.message || "Không tải được dữ liệu sản phẩm");
			});

		return () => {
			mounted = false;
		};
	}, []);

	const selectedItem = useMemo(() => {
		if (!detail) return undefined;
		return (
			detail.variants.find((v) => v.id === selected) || detail.variants[0]
		);
	}, [detail, selected]);

	const total = (selectedItem?.price || 0) * quantity;
	const available = selectedItem?.status ?? true;

	const handleAddToCart = () => {
		if (selectedItem && available && detail) {
			addToCart(
				{
					id: `${categoryId}-${selectedItem.id}`,
					name: `${detail.hero.title} - ${selectedItem.label}`,
					price: selectedItem.price
						? formatPrice(selectedItem.price)
						: "Liên hệ",
					image: detail.hero.image,
					categoryId,
				},
				quantity,
			);
		}
	};

	if (error) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				<p>{error}</p>
			</div>
		);
	}

	if (!detail) {
		return (
			<div className="rounded-2xl border border-surface-600 bg-surface-700 p-6 text-ink-50">
				Đang tải dữ liệu sản phẩm
			</div>
		);
	}

	return (
		<div className="px-4 space-y-6">
			<ProductHero hero={detail.hero} placeholderImg={placeholderImg} />
			<div className="grid gap-5 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<ProductVariants
						variants={detail.variants}
						selectedId={selectedItem?.id}
						onSelect={setSelected}
						formatPrice={formatPrice}
					/>
				</div>
				<div className="space-y-4 lg:col-span-1">
					<ProductSummary
						quantity={quantity}
						total={total}
						available={available}
						onDecrease={() =>
							setQuantity((q) => Math.max(1, q - 1))
						}
						onIncrease={() => setQuantity((q) => q + 1)}
						onAddToCart={handleAddToCart}
						formatPrice={formatPrice}
					/>
				</div>
			</div>
			<div className="grid gap-5 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<ProductDescription description={detail.description} />
				</div>
			</div>
		</div>
	);
};

export default SteamPage;
