const Collab = require("../models/Collab");
const User = require("../models/User");

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function last6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()] });
  }
  return months;
}

const STATUS_COLORS = {
  brand_accepted: "#c87a4a",
  active: "#7a1f33",
  submitted: "#6366f1",
  completed: "#2f8f53",
  declined: "#a0364a",
};

function monthlyCount(items, dateField, months) {
  return months.map(({ year, month, label }) => {
    const count = items.filter((it) => {
      const d = it[dateField];
      return d && new Date(d).getFullYear() === year && new Date(d).getMonth() === month;
    }).length;
    return { label, value: count };
  });
}

function statusBreakdownFor(collabs) {
  const counts = {};
  collabs.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
  const total = collabs.length || 1;
  return Object.entries(counts).map(([status, count]) => ({
    label: status.replace("_", " "),
    pct: Math.round((count / total) * 100),
    color: STATUS_COLORS[status] || "#999",
  }));
}

// ── Creator Analytics ──
// GET /api/analytics/creator
const getCreatorAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const collabs = await Collab.find({ creatorId: userId })
      .populate("postId", "title budget niches")
      .populate("brandId", "name username avatarUrl");

    const completed = collabs.filter((c) => c.status === "completed");
    const active = collabs.filter((c) => ["active", "brand_accepted"].includes(c.status));
    const months = last6Months();

    const topCampaigns = completed
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
      .slice(0, 5)
      .map((c) => ({
        brand: c.brandId?.name || "Unknown Brand",
        title: c.postId?.title || "Campaign",
        budget: c.postId?.budget || "—",
      }));

    res.json({
      success: true,
      stats: {
        followers: user.followersArr?.length || 0,
        campaignsCompleted: completed.length,
        trustScore: user.trustScore || 0,
        activeCollabs: active.length,
      },
      monthlyCampaigns: monthlyCount(completed, "completedAt", months),
      monthlyApplications: monthlyCount(collabs, "createdAt", months),
      statusBreakdown: statusBreakdownFor(collabs),
      topCampaigns,
    });
  } catch (err) {
    console.error("getCreatorAnalytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Brand Analytics ──
// GET /api/analytics/brand
const getBrandAnalytics = async (req, res) => {
  try {
    const brandId = req.user._id;
    const user = await User.findById(brandId);

    const collabs = await Collab.find({ brandId })
      .populate("postId", "title budget niches")
      .populate("creatorId", "name username avatarUrl trustScore");

    const completed = collabs.filter((c) => c.status === "completed");
    const months = last6Months();

    const uniqueCreatorIds = [...new Set(collabs.map((c) => c.creatorId?._id?.toString()).filter(Boolean))];
    const topCreators = uniqueCreatorIds
      .map((id) => collabs.find((c) => c.creatorId?._id?.toString() === id)?.creatorId)
      .filter(Boolean)
      .slice(0, 5)
      .map((c) => ({ name: c.name, username: c.username, avatarUrl: c.avatarUrl, trustScore: c.trustScore }));

    res.json({
      success: true,
      stats: {
        totalCampaigns: collabs.length,
        campaignsCompleted: completed.length,
        totalCreators: uniqueCreatorIds.length,
        trustScore: user.trustScore || 0,
      },
      monthlyCampaigns: monthlyCount(completed, "completedAt", months),
      monthlyApplications: monthlyCount(collabs, "createdAt", months),
      statusBreakdown: statusBreakdownFor(collabs),
      topCreators,
    });
  } catch (err) {
    console.error("getBrandAnalytics error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCreatorAnalytics, getBrandAnalytics };