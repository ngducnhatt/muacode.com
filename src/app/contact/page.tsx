import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Liên hệ",
};

const ContactPage = () => {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 rounded-2xl border border-surface-600 bg-surface-700 p-6 shadow-soft lg:grid-cols-[320px,1fr]">
				<aside className="flex flex-col justify-between rounded-2xl bg-ink-950 p-4 text-ink-50">
					<div className="space-y-3">
						<div className="h-40 w-full rounded-xl bg-ink-800/60">
							<Image
								src="https://pub-f0a6dec73e084e83be3f5ea518ee5da7.r2.dev/logo.png"
								alt="Banner"
								width={400}
								height={160}
								className="h-40 w-full rounded-xl object-cover"></Image>
						</div>
						<h2 className="text-lg font-bold">
							Liên hệ dịch vụ khách hàng
						</h2>
						<p className="text-sm text-ink-100/80">
							Chúng tôi có đội ngũ hỗ trợ luôn sẵn sàng giúp bạn.
							Bạn có thể chat trực tuyến hoặc gửi email cho chúng
							tôi, và nhận hỗ trợ nhanh chóng từ đội ngũ chăm sóc
							khách hàng của <span>MuaCode.com</span>
						</p>
					</div>
				</aside>

				<section className="space-y-6">
					<div className="rounded-2xl bg-ink-950 p-5">
						<h3 className="text-lg font-normal text-ink-50">
							Liên hệ với chúng tôi bằng các phương thức sau
						</h3>

						<div className="mt-4 grid gap-2 md:grid-cols-3">
							<button className="flex items-center gap-2 rounded-3xl border border-surface-600 bg-surface-700 px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<span>Facebook</span>
							</button>
							<button className="flex items-center gap-2 rounded-3xl border border-surface-600 bg-surface-700 px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<span>Telegram</span>
							</button>
							<button className="flex items-center gap-2 rounded-3xl border border-surface-600 bg-surface-700 px-3 py-2 text-left text-sm font-semibold text-ink-50">
								<span>Discord</span>
							</button>
						</div>
					</div>

					<div className="rounded-2xl bg-ink-950 p-5 space-y-3">
						<h3 className="text-lg font-normal text-ink-50">
							Hãy Email cho chúng tôi
						</h3>
						<div>
							<div className="mt-2 flex flex-wrap gap-2">
								<button className="rounded-full bg-surface-700 px-3 py-1  font-normal text-ink-50">
									support@muacode.com
								</button>
							</div>
						</div>
					</div>

					<div className="rounded-2xl  bg-ink-950 p-5 space-y-3">
						<h3 className="text-lg font-normal text-ink-50">
							Địa chỉ MuaCode.com
						</h3>
						<div className="overflow-hidden rounded-xl border border-surface-600">
							<div className="h-64 w-full bg-surface-700">
								<iframe
									title="MuaCode.com Map"
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.223922260935!2d105.78884687544814!3d20.983659280654454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accf2e89d531%3A0x79a6a4e049e4116d!2zc-G7kSAxMCDEkC4gVHLhuqduIFBow7osIFAuIE3hu5kgTGFvLCBIw6AgxJDDtG5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1763948067283!5m2!1svi!2s"
									className="h-full w-full"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default ContactPage;
