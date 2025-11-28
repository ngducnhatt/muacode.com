"use client";

import ReactMarkdown from "react-markdown";

type ProductDescriptionProps = {
	description: string;
};

const ProductDescription = ({ description }: ProductDescriptionProps) => (
	<div className="prose prose-invert max-w-none space-y-3  bg-surface-700 box p-5 shadow-soft">
		<h3 className="text-sm font-normal text-ink-50">Mô tả</h3>
		<ReactMarkdown>{description}</ReactMarkdown>
	</div>
);

export default ProductDescription;
