import { MapPin, Phone, Clock, Navigation, Locate, Loader2, Star, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface ReferralSectionProps {
  selectedLanguage: string;
}

interface Center {
  id: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Clinic {
  id: number;
  name: string;
  type: string;
  services: string[];
  centers: Center[];
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface CenterWithDistance extends Center {
  clinicName: string;
  clinicType: string;
  services: string[];
  distance?: number;
}

export function ReferralSection({ selectedLanguage }: ReferralSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [expandedClinics, setExpandedClinics] = useState<number[]>([]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Request user's location
  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied. Please enable location access.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        setLocationError(errorMessage);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const content = {
    en: {
      title: "Find Youth-Friendly Clinics",
      searchPlaceholder: "Search by location...",
      filterAll: "All",
      filterClinic: "Clinics",
      filterPharmacy: "Pharmacies",
      callNow: "Call",
      getDirections: "Directions",
      services: "Services",
      centers: "Centers",
      locationBtn: "Find Nearest",
      locationLoading: "Locating...",
      nearest: "Nearest",
      showCenters: "Show all centers",
      hideCenters: "Hide centers",
      clinics: [
        {
          id: 1,
          name: "PPAG Youth Clinics",
          type: "Clinic",
          services: ["Contraceptive counseling", "STI testing", "Pregnancy counseling", "Youth services"],
          centers: [
            {
              id: "ppag-accra",
              address: "Asylum Down, Accra",
              phone: "0302-219-038",
              hours: "Mon-Fri: 8am-5pm, Sat: 9am-2pm",
              coordinates: { lat: 5.5717, lng: -0.2057 }
            },
            {
              id: "ppag-kumasi",
              address: "Adum, Kumasi",
              phone: "0322-022-692",
              hours: "Mon-Fri: 8am-5pm, Sat: 9am-2pm",
              coordinates: { lat: 6.6885, lng: -1.6244 }
            },
            {
              id: "ppag-tamale",
              address: "Central Tamale",
              phone: "0372-022-309",
              hours: "Mon-Fri: 8am-5pm",
              coordinates: { lat: 9.4034, lng: -0.8393 }
            },
            {
              id: "ppag-tema",
              address: "Community 1, Tema",
              phone: "0303-206-270",
              hours: "Mon-Fri: 8am-5pm, Sat: 9am-2pm",
              coordinates: { lat: 5.6698, lng: -0.0166 }
            }
          ]
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Clinic",
          services: ["Contraception", "STI testing", "Safe abortion", "Family planning"],
          centers: [
            {
              id: "ms-accra-central",
              address: "Adabraka, Accra",
              phone: "0302-234-040",
              hours: "Mon-Sat: 8am-6pm",
              coordinates: { lat: 5.5680, lng: -0.2012 }
            },
            {
              id: "ms-tema",
              address: "Community 4, Tema",
              phone: "0303-211-966",
              hours: "Mon-Sat: 8am-6pm",
              coordinates: { lat: 5.6393, lng: -0.0061 }
            },
            {
              id: "ms-kumasi",
              address: "Bantama, Kumasi",
              phone: "0322-035-188",
              hours: "Mon-Sat: 8am-6pm",
              coordinates: { lat: 6.7075, lng: -1.6317 }
            }
          ]
        },
        {
          id: 3,
          name: "Ridge Hospital Family Planning",
          type: "Clinic",
          services: ["Contraception", "STI testing", "Maternal Health", "Prenatal care"],
          centers: [
            {
              id: "ridge-main",
              address: "Ridge, Accra",
              phone: "+233 30 222 1234",
              hours: "Mon-Fri: 7am-4pm",
              coordinates: { lat: 5.5600, lng: -0.1970 }
            }
          ]
        },
        {
          id: 4,
          name: "Korle Bu Teaching Hospital",
          type: "Clinic",
          services: ["Comprehensive SRHR services", "STI clinic", "Family planning", "Reproductive health"],
          centers: [
            {
              id: "korlebu-main",
              address: "Korle Bu, Accra",
              phone: "0302-674-059",
              hours: "Mon-Fri: 8am-5pm",
              coordinates: { lat: 5.5364, lng: -0.2257 }
            }
          ]
        },
        {
          id: 5,
          name: "37 Military Hospital",
          type: "Clinic",
          services: ["Family planning", "STI services", "Youth counseling", "Contraception"],
          centers: [
            {
              id: "37mh-main",
              address: "37, Accra",
              phone: "0302-776-111",
              hours: "Mon-Fri: 7am-5pm",
              coordinates: { lat: 5.5952, lng: -0.1753 }
            }
          ]
        }
      ]
    },
    twi: {
      title: "Hwehwɛ Mmabunu Ayaresabea",
      searchPlaceholder: "Hwehwɛ beae...",
      filterAll: "Nyinaa",
      filterClinic: "Ayaresabea",
      filterPharmacy: "Adurutoɔ",
      callNow: "Frɛ",
      getDirections: "Ɔkwan",
      services: "Dwumadie",
      centers: "Mmeae",
      locationBtn: "Hwehwɛ Nea Ɛbɛn",
      locationLoading: "Yɛrehwehwɛ...",
      nearest: "Ɛbɛn paa",
      showCenters: "Kyerɛ mmeae nyinaa",
      hideCenters: "Fa mmeae sie",
      clinics: [
        {
          id: 1,
          name: "PPAG Mmabunu Ayaresabea",
          type: "Ayaresabea",
          services: ["Awo si ano afotusoɔ", "Yadeɛ hwehwɛmu", "Nyinsɛn afotusoɔ", "Mmabunu dwumadie"],
          centers: [
            {
              id: "ppag-accra",
              address: "Asylum Down, Nkran",
              phone: "0302-219-038",
              hours: "Dwoada-Fiada: 8am-5pm, Memeneda: 9am-2pm",
              coordinates: { lat: 5.5717, lng: -0.2057 }
            },
            {
              id: "ppag-kumasi",
              address: "Adum, Kumase",
              phone: "0322-022-692",
              hours: "Dwoada-Fiada: 8am-5pm, Memeneda: 9am-2pm",
              coordinates: { lat: 6.6885, lng: -1.6244 }
            },
            {
              id: "ppag-tamale",
              address: "Tamale Mfimfini",
              phone: "0372-022-309",
              hours: "Dwoada-Fiada: 8am-5pm",
              coordinates: { lat: 9.4034, lng: -0.8393 }
            },
            {
              id: "ppag-tema",
              address: "Community 1, Tema",
              phone: "0303-206-270",
              hours: "Dwoada-Fiada: 8am-5pm, Memeneda: 9am-2pm",
              coordinates: { lat: 5.6698, lng: -0.0166 }
            }
          ]
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Ayaresabea",
          services: ["Awo si ano", "Yadeɛ hwehwɛmu", "Nyinsɛn yi ɔho tew", "Abusua nhyehyɛɛ"],
          centers: [
            {
              id: "ms-accra-central",
              address: "Adabraka, Nkran",
              phone: "0302-234-040",
              hours: "Dwoada-Memeneda: 8am-6pm",
              coordinates: { lat: 5.5680, lng: -0.2012 }
            },
            {
              id: "ms-tema",
              address: "Community 4, Tema",
              phone: "0303-211-966",
              hours: "Dwoada-Memeneda: 8am-6pm",
              coordinates: { lat: 5.6393, lng: -0.0061 }
            },
            {
              id: "ms-kumasi",
              address: "Bantama, Kumase",
              phone: "0322-035-188",
              hours: "Dwoada-Memeneda: 8am-6pm",
              coordinates: { lat: 6.7075, lng: -1.6317 }
            }
          ]
        },
        {
          id: 3,
          name: "Ridge Ayaresabea Abusua Nhyehyɛɛ",
          type: "Ayaresabea",
          services: ["Awo si ano", "Yadeɛ hwehwɛmu", "Ɛnanom akwahosan", "Nyinsɛn mu hwɛ"],
          centers: [
            {
              id: "ridge-main",
              address: "Ridge, Nkran",
              phone: "+233 30 222 1234",
              hours: "Dwoada-Fiada: 7am-4pm",
              coordinates: { lat: 5.5600, lng: -0.1970 }
            }
          ]
        },
        {
          id: 4,
          name: "Korle Bu Nkyerɛkyerɛ Ayaresabea",
          type: "Ayaresabea",
          services: ["SRHR dwumadie nyinaa", "Yadeɛ ayaresabea", "Abusua nhyehyɛɛ", "Awo akwahosan"],
          centers: [
            {
              id: "korlebu-main",
              address: "Korle Bu, Nkran",
              phone: "0302-674-059",
              hours: "Dwoada-Fiada: 8am-5pm",
              coordinates: { lat: 5.5364, lng: -0.2257 }
            }
          ]
        },
        {
          id: 5,
          name: "37 Asraadɔm Ayaresabea",
          type: "Ayaresabea",
          services: ["Abusua nhyehyɛɛ", "Yadeɛ dwumadie", "Mmabunu afotusoɔ", "Awo si ano"],
          centers: [
            {
              id: "37mh-main",
              address: "37, Nkran",
              phone: "0302-776-111",
              hours: "Dwoada-Fiada: 7am-5pm",
              coordinates: { lat: 5.5952, lng: -0.1753 }
            }
          ]
        }
      ]
    },
    ewe: {
      title: "Di Sɔhɛwo Kliniko",
      searchPlaceholder: "Di le teƒe nu...",
      filterAll: "Ɖesiaɖe",
      filterClinic: "Kɔdaƒewo",
      filterPharmacy: "Atikewɔƒewo",
      callNow: "Yɔ",
      getDirections: "Mɔ",
      services: "Dɔwɔnawo",
      centers: "Teƒewo",
      locationBtn: "Di Teƒe si te ɖe ŋuwò",
      locationLoading: "Míele didiм...",
      nearest: "Ete ɖe ŋuwò",
      showCenters: "Fia teƒeawo katã",
      hideCenters: "Ɣla teƒewo",
      clinics: [
        {
          id: 1,
          name: "PPAG Sɔhɛwo Kliniko",
          type: "Kɔdaƒe",
          services: ["Fuvɔvɔ aɖaŋuɖoɖo", "Dɔléle dodokpɔ", "Fufɔfɔ aɖaŋuɖoɖo", "Sɔhɛwo dɔwɔnawo"],
          centers: [
            {
              id: "ppag-accra",
              address: "Asylum Down, Accra",
              phone: "0302-219-038",
              hours: "Dzo-Fiɖa: 8am-5pm, Memleɖa: 9am-2pm",
              coordinates: { lat: 5.5717, lng: -0.2057 }
            },
            {
              id: "ppag-kumasi",
              address: "Adum, Kumasi",
              phone: "0322-022-692",
              hours: "Dzo-Fiɖa: 8am-5pm, Memleɖa: 9am-2pm",
              coordinates: { lat: 6.6885, lng: -1.6244 }
            },
            {
              id: "ppag-tamale",
              address: "Tamale Titina",
              phone: "0372-022-309",
              hours: "Dzo-Fiɖa: 8am-5pm",
              coordinates: { lat: 9.4034, lng: -0.8393 }
            },
            {
              id: "ppag-tema",
              address: "Community 1, Tema",
              phone: "0303-206-270",
              hours: "Dzo-Fiɖa: 8am-5pm, Memleɖa: 9am-2pm",
              coordinates: { lat: 5.6698, lng: -0.0166 }
            }
          ]
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Kɔdaƒe",
          services: ["Fuvɔvɔ", "Dɔléle dodokpɔ", "Fu ɖeɖe si li ŋu", "Ƒome ɖoɖo"],
          centers: [
            {
              id: "ms-accra-central",
              address: "Adabraka, Accra",
              phone: "0302-234-040",
              hours: "Dzo-Memleɖa: 8am-6pm",
              coordinates: { lat: 5.5680, lng: -0.2012 }
            },
            {
              id: "ms-tema",
              address: "Community 4, Tema",
              phone: "0303-211-966",
              hours: "Dzo-Memleɖa: 8am-6pm",
              coordinates: { lat: 5.6393, lng: -0.0061 }
            },
            {
              id: "ms-kumasi",
              address: "Bantama, Kumasi",
              phone: "0322-035-188",
              hours: "Dzo-Memleɖa: 8am-6pm",
              coordinates: { lat: 6.7075, lng: -1.6317 }
            }
          ]
        },
        {
          id: 3,
          name: "Ridge Kɔdaƒe Ƒome Ðoɖo",
          type: "Kɔdaƒe",
          services: ["Fuvɔvɔ", "Dɔléle dodokpɔ", "Funɔwo ƒe lãmesɛ", "Funɔ me kpɔkplɔ"],
          centers: [
            {
              id: "ridge-main",
              address: "Ridge, Accra",
              phone: "+233 30 222 1234",
              hours: "Dzo-Fiɖa: 7am-4pm",
              coordinates: { lat: 5.5600, lng: -0.1970 }
            }
          ]
        },
        {
          id: 4,
          name: "Korle Bu Nufiame Kɔdaƒe",
          type: "Kɔdaƒe",
          services: ["SRHR dɔwɔna blibowo", "Dɔléle kɔdaƒe", "Ƒome ɖoɖo", "Dzidzime lãmesɛ"],
          centers: [
            {
              id: "korlebu-main",
              address: "Korle Bu, Accra",
              phone: "0302-674-059",
              hours: "Dzo-Fiɖa: 8am-5pm",
              coordinates: { lat: 5.5364, lng: -0.2257 }
            }
          ]
        },
        {
          id: 5,
          name: "37 Asrafo Kɔdaƒe",
          type: "Kɔdaƒe",
          services: ["Ƒome ɖoɖo", "Dɔléle dɔwɔnawo", "Sɔhɛwo aɖaŋuɖoɖo", "Fuvɔvɔ"],
          centers: [
            {
              id: "37mh-main",
              address: "37, Accra",
              phone: "0302-776-111",
              hours: "Dzo-Fiɖa: 7am-5pm",
              coordinates: { lat: 5.5952, lng: -0.1753 }
            }
          ]
        }
      ]
    },
    ga: {
      title: "Shi Shitsɔɔmɔi Kliniko",
      searchPlaceholder: "Shi hi teŋŋ...",
      filterAll: "Kome",
      filterClinic: "Kɔdaji",
      filterPharmacy: "Atikewɔji",
      callNow: "Yɔɔ",
      getDirections: "Sane",
      services: "Shishi",
      centers: "Teŋi",
      locationBtn: "Shi he bo yo",
      locationLoading: "Ye le shi...",
      nearest: "He le yo",
      showCenters: "Yo teŋŋ kome",
      hideCenters: "Kpa teŋŋ",
      clinics: [
        {
          id: 1,
          name: "PPAG Shitsɔɔmɔi Kliniko",
          type: "Kɔdaji",
          services: ["Vidzidzi huŋɔ", "Yadeɛ shi", "Afɔ huŋɔ", "Shitsɔɔmɔi shishi"],
          centers: [
            {
              id: "ppag-accra",
              address: "Asylum Down, Gaa",
              phone: "0302-219-038",
              hours: "Dzu-Fii: 8am-5pm, Hoo: 9am-2pm",
              coordinates: { lat: 5.5717, lng: -0.2057 }
            },
            {
              id: "ppag-kumasi",
              address: "Adum, Kumasi",
              phone: "0322-022-692",
              hours: "Dzu-Fii: 8am-5pm, Hoo: 9am-2pm",
              coordinates: { lat: 6.6885, lng: -1.6244 }
            },
            {
              id: "ppag-tamale",
              address: "Tamale Mli",
              phone: "0372-022-309",
              hours: "Dzu-Fii: 8am-5pm",
              coordinates: { lat: 9.4034, lng: -0.8393 }
            },
            {
              id: "ppag-tema",
              address: "Community 1, Tema",
              phone: "0303-206-270",
              hours: "Dzu-Fii: 8am-5pm, Hoo: 9am-2pm",
              coordinates: { lat: 5.6698, lng: -0.0166 }
            }
          ]
        },
        {
          id: 2,
          name: "Marie Stopes Ghana",
          type: "Kɔdaji",
          services: ["Vidzidzi", "Yadeɛ shi", "Afɔ kpakpa", "Dɔŋ hyɛhyɛ"],
          centers: [
            {
              id: "ms-accra-central",
              address: "Adabraka, Gaa",
              phone: "0302-234-040",
              hours: "Dzu-Hoo: 8am-6pm",
              coordinates: { lat: 5.5680, lng: -0.2012 }
            },
            {
              id: "ms-tema",
              address: "Community 4, Tema",
              phone: "0303-211-966",
              hours: "Dzu-Hoo: 8am-6pm",
              coordinates: { lat: 5.6393, lng: -0.0061 }
            },
            {
              id: "ms-kumasi",
              address: "Bantama, Kumasi",
              phone: "0322-035-188",
              hours: "Dzu-Hoo: 8am-6pm",
              coordinates: { lat: 6.7075, lng: -1.6317 }
            }
          ]
        },
        {
          id: 3,
          name: "Ridge Kɔdaji Dɔŋ Hyɛhyɛ",
          type: "Kɔdaji",
          services: ["Vidzidzi", "Yadeɛ shi", "Maamɛi atɔɔ", "Afɔ kwɛ hwɛ"],
          centers: [
            {
              id: "ridge-main",
              address: "Ridge, Gaa",
              phone: "+233 30 222 1234",
              hours: "Dzu-Fii: 7am-4pm",
              coordinates: { lat: 5.5600, lng: -0.1970 }
            }
          ]
        },
        {
          id: 4,
          name: "Korle Bu Kaŋkaŋ Kɔdaji",
          type: "Kɔdaji",
          services: ["SRHR shishi kome", "Yadeɛ kɔdaji", "Dɔŋ hyɛhyɛ", "Viviŋŋ atɔɔ"],
          centers: [
            {
              id: "korlebu-main",
              address: "Korle Bu, Gaa",
              phone: "0302-674-059",
              hours: "Dzu-Fii: 8am-5pm",
              coordinates: { lat: 5.5364, lng: -0.2257 }
            }
          ]
        },
        {
          id: 5,
          name: "37 Asafo Kɔdaji",
          type: "Kɔdaji",
          services: ["Dɔŋ hyɛhyɛ", "Yadeɛ shishi", "Shitsɔɔmɔi huŋɔ", "Vidzidzi"],
          centers: [
            {
              id: "37mh-main",
              address: "37, Gaa",
              phone: "0302-776-111",
              hours: "Dzu-Fii: 7am-5pm",
              coordinates: { lat: 5.5952, lng: -0.1753 }
            }
          ]
        }
      ]
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  // Get all centers with distances
  const getAllCentersWithDistances = (): CenterWithDistance[] => {
    const allCenters: CenterWithDistance[] = [];
    
    lang.clinics.forEach((clinic) => {
      clinic.centers.forEach((center) => {
        const centerWithDistance: CenterWithDistance = {
          ...center,
          clinicName: clinic.name,
          clinicType: clinic.type,
          services: clinic.services,
        };

        if (userLocation) {
          centerWithDistance.distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            center.coordinates.lat,
            center.coordinates.lng
          );
        }

        allCenters.push(centerWithDistance);
      });
    });

    // Sort by distance if user location is available
    if (userLocation) {
      allCenters.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return allCenters;
  };

  const allCenters = getAllCentersWithDistances();
  const nearestCenter = allCenters.length > 0 && userLocation ? allCenters[0] : null;

  // Filter clinics
  const filteredClinics = lang.clinics.filter(clinic => {
    const matchesType = selectedType === "all" || 
      clinic.type === (selectedType === "clinic" ? 
        (selectedLanguage === "en" ? "Clinic" : 
         selectedLanguage === "twi" ? "Ayaresabea" : 
         selectedLanguage === "ga" ? "Kɔdaji" : "Kɔdaƒe") : 
        (selectedLanguage === "en" ? "Pharmacy" : 
         selectedLanguage === "twi" ? "Adurutoɔ" : 
         selectedLanguage === "ga" ? "Atikewɔji" : "Atikewɔƒe"));
    
    const matchesSearch = searchQuery === "" || 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.centers.some(center => center.address.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const toggleClinic = (clinicId: number) => {
    setExpandedClinics(prev => 
      prev.includes(clinicId) 
        ? prev.filter(id => id !== clinicId)
        : [...prev, clinicId]
    );
  };

  const getDirectionsUrl = (center: Center) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${center.coordinates.lat},${center.coordinates.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${center.coordinates.lat},${center.coordinates.lng}`;
  };

  return (
    <div className="space-y-4">
      {/* Location Button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 rounded-full"
          style={{ borderColor: '#0048ff', color: '#0048ff' }}
          onClick={requestLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {lang.locationLoading}
            </>
          ) : (
            <>
              <Locate className="w-4 h-4 mr-2" />
              {lang.locationBtn}
            </>
          )}
        </Button>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          {locationError}
        </div>
      )}

      {/* Nearest Center Highlight */}
      {nearestCenter && (
        <Card className="p-4 border-2" style={{ borderColor: '#0048ff' }}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" style={{ color: '#0048ff', fill: '#0048ff' }} />
            <Badge style={{ backgroundColor: '#0048ff' }} className="rounded-full">
              {lang.nearest}
            </Badge>
            <span className="text-sm" style={{ color: '#0048ff' }}>
              {nearestCenter.distance} km
            </span>
          </div>
          <h3 className="mb-1" style={{ color: '#0048ff' }}>{nearestCenter.clinicName}</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{nearestCenter.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{nearestCenter.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{nearestCenter.hours}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-full"
              style={{ borderColor: '#10b981', color: '#10b981' }}
              onClick={() => window.open(`tel:${nearestCenter.phone}`, '_self')}
            >
              <Phone className="w-4 h-4 mr-1" />
              {lang.callNow}
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-full"
              style={{ backgroundColor: '#0048ff' }}
              onClick={() => window.open(getDirectionsUrl(nearestCenter), '_blank', 'noopener,noreferrer')}
            >
              <Navigation className="w-4 h-4 mr-1" />
              {lang.getDirections}
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Input
        placeholder={lang.searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="rounded-full"
      />

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedType === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setSelectedType("all")}
          style={selectedType === "all" ? { backgroundColor: '#0048ff' } : { borderColor: '#0048ff', color: '#0048ff' }}
        >
          {lang.filterAll}
        </Button>
        <Button
          variant={selectedType === "clinic" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setSelectedType("clinic")}
          style={selectedType === "clinic" ? { backgroundColor: '#0048ff' } : { borderColor: '#0048ff', color: '#0048ff' }}
        >
          {lang.filterClinic}
        </Button>
      </div>

      {/* Clinics List */}
      <div className="space-y-3">
        {filteredClinics.map((clinic) => {
          const isExpanded = expandedClinics.includes(clinic.id);
          const hasMultipleCenters = clinic.centers.length > 1;
          
          return (
            <Card key={clinic.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="mb-1" style={{ color: '#0048ff' }}>{clinic.name}</h3>
                  <div className="flex gap-2 items-center flex-wrap">
                    <Badge 
                      variant="outline" 
                      className="rounded-full"
                      style={{ borderColor: '#ff7b6e', color: '#ff7b6e' }}
                    >
                      {clinic.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {clinic.centers.length} {lang.centers}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mb-3">
                <p className="text-sm mb-2" style={{ color: '#0048ff' }}>{lang.services}:</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.slice(0, 3).map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {clinic.services.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{clinic.services.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Show first center by default */}
              <div className="border-t pt-3 space-y-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{clinic.centers[0].address}</span>
                    {userLocation && (
                      <span className="ml-auto text-xs" style={{ color: '#0048ff' }}>
                        {calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          clinic.centers[0].coordinates.lat,
                          clinic.centers[0].coordinates.lng
                        )} km
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{clinic.centers[0].phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{clinic.centers[0].hours}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-full"
                    style={{ borderColor: '#10b981', color: '#10b981' }}
                    onClick={() => window.open(`tel:${clinic.centers[0].phone}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {lang.callNow}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-full"
                    style={{ backgroundColor: '#0048ff' }}
                    onClick={() => window.open(getDirectionsUrl(clinic.centers[0]), '_blank', 'noopener,noreferrer')}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    {lang.getDirections}
                  </Button>
                </div>
              </div>

              {/* Expandable other centers */}
              {hasMultipleCenters && (
                <Collapsible open={isExpanded} onOpenChange={() => toggleClinic(clinic.id)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 rounded-full"
                      style={{ color: '#0048ff' }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          {lang.hideCenters}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          {lang.showCenters} ({clinic.centers.length - 1} more)
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3">
                    {clinic.centers.slice(1).map((center) => (
                      <div key={center.id} className="border-t pt-3 space-y-3">
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{center.address}</span>
                            {userLocation && (
                              <span className="ml-auto text-xs" style={{ color: '#0048ff' }}>
                                {calculateDistance(
                                  userLocation.lat,
                                  userLocation.lng,
                                  center.coordinates.lat,
                                  center.coordinates.lng
                                )} km
                              </span>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{center.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{center.hours}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full"
                            style={{ borderColor: '#10b981', color: '#10b981' }}
                            onClick={() => window.open(`tel:${center.phone}`, '_self')}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {lang.callNow}
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 rounded-full"
                            style={{ backgroundColor: '#0048ff' }}
                            onClick={() => window.open(getDirectionsUrl(center), '_blank', 'noopener,noreferrer')}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            {lang.getDirections}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}