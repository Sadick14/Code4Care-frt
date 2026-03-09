import { useState } from "react";
import { Phone, AlertCircle, Heart, Info, MapPin, Clock, ChevronRight, Building2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ReferralSection } from "./ReferralSection";

interface SupportAndClinicsProps {
  selectedLanguage: string;
}

interface Hotline {
  id: number;
  type: string;
  contact: string;
  phone: string;
  icon: "alert" | "heart" | "info";
  description: string;
}

interface Clinic {
  id: number;
  name: string;
  type: string;
  location: string;
  phone: string;
  hours: string;
  services: string[];
  distance: string;
}

export function SupportAndClinics({ selectedLanguage }: SupportAndClinicsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const content = {
    en: {
      title: "Support & Clinics",
      subtitle: "Get help and find youth-friendly services",
      tabCrisis: "Crisis Support",
      tabClinics: "Find Clinics",
      callNow: "Call Now",
      available247: "Available 24/7",
      legalNotice: "Important Legal Information",
      ageOfConsent: "Age of consent in Ghana: 16 years",
      consentDescription: "Any sexual activity with someone under 16 is illegal in Ghana. If you or someone you know is in this situation, please contact the authorities immediately.",
      searchPlaceholder: "Search by location...",
      filterAll: "All",
      filterClinic: "Clinics",
      filterPharmacy: "Pharmacies",
      viewDetails: "View Details",
      getDirections: "Get Directions",
      services: "Services:",
      hotlines: [
        {
          id: 1,
          type: "Abuse / Violence",
          contact: "DOVVSU Helpline",
          phone: "055-1000-900",
          icon: "alert" as const,
          description: "For domestic violence, sexual assault, and abuse cases"
        },
        {
          id: 2,
          type: "Mental Health Support",
          contact: "Mental Health Authority Ghana",
          phone: "050-911-4396",
          icon: "heart" as const,
          description: "Counseling and mental health crisis support"
        },
        {
          id: 3,
          type: "SRH Information",
          contact: "PPAG Ghana",
          phone: "0302-219-038",
          icon: "info" as const,
          description: "Sexual and reproductive health information and services"
        },
        {
          id: 4,
          type: "SRH Information",
          contact: "Marie Stopes Ghana",
          phone: "0302-234-040",
          icon: "info" as const,
          description: "Contraception, family planning, and safe services"
        }
      ],
      clinics: [
        {
          id: 1,
          name: "PPAG Youth Clinics",
          type: "Clinic",
          location: "Multiple locations in Ghana",
          phone: "0302-219-038",
          hours: "Mon-Fri: 8am-5pm, Sat: 9am-2pm",
          services: ["Contraceptive counseling", "STI testing and treatment", "Pregnancy counseling", "Youth-friendly services"],
          distance: "Various"
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Clinic",
          location: "Nationwide centers",
          phone: "0302-234-040",
          hours: "Mon-Sat: 8am-6pm",
          services: ["Contraceptive counseling", "STI testing and treatment", "Safe abortion services", "Family planning"],
          distance: "Various"
        },
        {
          id: 3,
          name: "DKT Ghana",
          type: "Clinic",
          location: "Regional offices",
          phone: "+233 30 276 5432",
          hours: "Mon-Fri: 9am-5pm",
          services: ["Contraceptive counseling", "STI testing and treatment", "Youth health education", "Family planning products"],
          distance: "Various"
        },
        {
          id: 4,
          name: "Ridge Hospital Family Planning",
          type: "Clinic",
          location: "Ridge, Accra",
          phone: "+233 30 222 1234",
          hours: "Mon-Fri: 7am-4pm",
          services: ["Contraceptive counseling", "STI testing and treatment", "Maternal Health", "Prenatal care"],
          distance: "5.1 km"
        }
      ]
    },
    twi: {
      title: "Mmoa ne Ayaresabea",
      subtitle: "Nya mmoa na hwehwɛ mmabunu dwumadie",
      tabCrisis: "Adesua Mmoa",
      tabClinics: "Hwehwɛ Ayaresabea",
      callNow: "Frɛ Seesei",
      available247: "Ɛwɔ hɔ dapem",
      legalNotice: "Mmara Ho Nsɛm a Ɛho Hia",
      ageOfConsent: "Mfe a wubetumi apene so wɔ Ghana: Mfe 16",
      consentDescription: "Nna biara a wode to obi a wadi mfe 16 no yɛ bɔne wɔ Ghana. Sɛ wo anaa obi a wonim wɔ saa tebea mu a, frɛ tumi no ntɛm ara.",
      searchPlaceholder: "Hwehwɛ beae...",
      filterAll: "Nyinaa",
      filterClinic: "Ayaresabea",
      filterPharmacy: "Adurutoɔ",
      viewDetails: "Hwɛ nsɛm",
      getDirections: "Nya ɔkwan",
      services: "Dwumadie:",
      hotlines: [
        {
          id: 1,
          type: "Basabasayɛ / Akakabensɛm",
          contact: "DOVVSU Nkɔmmɔbea",
          phone: "055-1000-900",
          icon: "alert" as const,
          description: "Ma efie basabasayɛ, nna basabasayɛ, ne akakabensɛm"
        },
        {
          id: 2,
          type: "Adwene Akwahosan Mmoa",
          contact: "Mental Health Authority Ghana",
          phone: "050-911-4396",
          icon: "heart" as const,
          description: "Afotusoɔ ne adwene akwahosan adesua mmoa"
        },
        {
          id: 3,
          type: "Nwokoɔ Akwahosan Nsɛm",
          contact: "PPAG Ghana",
          phone: "0302-219-038",
          icon: "info" as const,
          description: "Nwokoɔ ne awo akwahosan nsɛm ne dwumadie"
        },
        {
          id: 4,
          type: "Nwokoɔ Akwahosan Nsɛm",
          contact: "Marie Stopes Ghana",
          phone: "0302-234-040",
          icon: "info" as const,
          description: "Awo si ano, abusua nhyehyɛe, ne dwumadie a ɛho tew"
        }
      ],
      clinics: [
        {
          id: 1,
          name: "PPAG Mmabunu Ayaresabea",
          type: "Ayaresabea",
          location: "Mmeae pii wɔ Ghana",
          phone: "0302-219-038",
          hours: "Dwoada-Fiada: 8am-5pm, Memeneda: 9am-2pm",
          services: ["Awo si ano afotusoɔ", "Yadeɛ hwehwɛmu ne ayaresa", "Nyinsɛn afotusoɔ", "Mmabunu dwumadie"],
          distance: "Ahorow"
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Ayaresabea",
          location: "Mmeae wɔ man no mu nyinaa",
          phone: "0302-234-040",
          hours: "Dwoada-Memeneda: 8am-6pm",
          services: ["Awo si ano afotusoɔ", "Yadeɛ hwehwɛmu ne ayaresa", "Nyinsɛn yi a ɛho tew", "Abusua nhyehyɛe"],
          distance: "Ahorow"
        },
        {
          id: 3,
          name: "DKT Ghana",
          type: "Ayaresabea",
          location: "Mantam asoɛe",
          phone: "+233 30 276 5432",
          hours: "Dwoada-Fiada: 9am-5pm",
          services: ["Awo si ano afotusoɔ", "Yadeɛ hwehwɛmu ne ayaresa", "Mmabunu akwahosan nkyerɛkyerɛ", "Abusua nhyehyɛe nneɛma"],
          distance: "Ahorow"
        },
        {
          id: 4,
          name: "Ridge Hospital Abusua Nhyehyɛe",
          type: "Ayaresabea",
          location: "Ridge, Accra",
          phone: "+233 30 222 1234",
          hours: "Dwoada-Fiada: 7am-4pm",
          services: ["Awo si ano afotusoɔ", "Yadeɛ hwehwɛmu ne ayaresa", "Ɛnanom akwahosan", "Nyinsɛn mu hwɛ"],
          distance: "5.1 km"
        }
      ]
    },
    ewe: {
      title: "Kpekpeɖeŋu kple Kliniko",
      subtitle: "Xɔ kpekpeɖeŋu eye nàdi sɔhɛwo dɔwɔnawo",
      tabCrisis: "Xaxa Kpekpeɖeŋu",
      tabClinics: "Di Kliniko",
      callNow: "Yɔ Fifia",
      available247: "Ele anyi ŋkeke blibo",
      legalNotice: "Se Nyatakaka Vevitɔ",
      ageOfConsent: "Lɔlɔ̃nu gbɔ ƒe ƒe le Ghana: Ƒe 16",
      consentDescription: "Nuwɔwɔ ɖesiaɖe kple ame si mexɔ ƒe 16 o la nye nu si se xɔ le Ghana. Ne wò alo ame aɖe si nènya le nɔnɔme sia me la, tia dziɖuɖu enumake.",
      searchPlaceholder: "Di le teƒe nu...",
      filterAll: "Ɖesiaɖe",
      filterClinic: "Kɔdaƒewo",
      filterPharmacy: "Atikewɔƒewo",
      viewDetails: "Kpɔ nuɖeɖe",
      getDirections: "Xɔ mɔfiame",
      services: "Dɔwɔnawo:",
      hotlines: [
        {
          id: 1,
          type: "Nuvɔ̃wɔwɔ / Ŋutasesẽ",
          contact: "DOVVSU Kaɖiɖimɔ",
          phone: "055-1000-900",
          icon: "alert" as const,
          description: "Aƒemenu ŋutasesẽ, ahasi ŋutasesẽ, kple nuvɔ̃wɔwɔ"
        },
        {
          id: 2,
          type: "Susu Lãmesɛ Kpekpeɖeŋu",
          contact: "Mental Health Authority Ghana",
          phone: "050-911-4396",
          icon: "heart" as const,
          description: "Aɖaŋuɖoɖo kple susu lãmesɛ xaxa kpekpeɖeŋu"
        },
        {
          id: 3,
          type: "Ahasi kple Vidzidzi Lãmesɛ",
          contact: "PPAG Ghana",
          phone: "0302-219-038",
          icon: "info" as const,
          description: "Ahasi kple vidzidzi lãmesɛ nyatakaka kple dɔwɔnawo"
        },
        {
          id: 4,
          type: "Ahasi kple Vidzidzi Lãmesɛ",
          contact: "Marie Stopes Ghana",
          phone: "0302-234-040",
          icon: "info" as const,
          description: "Fuvɔvɔ, ƒome ɖoɖo, kple dɔwɔna siwo li ŋu le dedie"
        }
      ],
      clinics: [
        {
          id: 1,
          name: "PPAG Sɔhɛwo Kliniko",
          type: "Kɔdaƒe",
          location: "Teƒe vovovowo le Ghana",
          phone: "0302-219-038",
          hours: "Dzo-Fiɖa: 8am-5pm, Memleɖa: 9am-2pm",
          services: ["Fuvɔvɔ aɖaŋuɖoɖo", "Dɔléle dodokpɔ kple kpɔkplɔ", "Fufɔfɔ aɖaŋuɖoɖo", "Sɔhɛwo dɔwɔnawo"],
          distance: "Vovovo"
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Kɔdaƒe",
          location: "Teƒewo le dukɔ blibo la me",
          phone: "0302-234-040",
          hours: "Dzo-Memleɖa: 8am-6pm",
          services: ["Fuvɔvɔ aɖaŋuɖoɖo", "Dɔléle dodokpɔ kple kpɔkplɔ", "Fu ɖeɖe si li ŋu le dedie", "Ƒome ɖoɖo"],
          distance: "Vovovo"
        },
        {
          id: 3,
          name: "DKT Ghana",
          type: "Kɔdaƒe",
          location: "Nutome ɔfiswo",
          phone: "+233 30 276 5432",
          hours: "Dzo-Fiɖa: 9am-5pm",
          services: ["Fuvɔvɔ aɖaŋuɖoɖo", "Dɔléle dodokpɔ kple kpɔkplɔ", "Sɔhɛwo lãmesɛ fifia", "Ƒome ɖoɖo nuwo"],
          distance: "Vovovo"
        },
        {
          id: 4,
          name: "Ridge Kɔdaƒe Ƒome Ðoɖo",
          type: "Kɔdaƒe",
          location: "Ridge, Accra",
          phone: "+233 30 222 1234",
          hours: "Dzo-Fiɖa: 7am-4pm",
          services: ["Fuvɔvɔ aɖaŋuɖoɖo", "Dɔléle dodokpɔ kple kpɔkplɔ", "Funɔwo ƒe lãmesɛ", "Funɔ me kpɔkplɔ"],
          distance: "5.1 km"
        }
      ]
    },
    ga: {
      title: "Bɔbɔi kɛ Ayɔyɔ Shiɛi",
      subtitle: "Nyɛ bɔbɔi kɛ shi nuŋ nyiɛi shiɛi",
      tabCrisis: "Nshɔŋŋ Bɔbɔi",
      tabClinics: "Shi Ayɔyɔ Shiɛi",
      callNow: "Yɛɔ Lɛ Fɛɛ",
      available247: "Ɛ jie gbekuu",
      legalNotice: "Tsɛtsɛ Sɛmi Kɛ Ɛ Mli",
      ageOfConsent: "Fɛɛ tsɔŋŋ kɛ Ghana: Mli 16",
      consentDescription: "Ahiɛ wulu kɛ niɛ kɛ mli 16 yɛ bɔni lɛ Ghana. Shɛ woo kooo niɛ kɛ wɔnya lɛ shishi be, yɛɔ tsɛtsɛ mli ni fɛɛ.",
      searchPlaceholder: "Shi lɛ beɛ ni...",
      filterAll: "Fɛɛ ni",
      filterClinic: "Ayɔyɔ Shiɛi",
      filterPharmacy: "Kpakpa Shiɛi",
      viewDetails: "Nyɛ Sɛmi",
      getDirections: "Nyɛ ɔkwan",
      services: "Wulumiɛi:",
      hotlines: [
        {
          id: 1,
          type: "Abulu / Nshɔŋŋ",
          contact: "DOVVSU Yɛɔbɔɔ",
          phone: "055-1000-900",
          icon: "alert" as const,
          description: "Lɛ shiɛ nshɔŋŋ, ahiɛ nshɔŋŋ, kɛ abulu"
        },
        {
          id: 2,
          type: "Susu Shibuiɛ Bɔbɔi",
          contact: "Mental Health Authority Ghana",
          phone: "050-911-4396",
          icon: "heart" as const,
          description: "Kɔŋŋmaŋ kɛ susu shibuiɛ nshɔŋŋ bɔbɔi"
        },
        {
          id: 3,
          type: "Ahiɛ Shibuiɛ Sɛmi",
          contact: "PPAG Ghana",
          phone: "0302-219-038",
          icon: "info" as const,
          description: "Ahiɛ kɛ bi shibuiɛ sɛmi kɛ wulumiɛi"
        },
        {
          id: 4,
          type: "Ahiɛ Shibuiɛ Sɛmi",
          contact: "Marie Stopes Ghana",
          phone: "0302-234-040",
          icon: "info" as const,
          description: "Bi si, shiɛ ɔyeɛ, kɛ wulumiɛi kɛ ɛ hiɛ"
        }
      ],
      clinics: [
        {
          id: 1,
          name: "PPAG Nuŋ Nyiɛi Ayɔyɔ Shiɛi",
          type: "Ayɔyɔ Shiɛ",
          location: "Beɛi fɛɛ lɛ Ghana",
          phone: "0302-219-038",
          hours: "Dzu-Fii: 8am-5pm, Hɔh: 9am-2pm",
          services: ["Bi si kɔŋŋmaŋ", "Yɔɔ shimiɛ kɛ ayɔi", "Bii kɔŋŋmaŋ", "Nuŋ nyiɛi wulumiɛi"],
          distance: "Fɛɛ fɛɛ"
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Ayɔyɔ Shiɛ",
          location: "Beɛi lɛ man blɔɔ",
          phone: "0302-234-040",
          hours: "Dzu-Hɔh: 8am-6pm",
          services: ["Bi si kɔŋŋmaŋ", "Yɔɔ shimiɛ kɛ ayɔi", "Bii gbɛmi kɛ ɛ hiɛ", "Shiɛ ɔyeɛ"],
          distance: "Fɛɛ fɛɛ"
        },
        {
          id: 3,
          name: "DKT Ghana",
          type: "Ayɔyɔ Shiɛ",
          location: "Kɛja shiɛi",
          phone: "+233 30 276 5432",
          hours: "Dzu-Fii: 9am-5pm",
          services: ["Bi si kɔŋŋmaŋ", "Yɔɔ shimiɛ kɛ ayɔi", "Nuŋ nyiɛi shibuiɛ kɔŋŋ", "Shiɛ ɔyeɛ nɛmiɛi"],
          distance: "Fɛɛ fɛɛ"
        },
        {
          id: 4,
          name: "Ridge Ayɔyɔ Shiɛ Ɔyeɛ",
          type: "Ayɔyɔ Shiɛ",
          location: "Ridge, Accra",
          phone: "+233 30 222 1234",
          hours: "Dzu-Fii: 7am-4pm",
          services: ["Bi si kɔŋŋmaŋ", "Yɔɔ shimiɛ kɛ ayɔi", "Ɔyɔi Shibuiɛ", "Bii mu nyɛ"],
          distance: "5.1 km"
        }
      ]
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "alert":
        return <AlertCircle className="w-6 h-6" style={{ color: '#FF4444' }} />;
      case "heart":
        return <Heart className="w-6 h-6" style={{ color: '#0048ff' }} />;
      case "info":
        return <Info className="w-6 h-6" style={{ color: '#0048ff' }} />;
      default:
        return <Phone className="w-6 h-6" style={{ color: '#0048ff' }} />;
    }
  };

  const filteredClinics = lang.clinics.filter(clinic => {
    const matchesType = selectedType === "all" || 
      clinic.type === (selectedType === "clinic" ? (selectedLanguage === "en" ? "Clinic" : selectedLanguage === "twi" ? "Ayaresabea" : selectedLanguage === "ewe" ? "Kɔdaƒe" : "Ayɔyɔ Shiɛ") : (selectedLanguage === "en" ? "Pharmacy" : selectedLanguage === "twi" ? "Adurutoɔ" : selectedLanguage === "ewe" ? "Atikewɔƒe" : "Kpakpa Shiɛ"));
    const matchesSearch = searchQuery === "" || 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)' }}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="mb-2" style={{ color: '#0048ff' }}>{lang.title}</h1>
          <p className="text-gray-600">{lang.subtitle}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="crisis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="crisis" className="rounded-xl">
              <AlertCircle className="w-4 h-4 mr-2" />
              {lang.tabCrisis}
            </TabsTrigger>
            <TabsTrigger value="clinics" className="rounded-xl">
              <Building2 className="w-4 h-4 mr-2" />
              {lang.tabClinics}
            </TabsTrigger>
          </TabsList>

          {/* Crisis Support Tab */}
          <TabsContent value="crisis" className="space-y-4">
            {/* Legal Notice - Age of Consent */}
            <Card className="p-6" style={{ borderColor: '#0048ff', borderWidth: '2px' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#0048ff' }} />
                <div>
                  <h3 className="mb-2" style={{ color: '#0048ff' }}>{lang.legalNotice}</h3>
                  <p className="mb-2" style={{ color: '#1A1A1A' }}>
                    <strong>{lang.ageOfConsent}</strong>
                  </p>
                  <p className="text-gray-700">{lang.consentDescription}</p>
                </div>
              </div>
            </Card>

            {/* Hotlines */}
            <div className="space-y-4">
              {lang.hotlines.map((hotline) => (
                <Card key={hotline.id} className="p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getIcon(hotline.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge 
                            variant="outline" 
                            className="rounded-full mb-2"
                            style={{ borderColor: '#0048ff', color: '#0048ff' }}
                          >
                            {hotline.type}
                          </Badge>
                          <h3 className="mb-1" style={{ color: '#1A1A1A' }}>{hotline.contact}</h3>
                          <p className="text-sm text-gray-600">{hotline.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <a href={`tel:${hotline.phone.replace(/\s/g, '')}`} className="flex-1">
                          <Button 
                            className="w-full rounded-full"
                            style={{ 
                              background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                              boxShadow: '0 2px 8px rgba(0, 72, 255, 0.2)'
                            }}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            {lang.callNow}: {hotline.phone}
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Emergency Note */}
            <Card className="p-4" style={{ backgroundColor: '#FFF4E5', borderColor: '#FFB020' }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FFB020' }} />
                <p className="text-sm" style={{ color: '#1A1A1A' }}>
                  <strong>{selectedLanguage === 'en' ? 'In case of emergency' : selectedLanguage === 'twi' ? 'Adesua tebea mu' : selectedLanguage === 'ewe' ? 'Le xaxa nɔnɔme me' : 'Lɛ nshɔŋŋ ni'}:</strong>{' '}
                  {selectedLanguage === 'en' 
                    ? 'Always call emergency services (191 for Police, 193 for Ambulance) if you are in immediate danger.'
                    : selectedLanguage === 'twi'
                    ? 'Frɛ adesua dwumadie (191 ma Polisifo, 193 ma Ayaresabea kar) bere nyinaa sɛ wowɔ asiane mu seesei ara.'
                    : selectedLanguage === 'ewe'
                    ? 'Yɔ xaxa dɔwɔnawo (191 na Kpovitɔwo, 193 na Lãmesɛkara) ɣesiaɣi ne èle asitsoƒe enumake.'
                    : 'Yɛɔ nshɔŋŋ wulumiɛi (191 lɛ Police, 193 lɛ Ayɔyɔ kar) shɛ wɔ jie lɛ nshɔŋŋ mu fɛɛ.'
                  }
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Find Clinics Tab */}
          <TabsContent value="clinics" className="space-y-4">
            {/* Use the enhanced ReferralSection component */}
            <ReferralSection selectedLanguage={selectedLanguage} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}