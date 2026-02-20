export const projects = [
  {
    id: "checkout",
    name: "Checkout API",
    updatedAt: "Feb 19, 2026",
    description: "Secure variables for payment integrations.",
    summary: "Variables and secrets for payments and anti-fraud flow.",
    variables: [
      { key: "PAYMENT_PUBLIC_KEY", value: "pk_live_51NX...9H2" },
      { key: "PAYMENT_WEBHOOK_SECRET", value: "whsec_9b3...7a1" },
      { key: "ANTI_FRAUD_TOKEN", value: "af_5fe2...1d0" },
      { key: "DB_READONLY_URL", value: "postgres://readonly@db.internal" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Site",
    updatedAt: "Feb 12, 2026",
    description: "Preview environments and analytics keys.",
    summary: "Public keys and feature flags for campaigns and landing pages.",
    variables: [
      { key: "NEXT_PUBLIC_ANALYTICS_ID", value: "ga-4f22...c0a" },
      { key: "PREVIEW_TOKEN", value: "pv_8d0e...aa4" },
      { key: "CMS_READONLY_KEY", value: "cms_ro_7c1...2aa" },
    ],
  },
  {
    id: "ops",
    name: "Ops & Logs",
    updatedAt: "Feb 07, 2026",
    description: "Observability pipeline and internal alerts.",
    summary: "Secrets and internal routes for logs and incidents.",
    variables: [
      { key: "LOGS_INGEST_TOKEN", value: "lg_9b1...2f0" },
      { key: "ALERTS_WEBHOOK", value: "https://alerts.internal" },
      { key: "TRACE_SAMPLING", value: "0.25" },
    ],
  },
] as const;
