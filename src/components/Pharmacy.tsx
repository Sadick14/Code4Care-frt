import { useMemo, useState } from "react";
import { Clock, MapPin, Navigation, Phone, Pill } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useTranslation } from "react-i18next";
import { DKTProducts } from "./DKTProductsDropdown";

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
  const [selectedCity, setSelectedCity] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearby, setNearby] = useState<Array<PharmacyLocation & { distanceKm: number }>>([]);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // No hardcoded locations: use user's location to open Google Maps searches
  const cities: string[] = [];
  const filteredLocations: PharmacyLocation[] = [];

  // Common regions (Ghana-focused list — adjust if you want different regions)
  const regions = [
    "Greater Accra",
    "Ashanti",
    "Eastern",
    "Volta",
    "Central",
    "Western",
    "Northern",
    "Upper East",
    "Upper West",
    "Bono",
    "Ahafo",
    "Oti",
  ];

  const openRegion = (region: string) => {
    setLocationError(null);
    if (!navigator.geolocation) {
      // fallback: search by region only
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("pharmacies in " + region)}`;
      window.open(url, "_blank");
      return;
    }

    const mapWindow = window.open("", "_blank");
    if (!mapWindow) {
      setLocationError("Unable to open a new window. Please allow popups for this site.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setLocating(false);

        // Use Maps search with query and center coordinates as a hint
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          "pharmacies in " + region
        )}&center=${lat},${lng}`;
        try {
          mapWindow.location.href = url;
        } catch (e) {
          window.open(url, "_blank");
        }
      },
      (err) => {
        setLocating(false);
        if (mapWindow && !mapWindow.closed) mapWindow.close();
        // Fallback: open region-only search
        const fallback = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("pharmacies in " + region)}`;
        window.open(fallback, "_blank");
        if (err.code === 1) setLocationError("Location permission denied.");
        else if (err.code === 3) setLocationError("Location request timed out.");
        else setLocationError("Unable to retrieve location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const findNearby = (radius?: number) => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    // Open a blank window immediately to preserve the user gesture
    const mapWindow = window.open("", "_blank");
    if (!mapWindow) {
      setLocationError("Unable to open a new window. Please allow popups for this site.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setLocating(false);

        // Navigate the previously opened window to Google Maps search centered on user's location
        const url = `https://www.google.com/maps/search/pharmacies+near+${lat},${lng}`;
        try {
          mapWindow.location.href = url;
        } catch (e) {
          // Fallback: if setting location fails, open in current tab
          window.open(url, "_blank");
        }
      },
      (err) => {
        setLocating(false);
        if (mapWindow && !mapWindow.closed) mapWindow.close();
        if (err.code === 1) setLocationError("Location permission denied.");
        else if (err.code === 3) setLocationError("Location request timed out.");
        else setLocationError("Unable to retrieve location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F8FAFE]">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('pharmacy.title')}</h1>
          <p className="text-gray-500 text-lg">{t('pharmacy.subtitle')}</p>
        </div>

        <Tabs defaultValue="dkt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 mb-6 p-1 bg-slate-100 rounded-2xl h-12 sm:h-14">
            <TabsTrigger
              value="dkt"
              className="rounded-xl data-[state=active]:bg-white text-base sm:text-lg focus-visible:bg-[#0048ff] focus-visible:text-white focus-visible:ring-[#0048ff]/50"
            >
              <Pill className="w-5 h-5 mr-2" />
              DKT Products
            </TabsTrigger>
            <TabsTrigger
              value="locations"
              className="rounded-xl data-[state=active]:bg-white text-base sm:text-lg focus-visible:bg-[#0048ff] focus-visible:text-white focus-visible:ring-[#0048ff]/50"
            >
              <MapPin className="w-5 h-5 mr-2" />
              {t('pharmacy.tabs.locations')}
            </TabsTrigger>
          </TabsList>

          <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={() => findNearby(5)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0048ff] hover:bg-[#003eda] text-white px-4 py-2 text-sm font-semibold w-full sm:w-auto"
            >
              <Navigation className="w-4 h-4" />
              {locating ? 'Finding...' : 'Find Nearby'}
            </button>
            <button
              onClick={() => { setNearby([]); setUserLocation(null); setLocationError(null); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 text-sm w-full sm:w-auto"
            >
              Clear
            </button>
          </div>

          <TabsContent value="dkt" className="outline-none">
            <DKTProducts />
          </TabsContent>

          <TabsContent value="locations" className="outline-none">
            <Card className="p-5 sm:p-6 rounded-2xl border-[#D8E7FF] mb-6 text-center">
              <h3 className="font-semibold text-[#173A7C] mb-2">Find nearby pharmacies & clinics</h3>
              <p className="text-sm text-[#4D6BA6] mb-4">Tap the button to allow location access and view nearby pharmacies in Google Maps.</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                <button
                  onClick={() => findNearby()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0048ff] hover:bg-[#003eda] text-white px-4 py-2 text-sm font-semibold w-full sm:w-auto"
                >
                  <Navigation className="w-4 h-4" />
                  {locating ? 'Finding...' : 'Open Google Maps Nearby'}
                </button>
                <button
                  onClick={() => { setLocationError(null); setLocating(false); setUserLocation(null); }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 text-sm w-full sm:w-auto"
                >
                  Clear
                </button>
              </div>
              {locationError && <p className="text-sm text-red-600 mt-3">{locationError}</p>}
            </Card>

            <Card className="p-5 rounded-2xl border-[#EAF2FF]">
              <h4 className="font-semibold text-[#173A7C] mb-3">Browse by region</h4>
              <p className="text-sm text-[#4D6BA6] mb-4">Select a region to find nearby pharmacies centered on your location (or search the region if location is denied).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => openRegion(r)}
                    className="text-left rounded-xl border px-3 py-2 text-sm bg-white hover:bg-slate-50"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Card>

             {locationError && (
               <Card className="p-4 mb-4 rounded-2xl border-red-100 bg-red-50">
                 <p className="text-sm text-red-700">{locationError}</p>
               </Card>
             )}

             {nearby.length > 0 && (
               <Card className="p-4 md:p-5 rounded-2xl border-[#D8E7FF] mb-6">
                 <h4 className="font-semibold text-[#173A7C] mb-3">Closest pharmacies & clinics</h4>
                 <div className="space-y-3">
                     {nearby.map((loc) => (
                       <div key={loc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                         <div className="min-w-0">
                           <div className="text-sm font-bold text-[#173A7C]">{loc.name}</div>
                           <div className="text-xs text-[#4D6BA6] truncate">{loc.address} • {loc.city}</div>
                           <div className="text-xs text-[#5F7CB3]">{loc.distanceKm.toFixed(2)} km away</div>
                         </div>
                         <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
                           <a
                             className="text-sm text-white bg-[#0048ff] px-3 py-2 rounded-xl inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                             target="_blank"
                             rel="noreferrer"
                             href={
                               userLocation
                                 ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${loc.lat},${loc.lng}&travelmode=driving`
                                 : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address + ' ' + loc.city)}`
                             }
                           >
                             <Navigation className="w-4 h-4" />
                             Directions
                           </a>
                           <a href={`tel:${loc.phone}`} className="text-sm text-[#0048ff]">Call</a>
                         </div>
                       </div>
                     ))}
                   </div>
               </Card>
             )}

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