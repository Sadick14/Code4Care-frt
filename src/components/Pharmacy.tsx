import { useMemo, useState } from "react";
import { AlertCircle, Clock, MapPin, Navigation, Phone, Pill, Search, ShoppingBag } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

interface PharmacyLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
}

export function Pharmacy() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const medications = t('pharmacy.medications', { returnObjects: true }) as any[];

  const locations: PharmacyLocation[] = [
    {
      id: "accra-central",
      name: "BlueCross Pharmacy - Osu",
      city: "Accra",
      address: "Oxford Street, Osu",
      phone: "+233302761210",
      hours: "Mon-Sat: 8:00 - 21:00",
      services: ["Emergency contraception", "Pregnancy tests", "Condoms"],
      lat: 5.5595,
      lng: -0.1824,
    },
    {
      id: "tema-hub",
      name: "Tema Community Pharmacy",
      city: "Tema",
      address: "Community 1 Junction",
      phone: "+233302901145",
      hours: "Mon-Sun: 9:00 - 20:00",
      services: ["Family planning products", "STI support", "Counseling referral"],
      lat: 5.6698,
      lng: -0.0166,
    },
    {
      id: "kumasi-care",
      name: "Kumasi Care Pharmacy",
      city: "Kumasi",
      address: "Adum, near Kejetia",
      phone: "+233322031509",
      hours: "Mon-Sat: 8:30 - 19:30",
      services: ["SRH medication", "Test kits", "Youth-friendly support"],
      lat: 6.6885,
      lng: -1.6244,
    },
  ];

  const categories = useMemo(() => {
    const unique = Array.from(new Set(medications.map((med) => med.category)));
    return ["all", ...unique];
  }, [medications]);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(locations.map((location) => location.city)));
    return ["all", ...unique];
  }, [locations]);

  const filteredMedications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return medications.filter((med) => {
      const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;
      const matchesQuery =
        !query ||
        med.name.toLowerCase().includes(query) ||
        med.description.toLowerCase().includes(query) ||
        String(t(`pharmacy.categories.${med.category}`)).toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [medications, searchQuery, selectedCategory, t]);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => selectedCity === "all" || location.city === selectedCity);
  }, [locations, selectedCity]);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F8FAFE]">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('pharmacy.title')}</h1>
          <p className="text-gray-500 text-lg">{t('pharmacy.subtitle')}</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-10 p-1 bg-slate-100 rounded-2xl h-14">
            <TabsTrigger value="products" className="rounded-xl data-[state=active]:bg-white text-lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('pharmacy.tabs.products')}
            </TabsTrigger>
            <TabsTrigger value="locations" className="rounded-xl data-[state=active]:bg-white text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {t('pharmacy.tabs.locations')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 outline-none">
             <Card className="p-4 md:p-5 border-[#D8E7FF] rounded-2xl bg-white shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 text-[#6C88BE] absolute left-3 top-1/2 -translate-y-1/2" />
                   <Input
                     value={searchQuery}
                     onChange={(event) => setSearchQuery(event.target.value)}
                     placeholder={t("pharmacy.searchProducts", "Search products, categories, or symptoms")}
                     className="h-11 rounded-xl border-[#CFE0FF] pl-9"
                   />
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-1">
                   {categories.map((category) => {
                     const active = selectedCategory === category;
                     const label =
                       category === "all" ? t("pharmacy.filterAll", "All") : String(t(`pharmacy.categories.${category}`));

                     return (
                       <button
                         key={category}
                         onClick={() => setSelectedCategory(category)}
                         className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                           active
                             ? "border-[#0048ff] bg-[#0048ff] text-white"
                             : "border-[#D1E3FF] bg-[#F7FAFF] text-[#45639E] hover:border-[#90B3FF]"
                         }`}
                       >
                         {label}
                       </button>
                     );
                   })}
                 </div>
               </div>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMedications.map((med, idx) => (
                  <motion.div 
                    key={med.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-slate-100 rounded-3xl group">
                      <div className="flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                           <Pill className="w-6 h-6" />
                        </div>
                        <Badge variant="outline" className="mb-2 border-blue-100 text-blue-600 bg-blue-50/30">
                           {t(`pharmacy.categories.${med.category}`)}
                        </Badge>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{med.name}</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{med.description}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50 mt-auto">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-slate-400 text-sm">{t('pharmacy.price')}</span>
                           <span className="text-xl font-bold text-blue-600">{med.price}</span>
                        </div>
                        <Button asChild className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                          <a href="tel:+233302761210">
                            <Phone className="w-4 h-4 mr-2" />
                            {t('pharmacy.callToOrder')}
                          </a>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
             </div>

             {filteredMedications.length === 0 && (
               <Card className="p-10 rounded-3xl border-[#D8E7FF] text-center">
                 <Pill className="w-10 h-10 text-[#7FA0DA] mx-auto mb-3" />
                 <h3 className="font-semibold text-[#1D3D79]">{t("pharmacy.noProductsTitle", "No products found")}</h3>
                 <p className="text-sm text-[#5F7CB3] mt-1">{t("pharmacy.noProductsBody", "Try a different search term or filter.")}</p>
               </Card>
             )}

             <Card className="p-6 bg-amber-50 border-amber-100 border rounded-3xl">
                <div className="flex items-start gap-4">
                   <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                   <div>
                      <h4 className="font-bold text-amber-900">{t('pharmacy.disclaimer', 'Important Note')}</h4>
                      <p className="text-sm text-amber-800 opacity-80 leading-relaxed">
                        Always consult a medical professional. Our products are sourced from verified pharmacists.
                      </p>
                   </div>
                </div>
             </Card>
          </TabsContent>

          <TabsContent value="locations" className="outline-none">
             <Card className="p-4 md:p-5 border-[#D8E7FF] rounded-2xl mb-6">
               <div className="flex flex-wrap items-center gap-2">
                 <span className="text-xs font-semibold text-[#5B78B2] uppercase tracking-wider">
                   {t("pharmacy.cityFilter", "City")}
                 </span>
                 {cities.map((city) => {
                   const active = selectedCity === city;
                   const label = city === "all" ? t("pharmacy.filterAll", "All") : city;
                   return (
                     <button
                       key={city}
                       onClick={() => setSelectedCity(city)}
                       className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                         active
                           ? "border-[#0048ff] bg-[#0048ff] text-white"
                           : "border-[#D1E3FF] bg-[#F7FAFF] text-[#45639E] hover:border-[#90B3FF]"
                       }`}
                     >
                       {label}
                     </button>
                   );
                 })}
               </div>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {filteredLocations.map((location) => (
                 <Card key={location.id} className="rounded-3xl border-[#DCE9FF] shadow-sm p-5">
                   <div className="flex items-start justify-between gap-4">
                     <div>
                       <h3 className="text-lg font-bold text-[#173A7C]">{location.name}</h3>
                       <p className="text-sm text-[#5A77B0] mt-1">{location.address}</p>
                       <Badge className="mt-3 bg-[#EAF2FF] text-[#2F58A4] border-[#D2E3FF]" variant="outline">
                         {location.city}
                       </Badge>
                     </div>
                     <div className="w-10 h-10 rounded-2xl bg-[#EAF2FF] text-[#0048ff] flex items-center justify-center">
                       <MapPin className="w-5 h-5" />
                     </div>
                   </div>

                   <div className="mt-4 space-y-2 text-sm text-[#4D6BA6]">
                     <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       {location.hours}
                     </div>
                     <div className="flex items-center gap-2">
                       <Phone className="w-4 h-4" />
                       {location.phone}
                     </div>
                   </div>

                   <div className="mt-4 flex flex-wrap gap-2">
                     {location.services.map((service) => (
                       <span key={service} className="text-[11px] px-2 py-1 rounded-full bg-[#F2F7FF] text-[#42609A] border border-[#E1ECFF]">
                         {service}
                       </span>
                     ))}
                   </div>

                   <div className="mt-5 grid grid-cols-2 gap-2">
                     <Button asChild className="rounded-xl bg-[#0048ff] hover:bg-[#003dda]">
                       <a href={`tel:${location.phone}`}>
                         <Phone className="w-4 h-4 mr-2" />
                         {t("support.callNow", "Call")}
                       </a>
                     </Button>
                     <Button asChild variant="outline" className="rounded-xl border-[#C7DBFF] text-[#1C458D] hover:bg-[#EDF4FF]">
                       <a href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`} target="_blank" rel="noreferrer">
                         <Navigation className="w-4 h-4 mr-2" />
                         {t("clinics.locationBtn", "Find Nearest")}
                       </a>
                     </Button>
                   </div>
                 </Card>
               ))}
             </div>

             {filteredLocations.length === 0 && (
               <Card className="mt-4 p-10 rounded-3xl border-[#D8E7FF] text-center">
                 <MapPin className="w-10 h-10 text-[#7FA0DA] mx-auto mb-3" />
                 <h3 className="font-semibold text-[#1D3D79]">{t("pharmacy.noLocationsTitle", "No pharmacies in this filter")}</h3>
                 <p className="text-sm text-[#5F7CB3] mt-1">{t("pharmacy.noLocationsBody", "Try another city to see available pharmacy hubs.")}</p>
               </Card>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}