"use client";

import { useState, useEffect, useActionState, useRef } from "react";
import { FormState, sendTelegramOrder } from "@/app/actions/telegram";
import { TelegramOrderFormProps } from "@/lib/types";
import { SubmitButton } from "@/app/components/SubmitButton";
import Image from "next/image";

export const BuyForm = ({ selectedItem }: TelegramOrderFormProps) => {
	const [orderId] = useState(() => `MUACODE${Date.now()}`);
	const initialState: FormState = { message: "", success: false, errors: {} };
	const [state, formAction] = useActionState(sendTelegramOrder, initialState);

	const [amount, setAmount] = useState(10);
	const unitPrice = selectedItem.price || 0;
	const totalAmount = unitPrice * amount;

	const [sellId, setSellId] = useState("");
	const [submissionKey, setSubmissionKey] = useState(0);

	const showQrPopup = state.success && state.data;
	let qrCodeValue = "";
	if (showQrPopup && state.data) {
		const qrBank = "970407"; // Techcombank BIN
		const qrAccount = "1122102102";
		const qrAddInfo = `${state.data.orderId}`;
		qrCodeValue = `https://img.vietqr.io/image/${qrBank}-${qrAccount}-compact.png?amount=${state.data.totalAmount}&addInfo=${qrAddInfo}`;
	}

	const handleClosePopup = () => {
		setAmount(10);
		setSellId("");
		setSubmissionKey(Date.now());
	};

	const formatPrice = (value: number) =>
		value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

	return (
		<div className="rounded-2xl border border-surface-600 bg-surface-700 px-5 shadow-soft">
			<form key={submissionKey} action={formAction} className="space-y-4">
				<input
					type="hidden"
					name="productName"
					value={selectedItem.label}
				/>
				<input type="hidden" name="unitPrice" value={unitPrice} />
				<input type="hidden" name="totalAmount" value={totalAmount} />
				<input type="hidden" name="orderId" value={orderId} />
				<input
					type="hidden"
					name="selectedItemId"
					value={selectedItem.id}
				/>

				<div className="space-y-1 pt-1">
					<label
						className="block text-sm font-medium text-ink-50"
						htmlFor="order-amount">
						Số lượng (tối thiểu 10)
					</label>
					<input
						className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
						id="order-amount"
						name="amount"
						type="number"
						min="10"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value))}
						required
					/>
					{state.errors?.amount && (
						<p className="text-sm text-red-500">
							{state.errors.amount[0]}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<label
						className="block text-sm font-medium text-ink-50"
						htmlFor="order-id">
						ID Bán (id steam)
					</label>
					<input
						className="w-full px-3 border border-surface-600 rounded-2xl bg-surface-800 text-ink-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
						id="order-id"
						name="id"
						type="text"
						required
						value={sellId}
						onChange={(e) => setSellId(e.target.value)}
					/>
					{state.errors?.sellId && (
						<p className="text-sm text-red-500">
							{state.errors.sellId[0]}
						</p>
					)}
				</div>

				<div className="mb-6 pt-3 border-t border-surface-600">
					<div className="text-lg font-semibold text-ink-50 mb-4">
						Xác nhận đơn hàng
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center text-sm">
							<span className="text-ink-100">Sản phẩm</span>
							<span className="font-medium text-ink-50">
								{selectedItem.label}
							</span>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-ink-100">Đơn giá</span>
							<span className="font-medium text-ink-50">
								{formatPrice(unitPrice)}
							</span>
						</div>
						<div className="flex justify-between items-center text-base font-semibold pt-2 border-t border-surface-600">
							<span className="text-ink-50">Thành tiền</span>
							<span className="text-accent-500">
								{formatPrice(totalAmount)}
							</span>
						</div>
					</div>
				</div>
				<SubmitButton />

				{state.message && (
					<p
						className={`text-sm mt-4 ${
							state.success ? "text-green-500" : "text-red-500"
						}`}>
						{state.message}
					</p>
				)}
			</form>
			{showQrPopup && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative rounded-3xl card p-6 shadow-lg">
						<h3 className="mb-4 text-lg font-bold">
							Quét mã QR để thanh toán
						</h3>
						<div className="flex justify-center p-4">
							<Image
								src={qrCodeValue}
								alt="QR Code for payment"
								width={256}
								height={256}
							/>
						</div>
						<button
							onClick={handleClosePopup}
							className="mt-4 w-full bg-red-500 py-2 text-white hover:bg-red-600">
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
