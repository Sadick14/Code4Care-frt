import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ProPlanCard() {
  return (
    <Card className="p-6 border-0 shadow-lg overflow-hidden relative transition-all hover:shadow-xl">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(135deg, #00C27A 0%, #00E88F 100%)'
        }}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#00C27A' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A1A' }}>
          Upgrade to Pro
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Unlock advanced features, priority support, and unlimited access to all tools.
        </p>

        <div className="space-y-2 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00C27A' }}></div>
            <span className="text-gray-700">Unlimited conversations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00C27A' }}></div>
            <span className="text-gray-700">Advanced AI models</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#00C27A' }}></div>
            <span className="text-gray-700">Priority support</span>
          </div>
        </div>

        <Button 
          className="w-full rounded-xl group hover:opacity-90 transition-all"
          style={{ backgroundColor: '#00C27A' }}
        >
          <span>Get Pro</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <p className="text-xs text-center text-gray-500 mt-3">
          Starting at $9.99/month
        </p>
      </div>
    </Card>
  );
}
