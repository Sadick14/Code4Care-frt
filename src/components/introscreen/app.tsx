import React from "react";

// Screen images
const screen1Img = "/introscreen/6046367028903349859.jpg";
const screen2Img = "/introscreen/6046367028903349861.jpg";
const screen3Img = "/introscreen/6046367028903349860.jpg";

type LayoutProps = {
  image: string;
  title: React.ReactNode;
  description: string;
  activeIndex: number;
  buttonText: string;
  onNext: () => void;
  onSkip: () => void;
};

function MobileIntroLayout({
  image,
  title,
  description,
  activeIndex,
  buttonText,
  onNext,
  onSkip,
}: LayoutProps) {
  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden fixed inset-0 w-full bg-white flex flex-col overflow-hidden z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Image */}
        <div className="relative h-[48vh] w-full overflow-hidden">
          <img src={image} alt="intro" className="w-full h-full object-cover" />

          <button
            onClick={onSkip}
            className="absolute top-14 right-5 bg-[#5B82FF] text-white px-5 py-3 rounded-2xl font-semibold shadow-md"
          >
            Skip
          </button>

          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none">
            <svg
              viewBox="0 0 1440 120"
              className="w-full h-[90px]"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-8 pt-8 pb-10">
          <h2 className="text-[2rem] font-bold text-center text-[#101828] mb-5">
            {title}
          </h2>

          <p className="text-center text-[#8E8E93] text-lg max-w-sm mb-10">
            {description}
          </p>

          {/* Pagination */}
          <div className="flex gap-2 mb-12">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`rounded-full transition-all ${
                  activeIndex === index
                    ? "w-10 h-2 bg-[#2563FF]"
                    : "w-2 h-2 bg-[#D9D9D9]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNext}
            className="w-full max-w-sm bg-[#2563FF] text-white font-semibold py-4 rounded-full text-lg active:scale-[0.98]"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-center h-screen bg-gray-50 px-3 py-3">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-80 overflow-hidden flex items-center justify-center">
            <img src={image} alt="intro" className="w-full h-full object-cover" />
          </div>

          <div className="px-6 py-8">
            <div className="flex justify-end mb-6">
              <button onClick={onSkip} className="text-sm text-gray-400">
                Skip
              </button>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`rounded-full ${
                    activeIndex === index
                      ? "w-8 h-2 bg-[#155dfc]"
                      : "w-2 h-2 bg-[#d9d9d9]"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>

            <p className="text-center text-gray-500 mb-8">{description}</p>

            <button
              onClick={onNext}
              className="w-full bg-[#155dfc] text-white font-semibold py-3 rounded-xl"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Shared props for screens
type ScreenProps = {
  onNext: () => void;
  onSkip: () => void;
};

// Screens
function Screen1({ onNext, onSkip }: ScreenProps) {
  return (
    <MobileIntroLayout
      image={screen1Img}
      title={
        <>
          Your safe space for <br />
          confidential support
        </>
      }
      description="Experience 100% anonymity with no personal data collected. Your privacy is always our priority."
      activeIndex={0}
      buttonText="Next"
      onNext={onNext}
      onSkip={onSkip}
    />
  );
}

function Screen2({ onNext, onSkip }: ScreenProps) {
  return (
    <MobileIntroLayout
      image={screen2Img}
      title={
        <>
          Access accurate and <br />
          expert guidance
        </>
      }
      description="Skip the rumors and get reliable SRHR information curated from trusted sources."
      activeIndex={1}
      buttonText="Next"
      onNext={onNext}
      onSkip={onSkip}
    />
  );
}

function Screen3({ onNext, onSkip }: ScreenProps) {
  return (
    <MobileIntroLayout
      image={screen3Img}
      title={
        <>
          Designed for the youth <br />
          of Ghana
        </>
      }
      description="Join a community empowering young people with the right health information."
      activeIndex={2}
      buttonText="Get Started"
      onNext={onNext}
      onSkip={onSkip}
    />
  );
}

// Carousel
type Props = {
  onComplete?: () => void;
  onSkip?: () => void;
};

export default function OnboardingCarousel({ onComplete, onSkip }: Props) {
  const [current, setCurrent] = React.useState<number>(0);

  const screens = [
    Screen1,
    Screen2,
    Screen3,
  ];

  const CurrentScreen = screens[current];

  const handleNext = () => {
    if (current >= screens.length - 1) {
      onComplete?.();
      return;
    }
    setCurrent((p) => p + 1);
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return <CurrentScreen onNext={handleNext} onSkip={handleSkip} />;
}