// FILE: src/app/(marketing)/affiliate/page.tsx
import type { Metadata } from "next";
import AffiliateClient from "./AffliliateClient";

export const metadata: Metadata = {
  title: "Affiliate Program | Avertune",
  description:
    "Earn recurring commissions by sharing Avertune with your audience.",
};

export default function AffiliatePage() {
  return <AffiliateClient />;
}
