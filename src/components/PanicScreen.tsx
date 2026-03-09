import { useState } from "react";
import { Button } from "./ui/button";
import { Delete } from "lucide-react";

interface PanicScreenProps {
  onExit: () => void;
}

export function PanicScreen({ onExit }: PanicScreenProps) {
  const [display, setDisplay] = useState("0");
  const [showReturn, setShowReturn] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(display === "0" ? num : display + num);
    // Show return button after 3 seconds of inactivity
    setTimeout(() => setShowReturn(true), 3000);
  };

  const handleOperator = (op: string) => {
    setDisplay(display + " " + op + " ");
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleDelete = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const handleEquals = () => {
    try {
      const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "C", action: handleClear, className: "bg-gray-300 text-gray-800" },
    { label: "⌫", action: handleDelete, className: "bg-gray-300 text-gray-800" },
    { label: "÷", action: () => handleOperator("÷"), className: "bg-orange-400 text-white" },
    { label: "×", action: () => handleOperator("×"), className: "bg-orange-400 text-white" },
    { label: "7", action: () => handleNumber("7"), className: "bg-white" },
    { label: "8", action: () => handleNumber("8"), className: "bg-white" },
    { label: "9", action: () => handleNumber("9"), className: "bg-white" },
    { label: "-", action: () => handleOperator("-"), className: "bg-orange-400 text-white" },
    { label: "4", action: () => handleNumber("4"), className: "bg-white" },
    { label: "5", action: () => handleNumber("5"), className: "bg-white" },
    { label: "6", action: () => handleNumber("6"), className: "bg-white" },
    { label: "+", action: () => handleOperator("+"), className: "bg-orange-400 text-white" },
    { label: "1", action: () => handleNumber("1"), className: "bg-white" },
    { label: "2", action: () => handleNumber("2"), className: "bg-white" },
    { label: "3", action: () => handleNumber("3"), className: "bg-white" },
    { label: "=", action: handleEquals, className: "bg-orange-500 text-white row-span-2" },
    { label: "0", action: () => handleNumber("0"), className: "bg-white col-span-2" },
    { label: ".", action: () => handleNumber("."), className: "bg-white" },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col" style={{ backgroundColor: '#1F2937' }}>
      <div className="flex-1 flex flex-col">
        {/* Calculator */}
        <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
          {/* Display - 40% of screen */}
          <div className="bg-gray-900 text-right flex items-center justify-end" style={{ height: '40%' }}>
            <div className="w-full p-8">
              <div className="text-5xl md:text-6xl text-white break-all flex items-center justify-end">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons - 60% of screen */}
          <div className="bg-gray-800" style={{ height: '60%' }}>
            <div className="h-full grid grid-cols-4 gap-2 p-6">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.action}
                  className={`${btn.className} rounded-2xl text-2xl md:text-3xl font-semibold shadow-sm hover:opacity-90 transition-opacity active:scale-95 flex items-center justify-center ${
                    btn.label === "=" ? "row-span-2" : ""
                  } ${
                    btn.label === "0" ? "col-span-2" : ""
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Return to Room 1221 - Hidden button */}
        {showReturn && (
          <button
            onClick={onExit}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 py-3 px-6 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-colors bg-gray-800/50"
            onMouseEnter={() => setShowReturn(true)}
          >
            Return to Room 1221
          </button>
        )}

        {/* Always show if you hold the display for 2 seconds */}
        <div
          onTouchStart={() => {
            setTimeout(() => setShowReturn(true), 2000);
          }}
          onClick={() => {
            // Triple click the display to show return button
            const clicks = parseInt(sessionStorage.getItem('panic_clicks') || '0');
            sessionStorage.setItem('panic_clicks', (clicks + 1).toString());
            if (clicks >= 2) {
              setShowReturn(true);
              sessionStorage.setItem('panic_clicks', '0');
            }
            setTimeout(() => sessionStorage.setItem('panic_clicks', '0'), 1000);
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-sm font-medium text-gray-800 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
        >
          {!showReturn && "Tap display 3 times to return"}
        </div>
      </div>
    </div>
  );
}