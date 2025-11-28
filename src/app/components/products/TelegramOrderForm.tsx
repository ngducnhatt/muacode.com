"use client";

import { TelegramOrderFormProps } from "@/lib/types";
import { BuyForm } from "./BuyForm";
import { SellForm } from "./SellForm";

const TelegramOrderForm = ({
	selectedItem,
	banks = [],
}: TelegramOrderFormProps) => {
	if (!selectedItem) {
		return null;
	}
	const isBuyForm =
		selectedItem.id === "duelbuy" || selectedItem.id === "empirebuy";

	if (isBuyForm) {
		return <BuyForm selectedItem={selectedItem} banks={banks} />;
	}

	return <SellForm selectedItem={selectedItem} banks={banks} />;
};

export default TelegramOrderForm;