export interface DimensionConfig {
  key: string;
  label: string;
  type: "select" | "text";
  values?: string[];
}

export const DEFAULT_DIMENSIONS: DimensionConfig[] = [
  {
    key: "asset_type",
    label: "Asset Type",
    type: "select",
    values: ["Canvas", "Campaign", "Segment", "Template", "Content Block"],
  },
  {
    key: "channel",
    label: "Channel",
    type: "select",
    values: [
      "Email",
      "Push",
      "SMS",
      "In-App",
      "Banner",
      "Content Card",
      "WhatsApp",
    ],
  },
  {
    key: "program",
    label: "Program",
    type: "select",
    values: [
      "Onboarding",
      "Activation",
      "Retention",
      "Dunning",
      "Win-back",
      "Feature Adoption",
      "Upsell",
      "Re-engagement",
      "Transactional",
      "Promotional",
    ],
  },
  {
    key: "audience",
    label: "Audience",
    type: "select",
    values: [
      "All",
      "Free",
      "Paid",
      "Trial",
      "Churned",
      "At-Risk",
      "New",
      "Dormant",
      "VIP",
    ],
  },
  { key: "version", label: "Version", type: "text" },
  { key: "step", label: "Step / Day", type: "text" },
  { key: "variant", label: "Variant", type: "text" },
];
