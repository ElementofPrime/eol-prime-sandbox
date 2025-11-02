import "@styles/globals.css";
import Providers from "./providers";
import { Inter, Great_Vibes } from "next/font/google";
import BackgroundDecor from "@/components/BackgroundDecor";
import NavBar from "@/components/NavBar";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});
const greatVibes = Great_Vibes({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-greatvibes",
	display: "swap",
});

export const metadata = {
	"apple-mobile-web-app-capable": "yes",
	"apple-mobile-web-app-status-bar-style": "black-translucent",
	"apple-mobile-web-app-title": "Element of Life",
	"mobile-web-app-capable": "yes",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.variable} ${greatVibes.variable}`}>
			<body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
				<Providers>
					<BackgroundDecor />
					<ClientLayout>
						<main className="relative z-10">
							<NavBar />
							{children}
						</main>
					</ClientLayout>
				</Providers>
			</body>
		</html>
	);
}
