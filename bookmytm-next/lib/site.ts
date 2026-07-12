export const SITE = {
  name: 'BookMyTM',
  tagline: 'Click. Start Business!',
  url: 'https://bookmytm.com',
  phone1: '+91 809 809 0880',
  phone2: '+91 809 809 0440',
  phone1Href: 'tel:+918098090880',
  phone2Href: 'tel:+918098090440',
  email: 'cc@bookmytm.com',
  whatsapp: 'https://wa.me/918098090880',
  address: 'Plot No 207, Behind Onam Park, Mavelipuram, Kakkanad, Kochi, Kerala 682030',
  facebook: 'https://www.facebook.com/bookmytm',
  instagram: 'https://www.instagram.com/bookmytm',
};

export type NavLink = { label: string; href: string };
export type NavColumn = { title: string; href: string; links: NavLink[] };
export type NavPromo = { image: string; title: string; text: string };
export type NavCategory = { label: string; href: string; promo: NavPromo; columns: NavColumn[] };

export const NAV: NavCategory[] = [
  {
    label: 'Startup',
    href: '/startup/',
    promo: {
      image: '/images/photo-1497366216548-37526070297c.jpg',
      title: 'Start your business right',
      text: 'Company, LLP & firm registration with expert guidance from day one.',
    },
    columns: [
      {
        title: 'Registrations',
        href: '/startup/registrations/',
        links: [
          { label: 'Proprietorship Registration', href: '/startup/registrations/proprietorship-firm-registration/' },
          { label: 'Partnership Firm Registration', href: '/startup/registrations/partnership-firm-registration/' },
          { label: 'LLP Registration', href: '/startup/registrations/limited-liability-partnership-llp-registration/' },
          { label: 'Private Limited Company', href: '/startup/registrations/private-limited-company-registration/' },
          { label: 'Public Limited Company', href: '/startup/registrations/public-limited-company-registration/' },
          { label: 'One Person Company (OPC)', href: '/startup/registrations/one-person-company-opc-registration/' },
        ],
      },
      {
        title: 'Special Business Entities',
        href: '/startup/special-business-entities/',
        links: [
          { label: 'Section 8 Company', href: '/startup/special-business-entities/section-8-company-registration/' },
          { label: 'Nidhi Company', href: '/startup/special-business-entities/nidhi-company-registration/' },
        ],
      },
      {
        title: 'Other Registrations & Licenses',
        href: '/startup/other-registrations/',
        links: [
          { label: 'Digital Signature (DSC)', href: '/startup/other-registrations/digital-signature-certificate/' },
          { label: 'Udyam Registration', href: '/startup/other-registrations/udyam-registration/' },
          { label: 'Import Export License (IEC)', href: '/startup/other-registrations/import-export-license-import-export-code-iec-registration/' },
          { label: 'Barcode Registration', href: '/startup/other-registrations/barcode-registration/' },
          { label: 'FSSAI Registration', href: '/startup/other-registrations/fssai-registration/' },
          { label: 'Professional Tax', href: '/startup/other-registrations/professional-tax-registration/' },
        ],
      },
    ],
  },
  {
    label: 'ISO Certification',
    href: '/iso-certification/',
    promo: {
      image: '/images/blog_05_iso_quality_seal_1765545624585.webp',
      title: 'The gold standard for growth',
      text: 'Globally recognized certifications that build trust and win tenders.',
    },
    columns: [
      {
        title: 'ISO Certifications',
        href: '/iso-certification/',
        links: [
          { label: 'ISO 9001:2015', href: '/iso-certification/iso-9001-2015/' },
          { label: 'ISO 14001:2015', href: '/iso-certification/iso-14001-2015/' },
          { label: 'ISO 22000:2018', href: '/iso-certification/iso-22000-2018/' },
          { label: 'ISO 27001:2013', href: '/iso-certification/iso-27001-2013/' },
          { label: 'ISO 45001:2018', href: '/iso-certification/iso-45001-2018/' },
        ],
      },
    ],
  },
  {
    label: 'Intellectual Property',
    href: '/intellectual-property/',
    promo: {
      image: '/images/blog_06_trademark_objection.webp',
      title: 'Protect what you build',
      text: 'Trademarks, patents, copyright & design — full-spectrum IP protection.',
    },
    columns: [
      {
        title: 'Trademark',
        href: '/intellectual-property/trademark/',
        links: [
          { label: 'Trademark Registration', href: '/intellectual-property/trademark/trademark-registration-in-kerala/' },
          { label: 'Trademark Renewal', href: '/intellectual-property/trademark/trademark-renewal/' },
          { label: 'Rectification Filing', href: '/intellectual-property/trademark/trademark-rectification-filing/' },
          { label: 'Trademark Opposition', href: '/intellectual-property/trademark/trademark-opposition/' },
          { label: 'Trademark Assignment', href: '/intellectual-property/trademark/trademark-assignment/' },
          { label: 'Objection Reply', href: '/intellectual-property/trademark/trademark-objection-reply/' },
          { label: 'Trademark Licensing', href: '/intellectual-property/trademark/trademark-licensing/' },
          { label: 'Show Cause Hearing', href: '/intellectual-property/trademark/trademark-objection-show-cause-hearing/' },
          { label: 'Watch Service', href: '/intellectual-property/trademark/trademark-watch-service/' },
        ],
      },
      {
        title: 'Patent',
        href: '/intellectual-property/patent/',
        links: [
          { label: 'Patent Search', href: '/intellectual-property/patent/patent-search/' },
          { label: 'Permanent Patent Registration', href: '/intellectual-property/patent/permanent-patent-registration/' },
          { label: 'Provisional Patent', href: '/intellectual-property/patent/provisional-patent/' },
          { label: 'Patent Reimbursement Scheme', href: '/patent-reimbursement-schemes-in-india-2026/' },
        ],
      },
      {
        title: 'Other IP',
        href: '/intellectual-property/other-ip-registrations/',
        links: [
          { label: 'Design Registration', href: '/intellectual-property/other-ip-registrations/design-registration/' },
          { label: 'Copyright Registration', href: '/intellectual-property/other-ip-registrations/copyright-registration/' },
        ],
      },
    ],
  },
  {
    label: 'Statutory Compliance',
    href: '/statutory-compliance/',
    promo: {
      image: '/images/photo-1450101499163-c8848c66ca85.jpg',
      title: 'Stay compliant, stress-free',
      text: 'GST, PAN, PF, ESI and ROC filings handled accurately and on time.',
    },
    columns: [
      {
        title: 'Basic Compliances',
        href: '/statutory-compliance/basic-compliances/',
        links: [
          { label: 'GST Registration', href: '/statutory-compliance/basic-compliances/gst-registration/' },
          { label: 'GST Return Filing', href: '/statutory-compliance/basic-compliances/gst-return-filing/' },
          { label: 'PAN Application', href: '/statutory-compliance/basic-compliances/pan-application/' },
          { label: 'TAN Application', href: '/statutory-compliance/basic-compliances/tan-tax-account-number-application/' },
          { label: 'PF Registration', href: '/statutory-compliance/basic-compliances/provident-fund-pf-registration/' },
          { label: 'ESI Registration', href: '/statutory-compliance/basic-compliances/esi-registration/' },
          { label: 'Accounting & Bookkeeping', href: '/statutory-compliance/basic-compliances/accounting-bookkeeping/' },
        ],
      },
      {
        title: 'ROC Filing',
        href: '/statutory-compliance/roc-filing/',
        links: [
          { label: 'LLP Annual Compliance', href: '/statutory-compliance/roc-filing/annual-compliance-for-limited-liability-partnership-llp/' },
          { label: 'Pvt Ltd Annual Compliance', href: '/statutory-compliance/roc-filing/annual-compliance-for-private-limited-company/' },
          { label: 'DIR-3 KYC Filing', href: '/statutory-compliance/roc-filing/dir-3-kyc-filing/' },
          { label: 'INC-20A Filing', href: '/statutory-compliance/roc-filing/inc-20a-filing/' },
        ],
      },
    ],
  },
  {
    label: 'Other Services',
    href: '/other-services/',
    promo: {
      image: '/images/photo-1552664730-d307ca884978.jpg',
      title: 'Evolve your business',
      text: 'Convert entity type, update records, or wind up — we handle the paperwork.',
    },
    columns: [
      {
        title: 'Change Entity Type',
        href: '/other-services/change-entity-type/',
        links: [
          { label: 'Proprietorship to Pvt Ltd', href: '/other-services/change-entity-type/convert-proprietorship-to-private-limited-company/' },
          { label: 'Proprietorship to Partnership', href: '/other-services/change-entity-type/convert-proprietorship-to-partnership/' },
          { label: 'Partnership to Pvt Ltd', href: '/other-services/change-entity-type/convert-partnership-to-private-limited-company/' },
          { label: 'OPC to Pvt Ltd', href: '/other-services/change-entity-type/convert-opc-to-private-limited/' },
          { label: 'Partnership to LLP', href: '/other-services/change-entity-type/convert-partnership-to-llp/' },
          { label: 'Proprietorship to OPC', href: '/other-services/change-entity-type/convert-proprietorship-to-opc/' },
          { label: 'Proprietorship to LLP', href: '/other-services/change-entity-type/convert-proprietorship-to-llp/' },
        ],
      },
      {
        title: 'Change Master Data',
        href: '/other-services/change-in-master-data/',
        links: [
          { label: 'Add/Remove Partner (LLP)', href: '/other-services/change-in-master-data/add-or-remove-designated-partner-llp/' },
          { label: 'Add/Remove Director', href: '/other-services/change-in-master-data/add-or-remove-director-company/' },
          { label: 'Change Business Activity', href: '/other-services/change-in-master-data/change-business-activity/' },
          { label: 'Change Company Name', href: '/other-services/change-in-master-data/change-company-name/' },
          { label: 'Change Registered Office', href: '/other-services/change-in-master-data/change-registered-office-of-company/' },
          { label: 'Modify Share Capital', href: '/other-services/change-in-master-data/modify-authorized-share-capital/' },
        ],
      },
      {
        title: 'Winding Up',
        href: '/other-services/winding-up-an-entity/',
        links: [
          { label: 'Close LLP', href: '/other-services/winding-up-an-entity/close-a-limited-liability-partnership/' },
          { label: 'Close OPC', href: '/other-services/winding-up-an-entity/close-a-one-person-company/' },
          { label: 'Close Pvt Ltd Company', href: '/other-services/winding-up-an-entity/close-a-private-limited-company/' },
          { label: 'Dissolve Partnership', href: '/other-services/winding-up-an-entity/dissolve-a-partnership-firm/' },
        ],
      },
    ],
  },
];

/** For hub pages: find nav category/column whose href prefix matches a path. */
export function childrenFor(path: string): NavLink[] {
  for (const cat of NAV) {
    if (cat.href === path) {
      return cat.columns.flatMap((c) => c.links);
    }
    for (const col of cat.columns) {
      const matches = col.links.filter((l) => l.href.startsWith(path) && l.href !== path);
      if (matches.length && path !== '/' && path.split('/').filter(Boolean).length >= 2) {
        return matches;
      }
    }
  }
  // fallback: any nav link under this path
  const all = NAV.flatMap((c) => c.columns.flatMap((col) => col.links));
  return all.filter((l) => l.href.startsWith(path) && l.href !== path);
}
