import { useState, useMemo } from "react";
import {
  ChevronDown,
  Droplets,
  HeartPulse,
  MapPin,
  PhoneCall,
  Pill,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { dktProducts, dktSupportLines, getDKTCategories } from "@/data/dktProducts";

const CATEGORY_META: Record<string, { label: string; icon: LucideIcon }> = {
  condoms: { label: "Condoms", icon: ShieldCheck },
  emergencyContraception: { label: "Emergency Contraception", icon: Pill },
  contraceptives: { label: "Contraceptives", icon: HeartPulse },
  lubricants: { label: "Lubricants", icon: Droplets },
  testKits: { label: "Test Kits", icon: TestTube2 },
  supplements: { label: "Supplements", icon: Sparkles },
  intimateCare: { label: "Intimate Care", icon: Droplets },
  painRelief: { label: "Pain Relief", icon: HeartPulse }
};

export function DKTProducts() {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return ["all", ...getDKTCategories()];
  }, []);

  const primarySupportLine = dktSupportLines[0];
  const supportTel = primarySupportLine ? `+${primarySupportLine.phone.replace(/\D/g, "")}` : "+233302772799";
  const regionalSupportLines = dktSupportLines.slice(1);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return dktProducts.filter(product => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesQuery = !query || 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.uses.some(use => use.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleProduct = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
    

      {/* Search and Filter */}
      <Card className="p-4 sm:p-5 border-[#F4D6D5] rounded-2xl bg-white shadow-sm">
        <div className="space-y-3 sm:space-y-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-[#241515]">Search DKT products</h3>
            <p className="text-xs sm:text-sm text-[#6D4A49] mt-1">
              Filter products by name, use, or category to find the right option faster.
            </p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-[#6C88BE] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, uses, or benefits..."
              className="h-11 rounded-xl border-[#CFE0FF] pl-12 pr-3 bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
            const active = selectedCategory === category;
            const meta = category === "all" ? null : CATEGORY_META[category];
            const CategoryIcon = meta?.icon ?? ShoppingBag;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-[#BE322D] bg-gradient-to-r from-[#BE322D] to-[#F16365] text-white"
                    : "border-[#F4D6D5] bg-[#FFF8F8] text-[#6D4A49] hover:border-[#F16365]"
                }`}
              >
                <span className="inline-flex items-center gap-2 leading-none">
                  <CategoryIcon className="h-4 w-4" />
                  {category === "all" ? "All Products" : meta?.label || category}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, idx) => {
            const isExpanded = expandedProductId === product.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  onClick={() => toggleProduct(product.id)}
                  className="cursor-pointer border-[#F4D6D5] hover:border-[#F16365] transition-all rounded-2xl overflow-hidden group"
                >
                  <div className="p-4 sm:p-5">
                    {/* Product Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <Badge className="inline-flex items-center gap-1.5 bg-[#FFF1F1] text-[#BE322D] border-[#F4D6D5]">
                            {(() => {
                              const BadgeIcon = CATEGORY_META[product.category]?.icon ?? ShoppingBag;
                              return <BadgeIcon className="h-3.5 w-3.5" />;
                            })()}
                            {CATEGORY_META[product.category]?.label || product.category}
                          </Badge>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            {product.availability}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-[#241515] group-hover:text-[#BE322D] transition-colors break-words">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{product.description}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-3 sm:gap-2">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500">Price Range</p>
                          <p className="text-sm font-bold text-emerald-600 break-words">{product.priceRange}</p>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-[#F4D6D5] space-y-4"
                        >
                          {/* Uses */}
                          <div>
                            <h4 className="font-semibold text-[#0F2A6B] mb-2 text-sm">Uses & Benefits:</h4>
                              <div className="flex flex-wrap gap-2">
                              {product.uses.map((use, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-[#FFF1F1] text-[#BE322D] px-3 py-1.5 rounded-full border border-[#F4D6D5] max-w-full break-words"
                                >
                                  ✓ {use}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Where to Get */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-orange-500" />
                              <h4 className="font-semibold text-[#0F2A6B] text-sm">Where to Get:</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {product.whereToGet.map((location, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100"
                                >
                                  <MapPin className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                  <span className="min-w-0 break-words">{location}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            <Button className="h-10 rounded-xl bg-gradient-to-r from-[#BE322D] to-[#F16365] hover:from-[#9F2622] hover:to-[#DD575A] text-white font-semibold w-full">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Order Now
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="h-10 rounded-full border-[#F4D6D5] text-[#BE322D] hover:bg-[#FFF1F1] w-full inline-flex items-center justify-center"
                            >
                              <a href={`tel:${supportTel}`}>
                                <PhoneCall className="w-4 h-4 mr-2" />
                                Call to Order
                              </a>
                            </Button>
                          </div>

                          {/* Info Box */}
                          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800">
                            <p>
                              <strong>Tip:</strong> Availability varies by location. Call ahead or visit your nearest pharmacy to confirm stock.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className="p-10 rounded-3xl border-[#F4D6D5] text-center bg-gradient-to-br from-[#FFF1F1] to-[#FDECEC]">
            <ShoppingBag className="w-10 h-10 text-[#BE322D] mx-auto mb-3" />
            <h3 className="font-semibold text-[#241515]">No products found</h3>
            <p className="text-sm text-[#6D4A49] mt-1">Try a different search term or filter.</p>
          </Card>
        )}
      </div>

      {/* Product Count */}
      <div className="text-center py-2 sm:py-4">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {dktProducts.length} products
        </p>
      </div>

      {/* Info Banner */}
      <Card className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF1F1] to-[#FFF8F8] border-[#F4D6D5] rounded-2xl">
        <p className="text-sm text-[#241515] leading-relaxed">
          <strong>About DKT International:</strong> DKT International is a leading non-profit organization providing
          high-quality, affordable family planning and reproductive health products across Ghana and Africa.
          All products are sourced through verified channels and meet international quality standards.
        </p>
        <p className="text-sm text-[#241515] mt-2 leading-relaxed">
          <strong>Support line:</strong> {primarySupportLine?.region || "Head Office"} - {primarySupportLine?.phone || "0302772799"}
        </p>
        <p className="text-sm text-[#241515] mt-1 leading-relaxed">
          <strong>Location:</strong> {primarySupportLine?.location || "Dzorwulu, Accra"}
        </p>
        <p className="text-sm text-[#241515] mt-1 leading-relaxed">
          <strong>Email:</strong> {primarySupportLine?.email || "info@dktghana.org"}
        </p>
                          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {regionalSupportLines.map((line) => (
            <a
              key={`${line.region}-${line.phone}`}
                                href={`tel:${line.phone}`}
                                className="text-xs text-[#241515] bg-white/70 border border-[#F4D6D5] rounded-lg px-3 py-2 hover:bg-white break-words"
            >
              <strong>{line.region}:</strong> {line.phone}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
