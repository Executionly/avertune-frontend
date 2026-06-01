import { getPlans, getSubscription } from "@/lib/api/auth";

// Cached limit — populated once per session
let _cachedLimit: number | null = null;

/**
 * Fetch the character limit from subscription/plans.
 * - Logged in: match the user's active plan tier from /subscription/me against /subscription/plans
 * - Logged out: use the free/trial plan's char_limits from /subscription/plans
 * Falls back to 500 if the endpoint fails.
 */
export async function fetchCharLimit(): Promise<number> {
  if (_cachedLimit !== null) return _cachedLimit;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  try {
    const plans = await getPlans();
    const planList: any[] = Array.isArray(plans) ? plans : (plans?.plans ?? []);

    // Free/trial plan limit — used as fallback and for unauthenticated users
    const freePlan = planList.find(
      (p) =>
        p.tier === "trial" ||
        p.tier === "free" ||
        p.name?.toLowerCase().includes("free") ||
        p.name?.toLowerCase().includes("trial"),
    );
    const freePlanLimit =
      freePlan?.char_limits ?? freePlan?.input_word_limit ?? 500;

    if (token) {
      // Get the user's active subscription tier from /subscription/me
      try {
        const sub = await getSubscription(token);
        const activeTier: string =
          sub?.tier ?? sub?.plan_tier ?? sub?.plan?.tier ?? null;

        if (activeTier) {
          const userPlan = planList.find(
            (p) => p.tier === activeTier || p.name === activeTier,
          );
          const userLimit =
            userPlan?.char_limits ??
            userPlan?.input_word_limit ??
            freePlanLimit;

          _cachedLimit = Number(userLimit);
          return _cachedLimit;
        }
      } catch {
        // subscription/me failed — fall through to free plan limit
      }
    }

    // Not logged in or couldn't determine plan — use free/trial limit
    _cachedLimit = Number(freePlanLimit);
    return _cachedLimit;
  } catch {
    return 500;
  }
}

/** Invalidate the cache (e.g. after a plan upgrade) */
export function invalidateCharLimitCache() {
  _cachedLimit = null;
}

export type CharCountStatus = "ok" | "warning" | "error";

export function getCharCountStatus(
  length: number,
  limit: number,
): CharCountStatus {
  if (length >= limit) return "error";
  if (length >= limit * 0.85) return "warning";
  return "ok";
}

/**
 * Fetch the char limit for unauthenticated users (free/trial plan).
 * Used on marketing pages to show the correct word count without a token.
 */
export async function fetchFreeCharLimit(): Promise<number> {
  try {
    const plans = await getPlans();
    const planList: any[] = Array.isArray(plans) ? plans : (plans?.plans ?? []);
    const freePlan = planList.find(
      (p) =>
        p.tier === "trial" ||
        p.tier === "free" ||
        p.name?.toLowerCase().includes("free") ||
        p.name?.toLowerCase().includes("trial"),
    );
    return Number(freePlan?.char_limits ?? freePlan?.input_word_limit ?? 500);
  } catch {
    return 500;
  }
}
