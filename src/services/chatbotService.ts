// Clean, Natural Conversational AI Chatbot for SRH - Ghana
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// Error logging utility
const logError = (context: string, error: unknown, additionalInfo?: any) => {
  console.error(`🔴 [CHATBOT SERVICE ERROR - ${context}]`, error);
  if (additionalInfo) {
    console.error('🔴 Additional Info:', additionalInfo);
  }
  console.trace('🔴 Stack trace');
};

// Conversation memory to maintain context like a real person
let conversationHistory: string[] = [];
let userConcerns: string[] = [];
let currentLanguage: string = 'en';
let conversationDepth: number = 0;

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
    dkt: "DKT Ghana: +233 30 276 5432",
    dovvsu: "DOVVSU (Domestic Violence & Victim Support): 055-1000-900",
    mentalHealth: "Mental Health Authority: 050-911-4396",
    emergency: "Emergency: 191 or 112",
    ageOfConsent: "16 years (Ghana law)"
  },
  twi: {
    ppag: "PPAG: 0302-219-038",
    marieStopes: "Marie Stopes Ghana: 0302-234-040",
    dkt: "DKT Ghana: +233 30 276 5432",
    dovvsu: "DOVVSU: 055-1000-900",
    mentalHealth: "Adwene Akwahosan: 050-911-4396",
    emergency: "Ntɛmpɛ Mmoa: 191 anaa 112",
    ageOfConsent: "Mfe 16 (Ghana mmara)"
  },
  ewe: {
    ppag: "PPAG: 0302-219-038",
    marieStopes: "Marie Stopes Ghana: 0302-234-040",
    dkt: "DKT Ghana: +233 30 276 5432",
    dovvsu: "DOVVSU: 055-1000-900",
    mentalHealth: "Susuŋudɔwɔha: 050-911-4396",
    emergency: "Kpakplikpakpli: 191 alo 112",
    ageOfConsent: "Ƒe 16 (Ghana ƒe se)"
  }
};

// Detect what user is asking about with enhanced context
function understandUserMessage(message: string): {
  topics: string[];
  isUrgent: boolean;
  isGreeting: boolean;
  emotion: string;
  questionType: string;
  needsClarification: boolean;
  hasTypos: boolean;
  abbreviations: string[];
} {
  const lower = message.toLowerCase();
  const topics: string[] = [];
  let isUrgent = false;
  let emotion = 'neutral';
  let questionType = 'general';
  let needsClarification = false;
  let hasTypos = false;
  const abbreviations: string[] = [];

  // Check greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'akwaaba', 'alo', 'maakye', 'yo'];
  const isGreeting = greetings.some(g => lower.startsWith(g) || lower === g);

  // Detect common typos and abbreviations
  const typoPatterns = [
    { typo: /pubaty|puberty|pubarty/i, correct: 'puberty' },
    { typo: /mensral|menstrual|menstruel/i, correct: 'menstrual' },
    { typo: /sikle|sycle|cycl/i, correct: 'cycle' },
    { typo: /contraceptve|contraceptiv/i, correct: 'contraceptive' },
    { typo: /pregnacy|pregancy|pregnency/i, correct: 'pregnancy' },
    { typo: /\bsx\b|\bsex\b/i, correct: 'sex' }
  ];

  // Detect abbreviations
  if (lower.match(/\b(4|de|der|hw|bcos|bcoz|whn|ppl|bf|gf)\b/)) {
    abbreviations.push('text_speak');
  }

  // Check for typos
  for (const pattern of typoPatterns) {
    if (pattern.typo.test(message) && !message.toLowerCase().includes(pattern.correct)) {
      hasTypos = true;
      break;
    }
  }

  // Detect topics from current message
  for (const [topic, data] of Object.entries(knowledge)) {
    if (data.keywords.some(kw => lower.includes(kw))) {
      topics.push(topic);
    }
  }

  // CHECK CONVERSATION HISTORY FOR CONTEXT - Follow-up question handling
  if (topics.length === 0 && conversationHistory.length > 0 && userConcerns.length > 0) {
    // Check if this is a follow-up question about previous topics
    const followUpIndicators = [
      'where', 'how', 'when', 'what about', 'tell me more', 'can you explain',
      'what are the', 'is it', 'can i', 'should i', 'do i need', 'where can i',
      'how do i', 'what if', 'symptoms', 'signs', 'treatment', 'get tested',
      'get help', 'clinic', 'safe', 'prevent', 'protect'
    ];
    
    const isFollowUp = followUpIndicators.some(indicator => lower.includes(indicator));
    
    if (isFollowUp) {
      // Use the most recent concern as context
      const recentConcern = userConcerns[userConcerns.length - 1];
      topics.push(recentConcern);
      
      // Also check last 2-3 messages for additional context
      const recentMessages = conversationHistory.slice(-3).join(' ').toLowerCase();
      for (const [topic, data] of Object.entries(knowledge)) {
        if (data.keywords.some(kw => recentMessages.includes(kw)) && !topics.includes(topic)) {
          topics.push(topic);
        }
      }
    }
  }

  // Check for specific subtopics
  if (topics.includes('puberty')) {
    if (knowledge.puberty.male.some(kw => lower.includes(kw))) topics.push('puberty_male');
    if (knowledge.puberty.female.some(kw => lower.includes(kw))) topics.push('puberty_female');
  }

  // Detect urgency - HIGH PRIORITY
  if (lower.match(/\b(urgent|emergency|help me|severe|really bad|scared|suicide|kill myself|hurt myself|abuse|rape|raped|forced|violence)\b/)) {
    isUrgent = true;
  }

  // Detect emotion
  if (lower.match(/\b(worried|scared|afraid|anxious|nervous|embarrassed|ashamed)\b/)) {
    emotion = 'worried';
  } else if (lower.match(/\b(confused|don't understand|not sure|don't know)\b/)) {
    emotion = 'confused';
  }

  // Detect question type
  if (lower.includes('what')) questionType = 'what';
  else if (lower.includes('how')) questionType = 'how';
  else if (lower.includes('when')) questionType = 'when';
  else if (lower.includes('where')) questionType = 'where';
  else if (lower.includes('why')) questionType = 'why';
  else if (lower.includes('is it normal') || lower.includes('am i normal')) questionType = 'reassurance';

  // Check if message is too vague (but not if we found context from history)
  if (message.trim().split(' ').length < 3 && !isGreeting && topics.length === 0) {
    needsClarification = true;
  }

  return { topics, isUrgent, isGreeting, emotion, questionType, needsClarification, hasTypos, abbreviations };
}

// Generate human-like conversational response
function generateHumanResponse(message: string, lang: string, consultantMode: boolean = false): string {
  try {
    console.log('🤖 [CHATBOT] Generating response for:', message);
    const understanding = understandUserMessage(message);
    console.log('🧠 [CHATBOT] Understanding:', understanding);
    conversationDepth++;
  
  // Handle urgent situations IMMEDIATELY - HIGH PRIORITY
  if (understanding.isUrgent) {
    return handleUrgentSituation(message, lang);
  }

  // Handle greetings warmly
  if (understanding.isGreeting) {
    return generateWarmGreeting(lang);
  }

  // Handle off-topic like a caring friend
  if (understanding.topics.length === 0 && !understanding.needsClarification) {
    return handleOffTopic(lang);
  }

  // Handle vague questions
  if (understanding.needsClarification) {
    return askClarifyingQuestion(message, lang);
  }

  // Generate main conversational response
  let response = '';

  // Add main content in digestible chunks
  for (const topic of understanding.topics) {
    response += generateTopicContent(topic, message, understanding, lang);
    response += '\n\n';
  }

  // End with follow-up question
  response += generateFollowUp(understanding, lang);

  // Remember this conversation
  conversationHistory.push(message);
  userConcerns.push(...understanding.topics);

  console.log('✅ [CHATBOT] Response generated successfully');
  return response.trim();
  } catch (error) {
    logError('generateHumanResponse', error, { message, lang });
    return getErrorResponse(lang);
  }
}

// Warm greeting
function generateWarmGreeting(lang: string): string {
  const greetings = {
    en: [
      "Hello! I'm here to help you with any questions about sexual and reproductive health. Everything we talk about is completely confidential, and there's no judgment here.\n\nIs there something specific you'd like to know about, or would you like to hear what topics I can help with?",
      
      "Hi! Welcome to Room 1221. I'm here for any questions you have about sexual and reproductive health. All our conversations are private and confidential.\n\nWhat would you like to talk about today?",
      
      "Hey there! I'm glad you're here. I can help with questions about puberty, periods, contraception, relationships, and more. Everything stays between us.\n\nWhat's on your mind?"
    ],
    twi: [
      "Akwaaba! Mewɔ ha sɛ meboa wo wɔ nsɛm a ɛfa nna ne awo ho akwahosan ho. Biribiara a yɛbɛka no yɛ kokoam, na atemmuo biara nni hɔ.\n\nBiribi pɔtee bi wɔ hɔ a wopɛ sɛ wohu ho nsɛm, anaasɛ wopɛ sɛ wote nneɛma a metumi aboa wo wɔ ho?",
      
      "Wo ho te sɛn! Me ani agye sɛ waba ha. Metumi aboa wo wɔ nsɛm a ɛfa mmabunu, bosome, awo si ano, ne abusuabɔ ho. Biribiara yɛ kokoam.\n\nDɛn na wopɛ sɛ yɛka ho asɛm nnɛ?"
    ],
    ewe: {
      greet: "Alo! Mele afisia be makpe ɖe ŋuwò tso nɔnɔme kple vidzidzi ƒe lãmesɛ ŋuti. Nu sia nu si míaƒo nu tso eŋu la nye ɣaɣla, eye ʋɔnudrɔ̃ aɖeke meli o.\n\nNane pɔtee aɖe li si ŋuti nèdi be yeanya, alo èdi be magblɔ tanya siwo ŋuti mate ŋu akpe ɖe ŋuwò le?"
    }
  };

  const langGreetings = greetings[lang as keyof typeof greetings] || greetings.en;
  if (Array.isArray(langGreetings)) {
    return langGreetings[Math.floor(Math.random() * langGreetings.length)];
  }
  return (langGreetings as any).greet;
}

// Ask clarifying questions for vague inputs
function askClarifyingQuestion(message: string, lang: string): string {
  const responses = {
    en: "I want to give you the most helpful answer. Can you tell me a bit more about what you're asking?\n\nFor example, I can help with:\n- Puberty and body changes\n- Periods and menstrual health\n- Contraception and safe sex\n- STIs and testing\n- Pregnancy questions\n- Consent and relationships\n- Finding clinics in Ghana\n\nWhich area are you most interested in?",
    
    twi: "Mepɛ sɛ mede mmuae a ɛwɔ mfasoɔ bɛma wo. Wobɛtumi aka biribi pii afa nea worebisa ho?\n\nSɛ nhwɛsoɔ no, metumi aboa wo wɔ:\n- Mmabunu ne honam nsakrae\n- Bosome ne akwahosan\n- Awo si ano\n- Yadeɛ ne nhwehwɛmu\n- Nyinsɛn nsɛm\n- Mpene ne abusuabɔ\n\nEhe na w'ani gye ho paa?",
    
    ewe: "Medi be matsɔ ŋuɖoɖo si akpe ɖe ŋuwò wu la na wò. Àte ŋu agblɔ nu sue aɖe wu nam tso nu si nèle biam ŋutia?\n\nLe kpɔɖeŋu me, mate ŋu akpe ɖe ŋuwò le:\n- Ɖekakpui kple ŋutilã tɔtrɔwo\n- Ɣletiɖoɖo\n- Fuvɔvɔ\n- Dɔlélewo\n- Fufɔfɔ\n- Lɔlɔ̃nu\n\nKa ka nèdi vevie?"
  };

  return responses[lang as keyof typeof responses] || responses.en;
}

// Generate conversational content for each topic
function generateTopicContent(topic: string, message: string, understanding: any, lang: string): string {
  const lower = message.toLowerCase();

  switch (topic) {
    case 'puberty':
    case 'puberty_male':
    case 'puberty_female':
      return talkAboutPuberty(topic, lower, understanding, lang);
    
    case 'menstruation':
      return talkAboutPeriods(lower, understanding, lang);
    
    case 'contraception':
      return talkAboutContraception(lower, understanding, lang);
    
    case 'sti':
      return talkAboutSTIs(lower, understanding, lang);
    
    case 'pregnancy':
      return talkAboutPregnancy(lower, understanding, lang);
    
    case 'consent':
      return talkAboutConsent(lower, understanding, lang);
    
    case 'mentalHealth':
      return talkAboutMentalHealth(lower, understanding, lang);
    
    case 'clinics':
      return talkAboutClinics(lang);
    
    case 'myths':
      return talkAboutMyths(lower, lang);
    
    default:
      return '';
  }
}

// Clean, natural puberty content
function talkAboutPuberty(topic: string, message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    // Specific questions about signs/starting puberty
    if (message.includes('how') && (message.includes('know') || message.includes('starting') || message.includes('sign'))) {
      if (topic === 'puberty_male' || message.includes('boy') || message.includes('im a boy')) {
        return `For boys in Ghana and everywhere else, early signs of puberty include:\n• The voice begins to deepen gradually\n• Hair starts growing on the face, underarms, and pubic area\n• Testicles and penis begin to grow\n• You may get spontaneous erections or wet dreams\n• You may notice rapid height and muscle growth\n\nThese changes are normal and happen at different ages. If you want, you can ask about any sign privately.`;
      }
      return `Great. Puberty is when your body starts developing into an adult. Signs depend on gender, but common early changes include growth spurts, body odour, and emotional changes. If you want, you can tell me your gender and I'll explain the specific signs you may notice.`;
    }
    
    // Period hasn't started
    if (message.includes('period') && message.includes('hasnt') || message.includes("hasn't") || message.includes('not come')) {
      return `Thanks for confirming. It's completely normal for menstruation to start anytime between ages 9 and 16. At 15, you're still within the typical range. If you have other signs of puberty like breast development or hair growth, your period may start soon. If you reach 16 with no period at all, it's good to speak to a healthcare provider for a check-up, but it's usually nothing serious.`;
    }
    
    // Check what specific question they're asking
    if (message.includes('what is puberty') || message.includes('what is') && message.includes('puberty')) {
      return `Puberty is the stage where your body changes from childhood into adulthood. These changes include physical growth, hormonal changes, and emotional development. It's completely normal and happens at different ages for everyone.`;
    }
    
    if (topic === 'puberty_male' || message.includes('boy') || message.includes('male') || message.includes('voice') || message.includes('wet dream')) {
      if (message.includes('wet dream')) {
        return `Yes, wet dreams (nocturnal emissions) are completely normal for boys during puberty. They happen automatically as the body adjusts to hormonal changes.`;
      }
      if (message.includes('voice') && (message.includes('crack') || message.includes('chang'))) {
        return `Voice cracking is a normal part of puberty for boys. As the vocal cords grow and thicken, your voice deepens gradually, causing cracking or squeaking sounds for a while.`;
      }
      return `For male adolescents, puberty brings changes such as a deeper voice, growth of facial and body hair, testicular and penile growth, and occasional spontaneous erections. Boys may also grow taller and develop broader shoulders.`;
    }
    
    if (topic === 'puberty_female' || message.includes('girl') || message.includes('female') || message.includes('hip')) {
      if (message.includes('hip') && message.includes('widen')) {
        return `For girls, widening of the hips is a natural part of puberty. The body prepares for future reproductive ability by changing body shape and redistributing fat.`;
      }
      if (message.includes('period') && (message.includes('different age') || message.includes('start'))) {
        return `Yes, it's completely normal. Most girls start menstruation between ages 9 and 16. Some start earlier or later based on genetics, nutrition, and overall health.`;
      }
      return `Girls begin developing breasts during puberty, and their hips widen. They start growing underarm and pubic hair. The menstrual cycle also begins during puberty, usually between ages 9 and 16.`;
    }
    
    if (message.includes('emotional') || message.includes('feeling') || message.includes('mood')) {
      return `Hormonal changes during puberty can cause mood swings and stronger feelings. You may experience new emotions, curiosity about relationships, and a growing sense of independence. These changes are normal and part of becoming an adult.`;
    }
    
    if (message.includes('different') || message.includes('normal') || message.includes('earlier') || message.includes('later')) {
      return `Yes, everyone goes through puberty at their own pace. Differences in growth, body shape, and emotional development are completely normal.`;
    }
    
    if (message.includes('size') || message.includes('weight')) {
      return `Yes, body size can play a role. Undernutrition or being overweight can influence how early or late puberty begins. But every person's body develops in its own time.`;
    }
    
    if (message.includes('who can i talk') || message.includes('where') || message.includes('help')) {
      return `You can speak to youth-friendly services such as PPAG Youth Clinics, Marie Stopes Ghana, or school health nurses. They provide confidential support and education about puberty and reproductive health.`;
    }
    
    // Default general puberty response
    return `Puberty is the stage where your body changes from childhood into adulthood. These changes include physical growth, hormonal changes, and emotional development. It's completely normal and happens at different ages for everyone.`;
  }
  
  return "Puberty information available...";
}

// Clean periods content
function talkAboutPeriods(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    // Pad changing frequency
    if (message.includes('change') && message.includes('pad') && (message.includes('once') || message.includes('day'))) {
      return `Pads should be changed every 4–6 hours, even if the flow seems light. Changing only once a day can cause infections, irritation, and odour. If access to pads is difficult, let me know and I can guide you on safe alternatives.`;
    }
    
    // Menstrual cycle explanation
    if (message.includes('what is') || message.includes('cycle') || message.includes('sikle')) {
      return `The menstrual cycle is the monthly process where the body prepares for pregnancy. Here's how it works:\n• Days 1–7: bleeding happens\n• Around day 14: ovulation occurs\n• The full cycle is usually 21–35 days\nIf pregnancy doesn't occur, the cycle starts again. If you want, I can help you track your cycle or explain common issues like cramps or irregular periods.`;
    }
    
    if (message.includes('hygiene') || message.includes('care') || message.includes('take care')) {
      return `Girls should change their sanitary pads every 4–6 hours, wash their hands before and after handling menstrual products, and maintain good personal hygiene. Pads, tampons, or menstrual cups are all safe options.`;
    }
    
    return `The menstrual cycle is a monthly process where your body prepares for pregnancy. A normal cycle lasts 21 to 35 days, with bleeding lasting 3 to 7 days. Change pads every 4-6 hours and maintain good hygiene.`;
  }
  
  return "Period information available...";
}

// Clean contraception content
function talkAboutContraception(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    // First time sex and pregnancy
    if (message.includes('first time') && (message.includes('get pregnant') || message.includes('pregnancy'))) {
      return `Yes, a girl can get pregnant the first time she has sex if it's unprotected and occurs during her fertile window. Pregnancy depends on timing, ovulation, and whether sperm is present — not on experience. If you want, I can explain how to prevent pregnancy safely.`;
    }
    
    // Asking where to get contraception
    if (message.includes('where') || message.includes('get') && (message.includes('clinic') || message.includes('help'))) {
      return `You can get confidential contraception services and counseling at:\n- ${resources.ppag}\n- ${resources.marieStopes}\n- ${resources.dkt}\n\nThese places offer youth-friendly services without judgment.`;
    }
    
    // Safest contraceptive for young people
    if (message.includes('safest') || message.includes('best') || message.includes('young')) {
      return `The safest and most effective contraceptives for youth include:\n\n1. Long-Acting Reversible Contraceptives (LARCs)\n• Implants (3–5 years)\n• IUDs (3–10 years)\nThey are over 99% effective and safe for young people.\n\n2. Condoms\n• Protect against pregnancy and STIs\n• Easily available in Ghana\n\n3. Pills\n• Effective when taken daily\n\nA healthcare provider or counselor can help you choose the best method for your situation.`;
    }
    
    // Main contraception response - No clinic details unless asked
    return `Contraception means preventing pregnancy. It helps people plan if and when they want to have a child. There are different methods, and each works in its own way:\n\n• Condoms: A cover worn during sex that stops sperm from reaching the egg and also helps protect against STIs.\n\n• Birth control pills: Tablets taken daily that prevent the ovaries from releasing an egg.\n\n• Injectables: A hormone injection that prevents pregnancy for several weeks or months.\n\n• IUDs: A small device placed in the uterus by a health professional that can prevent pregnancy for years.\n\n• Emergency contraception: Pills taken soon after unprotected sex to reduce the chance of pregnancy.\n\nNo method is perfect for everyone. The best choice depends on your health, preferences, and access. A healthcare provider or counselor can help find what works for you.`;
  }
  
  if (lang === 'twi') {
    return `Contraception yɛ kwan biara a wɔde sie ntɔn ne abofra mmɔden. Ɛboa nkurɔfoɔ ma wɔhyehyɛ sɛ wɔbɛnya abɔfra anaa daa. Akwan ahodoɔ pii wɔ hɔ:\n\n• Condom: Nkatawa a wɔde hyɛ bere a wɔne yɔnko da na ɛsiw kwan ma ahaba no amma ntoatwa no mu. Ɛsan boa ma wonnya yareɛ.\n\n• Birth control pills: Aduannuru a wɔnom da biara na ɛma wonnya ntɔ.\n\n��� Injection: Aduannuru a wɔwɔ mu bɔsome pii anaa nnawɔtwe pii na ɛsiw nyinsɛn ano.\n\n• IUD: Ade ketewa bi a akwahosan dwumayɛfoɔ de hyɛ yafunu mu na ɛsiw nyinsɛn ano mfeɛ pii.\n\n• Emergency contraception: Aduannuru a wɔnom ntɛm wɔ nna a wɔnnhwɛ wɔn ho so akyi na ɛma nyinsɛn no yɛ bɛyɛ ketewa.\n\nƐkwan biara nyɛ pɛ ma obiara. Nea ɛyɛ ma wo no gyina wo akwahosan, nea wopɛ, ne nea wotumi nya so. Akwahosan dwumayɛfoɔ bɛtumi aboa wo anya nea ɛyɛ ma wo.`;
  }
  
  if (lang === 'ewe') {
    return `Contraception nye dzesiwo si wotsɔ be ame magbe togbɔ. Ekpe ɖe amewo ŋu be woaɖo ɖoɖo ɖe alesi woadi be yewoakpɔ vi alo ɣeyiɣi si me. Mɔ vovovowo li:\n\n• Condom: Nu si wotsɔ tsyɔna le nɔnɔme ɣeyiɣiwo me si mexɔ mɔ na ŋutsuvi be wòage ɖe nyɔnuvi ƒe ƒodo me o. Eɖoa kpekpeɖeŋu na be ame nagbe dɔléle.\n\n• Birth control pills: Atike si womua gbe sia gbe be ame magabe fufɔfɔ o.\n\n• Injection: Atike si wotsɔna dea ame ŋu ɣleti geɖewo alo kɔsiɖa geɖewo be fufɔfɔ magadzɔ o.\n\n• IUD: Nu sue si akɔdɔla tsɔ dea nyɔnu ƒe dɔ me eye wòsea fufɔfɔ nu ƒe geɖewo.\n\n• Emergency contraception: Atike si womua kpuie le nɔnɔme si me womekpɔ ɖokuiwo dzi le o megbe be fufɔfɔ nagadzɔ o.\n\nMɔ ɖe sia ɖe me nyo na ame sia ame o. Esi nyo wu la ku ɖe wò lãmesẽ, nu si nèdi, kple nu si le asiwò ŋu. Akɔdɔla ate ŋu akpe ɖe ŋuwò be nàke ɖe esi nyo na wò ŋu.`;
  }
  
  if (lang === 'ga') {
    return `Contraception yɛ shishi ni amɛ yɛ wɔ lɛ mli be amɛ nyɛ abɔfra. Ɛboa nitsɛmɛi ma wɔhwɛɛ sɛ wɔbɛnya abɔfra anaa daa. Kwan kɛ gbɛ wɔ:\n\n• Condom: Nkatɛ ni amɛ de hyɛ bere ni amɛ lɛ yɔnko da ni ɛsi kwan ma ahaba no amma ntoatwa no mu. Ɛsan boa ma amɛ nyɛ yare.\n\n• Birth control pills: Aduro ni amɛ nom da biara ni ɛma amɛ nyɛ ntɔ.\n\n• Injection: Aduro ni amɛ wɔ mu bɔsome kɛ anaa nnawɔtwe kɛ ni ɛsi nyinsɛn ano.\n\n• IUD: Ade ketewa bi ni akwahosan dwumayɛfoɔ de hyɛ yafunu mu ni ɛsi nyinsɛn ano mfeɛ kɛ.\n\n• Emergency contraception: Aduro ni amɛ nom ntɛm wɔ nna a wɔnnhwɛ wɔn ho so akyi ni ɛma nyinsɛn no yɛ bɛyɛ ketewa.\n\nKwan biara nyɛ pɛ ma obiara. Nea ɛyɛ ma wo gyina wo akwahosan. Akwahosan dwumayɛfoɔ bɛtumi aboa wo anya nea ɛyɛ ma wo.`;
  }
  
  return "Contraception information available...";
}

// Clean STI content
function talkAboutSTIs(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    // Asking where to get tested
    if (message.includes('where') || (message.includes('get') && message.includes('test'))) {
      return `You can get confidential testing and treatment at:\n- ${resources.ppag}\n- ${resources.marieStopes}\n\nGetting tested is smart and responsible. There's no shame in taking care of your health.`;
    }
    
    // Itching concerns
    if (message.includes('itch') && !message.includes('sore')) {
      return `Itching without sores is usually caused by:\n• Yeast infections\n• Allergic reactions to soaps or pads\n• Mild irritation\n\nThese are common and treatable. HIV usually has no early symptoms. If you're worried about STIs, it's best to get tested.`;
    }
    
    // Do condoms prevent STIs
    if (message.includes('condom') && (message.includes('prevent') || message.includes('protect'))) {
      return `Yes. When used correctly and consistently, condoms greatly reduce the risk of STIs such as HIV, chlamydia, and gonorrhea. They're not 100% perfect, but they provide strong protection. If you want, I can teach you step-by-step how to use a condom correctly.`;
    }
    
    // Main STI response - No clinic details unless asked
    return `STIs, or Sexually Transmitted Infections, are infections that can pass from one person to another through sexual contact. Some common examples include chlamydia, gonorrhea, syphilis, and HIV.\n\nSTIs don't always show symptoms, but when they do, they may include things like unusual discharge, itching, sores, pain when peeing, or fever. Anyone who is sexually active can get an STI.\n\nYou can reduce your risk by:\n\n• Using condoms correctly and consistently\n• Getting tested regularly\n• Limiting sexual partners or practicing mutual monogamy\n\nSTIs are common and treatable, but testing and early care are important.`;
  }
  
  if (lang === 'twi') {
    return `STI yɛ yare a wɔfa adɔe mu na wɔkɔ so. Nhwɛsoɔ bi ne chlamydia, gonorrhea, syphilis, ne HIV.\n\nSTI mmere pii no nkyerɛ nsɛnkyerɛnne biara, nanso sɛ ɛba deɛ a, wobɛhunu nneɛma te sɛ nsuo a ɛnyɛ dɛ, ɛsane yaw, akuro, yaw bere a woregye nsuo, anaa huraeɛ. Obiara a ɔne obi da no betumi anya STI.\n\nWobɛtumi atew so denam:\n\n• Condom a wode di dwuma yie bere nyinaa\n• Kɔ nhwehwɛmu bere nyinaa\n• Wo ne nnipa kakraa pɛ na da anaa wo ne wo yɔnko nko ara na da\n\nSTI yɛ adeyɛ a ɛba pii na wɔtumi sa, nanso nhwehwɛmu ne ayaresa ntɛm ho hia.`;
  }
  
  if (lang === 'ewe') {
    return `STI nye ʋuwo si wotsɔ le afe kaka kpɔkpɔ me na ame bubu ɖe asi. Kpɔɖeŋu aɖewo dometɔ aɖewoe nye chlamydia, gonorrhea, syphilis, kple HIV.\n\nSTI megɔ̃a dzesiawo fia ɣe sia ɣi o, ke ne efia dzesiwo la, woate ŋu akpɔ nuwo abe tsi si mede o, ŋuɖoɖo, abi, vevesese ne èle tsi ɖem, alo dzoxɔxɔ. Ame sia ame si le nɔnɔme wɔm la ate ŋu akpɔ STI.\n\nÀte ŋu aɖe afɔku dzi to:\n\n• Condom zazã nyuie kple edziedzi\n• Test kpɔkpɔ edziedzi\n��� Nɔnɔme kple ame ʋɛ aɖewo ko alo wò ɖeka kple wò hati ɖeka ko\n\nSTI bɔ, eye woate ŋu ada wo gake test kpɔkpɔ kple kpɔkplɔ kaba bia.`;
  }
  
  if (lang === 'ga') {
    return `STI yɛ kpaa yare ni amɛ tsuɔɔ kɛ enaa. Examples yɛ chlamydia, gonorrhea, syphilis, kɛ HIV.\n\nSTI mmere kɛ no nkyerɛ nsɛnkyerɛnne biara, nanso sɛ ɛba la, wobɛhunu nneɛma te sɛ nsuo ni ɛnyɛ dɛ, yaw, akuro, yaw bere ni woreyi nsuo, anaa huraeɛ. Obiara ni ɔne obi da betumi anya STI.\n\nWobɛtumi atew so hewalɛ:\n\n• Condom yɛ yie bere nyinaa\n• Kɔ nhwehwɛmu bere nyinaa\n• Wo lɛ nnipa kakra pɛ na da anaa wo lɛ wo yɔnko nko ara na da\n\nSTI yɛ normal kɛ wɔtumi sa, nanso nhwehwɛmu kɛ ayaresa ntɛm ho hia.`;
  }
  
  return "STI information available...";
}

// Clean pregnancy content
function talkAboutPregnancy(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    // Asking where to get help
    if (message.includes('where') || (message.includes('help') && (message.includes('clinic') || message.includes('counseling')))) {
      return `If someone becomes pregnant, they can access confidential counseling and care at:\n- ${resources.ppag}\n- ${resources.marieStopes}\n\nThese facilities offer information about all options, including continuing the pregnancy, adoption, and safe abortion services where legal. Whatever you decide is your choice, and you can get support without judgment.`;
    }
    
    // Pregnancy without ejaculation inside
    if (message.includes('didnt cum') || message.includes("didn't cum") || message.includes('without') && message.includes('inside')) {
      return `Yes, pregnancy can still happen. Pre-ejaculation fluid (pre-cum) can contain sperm. The risk is lower than with full ejaculation, but it's still possible. If you had unprotected sex recently, emergency contraception can help prevent pregnancy if taken within 72 hours.`;
    }
    
    // Signs of pregnancy - No clinic details unless asked
    if (message.includes('sign') && (message.includes('pregnancy') || message.includes('pregnant'))) {
      return `Early signs of pregnancy can vary from person to person, but some common ones include:\n\n• A missed period\n• Feeling unusually tired\n• Nausea or vomiting ("morning sickness")\n• Sore or swollen breasts\n• Peeing more often than usual\n• Light spotting or cramping\n• Changes in appetite or mood\n\nThese signs do not always mean someone is pregnant — they can be caused by other things too. The only reliable way to know is by taking a pregnancy test or visiting a health facility.\n\nPregnancy tests are available at pharmacies in Ghana and are accurate.`;
    }
    
    // Nausea and tiredness as pregnancy signs
    if ((message.includes('nausea') || message.includes('tired')) && message.includes('pregnancy')) {
      return `Early pregnancy signs include:\n• Missed period\n• Nausea or vomiting\n• Breast tenderness\n• Fatigue\n• Frequent urination\n\nThese symptoms alone are not enough to confirm pregnancy. The best option is a pregnancy test — available at pharmacies or clinics in Ghana.`;
    }
    
    // General pregnancy response - No clinic details unless asked
    return `Early signs of pregnancy can vary from person to person, but some common ones include:\n\n• A missed period\n• Feeling unusually tired\n• Nausea or vomiting ("morning sickness")\n• Sore or swollen breasts\n• Peeing more often than usual\n• Light spotting or cramping\n• Changes in appetite or mood\n\nThese signs do not always mean someone is pregnant — they can be caused by other things too. The only reliable way to know is by taking a pregnancy test or visiting a health facility.`;
  }
  
  if (lang === 'twi') {
    return `Nyinsɛn nsɛnkyerɛnne a ɛdi kan betumi aseseɛ wɔ onipa ne onipa ntam, nanso nea ɛtaa ba no bi ne:\n\n• Bosome a ɛyera (menses a ɛmmaa)\n• Brɛ ne adidiɔm dɔɔso\n• Yaw anaa nufusu a ɛso\n• Nufusu a ɛyɛ yaw anaa ɛtow\n• Nsuo regye pii sen nea anka ɛteɛ\n• Mogya kakraa bi anaa yaw wɔ yafunu mu\n• Aduane pɛ nsakrae anaa adwene nsakrae\n\nSaa nsɛnkyerɛnne yi nyinaa nkyerɛ sɛ obi anyinsɛn bere nyinaa — ɛbɛtumi afi nneɛma foforɔ mu. Ɔkwan a ɛyɛ pɛpɛɛpɛ ara a wobɛfa so ahu ne sɛ wobɛyɛ nyinsɛn nhwehwɛmu anaa wobɛkɔ ayaresabea.`;
  }
  
  if (lang === 'ewe') {
    return `Fufɔfɔ ƒe dzesi gbãtɔwo ate ŋu atɔ tso ame ɖeka gbɔ yi bubu gbɔ, ke esiwo bɔ woe nye:\n\n• Ɣletiɖoɖo si megatrɔ gbɔ o (period si megava o)\n• Gbɔdzɔgbɔdzɔ kple nuɖuɖu\n• Ŋkunyaŋunya alo nyɔnu ƒe nɔƒe si wɔ\n• Nɔƒe si ve alo dzi\n• Tsitrɔtrɔ geɖe wu tsã\n• Ʋu sue aɖe alo vevesese le dɔ me\n• Nuɖuɖu alo susu ƒe tɔtrɔ\n\nDzesi siawo katã mefia be ame fɔ fu o — woate ŋu tso nu bubuwo me. Mɔ si dzi woaka ɖo be yeanya lae nye fufɔfɔ test tsɔtsɔ alo ayɔdɔƒe yiyi.`;
  }
  
  if (lang === 'ga') {
    return `Nyinsɛn nsɛnkyerɛnne ni ɛdi kan betumi aseseɛ wɔ onipa lɛ onipa ntam, nanso nea ɛtaa ba no bi ne:\n\n• Mɔmɔi a ɛyera (menses a ɛmmaa)\n• Soya lɛ gbɛnɛ\n• Yaw anaa nufusu a ɛso\n• Nufusu a ɛyɛ yaw anaa ɛtow\n• Nsuo reyi kɛ sen nea anka ɛteɛ\n• Mɔmɔi kakra bi anaa yaw wɔ yafunu mu\n• Aduane pɛ nsakrae anaa adwene nsakrae\n\nSaa nsɛnkyerɛnne yi nyinaa nkyerɛ sɛ obi anyinsɛn bere nyinaa — ɛbɛtumi afi nneɛma foforɔ mu. Ɔkwan ni ��yɛ pɛpɛɛpɛ ara a wobɛfa so ahu ne sɛ wobɛyɛ nyinsɛn nhwehwɛmu anaa wobɛkɔ ayaresabea.`;
  }
  
  return "Pregnancy information available...";
}

// Clean consent content
function talkAboutConsent(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    if (message.includes('unhealthy') || message.includes('relationship')) {
      return `A relationship is unhealthy if someone tries to control you, threatens you, insults you, or pressures you into things you don't want. Abuse can be physical, emotional, sexual, or financial.

Healthy relationships are based on trust, respect, honesty, and mutual decisions. Both people should feel safe and supported.

If you feel unsafe or uncomfortable in a relationship, talk to someone you trust or call ${resources.dovvsu}. They handle domestic violence and abuse cases 24/7, and everything is confidential.`;
    } else {
      return `Consent means agreeing clearly and willingly to a sexual activity. It must be enthusiastic, not forced, and can be withdrawn at any time. Silence or lack of resistance is not consent.

In Ghana, the age of consent is ${resources.ageOfConsent}. This means it's illegal for anyone to have sex with someone under 16, even if they say yes. This law exists to protect young people.

Healthy relationships are based on trust, respect, honesty, and mutual decisions. Both people should feel comfortable communicating and respecting each other's boundaries.

If you're experiencing abuse or pressure, you can contact ${resources.dovvsu} for confidential support.`;
    }
  }
  
  return "Consent information available...";
}

// Clean mental health content
function talkAboutMentalHealth(message: string, understanding: any, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    return `That's very normal. Many young people feel stressed during puberty and adolescence. It's okay to feel worried, anxious, or confused about relationships and growing up.

Talking to someone you trust, joining youth clubs, or seeking counseling can help. Taking care of your body through sleep, good nutrition, and exercise also supports your mental health.

If you're feeling deeply sad for weeks, losing interest in things you used to enjoy, or having thoughts of hurting yourself, please reach out for help. You can contact:
- ${resources.mentalHealth}
- ${resources.ppag}

If it's an emergency or you're thinking about suicide, call ${resources.emergency} immediately or go to the nearest hospital.

Your feelings are valid, and asking for help is a sign of strength, not weakness.`;
  }
  
  return "Mental health information available...";
}

// Clean clinics content
function talkAboutClinics(lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  
  if (lang === 'en') {
    return `You can visit several places in Ghana for confidential sexual and reproductive health services:

PPAG (Planned Parenthood Association of Ghana)
Phone: ${resources.ppag}
Services: Contraception, STI testing and treatment, pregnancy testing and counseling, youth-friendly support

Marie Stopes Ghana
Phone: ${resources.marieStopes}
Services: Family planning, STI screening, safe abortion services (where legal), reproductive health counseling

DKT Ghana
Phone: ${resources.dkt}
Services: Contraception products and education, family planning support

These facilities offer confidential, professional services without judgment. Everything you discuss with them stays private, and services are often free or low-cost.`;
  }
  
  return "Clinic information available...";
}

// Clean myths content
function talkAboutMyths(message: string, lang: string): string {
  if (lang === 'en') {
    if (message.includes('first time') || message.includes('pregnant the first')) {
      return `This is false. You can get pregnant any time you have unprotected sex, even the very first time. Your body doesn't know if it's your first time or not. If you're sexually active, use protection every time.`;
    } else if (message.includes('condom') && (message.includes('break') || message.includes('burst'))) {
      return `No, condoms are safe when you use them correctly and check the expiry date. They very rarely break if you:\n- Check the expiration date before use\n- Open the package carefully without using teeth or sharp objects\n- Store them in a cool, dry place\n- Use a new one every time\n\nCondoms are very effective at preventing both pregnancy and STIs when used properly.`;
    } else {
      return `There are many myths about sexual and reproductive health. Common false beliefs include:\n- "You can't get pregnant the first time" - False. Pregnancy can happen any time with unprotected sex.\n- "Condoms always break" - False. They're very safe when used correctly.\n- "Birth control makes you infertile" - False. You can get pregnant soon after stopping contraception.\n\nWhat specific myth have you heard that you'd like me to address?`;
    }
  }
  
  return "Myth information available...";
}

// Handle urgent situations IMMEDIATELY
function handleUrgentSituation(message: string, lang: string): string {
  const resources = ghanaResources[lang as keyof typeof ghanaResources] || ghanaResources.en;
  const lower = message.toLowerCase();
  
  if (lang === 'en') {
    // Detect specific crisis type
    if (lower.match(/\b(suicide|kill myself|end it|want to die|hurt myself|self harm)\b/)) {
      return `I'm really worried about you right now. Please listen to me: You matter. Your life has value. I know things might feel unbearable, but these feelings can get better with help.

PLEASE CALL IMMEDIATELY:
Emergency: ${resources.emergency}
Mental Health Authority: ${resources.mentalHealth}

If you can't call right now, please tell a trusted adult or go to the nearest hospital. Don't stay alone.

You are not alone. People care about you and want to help. This pain you're feeling is temporary, and with support, things can get better.`;
    }
    
    if (lower.match(/\b(rape|raped|assault|assaulted|abused|forced|violence)\b/)) {
      return `I'm so sorry this happened to you. Please know this is not your fault. No matter what anyone says, what happened to you is not okay and you didn't deserve it.

PLEASE GET HELP IMMEDIATELY:
DOVVSU (24/7 support): ${resources.dovvsu}
Emergency Services: ${resources.emergency}

If you're still in danger, get to a safe place right now. Then contact DOVVSU or the police. They're trained to help you.

For medical care, emergency contraception, and counseling:
${resources.ppag}
${resources.marieStopes}

You don't have to go through this alone. Help is available, and what happened is not your fault.`;
    }
    
    // General urgent situation
    return `This sounds urgent. I want to make sure you get professional help right away.

CALL IMMEDIATELY:
Emergency: ${resources.emergency}
For abuse/violence: ${resources.dovvsu}
For mental health crisis: ${resources.mentalHealth}
For SRH emergency: ${resources.ppag} or ${resources.marieStopes}

These services are confidential and available to help you. Please reach out to them right now.`;
  }
  
  return "Urgent help available - please contact emergency services.";
}

// Handle off-topic
function handleOffTopic(lang: string): string {
  if (lang === 'en') {
    return `I'm here specifically to help with sexual and reproductive health topics. I can answer questions about:

- Puberty and body changes
- Periods and menstrual health
- Contraception and safe sex
- STIs and testing
- Pregnancy questions
- Consent and healthy relationships
- Mental health related to SRH
- Finding clinics and support in Ghana

What would you like to know about?`;
  }
  
  return "I can help with sexual and reproductive health questions.";
}

// Follow-up questions
function generateFollowUp(understanding: any, lang: string): string {
  const followUps = {
    en: [
      "Does that answer your question?",
      "Is there anything else you'd like to know?",
      "What other questions do you have?",
      "Would you like more information about any part of this?",
      "Is there something specific you'd like me to explain further?"
    ],
    twi: [
      "Ɛyii w'asɛm ano?",
      "Biribi foforo bi wɔ hɔ a wopɛ sɛ wohu?",
      "Nsɛm foforɔ bɛn na wowɔ?"
    ],
    ewe: [
      "Ɖe meɖo wò nyabiase ŋu?",
      "Nane bubu li si nèdi be yeanya?",
      "Nyabiase bubu ka le asiwò?"
    ]
  };

  const langFollowUps = followUps[lang as keyof typeof followUps] || followUps.en;
  return langFollowUps[Math.floor(Math.random() * langFollowUps.length)];
}

// Main export function with error handling
export function getBotResponse(userMessage: string, language: string = 'en', consultantMode: boolean = false): string {
  try {
    console.log('📨 [CHATBOT] Received message:', userMessage);
    console.log('🌍 [CHATBOT] Language:', language);
    console.log('👤 [CHATBOT] Consultant Mode:', consultantMode);
    
    if (!userMessage || typeof userMessage !== 'string') {
      logError('getBotResponse', 'Invalid user message', { userMessage, type: typeof userMessage });
      return getErrorResponse(language, consultantMode);
    }

    currentLanguage = language;
    const response = generateHumanResponse(userMessage, language, consultantMode);
    
    console.log('✅ [CHATBOT] Generated response successfully');
    return response;
  } catch (error) {
    logError('getBotResponse', error, { userMessage, language });
    return getErrorResponse(language, consultantMode);
  }
}

// Fallback error response
function getErrorResponse(language: string, consultantMode: boolean = false): string {
  const errorResponses = {
    en: "I'm having a small technical issue, but I'm still here to help! Could you please try asking your question again?",
    twi: "Mewɔ nneɛma kakra bi nanso mewɔ hɔ ara sɛ mɛboa wo! Mesrɛ wo, bisa wo nsɛm no bio.",
    ewe: "Nya seseleleme sue aɖe, gake meli afi sia ɖe be makpe ɖe ŋuwò! Meɖe kuku, bia wò biabiam ake.",
    ga: "Me wɔ nneɛma kakra bi nanso me wɔ hɔ sɛ ma boa wo! Ma srɛ wo, bisa wo nsɛm bio."
  };
  return errorResponses[language as keyof typeof errorResponses] || errorResponses.en;
}

export function getFollowUpSuggestions(language: string = 'en'): string[] {
  const suggestions = {
    en: [
      "What changes happen during puberty?",
      "How do I take care of myself during my period?",
      "What contraceptives can I use?",
      "How can I prevent STIs?",
      "What does consent mean?",
      "Where can I get help in Ghana?",
      "Is it normal to feel stressed?"
    ],
    twi: [
      "Nsakrae bɛn na ɛba mmabunu mu?",
      "Sɛnea mɛhwɛ me ho wɔ me bosome bere mu?",
      "Awo si ano bɛn na metumi de adi dwuma?",
      "Sɛnea mɛsi yadeɛ ano?",
      "Mpene kyerɛ sɛn?",
      "Ɛhe na metumi anya mmoa wɔ Ghana?"
    ],
    ewe: [
      "Tɔtrɔ ka dzɔna le ɖekakpui me?",
      "Alesi malé ɖokuinye ɖo le ɣletiɖoɖo me?",
      "Fuvɔvɔ ka mate ŋu azã?",
      "Alesi mate ŋu aɖe dɔlélewo ɖa?",
      "Lɔlɔ̃nu ɖe kae nye?",
      "Afi ka mate ŋu akpɔ kpekpeɖeŋu le Ghana?"
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.en;
}

// Reset conversation memory (for new sessions)
export function resetConversation(): void {
  conversationHistory = [];
  userConcerns = [];
  conversationDepth = 0;
}