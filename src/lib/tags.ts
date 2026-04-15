export interface Tag {
  label: string;
  parent?: string; // if set, this tag is nested under a primary tag
}

export interface TagGroup {
  primary: string;
  children: string[];
}

// Maps selection values to recommended tags.
// Keys are lowercase. Children nest under the primary.
const TAG_RULES: Record<string, Record<string, { primary: string; children: string[] }>> = {
  asset_type: {
    canvas: {
      primary: "Canvas",
      children: ["Multi-Step", "Action-Based", "Scheduled"],
    },
    campaign: {
      primary: "Campaign",
      children: ["Scheduled", "Action-Based", "API-Triggered"],
    },
    segment: { primary: "Segment", children: ["Dynamic", "Static"] },
    template: { primary: "Template", children: ["Reusable", "Shared"] },
    "content block": {
      primary: "Content Block",
      children: ["HTML", "Liquid", "Shared"],
    },
  },
  channel: {
    email: {
      primary: "Email",
      children: ["Marketing", "Transactional", "HTML", "Plain Text"],
    },
    push: {
      primary: "Push",
      children: ["iOS", "Android", "Web", "Silent"],
    },
    sms: { primary: "SMS", children: ["Marketing", "Transactional", "MMS"] },
    "in-app": {
      primary: "In-App",
      children: ["Modal", "Slideup", "Full Screen"],
    },
    banner: { primary: "Banner", children: ["Persistent", "Dismissible"] },
    "content card": {
      primary: "Content Card",
      children: ["Classic", "Captioned", "Banner"],
    },
    whatsapp: {
      primary: "WhatsApp",
      children: ["Marketing", "Transactional", "Utility"],
    },
  },
  program: {
    onboarding: {
      primary: "Onboarding",
      children: ["Welcome", "Setup", "Education", "Activation"],
    },
    activation: {
      primary: "Activation",
      children: ["First Action", "Aha Moment", "Profile Complete"],
    },
    retention: {
      primary: "Retention",
      children: ["Engagement", "Habit Loop", "Value Reminder"],
    },
    dunning: {
      primary: "Dunning",
      children: ["Payment Failed", "Card Expiring", "Grace Period"],
    },
    "win-back": {
      primary: "Win-back",
      children: ["Lapsed", "Offer", "Feedback Request"],
    },
    "feature adoption": {
      primary: "Feature Adoption",
      children: ["Announcement", "Tutorial", "Nudge"],
    },
    upsell: {
      primary: "Upsell",
      children: ["Upgrade", "Cross-Sell", "Add-On"],
    },
    "re-engagement": {
      primary: "Re-engagement",
      children: ["Inactive", "Dormant", "Last Chance"],
    },
    transactional: {
      primary: "Transactional",
      children: ["Receipt", "Confirmation", "Notification"],
    },
    promotional: {
      primary: "Promotional",
      children: ["Sale", "Seasonal", "Launch", "Event"],
    },
  },
  audience: {
    all: { primary: "All Users", children: [] },
    free: {
      primary: "Free",
      children: ["Active Free", "Inactive Free"],
    },
    paid: {
      primary: "Paid",
      children: ["Monthly", "Annual", "Enterprise"],
    },
    trial: {
      primary: "Trial",
      children: ["Early Trial", "Mid Trial", "Expiring"],
    },
    churned: {
      primary: "Churned",
      children: ["Recent Churn", "Long-Term Churn"],
    },
    "at-risk": {
      primary: "At-Risk",
      children: ["Low Engagement", "Declining Usage"],
    },
    new: {
      primary: "New",
      children: ["Day 0", "Week 1", "Month 1"],
    },
    dormant: {
      primary: "Dormant",
      children: ["30-Day Inactive", "60-Day Inactive", "90-Day Inactive"],
    },
    vip: {
      primary: "VIP",
      children: ["High LTV", "Power User", "Advocate"],
    },
  },
};

// Cross-dimensional smart tags: when certain combinations appear together
const COMBO_TAGS: { match: Record<string, string>; tags: TagGroup }[] = [
  {
    match: { channel: "email", program: "transactional" },
    tags: { primary: "Compliance", children: ["CAN-SPAM", "Unsubscribe Exempt"] },
  },
  {
    match: { program: "dunning", channel: "email" },
    tags: { primary: "Revenue Recovery", children: ["Payment Retry", "Update Payment Method"] },
  },
  {
    match: { program: "onboarding", audience: "new" },
    tags: { primary: "First Impressions", children: ["Day 0 Welcome", "Quick Win"] },
  },
  {
    match: { program: "win-back", audience: "churned" },
    tags: { primary: "Re-Acquisition", children: ["Win-Back Offer", "Feedback Survey"] },
  },
];

export function getRecommendedTags(
  selections: Record<string, string>
): TagGroup[] {
  const groups: TagGroup[] = [];
  const seen = new Set<string>();

  // Per-dimension tags
  for (const [dimKey, value] of Object.entries(selections)) {
    if (!value) continue;
    const dimRules = TAG_RULES[dimKey];
    if (!dimRules) continue;
    const rule = dimRules[value.toLowerCase()];
    if (rule && !seen.has(rule.primary)) {
      seen.add(rule.primary);
      groups.push({ primary: rule.primary, children: rule.children });
    }
  }

  // Cross-dimensional combo tags
  for (const combo of COMBO_TAGS) {
    const matches = Object.entries(combo.match).every(
      ([k, v]) => selections[k]?.toLowerCase() === v
    );
    if (matches && !seen.has(combo.tags.primary)) {
      seen.add(combo.tags.primary);
      groups.push(combo.tags);
    }
  }

  return groups;
}
