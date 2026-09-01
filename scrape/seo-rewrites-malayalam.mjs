// Phase 1 copy: Malayalam posts.
// The 50-60 char title target is calibrated for Latin script in a ~600px SERP;
// Malayalam glyphs render wider, so these are trimmed for meaning first and kept
// near the window rather than cut mid-phrase. Descriptions that were whole
// paragraphs (up to 464 chars) are replaced with real summaries of the article.
// Also clears the literal &quot; entity that came in from the WordPress scrape.
export const REWRITES = {
  '/brand-sabotage-trademark-mistakes-malayalam/': {
    title: 'സംരംഭകർ വരുത്തുന്ന 7 ട്രേഡ്മാർക്ക് തെറ്റുകൾ | BookMyTM',
    description:
      'നിങ്ങളുടെ ബ്രാൻഡിന്റെ ഏറ്റവും വലിയ ഭീഷണി എതിരാളികളല്ല. ഇന്ത്യൻ സംരംഭകർ ട്രേഡ്മാർക്ക് ഫയലിംഗിൽ വരുത്തുന്ന 7 സാധാരണ തെറ്റുകളും അവ ഒഴിവാക്കാനുള്ള വഴികളും.',
  },
  '/fssai-license-explained-the-complete-guide-for-restaurants-cloud-kitchens-and-home-bakers-in-india/': {
    title: 'FSSAI ലൈസൻസ്: റെസ്റ്റോറന്റുകൾക്കുള്ള പൂർണ്ണ വഴികാട്ടി',
    description:
      'കേരളത്തിലെ റെസ്റ്റോറന്റുകൾ, ക്ലൗഡ് കിച്ചനുകൾ, ഹോം ബേക്കർമാർ എന്നിവർക്കുള്ള FSSAI ലൈസൻസ് വിശദീകരണം: ലൈസൻസ് തരങ്ങൾ, ആവശ്യമായ രേഖകൾ, അപേക്ഷാ നടപടിക്രമം.',
  },
  '/kerala-budget-2026-highlights-malayalam/': {
    title: 'കേരള ബജറ്റ് 2026: പ്രധാന പ്രഖ്യാപനങ്ങളും വിഹിതങ്ങളും',
  },
  '/received-a-trademark-objection-dont-panic-heres-how-to-file-a-winning-reply/': {
    title: 'ട്രേഡ്മാർക്ക് ഒബ്ജക്ഷൻ ലഭിച്ചോ? മറുപടിക്കുള്ള വഴികാട്ടി',
    description:
      'ട്രേഡ്മാർക്ക് അപേക്ഷയുടെ സ്റ്റാറ്റസ് ഒബ്ജക്റ്റഡ് ആയോ? പരിഭ്രമിക്കേണ്ട. മികച്ച ഒരു മറുപടി തയ്യാറാക്കി ഫയൽ ചെയ്യാനുള്ള ഘട്ടം ഘട്ടമായുള്ള വഴികാട്ടി ഇതാ.',
  },
  '/starting-an-e-commerce-business-in-india-the-2025-legal-guide-to-gst-trademarks-and-policies/': {
    title: 'ഇ-കൊമേഴ്‌സ് ബിസിനസ്സ്: നിയമപരമായ വഴികാട്ടി | BookMyTM',
    description:
      'ഇന്ത്യയിൽ ഇ-കൊമേഴ്‌സ് ബിസിനസ്സ് ആരംഭിക്കാൻ വേണ്ട ജി.എസ്.ടി രജിസ്ട്രേഷൻ, ട്രേഡ്മാർക്ക്, വെബ്സൈറ്റ് പോളിസികൾ എന്നിവയെക്കുറിച്ചുള്ള പൂർണ്ണ വഴികാട്ടി.',
  },
  '/the-2025-legal-checklist-for-indian-startups-12-essential-registrations-compliances/': {
    title: 'സ്റ്റാർട്ടപ്പുകൾക്കുള്ള 12 അവശ്യ രജിസ്ട്രേഷനുകൾ | BookMyTM',
    description:
      'ഇന്ത്യയിൽ ഒരു സ്റ്റാർട്ടപ്പ് ആരംഭിക്കുമ്പോൾ വേണ്ട 12 അവശ്യ രജിസ്ട്രേഷനുകളും കംപ്ലയൻസുകളും: കമ്പനി രജിസ്ട്രേഷൻ മുതൽ ജി.എസ്.ടി, ട്രേഡ്മാർക്ക് വരെ.',
  },
  '/the-complete-list-of-45-trademark-classes-in-malayalam/': {
    title: '45 ട്രേഡ്മാർക്ക് ക്ലാസുകളുടെ പൂർണ്ണ പട്ടിക | BookMyTM',
    description:
      'നിങ്ങളുടെ ബിസിനസ്സിന് അനുയോജ്യമായ ട്രേഡ്മാർക്ക് ക്ലാസ് ഏതെന്ന് കണ്ടെത്താൻ 45 ക്ലാസുകളുടെ പൂർണ്ണ പട്ടികയും പ്രായോഗിക വഴികാട്ടിയും ഇവിടെ വായിക്കുക.',
  },
  '/trademark-objection-appeal-malayalam/': {
    title: 'ട്രേഡ്മാർക്ക് ഒബ്ജക്ഷൻ മറുപടി: സമ്പൂർണ്ണ വഴികാട്ടി',
    description:
      'ട്രേഡ്മാർക്ക് ഒബ്ജക്ഷൻ ലഭിക്കുന്നത് അപേക്ഷ നിരസിക്കുന്നതിന് തുല്യമല്ല. ഇന്ത്യയിൽ മറുപടി തയ്യാറാക്കി ഫയൽ ചെയ്യുന്നതിനുള്ള പൂർണ്ണ വഴികാട്ടി ഇതാ.',
  },
};
