"use client";

import { useFormStatus } from "react-dom";
import React from "react";

export function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			aria-disabled={pending}
			className="btn btn-info w-full disabled:cursor-not-allowed disabled:bg-ink-800 disabled:text-ink-200"
			disabled={pending}>
			{pending ? "Đang gửi đơn hàng..." : "Tạo đơn hàng"}
		</button>
	);
}
