// Generate social media post .txt files for each of the 20 new blog posts.
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = join(import.meta.dirname, '..', 'social-posts');
mkdirSync(OUT_DIR, { recursive: true });

const PHONE1 = '+91 809 809 0880';
const PHONE2 = '+91 809 809 0440';
const EMAIL = 'cc@bookmytm.com';
const WEBSITE = 'www.bookmytm.com';
const ADDRESS = 'Kakkanad, Kochi, Kerala';

const COMMON_HASHTAGS = '#BookMyTM #Kerala #Kochi #India #BusinessCompliance #StartupIndia #MSME #LegalAwareness';

function footer(extraHashtags) {
  return `📞 Call/WhatsApp: ${PHONE1} | ${PHONE2}
📧 Email: ${EMAIL}
🌐 Website: ${WEBSITE}
📍 ${ADDRESS}

${COMMON_HASHTAGS} ${extraHashtags}`.trim();
}

const POSTS = [
  {
    slug: 'new-labour-codes-2026-employer-guide',
    hook: '⚖️ India\'s 4 New Labour Codes Are Now in Force — Is Your Business Ready?',
    body: `Wages, PF, working hours, appointment letters — the rules just changed for every employer in India.

If you haven't updated your HR policies and employment contracts to match the new Labour Codes, you could be exposed to compliance risk without even knowing it.

👉 Read our complete employer guide to what changed and what you need to do now.`,
    cta: 'Need help auditing your HR compliance? Talk to our experts today.',
    hashtags: '#LabourCodes2026 #HRCompliance #EmployeeRights #EmploymentLaw',
  },
  {
    slug: 'dpdp-act-compliance-small-business-guide',
    hook: '🔒 Does the DPDP Act Apply to YOUR Small Business? (Most owners get this wrong)',
    body: `India's data protection law isn't just for big tech. If you collect customer names, phone numbers, or emails — the DPDP Act applies to you too.

Our guide breaks down the phased rollout, what "consent" really means under the law, and the practical steps small businesses must take to stay compliant.

👉 Don't wait for a notice. Get compliant now.`,
    cta: 'Get a free DPDP compliance check for your business.',
    hashtags: '#DPDPAct #DataPrivacy #DataProtection #SmallBusinessIndia',
  },
  {
    slug: 'msme-udyam-classification-2026-limits',
    hook: '📊 MSME Classification Limits Have Changed — Are You Still in the Right Category?',
    body: `Your Udyam classification affects your loans, subsidies, and tax benefits. If the 2026 investment and turnover limits moved your business into a new category, your benefits could change too.

Know exactly where your business stands with the updated limits.

👉 Check the new thresholds before you file your next Udyam update.`,
    cta: 'Let us review your Udyam registration and classification for free.',
    hashtags: '#MSME #Udyam #MSMEIndia #SmallBusiness',
  },
  {
    slug: 'trademark-renewal-deadlines-india',
    hook: '⏰ Missed Your Trademark Renewal Deadline? Here\'s What Happens Next.',
    body: `A registered trademark isn't protected forever — miss your renewal window and you risk losing your brand name to someone else.

We break down the renewal timeline, the grace period, and exactly what to do if you've already missed your deadline.

👉 Don't lose the brand you built. Check your renewal status today.`,
    cta: 'Track your trademark status and never miss a deadline — talk to us.',
    hashtags: '#TrademarkRenewal #TrademarkIndia #BrandProtection #IPIndia',
  },
  {
    slug: 'design-registration-india-guide',
    hook: '🎨 Your Product\'s Look Can Be Stolen — Unless You Register the Design',
    body: `A trademark protects your brand name. It does NOT protect your product's shape, pattern, or visual design. That's a separate right — design registration.

Learn what qualifies, how the IP India process works, and why 15 years of protection is on the table.

👉 Full guide to design registration in India.`,
    cta: 'Protect your product design — talk to our IP team today.',
    hashtags: '#DesignRegistration #IndustrialDesign #IPProtection #ProductDesign',
  },
  {
    slug: 'patent-filing-process-india-explained',
    hook: '💡 Got an Invention? Here\'s Exactly How Patent Filing Works in India.',
    body: `Provisional vs complete specification. Publication. Examination. Opposition. The patent process has a lot of moving parts — and missed deadlines can cost you your rights permanently.

We break down the entire search-to-grant journey in plain language.

👉 Read the complete patent filing process guide.`,
    cta: 'Considering a patent? Get a free patentability consultation.',
    hashtags: '#PatentFiling #PatentIndia #Innovation #IPIndia',
  },
  {
    slug: 'section-8-company-vs-trust-vs-society',
    hook: '🤔 Starting a Non-Profit? Section 8 Company, Trust, or Society — Which One?',
    body: `Same charitable goal, three very different legal structures — and the wrong choice means the wrong compliance burden and the wrong donor confidence.

We compare governing law, registration process, and which structure fits which kind of non-profit.

👉 Full comparison guide inside.`,
    cta: 'Not sure which structure fits your mission? Let\'s talk it through.',
    hashtags: '#NonProfitIndia #Section8Company #TrustRegistration #NGOIndia',
  },
  {
    slug: 'nidhi-company-registration-pros-cons',
    hook: '🏦 What Is a Nidhi Company — And Is It Right for Your Community Finance Idea?',
    body: `A Nidhi company lets members save and lend among themselves — without needing an RBI licence. But it comes with real restrictions most people don\'t know about until it\'s too late.

We lay out the real pros, cons, and who should actually register one.

👉 Read the full Nidhi company guide.`,
    cta: 'Explore whether a Nidhi company fits your plans — talk to us.',
    hashtags: '#NidhiCompany #NBFC #CommunityFinance #CompanyRegistration',
  },
  {
    slug: 'trademark-assignment-vs-licensing',
    hook: '📝 Selling Your Brand vs Licensing It — Do You Know the Difference?',
    body: `Assignment transfers ownership permanently. Licensing lets someone use your mark while you keep control. Confusing the two can cost you your brand rights.

Learn which one you actually need — and how the legal process works for each.

👉 Trademark assignment vs licensing, explained.`,
    cta: 'Drafting an assignment deed or license agreement? We can help.',
    hashtags: '#TrademarkAssignment #TrademarkLicensing #BrandStrategy #IPLaw',
  },
  {
    slug: 'gs1-barcode-registration-india-guide',
    hook: '📦 Selling on Amazon or Flipkart? Your Barcode Might Get You Rejected.',
    body: `A random online barcode generator won\'t cut it. Major marketplaces verify against the official GS1 database — and unauthorized "890" barcodes have already led to court action in India.

Here\'s how GS1 India registration actually works.

👉 Full GTIN/barcode registration guide.`,
    cta: 'Get your GS1 barcode registration sorted — contact us today.',
    hashtags: '#GS1India #Barcode #Ecommerce #AmazonSellers #FlipkartSellers',
  },
  {
    slug: 'llp-vs-private-limited-company-2026',
    hook: '🏢 LLP or Private Limited? Here\'s the 2026 Answer for First-Time Founders.',
    body: `Planning to raise VC funding? You need a Pvt Ltd company. Running a services business with no funding plans? An LLP might save you serious compliance cost.

We compare liability, compliance, funding, and taxation side by side.

👉 Full 2026 comparison for founders.`,
    cta: 'Not sure which structure fits your startup? Get free guidance.',
    hashtags: '#LLP #PrivateLimitedCompany #StartupRegistration #FounderTips',
  },
  {
    slug: 'one-person-company-opc-rule-changes',
    hook: '🚀 Good News for OPC Founders: The Growth Ceiling Is Gone.',
    body: `OPCs no longer have to forcibly convert into a private company after crossing a turnover or capital threshold. And NRIs can now incorporate one too.

Here\'s what the 2021 rule relaxation actually means for you in 2026.

👉 Read the full OPC rule-change breakdown.`,
    cta: 'Thinking of incorporating an OPC? Let\'s get you started.',
    hashtags: '#OPC #OnePersonCompany #NRIBusiness #CompanyIncorporation',
  },
  {
    slug: 'company-name-rejected-run-spice-reasons',
    hook: '❌ Company Name Rejected on MCA? Here\'s Why (and How to Avoid It Next Time).',
    body: `Most RUN/SPICe+ rejections come down to a handful of predictable reasons — names that are "too similar," restricted words used without approval, or names with zero connection to your business.

We break down the actual MCA rules so you get it right the first time.

👉 Read the full guide to avoiding name rejection.`,
    cta: 'Let us handle your company name search & reservation — hassle-free.',
    hashtags: '#MCA #CompanyNameRegistration #SPICePlus #StartupIndia',
  },
  {
    slug: 'ai-generated-logo-copyright-trademark-ownership',
    hook: '🤖 Used AI to Design Your Logo? Here\'s Who Actually Owns It.',
    body: `Copyright law on AI-generated art in India is genuinely unsettled. But here\'s the good news — you can still trademark that logo as your brand identifier, starting today.

We explain the legal gap and the protection path that actually works right now.

👉 Full breakdown of AI logo ownership.`,
    cta: 'Protect your AI-designed logo with a trademark — talk to us.',
    hashtags: '#AIGeneratedLogo #TrademarkIndia #Copyright #BrandProtection',
  },
  {
    slug: 'well-known-trademark-status-india',
    hook: '⭐ What Makes a Trademark "Well-Known" Under Indian Law?',
    body: `Well-known status extends your brand\'s protection across ALL classes of goods and services — not just the ones you\'re registered in. And since 2017, you don\'t need a court case to get it.

Here\'s how the Registrar actually determines well-known status.

👉 Full guide to well-known trademarks in India.`,
    cta: 'Building a strong brand? Let\'s talk long-term trademark strategy.',
    hashtags: '#WellKnownTrademark #TrademarkIndia #BrandProtection #IPIndia',
  },
  {
    slug: 'kswift-kerala-single-window-clearance',
    hook: '🏭 Setting Up a Business in Kerala? One Portal, Multiple Clearances — K-SWIFT.',
    body: `Pollution control, fire safety, factories & boilers, electricity — instead of visiting every department separately, K-SWIFT lets you apply through one common online form.

Here\'s what it covers and how deemed approval protects you from delays.

👉 Full guide to Kerala\'s single window clearance system.`,
    cta: 'Setting up in Kerala? Let us handle your registrations & clearances.',
    hashtags: '#KSWIFT #KeralaBusiness #EaseOfDoingBusiness #KeralaStartup',
  },
  {
    slug: 'iso-14001-kerala-exporters-guide',
    hook: '🌍 Kerala Spice, Coir & Seafood Exporters — Is ISO 14001 Worth It?',
    body: `EU and US buyers are increasingly looking for environmental management credentials. For Kerala\'s rubber exporters, the EU Deforestation Regulation makes it even more relevant.

We break down what\'s actually required vs what\'s genuinely worth pursuing, sector by sector.

👉 Read the full ISO 14001 guide for Kerala exporters.`,
    cta: 'Exporting from Kerala? Get the right certification strategy in place.',
    hashtags: '#ISO14001 #KeralaExporters #SpiceExport #SeafoodExport #EUDR',
  },
  {
    slug: 'halal-export-certification-kerala',
    hook: '🕌 Exporting Spices or Seafood to the Middle East? Here\'s the Halal Certification Reality.',
    body: `India has no single government halal authority — it\'s all private certifying bodies. And halal never replaces your mandatory FSSAI, Spices Board, or MPEDA registrations.

Get the full picture before your next export shipment.

👉 Halal & export certification guide for Kerala exporters.`,
    cta: 'Confused about which export certifications you actually need? Ask us.',
    hashtags: '#HalalCertification #KeralaExporters #SpiceExport #SeafoodExport',
  },
  {
    slug: 'professional-tax-kerala-explained',
    hook: '💰 Professional Tax in Kerala Works Differently Than Most States. Here\'s How.',
    body: `No separate state PT department here — it\'s your local panchayat, municipality, or corporation that collects it. And it\'s paid half-yearly, not monthly.

Know your deadlines: 31 August and 28 February.

👉 Full guide to professional tax in Kerala.`,
    cta: 'Need help with local body tax registration & filing? We\'ve got you.',
    hashtags: '#ProfessionalTax #KeralaTax #TaxCompliance #KeralaBusiness',
  },
  {
    slug: 'gst-eway-bill-rules-kerala-mistakes',
    hook: '🚚 E-Way Bill Mistakes Are Getting Kerala Businesses\' Goods Detained.',
    body: `An expired validity window. An unupdated vehicle number. A mismatched invoice. These small errors are the #1 reason for e-way bill penalties — not ignorance of the threshold.

Plus: Kerala\'s special rule for gold & jewellery movement you need to know.

👉 Full guide to GST e-way bill rules & common mistakes.`,
    cta: 'Set up an e-way bill process that won\'t fail at a transport check.',
    hashtags: '#EWayBill #GSTIndia #KeralaBusiness #GSTCompliance',
  },
];

const TITLES = {
  'new-labour-codes-2026-employer-guide': 'New Labour Codes 2026: What Every Employer Needs to Know Before Rollout',
  'dpdp-act-compliance-small-business-guide': 'DPDP Act Compliance for Small Businesses',
  'msme-udyam-classification-2026-limits': 'MSME Udyam Classification 2026: New Limits',
  'trademark-renewal-deadlines-india': 'Trademark Renewal Deadlines in India',
  'design-registration-india-guide': "Design Registration in India: Protecting Your Product's Look",
  'patent-filing-process-india-explained': 'Patent Filing in India: The Complete Search-to-Grant Process',
  'section-8-company-vs-trust-vs-society': 'Section 8 Company vs Trust vs Society',
  'nidhi-company-registration-pros-cons': 'Nidhi Company Registration: Pros and Cons',
  'trademark-assignment-vs-licensing': 'Trademark Assignment vs Licensing',
  'gs1-barcode-registration-india-guide': 'Barcode Registration (GS1 India) Guide',
  'llp-vs-private-limited-company-2026': 'LLP vs Private Limited Company: 2026 Comparison',
  'one-person-company-opc-rule-changes': 'One Person Company (OPC): Recent Rule Relaxations',
  'company-name-rejected-run-spice-reasons': 'Company Name Rejected? Top RUN/SPICe+ Reasons',
  'ai-generated-logo-copyright-trademark-ownership': 'Who Owns an AI-Generated Logo?',
  'well-known-trademark-status-india': 'What Is a "Well-Known Trademark" in India?',
  'kswift-kerala-single-window-clearance': "K-SWIFT: Kerala's Single Window Clearance",
  'iso-14001-kerala-exporters-guide': 'ISO 14001 for Kerala Exporters',
  'halal-export-certification-kerala': "Halal & Export Certification for Kerala's Seafood and Spice Industry",
  'professional-tax-kerala-explained': 'Professional Tax in Kerala Explained',
  'gst-eway-bill-rules-kerala-mistakes': 'GST E-Way Bill Rules for Kerala Businesses',
};

let count = 0;
for (const post of POSTS) {
  const url = `https://bookmytm.com/${post.slug}/`;
  const content = `${post.hook}

${post.body}

🔗 Read the full article: ${url}

${post.cta}

${footer(post.hashtags)}
`;
  writeFileSync(join(OUT_DIR, `${post.slug}.txt`), content);
  count++;
}

console.log(`Created ${count} social media post files in social-posts/`);
