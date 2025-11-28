"use server";

import { z } from "zod";

// --- Telegram API Configuration ---
// IMPORTANT: These should be stored in environment variables.
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// --- Input Validation Schema ---
const OrderSchema = z.object({
	productName: z.string(),
	unitPrice: z.coerce.number(),
	totalAmount: z.coerce.number(),
	amount: z.coerce.number().min(1, "Số lượng không hợp lệ"),
	sellId: z.string().min(1, "ID Bán là bắt buộc"),
	bank: z.string().optional(),
	account: z.string().optional(),
	accountName: z.string().optional(),
	orderId: z.string(),
	selectedItemId: z.string(),
});

export type FormState = {
	message: string;
	errors?: Record<string, string[] | undefined>;
	success: boolean;
	data?: z.infer<typeof OrderSchema>;
	timestamp?: number;
};

// --- Server Action to Send Telegram Message ---
export async function sendTelegramOrder(
	prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	if (!botToken || !chatId) {
		console.error("Telegram Bot Token or Chat ID is not configured.");
		return {
			message:
				"Lỗi cấu hình: Vui lòng thiết lập biến môi trường cho Telegram.",
			success: false,
		};
	}

	const validatedFields = OrderSchema.safeParse({
		productName: formData.get("productName"),
		unitPrice: formData.get("unitPrice"),
		totalAmount: formData.get("totalAmount"),
		amount: formData.get("amount"),
		sellId: formData.get("id"),
		bank: formData.get("bank"),
		account: formData.get("account"),
		accountName: formData.get("name"),
		orderId: formData.get("orderId"),
		selectedItemId: formData.get("selectedItemId"),
	});

	if (!validatedFields.success) {
		return {
			message: "Vui lòng kiểm tra lại các trường đã nhập.",
			errors: validatedFields.error.flatten().fieldErrors,
			success: false,
		};
	}

	const {
		productName,
		unitPrice,
		totalAmount,
		amount,
		sellId,
		bank,
		account,
		accountName,
		orderId,
		selectedItemId,
	} = validatedFields.data;

	// Conditional validation for bank details
	if (selectedItemId !== "duelbuy" && selectedItemId !== "empirebuy") {
		if (!bank) {
			return {
				message: "Ngân hàng là bắt buộc.",
				success: false,
				errors: { bank: ["Ngân hàng là bắt buộc."] },
			};
		}
		if (!account) {
			return {
				message: "Số tài khoản là bắt buộc.",
				success: false,
				errors: { account: ["Số tài khoản là bắt buộc."] },
			};
		}
		if (!accountName) {
			return {
				message: "Tên tài khoản là bắt buộc.",
				success: false,
				errors: { accountName: ["Tên tài khoản là bắt buộc."] },
			};
		}
	}

	const formatPrice = (value: number) =>
		value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

	const bankInfo = `
**Ngân hàng:** \`${bank || "?"}\`
**Số tài khoản:** \`${account || "?"}\`
**Tên chủ tài khoản:** \`${accountName || "?"}\`
`;

	// --- Format the message for Telegram ---
	let messageText = `
ĐƠN HÀNG MỚI
**Order ID:** \`${orderId}\`
**Sản phẩm:** ***${productName}***
**Đơn giá:** ${formatPrice(unitPrice)}
**Số lượng:** ${amount}
**THÀNH TIỀN:** \`${formatPrice(totalAmount)}\`
--------------------
**ID Bán:** \`${sellId}\`
${
	selectedItemId !== "duelbuy" && selectedItemId !== "empirebuy"
		? bankInfo
		: ""
}
--------------------
`;

	const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: messageText,
				parse_mode: "Markdown",
			}),
		});

		const result = await response.json();

		if (!result.ok) {
			console.error("Telegram API error:", result);
			return {
				message: `Không gửi được đơn hàng. Lỗi từ Telegram: ${result.description}`,
				success: false,
			};
		}

		return {
			message: "Đơn hàng của bạn đã được gửi thành công!",
			success: true,
			data: validatedFields.data,
			timestamp: new Date().getTime(),
		};
	} catch (error) {
		console.error("Failed to send Telegram message:", error);
		return {
			message:
				"Không thể kết nối đến dịch vụ Telegram. Vui lòng thử lại sau.",
			success: false,
		};
	}
}
