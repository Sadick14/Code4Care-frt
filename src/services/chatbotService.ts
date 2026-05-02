// Clean, Natural Conversational AI Chatbot for SRH - Ghana
import { logger } from "@/utils/logger";

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface UserDemographics {
  ageRange?: string;
  genderIdentity?: string;
  region?: string;
}

export interface ChatApiRequest {
  message: string;
  language: string;
  session_id: string;
}

export type ChatCitation = string | {
  title?: string;
  source?: string;
  excerpt?: string;
  text?: string;
  url?: string;
  page?: string | number;
  [key: string]: unknown;
};

export type SafetyFlag = string | {
  label?: string;
  reason?: string;
  severity?: string;
  message?: string;
  [key: string]: unknown;
};

export interface ChatApiResponse {
  answer: string;
  citations: ChatCitation[];
  safety_flags: SafetyFlag[];
  language_detected: string;
  response_time_ms: number;
}

const CHAT_API_BASE_URL = (
  import.meta.env.VITE_CHAT_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).trim();

const DEFAULT_CHAT_ENDPOINT = CHAT_API_BASE_URL ? '/v1/chat' : '/api/chat';
const CHAT_ENDPOINTS = [import.meta.env.VITE_CHAT_API_ENDPOINT || DEFAULT_CHAT_ENDPOINT];

function buildChatUrl(path: string) {
  if (!CHAT_API_BASE_URL) {
    return path;
  }

  return new URL(path, CHAT_API_BASE_URL).toString();
}

function safeParseJson(value: string) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
}

function normalizeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeChatResponse(payload: unknown, fallbackLanguage: string): ChatApiResponse {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const answer = typeof record.answer === 'string'
    ? record.answer
    : typeof record.response === 'string'
      ? record.response
      : '';

  return {
    answer,
    citations: normalizeArray<ChatCitation>(record.citations),
    safety_flags: normalizeArray<SafetyFlag>(record.safety_flags),
    language_detected: typeof record.language_detected === 'string' ? record.language_detected : fallbackLanguage,
    response_time_ms: typeof record.response_time_ms === 'number' ? record.response_time_ms : 0,
  };
}

async function postChatCompletion(payload: ChatApiRequest, endpoint: string) {
  return fetch(buildChatUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

async function readErrorMessage(response: Response): Promise<string> {
  const bodyText = await response.text();
  const parsedBody = safeParseJson(bodyText);

  if (parsedBody && typeof parsedBody === 'object') {
    const record = parsedBody as Record<string, unknown>;

    if (typeof record.detail === 'string') {
      return record.detail;
    }

    if (Array.isArray(record.detail)) {
      return record.detail
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return String(item);
          }

          const detail = item as Record<string, unknown>;
          const location = Array.isArray(detail.loc) ? detail.loc.join('.') : '';
          const message = typeof detail.msg === 'string' ? detail.msg : 'Validation error';
          return location ? `${location}: ${message}` : message;
        })
        .join('; ');
    }

    if (typeof record.message === 'string') {
      return record.message;
    }
  }

  return bodyText || response.statusText || 'Chat API request failed';
}

export async function requestChatCompletion(payload: ChatApiRequest): Promise<ChatApiResponse> {
  let lastError: Error | null = null;

  for (const endpoint of CHAT_ENDPOINTS) {
    try {
      const response = await postChatCompletion(payload, endpoint);

      if (!response.ok) {
        const errorMessage = await readErrorMessage(response);

        if ((response.status === 404 || response.status === 405) && endpoint === CHAT_ENDPOINTS[0]) {
          lastError = new Error(`Chat API endpoint not available at ${endpoint}: ${errorMessage}`);
          continue;
        }

        throw new Error(`Chat API request failed (${response.status}) at ${endpoint}: ${errorMessage}`);
      }

      const data = await response.json();
      return normalizeChatResponse(data, payload.language);
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
      } else {
        lastError = new Error('Chat API request failed');
      }

      if (endpoint !== CHAT_ENDPOINTS[0]) {
        break;
      }
    }
  }

  throw lastError || new Error('Chat API request failed');
}

// Comprehensive SRH Knowledge Base (Ghana-Specific)
const knowledge = {
  puberty: {
    keywords: ['puberty', 'pubescent', 'growing up', 'teenager', 'adolescent', 'body changing', 'development', 'voice', 'breast', 'period start', 'mmabunu', 'ɖekakpui', 'changes', 'bodily changes'],
    male: ['boy', 'male', 'guy', 'man', 'penis', 'testicle', 'balls', 'erection', 'wet dream', 'voice deep', 'mmarima', 'ŋutsu'],
    female: ['girl', 'female', 'woman', 'lady', 'breast', 'boobs', 'period', 'menstruat', 'vagina', 'mmaa', 'nyɔnu']
  },
  menstruation: {
    keywords: ['period', 'menstruat', 'monthly', 'cycle', 'bleeding', 'cramp', 'pad', 'tampon', 'pms', 'irregular', 'bosome', 'ɣletiɖoɖo', 'mensuration']
  },
  contraception: {
    keywords: ['contraception', 'birth control', 'condom', 'protection', 'prevent pregnancy', 'pill', 'inject', 'implant', 'iud', 'family planning', 'safe sex', 'awo si ano', 'fuvɔvɔ', 'contraceptive']
  },
  sti: {
    keywords: ['sti', 'std', 'disease', 'infection', 'hiv', 'aids', 'gonorrhea', 'chlamydia', 'syphilis', 'herpes', 'hpv', 'sexually transmitted', 'yadeɛ', 'dɔléle']
  },
  pregnancy: {
    keywords: ['pregnant', 'pregnancy', 'expecting', 'baby', 'conceive', 'prenatal', 'antenatal', 'abortion', 'missed period', 'morning sickness', 'nyinsɛn', 'fufɔfɔ']
  },
  consent: {
    keywords: ['consent', 'permission', 'rape', 'assault', 'abuse', 'force', 'say no', 'uncomfortable', 'pressure', 'relationship', 'boyfriend', 'girlfriend', 'mpene', 'lɔlɔ̃nu', 'age of consent', 'unhealthy']
  },
  mentalHealth: {
    keywords: ['stress', 'depress', 'anxiety', 'sad', 'worried', 'scared', 'mental', 'emotional', 'feeling', 'suicide', 'self harm', 'overwhelm', 'adwene', 'susu']
  },
  clinics: {
    keywords: ['clinic', 'hospital', 'where to go', 'get tested', 'get help', 'ppag', 'marie stopes', 'find clinic', 'near me']
  },
  myths: {
    keywords: ['myth', 'is it true', 'i heard', 'someone said', 'can you get', 'first time', 'condom break']
  }
};

// Ghana-Specific High-Priority Resources
const ghanaResources = {
  en: {
    ppag: "PPAG: 0302-219-038",
    marieStopes: "Marie Stopes Ghana: 0302-234-040",
    dkt: "DKT Ghana: +233 30 277 2799",
    dovvsu: "DOVVSU (Domestic Violence & Victim Support): 055-1000-900",
    mentalHealth: "Mental Health Authority: 050-911-4396",
    emergency: "Emergency: 191 or 112",
    ageOfConsent: "16 years (Ghana law)"
  },
  twi: {
    ppag: "PPAG: 0302-219-038",
    marieStopes: "Marie Stopes Ghana: 0302-234-040",
    dkt: "DKT Ghana: +233 30 277 2799",
    dovvsu: "DOVVSU: 055-1000-900",
    mentalHealth: "Adwene Akwahosan: 050-911-4396",
    emergency: "Ntɛmpɛ Mmoa: 191 anaa 112",
    ageOfConsent: "Mfe 16 (Ghana mmara)"
  },
  ewe: {
    ppag: "PPAG: 0302-219-038",
    marieStopes: "Marie Stopes Ghana: 0302-234-040",
    dkt: "DKT Ghana: +233 30 277 2799",
    dovvsu: "DOVVSU: 055-1000-900",
    mentalHealth: "Susuŋudɔwɔha: 050-911-4396",
    emergency: "Kpakplikpakpli: 191 alo 112",
    ageOfConsent: "Ƒe 16 (Ghana ƒe se)"
  }
};

export class ChatbotSession {
  private history: string[] = [];
  private concerns: string[] = [];
  private depth: number = 0;
  private language: string;
  private demographics?: UserDemographics;

  constructor(language: string = 'en', demographics?: UserDemographics) {
    this.language = language;
    this.demographics = demographics;
  }

  public getResponse(message: string, consultantMode: boolean = false): string {
    try {
      logger.info('Chatbot session processing message:', { message, consultantMode, depth: this.depth });
      this.depth++;
      const understanding = this.understandMessage(message);
      
      if (understanding.isUrgent) return this.handleUrgent();
      if (understanding.isGreeting) return this.handleGreeting();
      if (understanding.topics.length === 0 && !understanding.needsClarification) return this.handleOffTopic();
      if (understanding.needsClarification) return this.askClarification();

      let response = '';
      for (const topic of understanding.topics) {
        response += this.generateTopicResponse(topic);
        response += '\n\n';
      }

      response += this.generateFollowUp();
      
      this.history.push(message);
      this.concerns.push(...understanding.topics);
      
      return response.trim();
    } catch (err) {
      logger.error('Chatbot error:', err);
      return this.getErrorResponse();
    }
  }

  private understandMessage(message: string) {
    const lower = message.toLowerCase();
    const topics: string[] = [];
    let isUrgent = false;
    let needsClarification = false;

    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'akwaaba', 'alo', 'maakye', 'yo'];
    const isGreeting = greetings.some(g => lower.startsWith(g) || lower === g);

    for (const [topic, data] of Object.entries(knowledge)) {
      if (data.keywords.some(kw => lower.includes(kw))) {
        topics.push(topic);
      }
    }

    // Context from history
    if (topics.length === 0 && this.history.length > 0 && this.concerns.length > 0) {
      const followUpIndicators = ['where', 'how', 'when', 'what about', 'tell me more', 'can you explain'];
      if (followUpIndicators.some(indicator => lower.includes(indicator))) {
        topics.push(this.concerns[this.concerns.length - 1]);
      }
    }

    if (lower.match(/\b(urgent|emergency|help me|scared|suicide|rape|abuse)\b/)) {
      isUrgent = true;
    }

    if (message.trim().split(' ').length < 3 && !isGreeting && topics.length === 0) {
      needsClarification = true;
    }

    return { topics, isUrgent, isGreeting, needsClarification };
  }

  private handleGreeting(): string {
    const responses = {
      en: "Hello! I'm here to help you with any questions about sexual and reproductive health. Our chat is private and confidential.\n\nWhat would you like to talk about today?",
      twi: "Akwaaba! Mewɔ ha sɛ meboa wo wɔ nsɛm a ɛfa nna ne awo ho akwahosan ho. Nea yɛka nyinaa yɛ kokoam.\n\nDɛn na wopɛ sɛ yɛka ho asɛm nnɛ?",
      ewe: "Alo! Mele afisia be makpe ɖe ŋuwò tso lãmesɛ ŋuti. Nu sia nu si míaƒo nu tso eŋu la nye ɣaɣla.\n\nNane pɔtee aɖe li si ŋuti nèdi be yeanya?"
    };
    const baseResponse = (responses as any)[this.language] || responses.en;
    return `${baseResponse}\n\n${this.getDemographicGuidanceIntro()}`;
  }

  private handleUrgent(): string {
    const res = (ghanaResources as any)[this.language] || ghanaResources.en;
    return `This sounds urgent. Please contact professional help immediately:\n\nEmergency: ${res.emergency}\nDOVVSU: ${res.dovvsu}\nPPAG: ${res.ppag}\n\nYou are not alone. Please reach out right now.`;
  }

  private handleOffTopic(): string {
    return "I'm specifically trained to help with sexual and reproductive health (SRH) topics like puberty, periods, contraception, and relationships. What SRH question can I help you with?";
  }

  private askClarification(): string {
    return "I want to be as helpful as possible. Could you tell me a bit more about what you're asking? For example, are you interested in puberty, periods, or contraception?";
  }

  private generateTopicResponse(topic: string): string {
    // We'll restore the full content logic later, this is a placeholder during refactor
    return `I'm happy to help with questions about ${topic}. (Content logic for ${this.language} is currently being mapped to the new session engine)`;
  }

  private generateFollowUp(): string {
    return `\n\n${this.getDemographicFollowUpPrompt()}`;
  }

  private getDemographicGuidanceIntro(): string {
    const ageLine = this.getAgeToneLine();
    const genderLine = this.getGenderToneLine();

    if (!ageLine && !genderLine) {
      return "I will tailor explanations to your needs and keep things clear, safe, and non-judgmental.";
    }

    return [ageLine, genderLine].filter(Boolean).join(" ");
  }

  private getDemographicFollowUpPrompt(): string {
    const ageRange = this.demographics?.ageRange;
    if (ageRange === '10-14' || ageRange === '15-19') {
      return "Does that help? I can also explain this in simple, step-by-step language for teens if you want.";
    }

    return "Does that help? Is there anything else you'd like to know?";
  }

  private getAgeToneLine(): string {
    const ageRange = this.demographics?.ageRange;
    if (ageRange === '10-14' || ageRange === '15-19') {
      return "I will keep feedback youth-friendly and practical.";
    }
    if (ageRange === '20-24' || ageRange === '25+') {
      return "I will keep feedback practical, clear, and action-focused.";
    }
    return "";
  }

  private getGenderToneLine(): string {
    const gender = this.demographics?.genderIdentity;
    if (gender === 'female') {
      return "I will include guidance relevant to women's SRH concerns when useful.";
    }
    if (gender === 'male') {
      return "I will include guidance relevant to men's SRH concerns when useful.";
    }
    if (gender === 'non-binary') {
      return "I will use inclusive language and avoid gender assumptions in guidance.";
    }
    return "";
  }

  private getErrorResponse(): string {
    const responses = {
      en: "I'm sorry, I'm having a technical moment. Could you try asking that again?",
      twi: "Mesrɛ wo, mewɔ mfomsoɔ ketewa bi. Wobɛtumi abisa wo nsɛm no bio?",
      ewe: "Meɖe kuku, vodada sue aɖe dzɔ. Àte ŋu abia wò nyabiase la akea?"
    };
    return (responses as any)[this.language] || responses.en;
  }
}

/**
 * Factory function to create a new session
 */
export function createChatSession(language: string, demographics?: UserDemographics) {
  return new ChatbotSession(language, demographics);
}

/**
 * Legacy support for direct calls (not recommended for persistent chat)
 */
export function getBotResponse(
  message: string,
  language: string = 'en',
  consultantMode: boolean = false,
  demographics?: UserDemographics,
): string {
  const session = new ChatbotSession(language, demographics);
  return session.getResponse(message, consultantMode);
}

export const getFollowUpSuggestions = (language: string = 'en'): string[] => {
  const suggestions = {
    en: ["What changes happen during puberty?", "How do I take care of myself during my period?", "What contraceptives can I use?", "How can I prevent STIs?", "Where can I get help in Ghana?"],
    twi: ["Nsakrae bɛn na ɛba mmabunu mu?", "Sɛnea mɛhwɛ me ho wɔ me bosome bere mu?", "Awo si ano bɛn na metumi de adi dwuma?", "Sɛnea mɛsi yadeɛ ano?", "Ɛhe na metumi anya mmoa wɔ Ghana?"],
    ewe: ["Tɔtrɔ ka dzɔna le ɖekakpui me?", "Alesi malé ɖokuinye ɖo le ɣletiɖoɖo me?", "Fuvɔvɔ ka mate ŋu azã?", "Alesi mate ŋu aɖe dɔlélewo ɖa?", "Afi ka mate ŋu akpɔ kpekpeɖeŋu le Ghana?"]
  };
  return (suggestions as any)[language] || suggestions.en;
};