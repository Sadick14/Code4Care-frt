import { Phone, Pill, ShoppingBag, MapPin, Clock, AlertCircle, Navigation, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

interface PharmacyProps {
  selectedLanguage: string;
}

interface Medication {
  id: string;
  name: string;
  category: string;
  description: {
    en: string;
    twi: string;
    ewe: string;
    ga: string;
  };
  price: string;
  availability: string;
  phoneNumber: string;
}

interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
}

export function Pharmacy({ selectedLanguage }: PharmacyProps) {
  const translations = {
    en: {
      title: "Pharmacy & Products",
      subtitle: "Order SRH medications and products safely",
      callToOrder: "Call to Order",
      available: "Available",
      limitedStock: "Limited Stock",
      outOfStock: "Out of Stock",
      price: "Price",
      category: "Category",
      contraceptives: "Contraceptives",
      emergencyContraception: "Emergency Contraception",
      testKits: "Test Kits",
      supplements: "Supplements",
      safetyNote: "Privacy Guaranteed",
      safetyDesc: "All orders are handled with complete discretion and privacy.",
      disclaimer: "Important Notice",
      disclaimerText: "Always consult a healthcare provider before using any medication. These are over-the-counter products available at verified pharmacies in Ghana.",
      productsTab: "Products",
      locationsTab: "Nearby Pharmacies",
      pharmacyLocations: "Verified Pharmacy",
      findNearby: "Find pharmacies near you with SRH products",
      callPharmacy: "Call",
      getDirections: "Directions",
      openingHours: "Hours",
      viewOnMap: "View on Map",
    },
    twi: {
      title: "Aduruyɛ & Nneɛma",
      subtitle: "Tɔ SRHR nnuru ne nneɛma asomdwoemu",
      callToOrder: "Frɛ na Tɔ",
      available: "Ɛwɔ Hɔ",
      limitedStock: "Kakra Bi Wɔ Hɔ",
      outOfStock: "Ɛnni Hɔ",
      price: "Ɛboɔ",
      category: "Akyɛfa",
      contraceptives: "Nnyinsɛn Ano Aduru",
      emergencyContraception: "Mprempren Nnyinsɛn Ano Aduru",
      testKits: "Nhwehwɛmu Nneɛma",
      supplements: "Nkabom Aduru",
      safetyNote: "Kokoam a Wɔhyɛ Bɔ",
      safetyDesc: "Wɔde kokoam ne ahofama di wo ntɔ nyinaa ho dwuma.",
      disclaimer: "Nsɛm a Ɛho Hia",
      disclaimerText: "Bisa akwahosan ho ɔyɛmfoɔ ansa na woabɛfa aduru biara. Eyinom yɛ nnuru a wubetumi atɔ wɔ aduruyɛbea a wɔagye atom wɔ Ghana.",
      productsTab: "Nneɛma",
      locationsTab: "Aduruyɛbea a ɛbɛn",
      pharmacyLocations: "Aduruyɛbea a Wɔagye Atom",
      findNearby: "Hwehwɛ aduruyɛbea a ɛbɛn wo a wɔwɔ SRHR nneɛma",
      callPharmacy: "Frɛ",
      getDirections: "Akwankyerɛ",
      openingHours: "Bere",
      viewOnMap: "Hwɛ wɔ Mepuo so",
    },
    ewe: {
      title: "Atikewɔƒe & Nuwo",
      subtitle: "Ƒle SRHR atike kple nuwo le dedinɔnɔme",
      callToOrder: "Yɔ be Naƒle",
      available: "Eli",
      limitedStock: "Sueme Wɔ",
      outOfStock: "Meli o",
      price: "Home",
      category: "Akpa",
      contraceptives: "Fufɔ Doxona",
      emergencyContraception: "Kpɔtɔ Fufɔ Doxona",
      testKits: "Dodokpɔ Nuwo",
      supplements: "Kpeɖeŋu Atike",
      safetyNote: "Ɣaɣlawo Kɔ̃",
      safetyDesc: "Wotsɔa ɣaɣlawo kple dzadzɛe wɔa wò nuƒleƒle katã.",
      disclaimer: "Nya Vevitɔwo",
      disclaimerText: "Bia lãmesẽnyala gbɔ hafi nawɔ atike aɖe ŋu dɔ. Esiawo nye atike siwo woate ŋu aƒle le atikewɔƒe siwo wodo kpɔ le Ghana.",
      productsTab: "Nuwo",
      locationsTab: "Atikewɔƒe te",
      pharmacyLocations: "Atikewɔƒe si Wodo Kpɔ",
      findNearby: "Di atikewɔƒe si te ɖe ŋuwò si SRHR nuwo le",
      callPharmacy: "Yɔ",
      getDirections: "Mɔfiame",
      openingHours: "Gaƒoƒowo",
      viewOnMap: "Kpɔ le Nutatawo dzi",
    },
    ga: {
      title: "Aduruyɛbea & Nneɛma",
      subtitle: "Tɔ SRHR nnuru lɛ nneɛma asomdwoemu",
      callToOrder: "Frɛ Kɛ Tɔ",
      available: "Ɛwɔ Lɛ",
      limitedStock: "Susu Wɔ Lɛ",
      outOfStock: "Ɛwɔ Hĩ",
      price: "Ɛboɔ",
      category: "Ekã",
      contraceptives: "Nnyinsɛn Ebii Aduru",
      emergencyContraception: "Kpakpa Nnyinsɛn Ebii Aduru",
      testKits: "Nhwehwɛmu Nneɛma",
      supplements: "Nkabom Aduru",
      safetyNote: "Kokoam Hyɛɛ Bɔ",
      safetyDesc: "Wɔ di wo ntɔ nyinaa kokoam lɛ ahofama.",
      disclaimer: "Nsɛm Hia Shikpon",
      disclaimerText: "Bisa akwahosan ɔyɛmfoɔ gbɔ tsɔ o fa aduru biara. Eyinom yɛ nnuru nɔ o tumi tɔ wɔ aduruyɛbea ni wɔ gye atom wɔ Ghana.",
      productsTab: "Nneɛma",
      locationsTab: "Aduruyɛbea ni ɛ bɛn",
      pharmacyLocations: "Aduruyɛbea ni Wɔ Gye Atom",
      findNearby: "Hwehwɛ aduruyɛbea ni ɛ bɛn wo ni wɔ wɔ SRHR nneɛma",
      callPharmacy: "Frɛ",
      getDirections: "Akwankyerɛ",
      openingHours: "Bere",
      viewOnMap: "Hwɛ wɔ Mepuo shi",
    },
  };

  // Pharmacy locations in major cities across Ghana
  const pharmacyLocations: PharmacyLocation[] = [
    {
      id: "1",
      name: "Accra Central Pharmacy",
      address: "23 High Street, Tudu",
      city: "Accra",
      phone: "+233 30 266 2345",
      lat: 5.6037,
      lng: -0.1870,
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-4PM",
    },
    {
      id: "2",
      name: "Osu Oxford Street Pharmacy",
      address: "Oxford Street, Osu",
      city: "Accra",
      phone: "+233 30 277 3456",
      lat: 5.5600,
      lng: -0.1767,
      hours: "Mon-Sat: 8AM-9PM, Sun: 9AM-6PM",
    },
    {
      id: "3",
      name: "Tema Community 1 Pharmacy",
      address: "Community 1 Shopping Area",
      city: "Tema",
      phone: "+233 30 320 4567",
      lat: 5.6698,
      lng: -0.0166,
      hours: "Mon-Sat: 7:30AM-8PM, Sun: 9AM-5PM",
    },
    {
      id: "4",
      name: "Madina Market Pharmacy",
      address: "Madina Main Market Road",
      city: "Accra",
      phone: "+233 30 251 5678",
      lat: 5.6836,
      lng: -0.1669,
      hours: "Mon-Sat: 8AM-7PM, Sun: Closed",
    },
    {
      id: "5",
      name: "Kumasi Central Pharmacy",
      address: "Adum Commercial Street",
      city: "Kumasi",
      phone: "+233 32 202 6789",
      lat: 6.6885,
      lng: -1.6244,
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-4PM",
    },
    {
      id: "6",
      name: "Takoradi Market Circle Pharmacy",
      address: "Market Circle",
      city: "Takoradi",
      phone: "+233 31 202 7890",
      lat: 4.8974,
      lng: -1.7498,
      hours: "Mon-Sat: 8AM-7PM, Sun: 9AM-3PM",
    },
    {
      id: "7",
      name: "Tamale Central Pharmacy",
      address: "Central Market Area",
      city: "Tamale",
      phone: "+233 37 202 8901",
      lat: 9.4008,
      lng: -0.8393,
      hours: "Mon-Sat: 8AM-7PM, Sun: 10AM-2PM",
    },
    {
      id: "8",
      name: "Cape Coast University Pharmacy",
      address: "University of Cape Coast Road",
      city: "Cape Coast",
      phone: "+233 33 213 9012",
      lat: 5.1053,
      lng: -1.2810,
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-5PM",
    },
    {
      id: "9",
      name: "East Legon Pharmacy",
      address: "American House, East Legon",
      city: "Accra",
      phone: "+233 30 251 0123",
      lat: 5.6407,
      lng: -0.1507,
      hours: "Mon-Sun: 8AM-10PM",
    },
    {
      id: "10",
      name: "Spintex Road Pharmacy",
      address: "Spintex Road, Baatsonaa",
      city: "Accra",
      phone: "+233 30 295 1234",
      lat: 5.6394,
      lng: -0.1067,
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-5PM",
    },
  ];

  const medications: Medication[] = [
    {
      id: "1",
      name: "Emergency Contraceptive Pills (Postinor-2)",
      category: "emergencyContraception",
      description: {
        en: "Emergency contraception that can prevent pregnancy when taken within 72 hours after unprotected sex.",
        twi: "Mprempren nnyinsɛn ano aduru a ɛbɛtumi asiw nyinsɛn bere a wode di dwuma wɔ nnɔnhwere 72 akyi wɔ nna a wɔanhwɛ so akyi.",
        ewe: "Kpɔtɔ fufɔ doxona si ate ŋu axɔ na fufɔ ne wowɔe le gaƒoƒo 72 megbe le asitsatsa si ŋu womele dedie ɖe o megbe.",
        ga: "Kpakpa nnyinsɛn ebii aduru ni ɛ tumi siw nyinsɛn bere ni wɔ de di dwuma wɔ nnɔnhwere 72 akyi wɔ nna ni amɛ hwɛ shi akyi.",
      },
      price: "GH₵ 15-25",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
    {
      id: "2",
      name: "Oral Contraceptive Pills (Birth Control)",
      category: "contraceptives",
      description: {
        en: "Daily pills that prevent pregnancy when taken correctly. Available in 21-day and 28-day packs.",
        twi: "Daa aduru a ɛsiw nyinsɛn bere a wode di dwuma yiye. Ɛwɔ nnafua 21 ne nnafua 28 mu.",
        ewe: "Ŋkeke sia ŋkeke atike si xɔa na fufɔ ne wowɔa wo nyuie. Woli le ŋkeke 21 kple ŋkeke 28 ƒe pakɛwo me.",
        ga: "Daa aduru ni ɛ siw nyinsɛn bere ni wɔ de di dwuma yie. Ɛ wɔ nnafua 21 lɛ nnafua 28 mu.",
      },
      price: "GH₵ 8-20/month",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
    {
      id: "3",
      name: "Condoms (Male & Female)",
      category: "contraceptives",
      description: {
        en: "Barrier method that prevents pregnancy and protects against STIs. Available for both men and women.",
        twi: "Akyi kwan a ɛsiw nyinsɛn na ɛbɔ wo ho ban firi yadeɛ ho. Ɛwɔ hɔ ma mmarima ne mmea.",
        ewe: "Mɔ̃ xexlẽ si xɔa na fufɔ eye wòléa ame ɖe STI ŋu. Woli na ŋutsuwo kple nyɔnuwo.",
        ga: "Kwan kakra ni ɛ siw nyinsɛn na ɛ bɔ wo ho ban firi yadeɛ. Ɛ wɔ lɛ ma mmarima lɛ mmaa.",
      },
      price: "GH₵ 2-5/pack",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
    {
      id: "4",
      name: "Pregnancy Test Kit",
      category: "testKits",
      description: {
        en: "Home pregnancy test that provides accurate results within minutes. Easy to use and reliable.",
        twi: "Fie nyinsɛn nhwehwɛmu a ɛkyerɛ nea ɛteɛ wɔ simma kakra mu. Ɛnyɛ den sɛ wode bedi dwuma na wotumi de ho to so.",
        ewe: "Aƒe me fufɔ dodokpɔ si naa tameɖoɖo si dzi ŋu woaka ɖo le aɖabaƒoƒo ʋɛ aɖewo me. Wobɔa wo ŋu awɔ eŋu dɔ eye wòdea dzi ɖe eŋu.",
        ga: "Fie nyinsɛn nhwehwɛmu ni ɛ kyerɛ nea ɛ teɛ wɔ simma kakra mu. Ɛ nyɛ den sɛ wɔ de di dwuma na wɔ tumi de ho to shi.",
      },
      price: "GH₵ 10-15",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
    {
      id: "5",
      name: "Folic Acid Supplements",
      category: "supplements",
      description: {
        en: "Essential vitamin for women planning pregnancy or during early pregnancy. Prevents birth defects.",
        twi: "Vitamin a ɛho hia ma mmea a wɔrehyehyɛ nyinsɛn anaa nyinsɛn mfitiase. Ɛsiw awodeɛ ho haw.",
        ewe: "Vitamin vevi na nyɔnu siwo le fufɔ ɖim alo le fufɔ gɔmedzedzea me. Enaa fufɔ ƒe kuxi wuwu.",
        ga: "Vitamin ni ɛ hia ma mmaa ni wɔ hyehyɛ nyinsɛn anaa nyinsɛn mfitiase. Ɛ siw awodeɛ haw.",
      },
      price: "GH₵ 12-18",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
    {
      id: "6",
      name: "HIV Self-Test Kit",
      category: "testKits",
      description: {
        en: "Confidential home test for HIV. Results in 20 minutes. Free counseling available with purchase.",
        twi: "Kokoam fie HIV nhwehwɛmu. Nea ɛbɛba wɔ simma 20 mu. Afotuo a wɔmfa sika nti wɔ hɔ bere a wotɔ no.",
        ewe: "Ɣaɣla aƒe me HIV dodokpɔ. Tameɖoɖo le aɖabaƒoƒo 20 me. Aɖaŋuɖoɖo femaxe li ne eƒle.",
        ga: "Kokoam fie HIV nhwehwɛmu. Nea ɛ ba wɔ simma 20 mu. Afotuo ni amɛ fa sika nti wɔ lɛ bere ni o tɔ.",
      },
      price: "GH₵ 25-35",
      availability: "available",
      phoneNumber: "+233 24 123 4567",
    },
  ];

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "contraceptives":
        return t.contraceptives;
      case "emergencyContraception":
        return t.emergencyContraception;
      case "testKits":
        return t.testKits;
      case "supplements":
        return t.supplements;
      default:
        return category;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    if (availability === "available") {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          {t.available}
        </Badge>
      );
    } else if (availability === "limited") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          {t.limitedStock}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          {t.outOfStock}
        </Badge>
      );
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const [selectedLocation, setSelectedLocation] = useState<PharmacyLocation | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)" }}>
      {/* Header with Info Button */}
      <div className="flex-shrink-0 p-4 border-b flex items-center justify-between" style={{ borderColor: "#E8ECFF", backgroundColor: "white" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0048ff 0%, #0066ff 100%)",
              boxShadow: "0 4px 12px rgba(0, 72, 255, 0.25)",
            }}
          >
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#0048ff" }}>
              {t.title}
            </h2>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
        </div>

        {/* Info Button to Open Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10"
              style={{ borderColor: "#0048ff", color: "#0048ff" }}
            >
              <Info className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ color: "#0048ff" }}>
                {t.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Safety Notice */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#E8ECFF" }}>
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#0048ff" }} />
                  <div>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: "#0048ff" }}>
                      {t.safetyNote}
                    </h4>
                    <p className="text-xs text-gray-600">{t.safetyDesc}</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-amber-800">
                      {t.disclaimer}
                    </h4>
                    <p className="text-xs text-amber-700">{t.disclaimerText}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content with Tabs */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="products" className="flex flex-col min-h-full">
          <div className="flex-shrink-0 px-6 pt-4 pb-2 sticky top-0 z-10" style={{ backgroundColor: "white" }}>
            <TabsList className="grid w-full grid-cols-2 p-1.5 h-auto rounded-xl gap-2" style={{ backgroundColor: "#F0F4FF" }}>
              <TabsTrigger 
                value="products"
                className="relative rounded-lg py-3.5 px-4 text-sm font-semibold transition-all duration-200 data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-white data-[state=inactive]:shadow-sm data-[state=active]:bg-[#0048ff] data-[state=active]:text-white data-[state=active]:shadow-lg hover:data-[state=inactive]:bg-gray-50"
              >
                {t.productsTab}
              </TabsTrigger>
              <TabsTrigger 
                value="locations"
                className="relative rounded-lg py-3.5 px-4 text-sm font-semibold transition-all duration-200 data-[state=inactive]:text-gray-500 data-[state=inactive]:bg-white data-[state=inactive]:shadow-sm data-[state=active]:bg-[#0048ff] data-[state=active]:text-white data-[state=active]:shadow-lg hover:data-[state=inactive]:bg-gray-50"
              >
                {t.locationsTab}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-0 flex-1">
            <div className="p-6 space-y-4">
              {medications.map((med) => (
                <Card
                  key={med.id}
                  className="p-5 hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: "white", borderColor: "#E8ECFF" }}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "#E8ECFF" }}
                          >
                            <Pill className="w-5 h-5" style={{ color: "#0048ff" }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1" style={{ color: "#1A1A1A" }}>
                              {med.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 items-center">
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: "#0048ff", color: "#0048ff" }}
                              >
                                {getCategoryLabel(med.category)}
                              </Badge>
                              {getAvailabilityBadge(med.availability)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {med.description[selectedLanguage as keyof typeof med.description] ||
                        med.description.en}
                    </p>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t" style={{ borderColor: "#E8ECFF" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{t.price}:</span>
                        <span className="text-lg font-bold" style={{ color: "#0048ff" }}>
                          {med.price}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleCall(med.phoneNumber)}
                        className="rounded-xl gap-2"
                        style={{
                          background: "linear-gradient(135deg, #0048ff 0%, #0066ff 100%)",
                          boxShadow: "0 4px 16px rgba(0, 72, 255, 0.2)",
                        }}
                        disabled={med.availability === "outOfStock"}
                      >
                        <Phone className="w-4 h-4" />
                        {t.callToOrder}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="mt-0 flex-1">
            <div className="p-6 space-y-6">
              {/* Map Info Banner */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: "#E8ECFF" }}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#0048ff" }} />
                  <div>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: "#0048ff" }}>
                      {t.pharmacyLocations}
                    </h4>
                    <p className="text-xs text-gray-600">{t.findNearby}</p>
                  </div>
                </div>
              </div>

              {/* Pharmacy List with Individual Maps */}
              <div className="space-y-4">
                {pharmacyLocations.map((location) => (
                  <Card
                    key={location.id}
                    className="p-5 hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: "white", borderColor: "#E8ECFF" }}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#E8ECFF" }}
                        >
                          <MapPin className="w-5 h-5" style={{ color: "#0048ff" }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1" style={{ color: "#1A1A1A" }}>
                            {location.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: "#0048ff", color: "#0048ff" }}
                          >
                            {location.city}
                          </Badge>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{location.address}, {location.city}</span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{location.phone}</span>
                      </div>

                      {/* Hours */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{location.hours}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "#E8ECFF" }}>
                        <Button
                          onClick={() => handleCall(location.phone)}
                          className="flex-1 rounded-xl gap-2"
                          style={{
                            background: "linear-gradient(135deg, #0048ff 0%, #0066ff 100%)",
                            boxShadow: "0 4px 16px rgba(0, 72, 255, 0.2)",
                          }}
                        >
                          <Phone className="w-4 h-4" />
                          {t.callPharmacy}
                        </Button>
                        <Button
                          onClick={() => handleGetDirections(location.lat, location.lng)}
                          className="flex-1 rounded-xl gap-2"
                          variant="outline"
                          style={{
                            borderColor: "#0048ff",
                            color: "#0048ff",
                          }}
                        >
                          <Navigation className="w-4 h-4" />
                          {t.getDirections}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}