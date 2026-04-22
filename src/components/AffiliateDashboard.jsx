import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { api } from "../lib/apiClient.js";
import { useToast } from "../lib/Toast.jsx";
import Sidebar from "./Sidebar.jsx";
import {
  Copy,
  Check,
  Users,
  DollarSign,
  Clock,
  Award,
  TrendingUp,
  Menu,
  CreditCard,
  MousePointer,
} from "lucide-react";

// FAQ data extracted from AffiliateProgram component
const AFFILIATE_FAQS = [
  {
    q: "Is there a follower requirement?",
    a: "No. We care about content quality, not follower count.",
  },
  {
    q: "When do I get paid?",
    a: "Payments are made based on approved content and performance cycles.",
  },
  {
    q: "Can I create my own content ideas?",
    a: "Yes. We encourage originality. We provide inspiration and proven formats, but you are free to test your own ideas.",
  },
  {
    q: "Is there a limit to earnings?",
    a: "No. Earnings scale with performance. The more you create and the better your content performs, the more you earn.",
  },
  {
    q: "What kind of content performs best?",
    a: "Real message examples, before/after comparisons, and emotional or high-stakes scenarios tend to perform very well.",
  },
  {
    q: "How is Avertune different from writing tools?",
    a: "Most tools help you rewrite text. Avertune helps you understand what a message really means, avoid miscommunication, and respond strategically. It's communication decision support, not just writing.",
  },
  {
    q: "Is Avertune free to use?",
    a: "Yes. You can try Avertune with a limited number of replies per day. Paid plans unlock more replies, advanced response strategies, and negotiation tools.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We do not sell your data. We use your inputs only to provide and improve the service.",
  },
];

export default function AffiliateDashboard() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("paypal");
  const [payoutDetails, setPayoutDetails] = useState({
    paypal_email: "",
    bank_name: "",
    bank_account: "",
    bank_account_name: "",
    bank_country: "NG",
    bank_swift: "",
    bank_routing: "",
    wise_email: "",
    payoneer_email: "",
    mobile_number: "",
    mobile_provider: "",
    mobile_country: "NG",
    usdt_address: "",
    usdt_network: "TRC20",
  });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink =
    profile?.referral_url ||
    (profile?.referral_code
      ? `https://www.avertune.com/signup?ref=${profile.referral_code}`
      : "");

  useEffect(() => {
    if (!user) return;
    fetchAffiliateData();
  }, [user]);

  async function fetchAffiliateData() {
    setLoading(true);
    try {
      const profileRes = await api.get("/affiliate/profile");
      const profileData = profileRes.data;

      if (profileData.is_affiliate === true) {
        setProfile(profileData);
        setJoined(true);
      } else {
        setJoined(false);
        setLoading(false);
        return;
      }

      // Fetch other data in parallel
      const [statsRes, referralsRes, clicksRes, withdrawalsRes] =
        await Promise.all([
          api.get("/affiliate/stats").catch(() => ({ data: null })),
          api
            .get("/affiliate/referrals?page=1&limit=50")
            .catch(() => ({ data: { data: [] } })),
          api
            .get("/affiliate/clicks?page=1&limit=50")
            .catch(() => ({ data: { data: [] } })),
          api
            .get("/affiliate/withdrawals?page=1&limit=50")
            .catch(() => ({ data: { data: [] } })),
        ]);

      setStats(statsRes.data);
      setReferrals(referralsRes.data?.data || referralsRes.data || []);
      setClicks(clicksRes.data?.data || clicksRes.data || []);
      setWithdrawals(withdrawalsRes.data?.data || withdrawalsRes.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setJoined(false);
      } else {
        toast.error("Failed to load affiliate data.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function joinAffiliateProgram() {
    setJoining(true);
    try {
      await api.post("/affiliate/join");
      toast.success(
        "Welcome to the Affiliate Program! Your referral link is ready.",
      );
      await fetchAffiliateData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join.");
    } finally {
      setJoining(false);
    }
  }

  async function requestWithdrawal() {
    const available = (stats?.total_earnings || 0) - (stats?.paid_out || 0);
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (parseFloat(withdrawAmount) > available) {
      toast.error("Amount exceeds available balance.");
      return;
    }

    // Validation per method
    if (payoutMethod === "paypal" && !payoutDetails.paypal_email) {
      toast.error("PayPal email is required.");
      return;
    }
    if (
      payoutMethod === "bank_transfer" &&
      (!payoutDetails.bank_account || !payoutDetails.bank_account_name)
    ) {
      toast.error("Bank account details are required.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/affiliate/withdraw", {
        amount: parseFloat(withdrawAmount),
        payout_method: payoutMethod,
        ...payoutDetails,
      });
      toast.success(
        "Withdrawal request submitted. It will be reviewed monthly.",
      );
      setWithdrawAmount("");
      setPayoutDetails({
        paypal_email: "",
        bank_name: "",
        bank_account: "",
        bank_account_name: "",
        bank_country: "NG",
        bank_swift: "",
        bank_routing: "",
        wise_email: "",
        payoneer_email: "",
        mobile_number: "",
        mobile_provider: "",
        mobile_country: "NG",
        usdt_address: "",
        usdt_network: "TRC20",
      });
      fetchAffiliateData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  }

  if (authLoading) return null;
  if (!user) {
    navigate("/login");
    return null;
  }

  // Calculate available balance
  const availableBalance =
    (stats?.total_earnings || 0) - (stats?.paid_out || 0);

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", display: "flex" }}
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main
        className="main-content"
        style={{ flex: 1, marginLeft: 240, minWidth: 0 }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              height: 60,
              gap: 12,
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                display: "none",
                color: "var(--ink-2)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              className="mobile-menu-btn"
            >
              <Menu size={21} />
            </button>
            <style>{`
              @media (max-width: 900px) {
                .mobile-menu-btn { display: flex !important; }
                .main-content { margin-left: 0 !important; }
              }
            `}</style>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color="var(--green)" />
              <span style={{ fontWeight: 800, fontSize: 15 }}>
                Affiliate Dashboard
              </span>
            </div>
          </div>
        </header>

        <div
          className="container"
          style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 1000 }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div className="dot-loader" style={{ justifyContent: "center" }}>
                <span />
                <span />
                <span />
              </div>
              <p style={{ marginTop: 16, color: "var(--ink-3)" }}>
                Loading affiliate data...
              </p>
            </div>
          ) : !joined ? (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(40px,8vw,80px) 20px",
                background: "var(--surface)",
                borderRadius: 24,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <TrendingUp size={28} color="var(--green)" />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                Join the Affiliate Program
              </h2>
              <p
                style={{
                  color: "var(--ink-3)",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Earn {profile?.commission_rate ?? 20}% commission for each
                referral's first 2 paid months, then 8% ongoing. Withdrawals are
                reviewed monthly.
              </p>
              <button
                onClick={joinAffiliateProgram}
                disabled={joining}
                className="btn-green"
                style={{ padding: "12px 28px", borderRadius: 12 }}
              >
                {joining ? "Joining..." : "Join Now"}
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    padding: "18px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Users size={18} color="var(--green)" />
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      Total referrals
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "var(--green)",
                    }}
                  >
                    {stats?.total_referrals ?? 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "18px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <DollarSign size={18} color="var(--teal)" />
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      Total earnings
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "var(--teal)",
                    }}
                  >
                    ${stats?.total_earnings?.toFixed(2) ?? "0.00"}
                  </div>
                </div>
                <div
                  style={{
                    padding: "18px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Clock size={18} color="#f59e0b" />
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      Pending earnings
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 800, color: "#f59e0b" }}
                  >
                    ${stats?.pending_earnings?.toFixed(2) ?? "0.00"}
                  </div>
                </div>
                <div
                  style={{
                    padding: "18px 20px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Award size={18} color="#a78bfa" />
                    <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      Paid referrals
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 800, color: "#a78bfa" }}
                  >
                    {stats?.paid_referrals ?? 0}
                  </div>
                </div>
              </div>

              {/* Commission Info + Referral Link */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  borderRadius: 20,
                  padding: "24px",
                  marginBottom: 28,
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <h2
                    style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}
                  >
                    Your commission rate
                  </h2>
                  <p style={{ color: "var(--ink-3)" }}>
                    <strong>{profile?.commission_rate ?? 20}%</strong> for each
                    referral's first 2 paid months, then <strong>8%</strong>{" "}
                    ongoing. Withdrawals are reviewed monthly.
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                    Your referral link
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      background: "var(--surface2)",
                      borderRadius: 12,
                      padding: "8px 12px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: "var(--ink-2)",
                        wordBreak: "break-all",
                      }}
                    >
                      {referralLink}
                    </span>
                    <button
                      onClick={copyReferralLink}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: copied
                          ? "rgba(34,197,94,0.1)"
                          : "transparent",
                        color: copied ? "var(--green)" : "var(--ink-3)",
                        border: "1px solid var(--border2)",
                        cursor: "pointer",
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Affiliate Info Note */}
              <div
                style={{
                  background: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  marginBottom: 28,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-2)",
                    lineHeight: 1.6,
                  }}
                >
                  💡 <strong>How it works:</strong> Share your unique referral
                  link. When someone signs up and subscribes to a paid plan, you
                  earn <strong>{profile?.commission_rate ?? 20}%</strong> for
                  their first 2 months, then <strong>8%</strong> ongoing.
                  Withdrawals are reviewed monthly and paid out via your chosen
                  method.
                </p>
              </div>

              {/* Referrals Table */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  Referrals
                </h2>
                {referrals.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 40,
                      background: "var(--surface)",
                      borderRadius: 16,
                    }}
                  >
                    <Users size={32} color="var(--ink-4)" />
                    <p style={{ marginTop: 12, color: "var(--ink-3)" }}>
                      No referrals yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid var(--border)",
                            textAlign: "left",
                          }}
                        >
                          <th
                            style={{
                              padding: "12px 8px",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Email / Name
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Signed up
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Commission
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((ref) => (
                          <tr
                            key={ref.id}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td style={{ padding: "12px 8px" }}>
                              {ref.email || ref.name || "Anonymous"}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              {new Date(ref.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              {ref.status || "Active"}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              ${ref.commission?.toFixed(2) ?? "0.00"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Clicks History */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  Link Clicks
                </h2>
                {clicks.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 40,
                      background: "var(--surface)",
                      borderRadius: 16,
                    }}
                  >
                    <MousePointer size={32} color="var(--ink-4)" />
                    <p style={{ marginTop: 12, color: "var(--ink-3)" }}>
                      No clicks tracked yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            IP / Country
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Landing page
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {clicks.map((click) => (
                          <tr
                            key={click.id}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td style={{ padding: "12px 8px" }}>
                              {new Date(click.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              {click.ip || click.country || "—"}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              {click.landing_page || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Request Withdrawal */}
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  Request Withdrawal
                </h2>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border2)",
                    borderRadius: 20,
                    padding: "24px",
                  }}
                >
                  {/* ... withdrawal form (same as before, unchanged) ... */}
                  {/* To avoid repetition, the withdrawal form remains exactly as in the original code */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Amount (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid var(--border2)",
                          background: "var(--surface2)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Payout method
                      </label>
                      <select
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid var(--border2)",
                          background: "var(--surface2)",
                          color: "var(--ink)",
                        }}
                      >
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="wise">Wise</option>
                        <option value="payoneer">Payoneer</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="usdt">USDT (TRC20)</option>
                      </select>
                    </div>
                  </div>

                  {/* PayPal */}
                  {payoutMethod === "paypal" && (
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        PayPal email
                      </label>
                      <input
                        type="email"
                        value={payoutDetails.paypal_email}
                        onChange={(e) =>
                          setPayoutDetails({
                            ...payoutDetails,
                            paypal_email: e.target.value,
                          })
                        }
                        placeholder="user@paypal.com"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid var(--border2)",
                          background: "var(--surface2)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  )}

                  {/* Wise */}
                  {payoutMethod === "wise" && (
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Wise email
                      </label>
                      <input
                        type="email"
                        value={payoutDetails.wise_email}
                        onChange={(e) =>
                          setPayoutDetails({
                            ...payoutDetails,
                            wise_email: e.target.value,
                          })
                        }
                        placeholder="user@wise.com"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid var(--border2)",
                          background: "var(--surface2)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  )}

                  {/* Payoneer */}
                  {payoutMethod === "payoneer" && (
                    <div style={{ marginBottom: 16 }}>
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Payoneer email
                      </label>
                      <input
                        type="email"
                        value={payoutDetails.payoneer_email}
                        onChange={(e) =>
                          setPayoutDetails({
                            ...payoutDetails,
                            payoneer_email: e.target.value,
                          })
                        }
                        placeholder="user@payoneer.com"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: "1px solid var(--border2)",
                          background: "var(--surface2)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {payoutMethod === "bank_transfer" && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 16,
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            Bank name
                          </label>
                          <input
                            type="text"
                            value={payoutDetails.bank_name}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                bank_name: e.target.value,
                              })
                            }
                            placeholder="First Bank"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            Account number
                          </label>
                          <input
                            type="text"
                            value={payoutDetails.bank_account}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                bank_account: e.target.value,
                              })
                            }
                            placeholder="1234567890"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Account holder name
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.bank_account_name}
                          onChange={(e) =>
                            setPayoutDetails({
                              ...payoutDetails,
                              bank_account_name: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--border2)",
                            background: "var(--surface2)",
                            color: "var(--ink)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 16,
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            SWIFT / BIC
                          </label>
                          <input
                            type="text"
                            value={payoutDetails.bank_swift}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                bank_swift: e.target.value,
                              })
                            }
                            placeholder="FBNINGLA"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            Routing number (if US)
                          </label>
                          <input
                            type="text"
                            value={payoutDetails.bank_routing}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                bank_routing: e.target.value,
                              })
                            }
                            placeholder="021000021"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Bank country
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.bank_country}
                          onChange={(e) =>
                            setPayoutDetails({
                              ...payoutDetails,
                              bank_country: e.target.value,
                            })
                          }
                          placeholder="NG"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--border2)",
                            background: "var(--surface2)",
                            color: "var(--ink)",
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Mobile Money */}
                  {payoutMethod === "mobile_money" && (
                    <>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 16,
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            Mobile number
                          </label>
                          <input
                            type="tel"
                            value={payoutDetails.mobile_number}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                mobile_number: e.target.value,
                              })
                            }
                            placeholder="+2348012345678"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              display: "block",
                              marginBottom: 6,
                            }}
                          >
                            Provider
                          </label>
                          <input
                            type="text"
                            value={payoutDetails.mobile_provider}
                            onChange={(e) =>
                              setPayoutDetails({
                                ...payoutDetails,
                                mobile_provider: e.target.value,
                              })
                            }
                            placeholder="MTN"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 10,
                              border: "1px solid var(--border2)",
                              background: "var(--surface2)",
                              color: "var(--ink)",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.mobile_country}
                          onChange={(e) =>
                            setPayoutDetails({
                              ...payoutDetails,
                              mobile_country: e.target.value,
                            })
                          }
                          placeholder="NG"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--border2)",
                            background: "var(--surface2)",
                            color: "var(--ink)",
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* USDT */}
                  {payoutMethod === "usdt" && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          USDT Address (TRC20)
                        </label>
                        <input
                          type="text"
                          value={payoutDetails.usdt_address}
                          onChange={(e) =>
                            setPayoutDetails({
                              ...payoutDetails,
                              usdt_address: e.target.value,
                            })
                          }
                          placeholder="TQqpDiEbZhbC..."
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--border2)",
                            background: "var(--surface2)",
                            color: "var(--ink)",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 6,
                          }}
                        >
                          Network
                        </label>
                        <select
                          value={payoutDetails.usdt_network}
                          onChange={(e) =>
                            setPayoutDetails({
                              ...payoutDetails,
                              usdt_network: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid var(--border2)",
                            background: "var(--surface2)",
                            color: "var(--ink)",
                          }}
                        >
                          <option value="TRC20">TRC20</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-4)",
                      marginBottom: 16,
                    }}
                  >
                    Complete all required payout fields correctly before
                    submitting.
                  </div>
                  <button
                    onClick={requestWithdrawal}
                    disabled={submitting}
                    className="btn-green"
                    style={{ width: "100%", padding: "12px", borderRadius: 12 }}
                  >
                    {submitting ? "Submitting..." : "Submit withdrawal request"}
                  </button>
                </div>
              </div>

              {/* Withdrawal Requests History */}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
                  Withdrawal Requests
                </h2>
                {withdrawals.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 40,
                      background: "var(--surface)",
                      borderRadius: 16,
                    }}
                  >
                    <CreditCard size={32} color="var(--ink-4)" />
                    <p style={{ marginTop: 12, color: "var(--ink-3)" }}>
                      No withdrawal requests yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Requested
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Method
                          </th>
                          <th
                            style={{
                              padding: "12px 8px",
                              textAlign: "left",
                              fontSize: 13,
                              color: "var(--ink-3)",
                            }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.map((req) => (
                          <tr
                            key={req.id}
                            style={{ borderBottom: "1px solid var(--border)" }}
                          >
                            <td style={{ padding: "12px 8px" }}>
                              {new Date(req.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              ${req.amount.toFixed(2)}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              {req.payout_method}
                            </td>
                            <td style={{ padding: "12px 8px" }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "2px 8px",
                                  borderRadius: 12,
                                  fontSize: 12,
                                  background:
                                    req.status === "approved"
                                      ? "rgba(34,197,94,0.1)"
                                      : req.status === "rejected"
                                        ? "rgba(239,68,68,0.1)"
                                        : "rgba(245,158,11,0.1)",
                                  color:
                                    req.status === "approved"
                                      ? "var(--green)"
                                      : req.status === "rejected"
                                        ? "#ef4444"
                                        : "#f59e0b",
                                }}
                              >
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* FAQ Section */}
              <div style={{ marginTop: 40 }}>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    marginBottom: 20,
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {AFFILIATE_FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 16,
                        padding: "16px 20px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          marginBottom: 8,
                          color: "var(--ink)",
                        }}
                      >
                        {faq.q}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--ink-3)",
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
