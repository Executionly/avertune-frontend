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
  ExternalLink,
  CreditCard,
  Wallet,
  Calendar,
  MousePointer,
  Download,
} from "lucide-react";

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

  const referralLink = profile?.referral_code
    ? `https://www.avertune.com/signup?ref=${profile.referral_code}`
    : "";

  useEffect(() => {
    if (!user) return;
    fetchAffiliateData();
  }, [user]);

  async function fetchAffiliateData() {
    setLoading(true);
    try {
      const [profileRes, statsRes, referralsRes, clicksRes, withdrawalsRes] =
        await Promise.all([
          api.get("/affiliate/profile").catch(() => ({ data: null })),
          api.get("/affiliate/stats").catch(() => ({ data: null })),
          api
            .get("/affiliate/referrals?page=1&limit=50")
            .catch(() => ({ data: [] })),
          api
            .get("/affiliate/clicks?page=1&limit=50")
            .catch(() => ({ data: [] })),
          api
            .get("/affiliate/withdrawals?page=1&limit=50")
            .catch(() => ({ data: [] })),
        ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setReferrals(referralsRes.data.data || referralsRes.data || []);
      setClicks(clicksRes.data.data || clicksRes.data || []);
      setWithdrawals(withdrawalsRes.data.data || withdrawalsRes.data || []);
      setJoined(!!profileRes.data);
    } catch (err) {
      toast.error("Failed to load affiliate data.");
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
      fetchAffiliateData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join.");
    } finally {
      setJoining(false);
    }
  }

  async function requestWithdrawal() {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (parseFloat(withdrawAmount) > (stats?.available_balance || 0)) {
      toast.error("Amount exceeds available balance.");
      return;
    }

    // Validate required fields based on payout method
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
        "Withdrawal request submitted. It will be reviewed bi-weekly.",
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
      fetchAffiliateData(); // refresh
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
            // Join Affiliate Program Prompt
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
                Earn 20% commission for each referral's first 2 paid months,
                then 8% ongoing. Withdrawals are reviewed bi-weekly.
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
                      Available balance
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: "var(--teal)",
                    }}
                  >
                    ${stats?.available_balance?.toFixed(2) ?? "0.00"}
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
                    ${stats?.pending_balance?.toFixed(2) ?? "0.00"}
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
                    <strong>20%</strong> for each referral's first 2 paid
                    months, then <strong>8%</strong> ongoing. Withdrawals are
                    reviewed bi‑weekly.
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

                  {/* Dynamic fields based on payout method */}
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
                    </>
                  )}

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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
