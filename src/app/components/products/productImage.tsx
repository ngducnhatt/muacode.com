"use client";

import Image from "next/image";

type ProductHeroProps = {
	hero: {
		title: string;
		region?: string;
		guarantee?: string;
		image?: string;
	};
	placeholderImg: string;
};

const ProductHero = ({ hero, placeholderImg }: ProductHeroProps) => (
	<div className="relative left-1/2 w-screen -translate-x-1/2 overflow-visible border border-surface-600 bg-surface-700 pb-10 shadow-soft">
		<div className="relative h-72 w-full md:h-100">
			<Image
				src={hero.image || placeholderImg}
				alt={hero.title}
				fill
				sizes="100vw"
				className="object-cover"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-surface-700 via-surface-700/80 to-transparent" />
			<div className="absolute inset-x-0 bottom-0">
				<div className="mx-auto flex max-w-6xl items-center gap-4 px-4 md:px-6">
					<div className="relative w-24 translate-y-4 overflow-hidden rounded-2xl border-white-custom bg-surface-600 shadow-soft aspect-[4/5] md:translate-y-6">
						<Image
							src={hero.image || placeholderImg}
							alt="logo"
							fill
							sizes="96px"
							className="object-contain"
						/>
					</div>
					<h1 className="text-xl font-normal					<h1 className="text-xl font-normal text-ink-50">
>
			</div>
		</div>
	</div>
);

export default ProductHero;
