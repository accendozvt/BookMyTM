// Phase 1 copy: English blog posts. Titles trimmed to 50-60 chars keeping the
// primary keyword; descriptions rewritten from each article's own content.
// Also clears literal HTML entities (&#039;) that came in from the WordPress scrape.
export const REWRITES = {
  '/ai-generated-logo-copyright-trademark-ownership/': {
    title: 'Who Owns Your AI-Generated Logo in India? | BookMyTM',
    description:
      'Who owns an AI-generated logo in India? Copyright law is still unsettled, but trademark registration protects your logo as a brand identifier today.',
  },
  '/amazon-brand-registry-india-requirements-benefits-how-to-apply-2025/': {
    title: 'Amazon Brand Registry India: Complete 2025 Guide | BookMyTM',
    description:
      'Protect your products on Amazon India. Learn how to enrol in Amazon Brand Registry and unlock A+ Content, Buy Box protection and Brand Analytics.',
  },
  '/big-brands-vs-copycats-lessons-from-2024-legal-judgements/': {
    description:
      'The Delhi High Court delivered landmark Indian IP judgements in 2024. See what these copycat rulings mean for how you protect and enforce your brand.',
  },
  '/brand-sabotage-7-common-trademark-filing-mistakes-indian-entrepreneurs-make-and-how-to-avoid-them/': {
    title: '7 Trademark Filing Mistakes Indian Founders Make | BookMyTM',
    description:
      "Don't let common trademark filing mistakes derail your brand. Learn how to avoid errors in class selection, search and distinctiveness in India.",
  },
  '/ccfs-2026-save-90-on-mca-late-fees/': {
    title: 'CCFS 2026: Save 90% on MCA Late Filing Fees | BookMyTM',
  },
  '/copyright-vs-trademark-difference-india-what-should-you-register-2025/': {
    title: 'Copyright vs Trademark in India: What to Register | BookMyTM',
    description:
      'Logo, book or code? Learn the difference between copyright and trademark in India, and which one actually protects your brand versus your content.',
  },
  '/design-registration-india-guide/': {
    title: 'Design Registration in India: Complete Guide | BookMyTM',
  },
  '/fast-track-trademark-how-2025-rules-speed-up-approvals/': {
    description:
      'Trademark registration in India used to take years. Learn how the 2025 rules, expedited examination and digital filing are speeding up approvals.',
  },
  '/feb-2026-bis-exemption-for-imports-customs-clearance/': {
    title: 'Feb 2026 BIS Exemption for Import Clearance | BookMyTM',
  },
  '/getting-ready-for-iso-90012025-why-indian-msmes-should-upgrade-now/': {
    title: 'ISO 9001:2025 Update: Why Indian MSMEs Must Prepare',
    description:
      'ISO 9001:2015 is nearly a decade old and a new revision is coming. Here is what Indian MSMEs should do now to prepare for the ISO 9001:2025 update.',
  },
  '/gs1-barcode-registration-india-guide/': {
    title: 'GS1 Barcode Registration in India: Full Guide | BookMyTM',
  },
  '/gst-eway-bill-rules-kerala-mistakes/': {
    description:
      'E-way bill thresholds, validity rules and Kerala-specific exemptions under GST, plus the common mistakes that get goods detained in transit.',
  },
  '/gst-registration-for-beginners-who-needs-it-why-and-how-to-get-it-in-2025/': {
    title: 'GST Registration for Beginners: 2025 Guide | BookMyTM',
    description:
      'A simple guide to GST registration in India: the turnover threshold, benefits of voluntary registration, documents required and the filing process.',
  },
  '/gst-rule-31d-mrp-based-tax-valuation-from-feb-2026/': {
    title: 'GST Rule 31D: MRP-Based Tax Valuation 2026 | BookMyTM',
    description:
      'From 1 February 2026, GST for specific sectors is calculated on retail sale price (MRP) under Rule 31D. Learn how to protect your margins and comply.',
  },
  '/guide-to-filing-a-strong-reply-to-a-trademark-objection/': {
    title: 'How to Reply to a Trademark Objection in India | BookMyTM',
    description:
      'A trademark objection is not a rejection. Follow our step-by-step guide to drafting and filing a strong reply to an examination report in India.',
  },
  '/guide-to-what-you-can-and-cant-trademark-in-india/': {
    title: "What You Can and Can't Trademark in India | BookMyTM",
  },
  '/halal-export-certification-kerala/': {
    description:
      "How halal certification works for Kerala's spice and seafood exporters, and how it fits alongside FSSAI, Spices Board and MPEDA registration.",
  },
  '/is-iso-9001-worth-it-for-your-small-business-a-cost-benefit-analysis-for-indian-smes/': {
    title: 'Is ISO 9001 Worth It for Indian Small Businesses? | BookMyTM',
    description:
      'Thinking about ISO 9001 for your small business in India? A clear cost-benefit analysis of the real costs against market access and credibility gains.',
  },
  '/iso-14001-kerala-exporters-guide/': {
    title: 'ISO 14001 for Kerala Exporters: Is It Worth It? | BookMyTM',
    description:
      "Why Kerala's spice, coir, rubber and seafood exporters are adopting ISO 14001 to meet EU and US buyer expectations and stay export-ready in 2026.",
  },
  '/january-2026-regulatory-round-up/': {
    title: 'January 2026 Regulatory Round-Up for India | BookMyTM',
    description:
      'January 2026 brought BIS, Ministry of Chemicals and Delhi High Court notifications affecting furniture, machinery and Khadi. Here is what changed.',
  },
  '/kerala-budget-2026-highlights-and-key-allocations-summary/': {
    description:
      'A complete summary of Kerala Budget 2026: the key allocations for agriculture, healthcare, education, infrastructure and social welfare, explained.',
  },
  '/msme-udyam-classification-2026-limits/': {
    title: 'MSME Udyam Classification Limits for 2026 | BookMyTM',
  },
  '/nidhi-company-registration-pros-cons/': {
    title: 'Nidhi Company Registration: Pros and Cons | BookMyTM',
    description:
      'What a Nidhi company is under Section 406 of the Companies Act, its real restrictions, the pros and cons, and how it compares with an NBFC licence.',
  },
  '/patent-filing-process-india-explained/': {
    title: 'Patent Filing Process in India Explained | BookMyTM',
  },
  '/professional-tax-kerala-explained/': {
    title: 'Professional Tax in Kerala: A Complete Guide | BookMyTM',
  },
  '/protecting-brand-digital-age/': {
    title: 'Protecting Your Brand in the Digital Age | BookMyTM',
    description:
      "From the metaverse to personality rights, learn how to future-proof your brand's intellectual property in India, including Classes 9, 35 and 42.",
  },
  '/section-8-company-vs-trust-vs-society/': {
    title: 'Section 8 Company vs Trust vs Society in India | BookMyTM',
  },
  '/startup-india-registration-vs-trademark-difference-benefits-2025/': {
    title: 'Startup India vs Trademark: Key Differences | BookMyTM',
    description:
      'Confused between Startup India (DPIIT) recognition and trademark registration? Learn the key differences and why founders in India need both in 2025.',
  },
  '/the-complete-list-of-45-trademark-classes/': {
    title: 'The Complete List of 45 Trademark Classes | BookMyTM',
    description:
      'A strategic guide to the 45 trademark classes under the NICE classification, and how to choose the right category for your business in India.',
  },
  '/the-non-isi-ban-on-furniture-is-active-are-you-compliant/': {
    description:
      'The grace period is over. Mandatory BIS certification (ISI mark) for furniture is enforced in 2026. Avoid stock seizure and get certified in time.',
  },
  '/the-ultimate-guide-to-trademark-registration-in-india-2025-from-search-to-certificate/': {
    title: 'Trademark Registration in India: Ultimate Guide | BookMyTM',
    description:
      'Our complete guide to trademark registration in India covers the full process, from trademark search and filing to handling objections and renewal.',
  },
  '/trademark-class-finder-india-complete-list-of-45-classes-2025-guide/': {
    title: 'Trademark Class Finder India: All 45 Classes | BookMyTM',
    description:
      'Confused by trademark classes? This guide explains the NICE classification system and helps you choose the right class or classes for your business.',
  },
  '/trademark-objection-reply-india-expert-process-fees-timeline-2025/': {
    title: 'Trademark Objection Reply India: Process and Fees | BookMyTM',
    description:
      'Trademark status showing objected? Learn how to respond to an examination report in India, the process, the fees and a realistic timeline to registry.',
  },
  '/trademark-registry-warns-against-unauthorized-portals/': {
    title: 'Trademark Registry Warns on Unauthorised Portals | BookMyTM',
    description:
      'The CGPDTM has warned businesses against filing trademarks through unauthorised platforms. Make sure your brand is protected through a verified route.',
  },
  '/trademark-renewal-deadlines-india/': {
    title: 'Trademark Renewal Deadlines in India Explained | BookMyTM',
  },
  '/trademark-vs-copyright-vs-patent-a-simple-guide-to-protecting-your-intellectual-property-in-india/': {
    title: 'Trademark vs Copyright vs Patent in India | BookMyTM',
    description:
      'Confused by intellectual property? A simple guide to the difference between a trademark, a copyright and a patent in India, and which one you need.',
  },
  '/unlocking-growth-10-hidden-benefits-of-udyam-registration-msme-you-might-be-missing/': {
    title: '10 Hidden Benefits of Udyam MSME Registration | BookMyTM',
    description:
      'Discover the real benefits of Udyam MSME registration in India, from collateral-free loans and subsidies to tender preference and lower interest rates.',
  },
  '/why-every-kerala-startup-needs-a-trademark-in-2026/': {
    description:
      'Why trademark registration matters for Kerala startups: KSUM innovation grants, MSME reimbursement schemes and the risk of losing your brand name.',
  },
};
