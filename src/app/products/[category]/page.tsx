"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/app/context/CartContext";
import productsData from "@/data/products.json";
import steamJson from "@/data/products/steam.json";
import duelJson from "@/data/products/duel.json";
import empireJson from "@/data/products/empire.json";
import faceitJson from "@/data/products/faceit.json";
import mobilecardsJson from "@/data/products/mobilecards.json";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

type Category = { id: string; label: string; count: number };

type Variant = {
	id: string;
	label: string;
	price: number;
	bonus?: string;
	tag?: string;
	save?: string;
};

type Section = { title: string; body: string[] };
type Related = { title: string; region: string; image: string };

type Detail = {
	hero: {
		title: string;
		region: string;
		guarantee: string;
		image: string;
		notes: string[];
	};
	variants: Variant[];
	description: Section[];
	related: Related[];
};

const placeholderImg = "/assets/placeholder-card.svg";

const formatPrice = (value: number) =>
	value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const normalizeDetail = (data: any): Detail => ({
	hero: {
		title: data.title,
		region: data.region,
		guarantee: data.guarantee,
		image: data.image,
		notes: data.notes || [],
	},
	variants: data.variants || [],
	description: data.description || [],
	related: data.related || [],
});

const detailMap: Record<string, Detail> = {
	steam: normalizeDetail(steamJson),
	duel: normalizeDetail(duelJson),
	csgoempire: normalizeDetail(empireJson),
	faceit: normalizeDetail(faceitJson),
	mobilecards: normalizeDetail(mobilecardsJson),
};

const CategoryPage = () => {
	const router = useRouter();
	const params = useParams<{ category?: string }>();
	const { addToCart } = useCart();

	const categories = productsData.categories as Category[];
	const allowedIds = categories.map((c) => c.id).filter((id) => id !== "all");
	const currentId = Array.isArray(params.category)
		? params.category[0]
		: params.category;
	const isValid = !!currentId && allowedIds.includes(currentId);

	const detail = isValid && currentId ? detailMap[currentId] : undefined;

	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState(detail?.variants[0]?.id ?? "");
	const selectedItem = useMemo(
		() =>
			detail?.variants.find((v) => v.id === selected) ??
			detail?.variants[0],
		[detail, selected],
	);
	const total = (selectedItem?.price || 0) * quantity;

	useEffect(() => {
		if (!isValid || !detail) {
			router.replace("/products");
		}
	}, [detail, isValid, router]);

	if (!isValid || !detail) return null;

	return (
		<div className="space-y-6">
			<div className="overflow-hidden rounded-2xl border border-surface-600 bg-surface-700 shadow-soft">
				<div className="relative h-44 w-full md:h-52">
					<Image
						src={detail.hero.image}
						alt={detail.hero.title}
						fill
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-surface-700 via-surface-700/80 to-transparent" />
					<div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
						<div className="flex items-center gap-4">
							<div className="relative h-[84px] w-16 overflow-hidden rounded-xl bg-surface-600">
								<Image
									src={detail.hero.image}
									alt="logo"
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<h1 className="text-xl font-bold text-ink-50">
									{detail.hero.title}
								</h1>
								<div className="mt-1 flex flex-wrap gap-3 text-xs text-ink-100/80">
									<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
										🌏 {detail.hero.region}
									</span>
									<span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2 py-1">
										🛡️ {detail.hero.guarantee}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid gap-5 lg:grid-cols-[1.7fr,0.9fr]">
				<div className="space-y-4">
					<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
						<h3 className="text-sm font-semibold text-ink-50">
							Chọn sản phẩm
						</h3>
						<div className="mt-3 grid gap-3 md:grid-cols-2">
							{detail.variants.map((variant) => {
								const active = variant.id === selectedItem?.id;
								return (
									<button
										key={variant.id}
										onClick={() => setSelected(variant.id)}
										className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
											active
												? "border-surface-700 bg-primary-700/30 text-ink-50"
												: "border-surface-600 bg-surface-700 text-ink-50 hover:border-primary-700"
										}`}>
										<div className="flex items-center justify-between">
											<p className="text-sm font-nỏmal">
												{variant.label}
											</p>
											{variant.save && (
												<span className="rounded-full bg-success-500/20 px-2 py-0.5 text-xs font-semibold text-success-400">
													{variant.save}
												</span>
											)}
										</div>
										<div className="mt-2 flex items-center justify-between text-xs text-ink-100/80">
											<span>{variant.bonus}</span>
											<span className="text-base font-normal text-ink-100">
												{formatPrice(variant.price)}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					<div className="space-y-3 rounded-2xl border border-surface-600 bg-surface-700 p-5 shadow-soft">
						<h3 className="text-sm font-normal text-ink-50">
							Mô tả
						</h3>
						{detail.description.map((section) => (
							<div key={section.title} className="space-y-2">
								<p className="text-base font-semibold text-ink-50">
									{section.title}
								</p>
								<ul className="list-disc space-y-1 pl-5 text-sm text-ink-100/80">
									{section.body.map((line) => (
										<li key={line}>{line}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<aside className="space-y-4">
					<div className="rounded-2xl border border-surface-600 bg-surface-700 p-4 shadow-soft">
						<div className="flex items-center justify-between">
							<p className="text-sm font-normal text-ink-50">
								Số lượng
							</p>
							<div className="flex items-center gap-2">
								<button
									onClick={() =>
										setQuantity((q) => Math.max(1, q - 1))
									}>
									<CiCircleMinus />
								</button>
								<span className="min-w-[24px] text-center text-sm text-ink-50">
									{quantity}
								</span>
								<button
									onClick={() => setQuantity((q) => q + 1)}>
									<CiCirclePlus />
								</button>
							</div>
						</div>
						<div className="mt-3 rounded-xl border border-surface-600 bg-ink-950 p-3">
							<p className="text-sm font-semibold text-ink-50">
								Tổng cộng
							</p>
							<p className="text-2xl font-normal text-ink-50">
								{formatPrice(total)}
							</p>

							<div className="mt-3 flex flex-col gap-2">
								<button
									className="w-full rounded-3xl bg-info-400 px-4 py-2 text-sm font-medium text-ink-50"
									onClick={() => {
										if (selectedItem && currentId) {
											addToCart(
												{
													id: `${currentId}-${selectedItem.id}`,
													name: `${detail.hero.title} - ${selectedItem.label}`,
													price: formatPrice(
														selectedItem.price,
													),
													image: detail.hero.image,
													categoryId: currentId,
												},
												quantity,
											);
										}
									}}>
									Thêm vào giỏ hàng
								</button>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
};

export default CategoryPage;
