"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

import duelData from "@/data/products/duel.json";
import empireData from "@/data/products/empire.json";
import faceitData from "@/data/products/faceit.json";
import mobilecardsData from "@/data/products/mobilecards.json";
import steamData from "@/data/products/steam.json";

type CardItem = {
	id: string;
	title: string;
	tag?: string;
	color?: string;
	href?: string;
	image?: string;
	priceRange?: string;
	rating?: number;
	sold?: number;
};

type VariantWithMeta = {
	id: string;
	label: string;
	tag?: string;
	sold?: number;
	price?: number;
};

type SourceWithMeta = {
	title: string;
	variants: VariantWithMeta[];
	image?: string;
};

const formatPrice = (price?: number) => {
	if (!price) return null;
	try {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	} catch {
		return `${price}đ`;
	}
};

const buildPopularItems = () => {
	const sources: SourceWithMeta[] = [
		{ ...(duelData as SourceWithMeta) },
		{ ...(empireData as SourceWithMeta) },
		{ ...(faceitData as SourceWithMeta) },
		{ ...(mobilecardsData as SourceWithMeta) },
		{ ...(steamData as SourceWithMeta) }
	];

	const items = sources.flatMap((source) =>
		(source.variants || []).map((variant) => ({
			id: variant.id,
			title: `${source.title}: ${variant.label}`,
			tag: variant.tag || "Hot",
			sold: variant.sold ?? 0,
			priceRange: formatPrice(variant.price) ?? "Liên hệ",
			image: source.image
		}))
	);

	return items.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 6);
};

const PorpularCard = ({ hrefLabel }: { hrefLabel?: string }) => {
	const placeholderImg = "/assets/placeholder-card.svg";
	const items: CardItem[] = buildPopularItems();

	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-ink-50">Sản phẩm phổ biến</h2>
				<Link href="/products" className="text-sm font-semibold hover:text-primary-400">
					{hrefLabel || "Xem thêm"}
				</Link>
			</div>
			<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
				{items.map((card) => {
					const linkHref = card.href || "/products";
					const displayPrice = card.priceRange || "25.000đ ~ 25.000đ";
					const displayRating = card.rating ?? 4.5;
					const fullStars = Math.floor(displayRating);
					const showHalf = displayRating % 1 >= 0.5;
					const soldCount = card.sold !== undefined ? card.sold : 229;

					return (
						<Link
							key={card.id}
							href={linkHref}
							className="group flex gap-3 rounded-2xl border border-surface-600 bg-surface-700 p-3 shadow-soft transition hover:border-primary-900/70">
							<div className="relative w-24 aspect-[522/653] flex-shrink-0 overflow-hidden rounded-2xl">
								<Image
									src={card.image || placeholderImg}
									alt={card.title}
									fill
									sizes="96px"
									className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
								/>
							</div>

							<div className="flex flex-1 flex-col justify-between gap-2">
								<div className="space-y-1">
									<p className="text-sm font-normal leading-snug text-ink-50 line-clamp-2">
										{card.title}
									</p>
									<p className="text-xs font-thin text-ink-200 line-clamp-1">
										{card.tag || "Order ngay"}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-base font-normal text-ink-400">{displayPrice}</p>
									<div className="flex items-center gap-2 text-xs text-ink-200">
										<div className="flex items-center gap-1 text-warning-300">
											{Array.from({ length: fullStars }, (_, idx) => (
												<FaStar key={idx} className="h-4 w-4" />
											))}
											{showHalf && <FaStarHalfAlt className="h-4 w-4" />}
										</div>
										<span className="ml-auto text-ink-300">Đã bán {soldCount}</span>
									</div>
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default PorpularCard;
