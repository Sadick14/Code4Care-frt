import { Phone, Pill, ShoppingBag, MapPin, Clock, AlertCircle, Navigation, Info } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export function Pharmacy() {
  const { t } = useTranslation();

  const medications = t('pharmacy.medications', { returnObjects: true }) as any[];

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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medications.map((med, idx) => (
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
                        <Button className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                           <Phone className="w-4 h-4 mr-2" />
                           {t('pharmacy.callToOrder')}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
             </div>

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
             {/* Map/Location logic can go here or shared with Clinic support */}
             <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                 <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                 <h3 className="text-slate-500 font-medium">{t('pharmacy.locationsPlaceholder', 'Pharmacy location mapping coming soon in Phase 4')}</h3>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}