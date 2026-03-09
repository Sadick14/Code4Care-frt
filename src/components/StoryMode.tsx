import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X, Check, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryModeProps {
  selectedLanguage: string;
  onNavigateToMyths?: () => void;
}

interface Story {
  id: number;
  title: string;
  scenario: string;
  choices: string[];
  correctAnswer: number; // Index of the correct answer
  feedback: string[];
  wrongFeedback: string; // Feedback for wrong answers
}

export function StoryMode({ selectedLanguage, onNavigateToMyths }: StoryModeProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showMythBustersPrompt, setShowMythBustersPrompt] = useState(false);

  const stories = {
    en: [
      {
        id: 1,
        title: "The Party",
        scenario: "Sarah's friend invites her to a party where there will be alcohol. She's worried about peer pressure. What should Sarah do?",
        choices: [
          "Go to the party but stay close to trusted friends",
          "Just go and do what everyone else is doing",
          "Go but have an exit plan if uncomfortable",
          "Talk to a trusted adult first"
        ],
        correctAnswer: 3, // Talk to a trusted adult first
        feedback: [
          "Wrong choice. While having friends around is helpful, it doesn't address the need for guidance about handling peer pressure and alcohol situations. It's always best to talk to a trusted adult first.",
          "Wrong choice. Following what others do can put you in risky situations. You should make informed decisions based on your own safety and values, not peer pressure.",
          "Wrong choice. While having an exit plan shows good thinking, you should seek guidance from a trusted adult before putting yourself in a potentially risky situation.",
          "Correct! Talking to a trusted adult first is the safest choice. They can help you think through the situation, understand the risks, and make an informed decision about whether to attend and how to stay safe."
        ],
        wrongFeedback: "That's not the safest choice. When facing situations involving alcohol and peer pressure, it's always best to talk to a trusted adult first. They can provide valuable guidance and help you make informed decisions about your safety."
      },
      {
        id: 2,
        title: "The Question",
        scenario: "Kwame wants to learn about contraception but feels embarrassed to ask anyone. What's the best approach?",
        choices: [
          "Use a confidential service like Room 1221",
          "Ask friends for advice",
          "Research from reliable health websites",
          "Use multiple reliable sources (Room 1221, healthcare providers, verified websites)"
        ],
        correctAnswer: 3, // All reliable sources
        feedback: [
          "Wrong choice. While Room 1221 is a good resource, relying on only one source may not give you complete information. It's best to use multiple reliable sources.",
          "Wrong choice. Friends may mean well, but they might not have accurate or complete information about contraception. It's important to consult reliable, verified sources.",
          "Wrong choice. While reliable websites are good, using only one type of source may not give you the full picture. It's best to combine multiple reliable sources.",
          "Correct! Using multiple reliable sources like Room 1221, healthcare providers, and verified websites gives you the most accurate and complete information about contraception. This ensures you're well-informed from different trusted perspectives."
        ],
        wrongFeedback: "While that could help, it's not the best approach. For important health information like contraception, you should use multiple reliable sources including confidential services like Room 1221, healthcare providers, and verified websites to get complete and accurate information."
      },
      {
        id: 3,
        title: "The Pressure",
        scenario: "Ama's partner is pressuring her to become sexually active before she feels ready. How should she respond?",
        choices: [
          "Clearly communicate she's not ready",
          "Just go along with it to keep the relationship",
          "Talk to someone she trusts about the situation",
          "Use all healthy approaches: communicate boundaries, take time, and seek support"
        ],
        correctAnswer: 3, // All healthy approaches
        feedback: [
          "Wrong choice. While clear communication is important, it's not enough on its own. You should also seek support from trusted people and take time to think about the relationship. A partner who truly cares will respect all your boundaries.",
          "Wrong choice. Never compromise your boundaries to keep a relationship. Your feelings and readiness matter. A healthy relationship is built on mutual respect, and a good partner will always wait until you're ready.",
          "Wrong choice. While seeking support is important, you also need to clearly communicate your boundaries to your partner. Doing just one thing isn't as effective as combining multiple healthy approaches.",
          "Correct! The best approach is to combine all these strategies: clearly communicate that you're not ready, seek support from people you trust, and give yourself time to think. A respectful partner will understand and wait. If they don't respect your boundaries, that's a red flag about the relationship."
        ],
        wrongFeedback: "That's not the complete answer. When facing pressure in a relationship, you need to do more than just one thing. The healthiest approach is to: clearly communicate you're not ready, talk to someone you trust, and take time to evaluate if this relationship is healthy. Remember, a respectful partner will always wait until you're comfortable."
      }
    ],
    twi: [
      {
        id: 1,
        title: "Apontɔ",
        scenario: "Sarah yɔnko frɛ no kɔ apontɔ bi a nsa wɔ hɔ. Ɔresuro sɛ wɔbɛhyɛ no so. Dɛn na Sarah bɛyɛ?",
        choices: [
          "Kɔ apontɔ no mu na ne nnamfonom a wogye wɔn di ben",
          "Kɔ na yɛ nea obiara yɛ",
          "Kɔ nanso fa ɔkwan bi a ɔbɛfa akɔ",
          "Kasa kyerɛ opanyin bi a ɔgye ne di"
        ],
        correctAnswer: 3,
        feedback: [
          "Paw bɔne. Ɛwom sɛ sɛ nnamfonom wɔ hɔ a ɛboa de, nanso ɛmfa akwankyerɛ a wobɛnya afa nhyɛsoɔ ne nsa ho nka ho. Ɛyɛ sɛ wokasa kyerɛ opanyin bi a wogye ne di kane.",
          "Paw bɔne. Sɛ woyɛ nea afoforo yɛ a, ebetumi de wo akɔ asiane mu. Ɛsɛ sɛ wofa gyinae a egyina wo ho ban ne nea wogye di so, ɛnyɛ nhyɛsoɔ.",
          "Paw bɔne. Ɛwom sɛ ɔkwan a wobɛfa akɔ no yɛ adwene pa de, nanso ɛsɛ sɛ wokɔ opanyin bi a wogye ne di hɔ ansa na woaba asiane mu.",
          "Ɛyɛ! Sɛ wokasa kyerɛ opanyin bi a wogye ne di kane a, ɛyɛ kwan a ɛho tew. Wɔbɛtumi aboa wo adwene ho, ate asiane a ɛwɔ mu ase, na woafa gyinae a ɛfata afa sɛ wobɛkɔ anaa na sɛ wobɛkɔ a, wobɛfa kwan bɛn so."
        ],
        wrongFeedback: "Ɛnyɛ paw a ɛho tew. Sɛ wohyia nsɛm a ɛfa nsa ne nhyɛsoɔ ho a, ɛyɛ sɛ wokasa kyerɛ opanyin bi a wogye ne di kane. Wɔbɛtumi aboa wo afa wo ho ban ho."
      },
      {
        id: 2,
        title: "Nsɛm bi",
        scenario: "Kwame pɛ sɛ ohu nea wɔyɛ de si awo ano nanso ɔfɛre sɛ ɔbɛbisa. Ɔkwan bɛn so na ɛbɛyɛ yiye?",
        choices: [
          "Fa Room 1221 te sɛ kokoam dwumadie",
          "Bisa nnamfonom",
          "Hwehwɛ wɔ akwahosan ho wɛbsaet a wogye di mu",
          "Fa baabi ahorow pii a wogye di (Room 1221, akwahosan ho adwumayɛfo, wɛbsaet)"
        ],
        correctAnswer: 3,
        feedback: [
          "Paw bɔne. Ɛwom sɛ Room 1221 yɛ papa de, nanso sɛ wode baabi biako pɛ di dwuma a, ebia wobenya nsɛm a ɛnyɛ ma. Ɛyɛ sɛ wode baabi ahorow pii a wogye di di dwuma.",
          "Paw bɔne. Nnamfonom betumi apɛ sɛ wɔboa, nanso ebia wonni nsɛm a ɛyɛ pɛpɛɛpɛ. Ɛho hia sɛ wobisa wɔ baabi a wogye di.",
          "Paw bɔne. Ɛwom sɛ wɛbsaet a wogye di yɛ papa de, nanso sɛ wode baabi biako pɛ di dwuma a, ebia wobenya nsɛm a ɛnyɛ ma. Ɛyɛ sɛ wode baabi ahorow pii di dwuma.",
          "Ɛyɛ papa! Sɛ wode baabi ahorow pii a wogye di te sɛ Room 1221, akwahosan ho adwumayɛfo, ne wɛbsaet a wɔahwɛ so di dwuma a, wobenya nsɛm a ɛyɛ pɛpɛɛpɛ ne nea ɛkɔ akyiri."
        ],
        wrongFeedback: "Ɛwom sɛ ɛbɛtumi aboa de, nanso ɛnyɛ kwan pa. Wɔ akwahosan ho nsɛm te sɛ awo si ano ho no, ɛsɛ sɛ wode baabi ahorow pii a wogye di di dwuma."
      },
      {
        id: 3,
        title: "Nhyɛso",
        scenario: "Ama hokafo rehyɛ no so sɛ ɔnto nna nanso ɔmpɛ sɛ ɔyɛ saa seesei. Ɔbɛyɛ dɛn?",
        choices: [
          "Ɔnka ntene sɛ ɔmpɛ",
          "Ɔnye atom na ɔnkora abusuabɔ no so",
          "Ɔnkasa kyerɛ obi a ɔgye ne di",
          "Ɔnyɛ akwan ahorow nyinaa: ka ntene, fa bere, kɔ nnamfonom nkyɛn"
        ],
        correctAnswer: 3,
        feedback: [
          "Paw bɔne. Ɛwom sɛ sɛ woka ntene a ɛho hia de, nanso ɛnyɛ ma. Ɛsɛ nso sɛ wokɔ nnamfonom nkyɛn kɔpɛ mmoa. Hokafo pa bɛtwɛn.",
          "Paw bɔne. Mma wo ahye mmra bere biara. Wo nneɛma ne wo ahye ho hia. Abusuabɔ pa gyina nidi so, na hokafo pa bɛtwɛn kosi sɛ woasiesiee.",
          "Paw bɔne. Ɛwom sɛ mmoa a wubenya no ho hia de, nanso ɛsɛ nso sɛ woka kyerɛ wo hokafo ntene sɛ wompɛ. Sɛ woyɛ biribi biako pɛ a, ɛnyɛ papa sɛ wobɛyɛ nneɛma ahorow pii.",
          "Ɛyɛ papa! Ɔkwan pa ne sɛ wobɛka sɛ wompɛ ntene, kɔ nnamfonom nkyɛn kɔpɛ mmoa, na fa bere dwene ho. Hokafo a ɔbu wo ani no bɛtwɛn. Sɛ ɔmmu wo ahye a, ɛkyerɛ sɛ abusuabɔ no nyɛ papa."
        ],
        wrongFeedback: "Ɛnyɛ mmuae a ɛyɛ ma. Sɛ worehyia nhyɛsoɔ wɔ abusuabɔ mu a, ɛsɛ sɛ woyɛ nneɛma pii: ka kyerɛ hokafo no ntene sɛ wompɛ, kasa kyerɛ obi a wogye ne di, na fa bere hwɛ sɛ abusuabɔ no yɛ papa. Kae sɛ, hokafo a ɔbu wo ani bɛtwɛn."
      }
    ],
    ewe: [
      {
        id: 1,
        title: "Takpekpe",
        scenario: "Sarah xɔlɔ̃ yɔe be wòava takpekpe aɖe si aha le. Etsia vɔ̃ be woabia be wòano nu. Nuka Sarah awɔ?",
        choices: [
          "Yi ɖe takpekpea gake nɔ xɔ̃ siwo dzi wòka ɖo gbɔ",
          "Yi eye nawɔ nu si ame bubuwo le wɔm",
          "Yi gake lé ɖoɖo ɖe asi be yeado go",
          "Ƒo nu kple ame si dzi wòka ɖo gbɔ"
        ],
        correctAnswer: 3,
        feedback: [
          "Tiatia gbegblẽ. Togbɔ be xɔ̃wo le mia gbɔ kpena ɖe ŋu hã la, mekpe ɖe ŋu tso aɖaŋuɖoɖo si nèhiã tso teteɖeanyi kple aha ŋu o. Enyo wu be nàƒo nu kple ame si dzi nèka ɖo gbɔ gbã.",
          "Tiatia gbegblẽ. Ne èwɔ nu si ame bubuwo le wɔm la, ate ŋu atsɔ wò ade fukpekpe me. Ele be nàwɔ wò tiatiawo le wò dedienɔnɔ kple nu si nèxɔ se nu dzi, menye teteɖeanyi o.",
          "Tiatia gbegblẽ. Togbɔ be ɖoɖo si nàwɔ be yeado go fia susu nyui hã la, ele be nàbia ame si dzi nèka ɖo gbɔ aɖaŋu hafi nàtsɔ ɖokuiwò ade fukpekpe me.",
          "Nyuie! Ne èƒo nu kple ame si dzi nèka ɖo gbɔ gbã la, eyae nye mɔnu si me dedienɔnɔ le. Woakpe ɖe ŋuwò nàbu tanya la ŋuti, àse fukpekpe siwo le eme gɔme, eye nàwɔ tiatia nyui tso ale si nàle dedii ŋu."
        ],
        wrongFeedback: "Menye tiatia si me dedienɔnɔ le o. Ne èdo go kple nya siwo ku ɖe aha kple teteɖeanyi ŋuti la, enyo wu be nàƒo nu kple ame si dzi nèka ɖo gbɔ gbã. Woakpe ɖe ŋuwò tso wò dedienɔnɔ ŋu."
      },
      {
        id: 2,
        title: "Nyabiase",
        scenario: "Kwame di be yeanya nu tso fu vɔvɔ ŋuti gake ŋukpe le eme. Aleke wòawɔ?",
        choices: [
          "Zã dɔwɔna ɣaɣla abe Room 1221 ene",
          "Bia xɔ̃wo",
          "Di nuwo le mɔ̃ɖaŋununya nyui teƒewo",
          "Zã teƒe geɖe siwo ŋu kakaɖedzi le (Room 1221, lãmeseseƒolawo, wɛbsaetwo)"
        ],
        correctAnswer: 3,
        feedback: [
          "Tiatia gbegblẽ. Togbɔ be Room 1221 nyo hã la, ne èzã teƒe ɖeka ko la, màte ŋu akpɔ nyatakaka bliboa o. Enyo wu be nàzã teƒe geɖe siwo ŋu kakaɖedzi le.",
          "Tiatia gbegblẽ. Togbɔ be xɔ̃wo di be yeakpe ɖe ŋuwò hã la, ɖewohĩ nyatakaka nyui aɖeke mele wo si o. Ele be nàzã teƒe siwo ŋu kakaɖedzi le.",
          "Tiatia gbegblẽ. Togbɔ be wɛbsaet siwo ŋu kakaɖedzi le nyo hã la, ne èzã teƒe ɖeka pɛ la, màte ŋu akpɔ nyatakaka bliboa o. Enyo wu be nàzã teƒe geɖe.",
          "Nyuie! Ne èzã teƒe geɖe siwo ŋu kakaɖedzi le abe Room 1221, lãmeseseƒolawo, kple wɛbsaet siwo wokpɔ dzi nyuie ene la, àkpɔ nyatakaka si sɔ eye wòde blibo tso teƒe vovovowo."
        ],
        wrongFeedback: "Togbɔ be ate ŋu akpe ɖe ŋuwò hã la, menye mɔ nyuitɔ wònye o. Le lãmesenyatakaka vevi abe fuvɔvɔ ene ta la, ele be nàzã teƒe geɖe siwo ŋu kakaɖedzi le."
      },
      {
        id: 3,
        title: "Teteɖeanyi",
        scenario: "Ama srɔ̃a le bia dzi ɖem be wòade asi ŋutsu kple nyɔnu wɔwɔ me gake medi be yeawɔe fifia o. Aleke wòawɔ?",
        choices: [
          "Negblɔ kɔtɛe be yemedi o",
          "Newɔ nu si srɔ̃a di be yeawɔ be woakpɔ ɖokuiwo",
          "Neƒo nu kple ame si dzi wòka ɖo tso nya la ŋuti",
          "Newɔ mɔnu ɖe sia ɖe: gblɔ liƒowo, xɔ ɣeyiɣi, eye nàdi kpekpeɖeŋu"
        ],
        correctAnswer: 3,
        feedback: [
          "Tiatia gbegblẽ. Togbɔ be nuƒoƒo kɔtɛe le vevie hã la, eme de o ɖeka. Ele be nàdi kpekpeɖeŋu tso amewo si hã, eye nàxɔ ɣeyiɣi abu lɔlɔ̃nu la ŋuti. Srɔ̃ si ƒe dzi me nèle vavã la abu wò liƒowo.",
          "Tiatia gbegblẽ. Mègagblẽ wò liƒowo kpɔ be yeakpɔ lɔlɔ̃nu o. Wò seselelãme kple dzadzraɖo le vevie. Lɔlɔ̃nu nyui tua asi ɖe bubuɖeme dzi, eye srɔ̃ nyui alala va se ɖe esime nèdzra ɖo.",
          "Tiatia gbegblẽ. Togbɔ be kpekpeɖeŋu didi le vevie hã la, ele be nàgblɔ wò liƒowo kɔtɛe na srɔ̃a hã. Ne èwɔ nu ɖeka ko la, menyo wu abe ne èwɔ nu geɖe ene o.",
          "Nyuie! Mɔnu nyuitɔ enye be nàwɔ nu siawo katã: gblɔ kɔtɛe be yemedzra ɖo o, di kpekpeɖeŋu tso amewo si, eye nàxɔ ɣeyiɣi abu lɔlɔ̃nu la ŋuti. Srɔ̃ si bua ŋu na wò la ase egɔme eye wòalala. Ne mebua ŋu na wò liƒowo o la, eyae nye dzesi be lɔlɔ̃nu la menyo o."
        ],
        wrongFeedback: "Menye ŋuɖoɖo bliboa wònye o. Ne èdo go kple teteɖeanyi le lɔlɔ̃nu me la, ele be nàwɔ nu geɖe: gblɔ kɔtɛe be yemedzra ɖo o, ƒo nu kple ame si dzi nèka ɖo, eye nàxɔ ɣeyiɣi abu lɔlɔ̃nu la ŋuti. Ðo ŋku edzi be srɔ̃ si bua ŋu na wò la alala ɣesiaɣi."
      }
    ]
  };

  const langStories = stories[selectedLanguage as keyof typeof stories] || stories.en;
  const currentStory = langStories[currentStoryIndex];

  const headers = {
    en: { title: "Story Mode", subtitle: "Learn through interactive scenarios" },
    twi: { title: "Nsɛm nna", subtitle: "Sua denam nsɛm bi mu" },
    ewe: { title: "Nya ɖiɖi ɖoɖo", subtitle: "Srɔ̃ nu to nya ɖiɖi me" }
  };

  const header = headers[selectedLanguage as keyof typeof headers] || headers.en;

  const nextStory = () => {
    setSelectedChoice(null);
    setShowMythBustersPrompt(false);
    setCurrentStoryIndex((prev) => (prev + 1) % langStories.length);
  };

  const prevStory = () => {
    setSelectedChoice(null);
    setShowMythBustersPrompt(false);
    setCurrentStoryIndex((prev) => (prev - 1 + langStories.length) % langStories.length);
  };

  const handleChoiceSelect = (index: number) => {
    setSelectedChoice(index);
    if (index !== currentStory.correctAnswer) {
      setShowMythBustersPrompt(true);
    } else {
      setShowMythBustersPrompt(false);
    }
  };

  const buttonLabels = {
    en: {
      learnMore: "Learn More in Myth Busters",
      continueReading: "Continue Reading"
    },
    twi: {
      learnMore: "Sua Pii wɔ Nsɛm a Ɛnyɛ Nokware mu",
      continueReading: "Kɔ so kenkan"
    },
    ewe: {
      learnMore: "Srɔ̃ nu geɖe le Alakpatɔwo me",
      continueReading: "Yi ŋgɔ nàxle nu"
    }
  };

  const labels = buttonLabels[selectedLanguage as keyof typeof buttonLabels] || buttonLabels.en;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)' }}>
      <div className="max-w-2xl mx-auto pb-8">
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#0048ff' }}>{header.title}</h1>
          <p className="text-gray-600">{header.subtitle}</p>
        </div>

        <Card className="p-6 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={prevStory}
              variant="outline"
              size="icon"
              className="rounded-full"
              style={{ borderColor: '#0048ff' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#0048ff' }} />
            </Button>
            
            <h2 className="text-center" style={{ color: '#0048ff' }}>{currentStory.title}</h2>
            
            <Button
              onClick={nextStory}
              variant="outline"
              size="icon"
              className="rounded-full"
              style={{ borderColor: '#0048ff' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#0048ff' }} />
            </Button>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {currentStory.scenario}
          </p>

          <div className="space-y-3">
            {currentStory.choices.map((choice, index) => {
              const isSelected = selectedChoice === index;
              const isCorrect = index === currentStory.correctAnswer;
              const isWrong = isSelected && !isCorrect;
              
              return (
                <div key={index}>
                  <button
                    onClick={() => handleChoiceSelect(index)}
                    disabled={selectedChoice !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'shadow-md'
                        : selectedChoice === null ? 'hover:shadow-sm' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: isSelected 
                        ? (isCorrect ? '#0048ff' : '#FF4444')
                        : 'white',
                      color: isSelected ? 'white' : '#333',
                      border: `2px solid ${
                        isSelected 
                          ? (isCorrect ? '#0048ff' : '#FF4444')
                          : '#e5e7eb'
                      }`,
                      cursor: selectedChoice !== null ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: isSelected ? 'white' : '#0048ff',
                          color: isSelected ? (isCorrect ? '#0048ff' : '#FF4444') : 'white'
                        }}
                      >
                        {isSelected ? (
                          isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1">{choice}</span>
                    </div>
                  </button>
                  
                  {isSelected && (
                    <div 
                      className="mt-3 p-4 rounded-lg" 
                      style={{ 
                        backgroundColor: isCorrect ? '#E8ECFF' : '#FFE8E8'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0048ff' }} />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF4444' }} />
                        )}
                        <p style={{ color: isCorrect ? '#0048ff' : '#FF4444' }}>
                          {currentStory.feedback[index]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Myth Busters Prompt for Wrong Answers */}
          {showMythBustersPrompt && onNavigateToMyths && (
            <div className="mt-6 p-4 rounded-xl border-2" style={{ 
              backgroundColor: '#FFF4E6',
              borderColor: '#FFA500'
            }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FFA500' }} />
                <div className="flex-1">
                  <p className="text-sm mb-3" style={{ color: '#1A1A1A' }}>
                    {selectedChoice !== null && currentStory.wrongFeedback}
                  </p>
                  <Button
                    onClick={onNavigateToMyths}
                    className="w-full rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                      color: 'white'
                    }}
                  >
                    {labels.learnMore}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Story {currentStoryIndex + 1} of {langStories.length}
          </div>
        </Card>
      </div>
    </div>
  );
}