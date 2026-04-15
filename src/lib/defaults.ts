export interface DimensionConfig {
  key: string;
  label: string;
  type: "select" | "text" | "date";
  values?: string[];
  /** Optional display label per value — the value is what gets written to the output string */
  labels?: Record<string, string>;
}

const COUNTRY_LABELS: Record<string, string> = {
  AU: "Australia",
  NZ: "New Zealand",
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  IE: "Ireland",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  PT: "Portugal",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  JP: "Japan",
  KR: "South Korea",
  SG: "Singapore",
  HK: "Hong Kong",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  AE: "United Arab Emirates",
  ZA: "South Africa",
  GLOBAL: "Global / All markets",
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  pl: "Polish",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
};

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
  {
    key: "country",
    label: "Country",
    type: "select",
    values: Object.keys(COUNTRY_LABELS),
    labels: COUNTRY_LABELS,
  },
  {
    key: "language",
    label: "Language",
    type: "select",
    values: Object.keys(LANGUAGE_LABELS),
    labels: LANGUAGE_LABELS,
  },
  { key: "version", label: "Version", type: "text" },
  { key: "step", label: "Step / Day", type: "text" },
  { key: "variant", label: "Variant", type: "text" },
  { key: "deployment_date", label: "Deployment Date", type: "date" },
];
