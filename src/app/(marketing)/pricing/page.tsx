import { Suspense } from "react";
import { PricingClient } from "./PricingClient";
import { getPlans } from "@/lib/api/auth";
//const SUB_URL = "http://localhost:3001/api/v2/subscription";

export default async function PricingPage() {
  const data = await getPlans();
  console.log("Fetched plans:", data);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-[3px] border-violet-500/30 border-t-violet-500 animate-spin" />
        </div>
      }
    >
      <PricingClient data={data} />
    </Suspense>
  );
}
