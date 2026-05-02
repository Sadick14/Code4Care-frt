export interface DKTProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  uses: string[];
  whereToGet: string[];
  priceRange: string;
  availability: string;
  image?: string;
}

export interface DKTSupportLine {
  region: string;
  location?: string;
  phone: string;
  email?: string;
}

export const dktSupportLines: DKTSupportLine[] = [
  {
    region: "Head Office",
    location: "Dzorwulu, Accra",
    phone: "0302772799",
    email: "info@dktghana.org"
  },
  {
    region: "Volta Region",
    phone: "0501516799"
  },
  {
    region: "Upper West Region",
    phone: "0501516867"
  },
  {
    region: "Western North Region",
    phone: "0501516913"
  },
  {
    region: "Bono Region",
    phone: "0501516883"
  },
  {
    region: "Northern Sector",
    phone: "0501336328"
  },
  {
    region: "Bono East Region",
    phone: "0505156874"
  },
  {
    region: "Eastern Region",
    phone: "0501336311"
  },
  {
    region: "Accra West / Central",
    phone: "0501336326"
  },
  {
    region: "Western Region",
    phone: "0501336327"
  },
  {
    region: "Ashanti Region",
    phone: "0501336329"
  },
  {
    region: "Northern / Upper West / Upper East",
    phone: "0501336308"
  },
  {
    region: "Accra West",
    phone: "0501336304"
  },
  {
    region: "Eastern / Volta",
    phone: "0501336306"
  },
  {
    region: "Accra East",
    phone: "0501336327"
  },
  {
    region: "Central / Western",
    phone: "0501336310"
  }
];

export const dktProducts: DKTProduct[] = [
  // Condoms
  {
    id: "dkt-prudence-male",
    name: "Prudence Male Condoms",
    category: "condoms",
    description: "Quality latex condoms for pregnancy prevention and STI protection.",
    uses: ["Pregnancy prevention", "STI protection", "Safe sex"],
    whereToGet: [
      "Pharmacies nationwide",
      "Health centers",
      "DKT partner clinics",
      "Online retailers",
      "Supermarkets"
    ],
    priceRange: "GH₵ 2-5 per box (3 pack)",
    availability: "Widely available year-round"
  },
  {
    id: "dkt-trustex-lubricated",
    name: "Trustex Lubricated Condoms",
    category: "condoms",
    description: "Pre-lubricated latex condoms for enhanced comfort and reduced friction.",
    uses: ["Pregnancy prevention", "STI protection", "Enhanced comfort"],
    whereToGet: [
      "Major pharmacies",
      "Health facilities",
      "DKT offices",
      "Online platforms",
      "Retail shops"
    ],
    priceRange: "GH₵ 3-6 per box (3 pack)",
    availability: "Readily available"
  },
  {
    id: "dkt-extended-condoms",
    name: "Extended Comfort Condoms",
    category: "condoms",
    description: "Extra-strength condoms for extended protection and sensitivity.",
    uses: ["Extended protection", "Pregnancy prevention", "STI protection"],
    whereToGet: [
      "Pharmacies",
      "Health centers",
      "DKT distribution points",
      "Online retailers"
    ],
    priceRange: "GH₵ 4-7 per box (3 pack)",
    availability: "Available in major cities"
  },
  {
    id: "dkt-female-condoms",
    name: "FC2 Female Condoms",
    category: "condoms",
    description: "Female-controlled contraceptive for protection and empowerment.",
    uses: ["Pregnancy prevention", "STI protection", "Woman-controlled contraception"],
    whereToGet: [
      "Specialized pharmacies",
      "Family planning clinics",
      "DKT partner facilities",
      "Women's health centers"
    ],
    priceRange: "GH₵ 15-25 per unit",
    availability: "Available in select locations"
  },

  // Emergency Contraception
  {
    id: "dkt-postinor",
    name: "Postinor-2 (Emergency Contraception)",
    category: "emergencyContraception",
    description: "Levonorgestrel-based emergency contraception, effective within 72 hours.",
    uses: ["Unprotected intercourse", "Contraceptive failure", "Sexual assault"],
    whereToGet: [
      "Pharmacies nationwide",
      "Health centers",
      "Emergency rooms",
      "DKT clinics",
      "Online pharmacies"
    ],
    priceRange: "GH₵ 12-20",
    availability: "Available 24/7 at major pharmacies"
  },
  {
    id: "dkt-ella",
    name: "ella (Ulipristal Acetate EC)",
    category: "emergencyContraception",
    description: "Second-generation EC effective up to 120 hours (5 days) after intercourse.",
    uses: ["Late unprotected intercourse", "Extended protection window"],
    whereToGet: [
      "Premium pharmacies",
      "Private clinics",
      "Teaching hospitals",
      "Online medical platforms"
    ],
    priceRange: "GH₵ 80-120",
    availability: "Limited availability in major cities"
  },

  // Regular Contraceptives
  {
    id: "dkt-pills-combined",
    name: "Combined Oral Contraceptive Pills",
    category: "contraceptives",
    description: "Daily hormonal pills containing estrogen and progestin.",
    uses: ["Pregnancy prevention", "Hormonal regulation", "Cycle control"],
    whereToGet: [
      "Pharmacies countrywide",
      "Family planning clinics",
      "Health centers",
      "DKT outlets",
      "Private hospitals"
    ],
    priceRange: "GH₵ 8-18 per month",
    availability: "Continuously available"
  },
  {
    id: "dkt-pills-progestin",
    name: "Progestin-Only Pills (POP)",
    category: "contraceptives",
    description: "Mini-pill containing only progestin, safer for breastfeeding mothers.",
    uses: ["Pregnancy prevention", "Breastfeeding-safe", "Hormonal regulation"],
    whereToGet: [
      "Health facilities",
      "Family planning centers",
      "Pharmacies",
      "Maternity clinics",
      "DKT distribution points"
    ],
    priceRange: "GH₵ 6-12 per month",
    availability: "Available in health centers and pharmacies"
  },
  {
    id: "dkt-injectables",
    name: "Injectable Contraceptives (Depo-Provera)",
    category: "contraceptives",
    description: "Long-acting hormonal injection, 3 months of protection per dose.",
    uses: ["Long-term pregnancy prevention", "Minimal maintenance"],
    whereToGet: [
      "Health centers",
      "Family planning clinics",
      "Hospitals",
      "Private clinics",
      "DKT service points"
    ],
    priceRange: "GH₵ 15-30 per injection",
    availability: "Available at health facilities"
  },

  // Lubricants
  {
    id: "dkt-lubricant-water",
    name: "Water-Based Lubricant",
    category: "lubricants",
    description: "Condom-compatible lubricant for comfort and reduced friction.",
    uses: ["Enhanced comfort", "Condom compatibility", "Reduced irritation"],
    whereToGet: [
      "Pharmacies",
      "Health stores",
      "Online retailers",
      "DKT outlets"
    ],
    priceRange: "GH₵ 8-15",
    availability: "Readily available"
  },
  {
    id: "dkt-lubricant-silicone",
    name: "Silicone-Based Lubricant",
    category: "lubricants",
    description: "Long-lasting lubricant, water-resistant and longer-acting.",
    uses: ["Extended lubrication", "Water-resistant", "Long-lasting comfort"],
    whereToGet: [
      "Premium pharmacies",
      "Health centers",
      "Specialty shops",
      "Online platforms"
    ],
    priceRange: "GH₵ 12-20",
    availability: "Available in select locations"
  },

  // Test Kits
  {
    id: "dkt-hiv-test",
    name: "HIV Test Kit (Rapid)",
    category: "testKits",
    description: "Quick HIV screening test with results in 15-20 minutes.",
    uses: ["HIV screening", "Regular testing", "Post-exposure testing"],
    whereToGet: [
      "Health centers",
      "Testing clinics",
      "Hospitals",
      "Pharmacies",
      "Community health points"
    ],
    priceRange: "GH₵ 5-10",
    availability: "Available nationwide"
  },
  {
    id: "dkt-pregnancy-test",
    name: "Pregnancy Test Kit (Home Use)",
    category: "testKits",
    description: "Early detection pregnancy test, accurate 99% when used correctly.",
    uses: ["Pregnancy confirmation", "Early detection", "Home testing"],
    whereToGet: [
      "Pharmacies nationwide",
      "Supermarkets",
      "Health shops",
      "Online retailers",
      "Hospital gift shops"
    ],
    priceRange: "GH₵ 3-6",
    availability: "Widely available"
  },
  {
    id: "dkt-sti-test-kit",
    name: "Basic STI Screening Kit",
    category: "testKits",
    description: "Home collection kit for STI testing through laboratory analysis.",
    uses: ["STI screening", "Chlamydia detection", "Gonorrhea screening"],
    whereToGet: [
      "Health facilities",
      "STI clinics",
      "Private laboratories",
      "Sexual health centers"
    ],
    priceRange: "GH₵ 25-50",
    availability: "Available at diagnostic centers"
  },

  // Supplements & Support
  {
    id: "dkt-folic-acid",
    name: "Folic Acid Supplements",
    category: "supplements",
    description: "Vitamin B9 supplement for women planning pregnancy or menstruating.",
    uses: ["Pregnancy support", "Menstrual health", "Red blood cell formation"],
    whereToGet: [
      "All pharmacies",
      "Health stores",
      "Supermarkets",
      "Online retailers",
      "Maternity clinics"
    ],
    priceRange: "GH₵ 4-8",
    availability: "Always available"
  },
  {
    id: "dkt-multivitamin",
    name: "Women's Multivitamin",
    category: "supplements",
    description: "Complete micronutrient support designed for women's health.",
    uses: ["General wellness", "Immune support", "Energy boost"],
    whereToGet: [
      "Pharmacies",
      "Health food stores",
      "Supermarkets",
      "Wellness centers",
      "Online platforms"
    ],
    priceRange: "GH₵ 15-30",
    availability: "Widely available"
  },
  {
    id: "dkt-iron-supplement",
    name: "Iron Supplements",
    category: "supplements",
    description: "Iron supplement for anemia prevention and menstrual health.",
    uses: ["Anemia prevention", "Menstrual support", "Energy maintenance"],
    whereToGet: [
      "All pharmacies",
      "Health centers",
      "Supermarkets",
      "Online retailers"
    ],
    priceRange: "GH₵ 5-12",
    availability: "Readily available"
  },

  // Intimate Care
  {
    id: "dkt-intimate-wash",
    name: "Intimate Hygiene Wash",
    category: "intimateCare",
    description: "pH-balanced intimate cleanser for comfortable daily use.",
    uses: ["Feminine hygiene", "pH balance", "Protection against infections"],
    whereToGet: [
      "Pharmacies",
      "Supermarkets",
      "Health and beauty stores",
      "Online retailers"
    ],
    priceRange: "GH₵ 10-20",
    availability: "Widely available"
  },
  {
    id: "dkt-menstrual-pads",
    name: "Premium Menstrual Pads",
    category: "intimateCare",
    description: "High-absorbency pads with comfort and leak protection.",
    uses: ["Menstrual protection", "Comfort", "Extended wear"],
    whereToGet: [
      "All supermarkets",
      "Pharmacies",
      "Health shops",
      "Online retailers"
    ],
    priceRange: "GH₵ 8-15 per pack",
    availability: "Continuously available"
  },
  {
    id: "dkt-tampons",
    name: "Tampons (Various Absorbencies)",
    category: "intimateCare",
    description: "Applicator or non-applicator tampons for convenience.",
    uses: ["Menstrual protection", "Active lifestyle", "Discretion"],
    whereToGet: [
      "Pharmacies",
      "Supermarkets",
      "Women's health shops",
      "Online platforms"
    ],
    priceRange: "GH₵ 12-20 per pack",
    availability: "Available in urban areas"
  },

  // Pain Relief
  {
    id: "dkt-ibuprofen",
    name: "Ibuprofen (Menstrual Pain Relief)",
    category: "painRelief",
    description: "Anti-inflammatory pain reliever for menstrual cramps.",
    uses: ["Menstrual pain", "Cramp relief", "Inflammation reduction"],
    whereToGet: [
      "All pharmacies",
      "Supermarkets",
      "Health stores",
      "Online retailers"
    ],
    priceRange: "GH₵ 0.50-2 per tablet",
    availability: "Readily available"
  },
  {
    id: "dkt-paracetamol",
    name: "Paracetamol (Pain & Fever Relief)",
    category: "painRelief",
    description: "General pain reliever and fever reducer.",
    uses: ["Pain relief", "Fever management", "General discomfort"],
    whereToGet: [
      "All pharmacies",
      "Supermarkets",
      "Retail shops",
      "Online platforms"
    ],
    priceRange: "GH₵ 0.30-1.50 per tablet",
    availability: "Always available"
  },

  // Ghana MD Booklet-mapped DKT products
  {
    id: "dkt-postpil",
    name: "Postpil",
    category: "emergencyContraception",
    description: "Emergency contraceptive pill listed in DKT Ghana booklet line-up.",
    uses: ["Emergency pregnancy prevention", "Post-unprotected intercourse"],
    whereToGet: ["DKT partner pharmacies", "Family planning clinics", "DKT support referral"],
    priceRange: "GH₵ 10-20",
    availability: "Available in major urban pharmacies"
  },
  {
    id: "dkt-sayana-press",
    name: "Sayana Press",
    category: "contraceptives",
    description: "Injectable contraceptive option listed in DKT Ghana booklet.",
    uses: ["Long-acting contraception", "Quarterly pregnancy prevention"],
    whereToGet: ["Family planning clinics", "DKT partner facilities", "Referral clinics"],
    priceRange: "GH₵ 20-40 per dose",
    availability: "Available through trained providers"
  },
  {
    id: "dkt-norigynon",
    name: "Norigynon",
    category: "contraceptives",
    description: "Injectable hormonal contraceptive listed in DKT Ghana booklet.",
    uses: ["Pregnancy prevention", "Routine injectable contraception"],
    whereToGet: ["Clinics", "Hospitals", "DKT partner providers"],
    priceRange: "GH₵ 15-35 per dose",
    availability: "Provider-dependent availability"
  },
  {
    id: "dkt-daphne",
    name: "Daphne",
    category: "contraceptives",
    description: "Oral contraceptive brand listed in DKT Ghana booklet.",
    uses: ["Daily pregnancy prevention", "Cycle control"],
    whereToGet: ["Pharmacies", "Family planning outlets", "DKT support referral"],
    priceRange: "GH₵ 8-20 per cycle",
    availability: "Widely available"
  },
  {
    id: "dkt-ocp",
    name: "OCP",
    category: "contraceptives",
    description: "Oral contraceptive pills listed in DKT Ghana booklet portfolio.",
    uses: ["Pregnancy prevention", "Hormonal regulation"],
    whereToGet: ["Pharmacies", "Clinics", "DKT partner outlets"],
    priceRange: "GH₵ 8-18 per month",
    availability: "Available nationwide"
  },
  {
    id: "dkt-implanon",
    name: "Implanon",
    category: "contraceptives",
    description: "Single-rod implant contraceptive listed in DKT Ghana booklet.",
    uses: ["Long-term contraception", "Reversible implant method"],
    whereToGet: ["Implant-trained clinics", "Hospitals", "DKT referral points"],
    priceRange: "GH₵ 120-300",
    availability: "Available at trained service points"
  },
  {
    id: "dkt-levoplant",
    name: "Levoplant",
    category: "contraceptives",
    description: "Two-rod contraceptive implant listed in DKT Ghana booklet.",
    uses: ["Long-term contraception", "Reversible implant method"],
    whereToGet: ["Implant-trained providers", "DKT partner clinics"],
    priceRange: "GH₵ 120-300",
    availability: "Available in partner clinics"
  },
  {
    id: "dkt-kiss-classic",
    name: "Kiss Classic Condoms",
    category: "condoms",
    description: "Classic Kiss condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 2-6 per pack",
    availability: "Widely available"
  },
  {
    id: "dkt-prudence-all-night",
    name: "Prudence All Night",
    category: "condoms",
    description: "All Night condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Extended comfort"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in major cities"
  },
  {
    id: "dkt-prudence-classic",
    name: "Prudence Classic",
    category: "condoms",
    description: "Classic condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 2-6 per pack",
    availability: "Widely available"
  },
  {
    id: "dkt-prudence-dotted",
    name: "Prudence Dotted",
    category: "condoms",
    description: "Dotted condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Textured experience"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in urban outlets"
  },
  {
    id: "dkt-prudence-extra-thin",
    name: "Prudence Extra Thin",
    category: "condoms",
    description: "Extra Thin condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Increased sensitivity"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in select and major outlets"
  },
  {
    id: "dkt-prudence-fruity",
    name: "Prudence Fruity",
    category: "condoms",
    description: "Flavored condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Flavor-enhanced use"],
    whereToGet: ["Pharmacies", "Supermarkets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in urban and peri-urban outlets"
  },
  {
    id: "dkt-prudence-strawberry",
    name: "Prudence Strawberry",
    category: "condoms",
    description: "Strawberry condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Flavor-enhanced use"],
    whereToGet: ["Pharmacies", "Supermarkets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in urban and peri-urban outlets"
  },
  {
    id: "dkt-prudence-sleek",
    name: "Prudence Sleek",
    category: "condoms",
    description: "Sleek condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Comfort-enhanced use"],
    whereToGet: ["Pharmacies", "Retail outlets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in major urban outlets"
  },
  {
    id: "dkt-kiss-strawberry",
    name: "Kiss Strawberry Condoms",
    category: "condoms",
    description: "Flavored Kiss condom variant listed in DKT Ghana booklet.",
    uses: ["STI prevention", "Pregnancy prevention", "Flavor-enhanced use"],
    whereToGet: ["Pharmacies", "Supermarkets", "DKT partner outlets"],
    priceRange: "GH₵ 3-7 per pack",
    availability: "Available in urban and peri-urban outlets"
  },
  {
    id: "dkt-kiss-gel",
    name: "Kiss Gel",
    category: "lubricants",
    description: "Lubricant line listed in DKT Ghana booklet.",
    uses: ["Comfort enhancement", "Reduced friction", "Condom-compatible use"],
    whereToGet: ["Pharmacies", "Health shops", "DKT partner outlets"],
    priceRange: "GH₵ 8-20",
    availability: "Available in selected pharmacies"
  },
  {
    id: "dkt-lydia-safeload",
    name: "Lydia Safeload",
    category: "condoms",
    description: "Female condom line listed in DKT Ghana booklet.",
    uses: ["Female-controlled contraception", "STI prevention", "Pregnancy prevention"],
    whereToGet: ["Family planning clinics", "Selected pharmacies", "DKT support referral"],
    priceRange: "GH₵ 15-30 per unit",
    availability: "Available in select service points"
  },
  {
    id: "dkt-mafem",
    name: "MaFem",
    category: "intimateCare",
    description: "Women-focused product line listed in DKT Ghana booklet.",
    uses: ["Women's health support", "Personal care"],
    whereToGet: ["Pharmacies", "Women's health outlets", "DKT partner outlets"],
    priceRange: "GH₵ 10-35",
    availability: "Availability varies by outlet"
  },
  {
    id: "dkt-mva-kit",
    name: "MVA Kit",
    category: "clinicalKits",
    description: "Manual vacuum aspiration kit listed in DKT Ghana booklet for clinical use.",
    uses: ["Clinical uterine evacuation procedures", "Facility-based reproductive care"],
    whereToGet: ["Hospitals", "Licensed clinics", "Provider procurement channels"],
    priceRange: "Facility procurement pricing",
    availability: "For trained providers and facilities"
  },
  {
    id: "dkt-mm-combit-kit",
    name: "MM Combit Kit",
    category: "clinicalKits",
    description: "Clinical reproductive health kit listed in DKT Ghana booklet.",
    uses: ["Facility reproductive care", "Provider-managed protocols"],
    whereToGet: ["Licensed health facilities", "Clinical procurement channels"],
    priceRange: "Facility procurement pricing",
    availability: "For trained providers and facilities"
  }
];

export function getDKTProducts(category?: string): DKTProduct[] {
  if (!category) return dktProducts;
  return dktProducts.filter(product => product.category === category);
}

export function getDKTCategories(): string[] {
  return Array.from(new Set(dktProducts.map(p => p.category)));
}
