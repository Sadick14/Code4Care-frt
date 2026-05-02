import { MapPin, Phone, Clock, Navigation, Locate, Loader2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

export function ReferralSection() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [expandedClinics, setExpandedClinics] = useState<number[]>([]);

  const clinicsData = t('clinics.list', { returnObjects: true });
  const clinics = Array.isArray(clinicsData) ? clinicsData : [];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false)
    );
  };

  const allCenters = clinics.flatMap(clinic => 
    clinic.centers.map((center: any) => ({
      ...center,
      clinicName: clinic.name,
      clinicType: clinic.type,
      services: clinic.services,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, center.coordinates.lat, center.coordinates.lng) : null
    }))
  ).sort((a, b) => (a.distance || 999) - (b.distance || 999));

  const filteredClinics = clinics.filter(c => 
    (selectedType === "all" || c.type.toLowerCase() === selectedType.toLowerCase()) &&
    (searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.centers.some((dc: any) => dc.address.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input 
            placeholder={t('clinics.search')} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-2xl h-12 pl-12 border-slate-200"
          />
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <Button 
          onClick={requestLocation} 
          disabled={loadingLocation}
          className="rounded-2xl h-12 px-6 bg-white text-blue-600 border border-blue-100 hover:bg-blue-50"
        >
          {loadingLocation ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Locate className="w-5 h-5 mr-2" />}
          {t('clinics.locationBtn')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredClinics.map((clinic) => {
          const isExpanded = expandedClinics.includes(clinic.id);
          return (
            <Card key={clinic.id} className="overflow-hidden border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{clinic.name}</h3>
                    <div className="flex gap-2 mt-2">
                      {clinic.services.map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-slate-50 text-slate-500 font-normal border-none">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Badge className="bg-blue-600 px-3 py-1 rounded-full">{clinic.type}</Badge>
                </div>

                <div className="space-y-3">
                  {clinic.centers.slice(0, isExpanded ? clinic.centers.length : 1).map((center: any) => {
                    const dist = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, center.coordinates.lat, center.coordinates.lng) : null;
                    return (
                      <motion.div 
                        key={center.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                         <div className="flex justify-between items-start mb-3">
                            <div>
                               <p className="font-semibold text-slate-800">{center.address}</p>
                               <p className="text-sm text-slate-500 flex items-center mt-1">
                                  <Clock className="w-3 h-3 mr-1" /> {center.hours}
                               </p>
                            </div>
                            {dist !== null && (
                               <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">
                                  {dist} km away
                               </Badge>
                            )}
                         </div>
                         <div className="flex gap-2">
                            <Button asChild variant="outline" className="flex-1 rounded-xl h-10 border-blue-100 text-blue-600">
                               <a href={`tel:${center.phone}`}><Phone className="w-4 h-4 mr-2" /> Call</a>
                            </Button>
                            <Button asChild className="flex-1 rounded-xl h-10 bg-blue-600">
                               <a href={`https://www.google.com/maps/search/?api=1&query=${center.coordinates.lat},${center.coordinates.lng}`} target="_blank" rel="noreferrer">
                                  <Navigation className="w-4 h-4 mr-2" /> Directions
                               </a>
                            </Button>
                         </div>
                      </motion.div>
                    );
                  })}
                </div>

                {clinic.centers.length > 1 && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-slate-400 hover:text-blue-600"
                    onClick={() => setExpandedClinics(prev => isExpanded ? prev.filter(id => id !== clinic.id) : [...prev, clinic.id])}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                    {isExpanded ? 'Show Less' : `Show ${clinic.centers.length - 1} more locations`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}