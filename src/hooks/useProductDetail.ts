import { useEffect, useMemo, useState } from "react";
import { fetchProductDetail } from "@/lib/data";
import type { ProductSource, ProductVariant } from "@/lib/types";

const CACHE_TTL = 60_000;

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

const readCacheDetail = (categoryId: string): Detail | null => {
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

const writeCacheDetail = (categoryId: string, value: Detail) => {
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

export const useProductDetail = (categoryId: string) => {
	// Initialize with null to match Server-Side Rendering (avoids Hydration Mismatch)
	const [detail, setDetail] = useState<Detail | null>(null);
	const [selected, setSelected] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		// 1. Try loading from cache first (Client-side only)
		const cached = readCacheDetail(categoryId);
		if (cached) {
			setDetail(cached);
			if (!selected) {
				setSelected(cached.variants[0]?.id ?? "");
			}
		}

		// 2. Fetch fresh data
		fetchProductDetail(categoryId)
			.then((data) => {
				if (!mounted) return;
				const normalized = normalizeDetail(data);
				if (!normalized) {
					setError("Không tìm thấy sản phẩm");
					return;
				}
				setDetail(normalized);

				// Preserve user selection if valid, otherwise default to first variant
				// Note: We check against the *current* selected state, not the one from closure
				setSelected((prevSelected) => {
					if (
						!prevSelected ||
						!normalized.variants.some((v) => v.id === prevSelected)
					) {
						return normalized.variants[0]?.id ?? "";
					}
					return prevSelected;
				});

				writeCacheDetail(categoryId, normalized);
			})
			.catch((err) => {
				if (!mounted) return;
				setError(err?.message || "Không tải được dữ liệu sản phẩm");
			});

		return () => {
			mounted = false;
		};
	}, [categoryId]); // Removed 'selected' dependency to prevent loop

	const selectedItem = useMemo(() => {
		if (!detail) return undefined;
		return (
			detail.variants.find((v) => v.id === selected) || detail.variants[0]
		);
	}, [detail, selected]);

	return {
		detail,
		selected,
		setSelected,
		error,
		selectedItem,
		isLoading: !detail && !error,
	};
};
