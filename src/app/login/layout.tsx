"use client"

import { Suspense } from 'react'

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Suspense>
			<section>
				sfgljsh
				{children}
			</section>
		</Suspense>
	);
}
