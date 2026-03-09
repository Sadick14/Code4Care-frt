import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Check, Share2, Copy } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MythBustersProps {
  selectedLanguage: string;
}

interface MythFact {
  id: number;
  category: string;
  myth: string;
  fact: string;
  source: string;
}

export function MythBusters({ selectedLanguage }: MythBustersProps) {
  const [selectedMyth, setSelectedMyth] = useState<number | null>(null);

  const content = {
    en: {
      title: "Myth Busters",
      subtitle: "Separating fact from fiction",
      mythLabel: "MYTH",
      factLabel: "FACT",
      shareButton: "Share",
      copyButton: "Copy",
      copiedToast: "Copied to clipboard!",
      myths: [
        {
          id: 1,
          category: "Pregnancy",
          myth: "You cannot get pregnant the first time you have sex",
          fact: "This is FALSE. Pregnancy can occur any time you have unprotected sex, including the first time. Using contraception is important from the very first time.",
          source: "SRH Guide Ghana"
        },
        {
          id: 2,
          category: "Contraception",
          myth: "Condoms always break",
          fact: "This is FALSE if used correctly. When used properly, condoms are highly effective at preventing pregnancy and STIs. Follow instructions carefully and check expiration dates.",
          source: "SRH Guide Ghana"
        },
        {
          id: 3,
          category: "STIs",
          myth: "STIs only happen to promiscuous people",
          fact: "This is FALSE. STIs can affect anyone who is sexually active, regardless of the number of partners. Regular testing and protection are important for everyone.",
          source: "SRH Guide Ghana"
        },
        {
          id: 4,
          category: "STIs",
          myth: "You can tell if someone has an STI just by looking at them",
          fact: "Many STIs have no visible symptoms. The only way to know is through testing. Regular testing is important for sexual health.",
          source: "CDC"
        },
        {
          id: 5,
          category: "Menstruation",
          myth: "You can't get pregnant during your period",
          fact: "While less likely, pregnancy can occur during menstruation, especially if you have irregular cycles. Sperm can survive up to 5 days.",
          source: "NHS"
        },
        {
          id: 6,
          category: "Contraception",
          myth: "Birth control pills make you gain weight",
          fact: "Modern birth control pills do not cause significant weight gain. Any changes are usually temporary and related to water retention.",
          source: "WHO"
        },
        {
          id: 7,
          category: "General",
          myth: "Douching is necessary for vaginal hygiene",
          fact: "Douching is not recommended and can actually disrupt healthy vaginal bacteria, leading to infections. The vagina is self-cleaning.",
          source: "ACOG"
        },
        {
          id: 8,
          category: "STIs",
          myth: "Oral sex is completely safe from STIs",
          fact: "STIs can be transmitted through oral sex. Using protection like dental dams or condoms reduces risk.",
          source: "CDC"
        },
        {
          id: 9,
          category: "Contraception",
          myth: "Withdrawal method is an effective form of contraception",
          fact: "The withdrawal method has a high failure rate (around 20%). Pre-ejaculate fluid can contain sperm, and perfect timing is difficult to maintain consistently.",
          source: "WHO"
        },
        {
          id: 10,
          category: "Menstruation",
          myth: "You should avoid exercise during your period",
          fact: "Exercise during menstruation is safe and can actually help reduce cramps and improve mood through endorphin release.",
          source: "NHS"
        }
      ]
    },
    twi: {
      title: "Nsɛm a wɔdi ho dawurubɔ",
      subtitle: "Nokware ne nea ɛnyɛ nokware",
      mythLabel: "DAWURU",
      factLabel: "NOKWARE",
      shareButton: "Kyɛ",
      copyButton: "Fa kɔ",
      copiedToast: "Wɔafa kɔ!",
      myths: [
        {
          id: 1,
          category: "Nyinsɛn",
          myth: "Wuntumi nyin bere a ɛto nna da a edi kan no",
          fact: "Eyi yɛ ATORO. Wubetumi anyin bere biara a woto nna a wɔmfa biribi nsi ano, mpo da a edi kan no. Ɛho hia sɛ wode biribi si ano fi mfitiaseɛ.",
          source: "SRH Guide Ghana"
        },
        {
          id: 2,
          category: "Awo si ano",
          myth: "Condom bu daa",
          fact: "Eyi yɛ ATORO sɛ wode di dwuma yie a. Sɛ wode di dwuma pɛpɛɛpɛ a, condom tumi si nyinsɛn ne yadeɛ ano yie. Di akwankyerɛ so na hwɛ bere a ɛbɛba awiei.",
          source: "SRH Guide Ghana"
        },
        {
          id: 3,
          category: "Yadeɛ",
          myth: "Yadeɛ ba nnipa a wɔto nna bebree nko ara",
          fact: "Eyi yɛ ATORO. Yadeɛ betumi aka obiara a ɔto nna, ɛmfa ho sɛ wɔwɔ ahokafo kakra anaa bebree. Nhwehwɛmu ne ahobammɔ ho hia ma obiara.",
          source: "SRH Guide Ghana"
        },
        {
          id: 4,
          category: "Yadeɛ",
          myth: "Wubetumi ahu sɛ obi wɔ yadeɛ sɛ wohwɛ no",
          fact: "Yadeɛ pii nni nsɛnkyerɛnne a wohu. Ɔkwan a wubehu ara ne sɛ wokɔyɛ nhwehwɛmu. Nhwehwɛmu yɛ na ho hia.",
          source: "CDC"
        },
        {
          id: 5,
          category: "Nsuo ba",
          myth: "Wuntumi nyin wɔ bere a nsuo reba no mu",
          fact: "Ɛbɛyɛ kakra deɛ, nanso wubetumi anyin wɔ nsuo ba mu, titiriw sɛ wo nsuo ba nnwuma a. Ahunmu betumi atena nkwa mu nnafua enum.",
          source: "NHS"
        },
        {
          id: 6,
          category: "Awo si ano",
          myth: "Aduro a wɔde si awo ano ma wo mu duru",
          fact: "Aduro a wɔde si awo ano mma wo mu nduru kɛse. Nsakraeɛ biara yɛ bere tiawa bi na ɛfa nsuo a ɛwɔ wo mu no ho.",
          source: "WHO"
        },
        {
          id: 7,
          category: "Nyinaa",
          myth: "Ɛho hia sɛ wohohoro mu ma ho tew",
          fact: "Wɔnkamfo sɛ wobɛhohoro mu na ebetumi asɛe bacteria pa. Twɛ no ara hohoro ne ho.",
          source: "ACOG"
        },
        {
          id: 8,
          category: "Yadeɛ",
          myth: "Nna a wɔde ano to no ho tew koraa",
          fact: "Wobetumi anya yadeɛ denam nna a wɔde ano to so. Fa condom anaa dental dam di dwuma.",
          source: "CDC"
        },
        {
          id: 9,
          category: "Awo si ano",
          myth: "Sɛ woyi mu a, ɛyɛ awo si ano kwan pa",
          fact: "Sɛ woyi mu a, ɛnni dwuma yiye (bɛyɛ 20% na ɛnni dwuma). Ahunmu betumi aba ansa na woayi mu.",
          source: "WHO"
        },
        {
          id: 10,
          category: "Nsuo ba",
          myth: "Ɛnsɛ sɛ woyɛ apɔmuden wɔ nsuo ba bere mu",
          fact: "Apɔmuden wɔ nsuo ba bere mu yɛ papa. Ebetumi atew yaw a ɛba no ano na ama wo ani agye.",
          source: "NHS"
        }
      ]
    },
    ewe: {
      title: "Aʋatsonyawo ŋuɖoɖo",
      subtitle: "Nyateƒe kple alakpa tɔtɔ dome",
      mythLabel: "AƲATSONYA",
      factLabel: "NYATEƑE",
      shareButton: "Ðɔ ɖe ame",
      copyButton: "Ŋlɔ ɖe agbalẽ me",
      copiedToast: "Woŋlɔe ɖe agbalẽ me!",
      myths: [
        {
          id: 1,
          category: "Fufɔfɔ",
          myth: "Màte ŋu afɔ fu zi gbãtɔ si nèwɔ nu o",
          fact: "Esia nye ALAKPA. Àte ŋu afɔ fu ɣesiaɣi si nèwɔ nu si ŋu womeɖo nu o, zi gbãtɔ gɔ̃ hã. Ele be nàzã fuvɔvɔ nu tso gɔmedzedzea me.",
          source: "SRH Guide Ghana"
        },
        {
          id: 2,
          category: "Fuvɔvɔ",
          myth: "Condom gbãna ɣesiaɣi",
          fact: "Esia nye ALAKPA ne èzãe nyuie. Ne èzãe pɛpɛpɛ la, condom ɖea fu kple dɔlélewo ɖa nyuie. Dze mɔfiamewo yome eye nàlé ŋku ɖe ɣeyiɣi si wòawu nu le la ŋu.",
          source: "SRH Guide Ghana"
        },
        {
          id: 3,
          category: "Dɔlélewo",
          myth: "Dɔlélewo dzɔna na ame siwo wɔa nu geɖe ko",
          fact: "Esia nye ALAKPA. Dɔlélewo ate ŋu aku ame sia ame si wɔa nu, ne amesiwo ƒe xɔlɔ̃wo sɔ gbɔ alo sɔ gbɔ o. Dodokpɔ edziedzi kple tanudzɔdzɔ hiã na ame sia ame.",
          source: "SRH Guide Ghana"
        },
        {
          id: 4,
          category: "Dɔlélewo",
          myth: "Àte ŋu akpɔ ame si ŋu dɔléle le ɖa kple ŋku kpɔkpɔ",
          fact: "Dɔléle geɖewo ƒe dzesiwo medzena o. Dodokpɔ koe ate ŋu aɖe eme. Dodokpɔ edziedzi hia.",
          source: "CDC"
        },
        {
          id: 5,
          category: "Ɣletovɔsa",
          myth: "Màte ŋu afɔ fu le wò ɣletovɔsa me o",
          fact: "Togbɔ be mesɔ gbɔ o hã la, àte ŋu afɔ fu le ɣletovɔsa me, vevietɔ ne wò ɣletovɔsawo meɖoa ɖoɖo nu o. Ŋutsu tɔ ate ŋu anɔ agbe ŋkeke atɔ̃.",
          source: "NHS"
        },
        {
          id: 6,
          category: "Fuvɔvɔ",
          myth: "Fuléle amuwo na wò ŋutilã kpea ɖe edzi",
          fact: "Fuléle amuwo yeye mena wò ŋutilã kpena ɖe edzi vevie o. Tɔtrɔ ɖesiaɖe nye ɣeyiɣi kpui aɖe ko eye wòku ɖe tsi si le ŋutilã me la ŋuti.",
          source: "WHO"
        },
        {
          id: 7,
          category: "Bliboa",
          myth: "Ele be nàklɔ wò lãme na dzadzɛwo",
          fact: "Womeka ɖe edzi be nàklɔ lãme o eye ate ŋu agblẽ bacteria nyuiwo. Nyɔnuƒome klɔa eɖokui.",
          source: "ACOG"
        },
        {
          id: 8,
          category: "Dɔlélewo",
          myth: "Nu wɔwɔ kple nu li ŋu le dedie keŋkeŋ",
          fact: "Àte ŋu aɖe dɔléle to nu wɔwɔ kple nu me. Zã tanudzɔnuwo abe dental dams alo condoms ene ɖea ŋui.",
          source: "CDC"
        },
        {
          id: 9,
          category: "Fuvɔvɔ",
          myth: "Ɖeɖe le eme nye fuvɔvɔ mɔnu nyuitɔ",
          fact: "Ɖeɖe le eme mewɔa dɔ nyuie o (abe 20% ene). Ŋutsu tɔ ate ŋu anɔ tsi si do ŋgɔ la me hafi woaɖe le eme.",
          source: "WHO"
        },
        {
          id: 10,
          category: "Ɣletovɔsa",
          myth: "Mele be nàwɔ lãmedɔ le wò ɣletovɔsa me o",
          fact: "Lãmedɔ wɔwɔ le ɣletovɔsa me li ŋu le dedie eye ate ŋu aɖe vevesese dzi akpɔtɔ na wò.",
          source: "NHS"
        }
      ]
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(lang.copiedToast);
  };

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)' }}>
      <div className="max-w-4xl mx-auto pb-8">
        <div className="text-center mb-8">
          <h1 className="mb-2" style={{ color: '#0048ff' }}>{lang.title}</h1>
          <p className="text-gray-600">{lang.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lang.myths.map((item) => (
            <Card 
              key={item.id} 
              className="p-6 cursor-pointer transition-all hover:shadow-lg"
              onClick={() => setSelectedMyth(selectedMyth === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge 
                  variant="outline" 
                  className="rounded-full"
                  style={{ borderColor: '#0048ff', color: '#0048ff' }}
                >
                  {item.category}
                </Badge>
                {selectedMyth === item.id ? (
                  <Check className="w-5 h-5" style={{ color: '#0048ff' }} />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF4444' }} />
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#FF4444' }}>{lang.mythLabel}</p>
                    <p className="text-gray-700">{item.myth}</p>
                  </div>
                </div>
              </div>

              {selectedMyth === item.id && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-4 rounded-lg" style={{ backgroundColor: '#E8ECFF' }}>
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0048ff' }} />
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#0048ff' }}>{lang.factLabel}</p>
                      <p style={{ color: '#1A1A1A' }}>{item.fact}</p>
                      <p className="text-xs text-gray-500 mt-2">Source: {item.source}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`${lang.mythLabel}: ${item.myth}\n\n${lang.factLabel}: ${item.fact}`);
                      }}
                      style={{ borderColor: '#0048ff', color: '#0048ff' }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {lang.copyButton}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderColor: '#0048ff', color: '#0048ff' }}
                      disabled
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {lang.shareButton}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}