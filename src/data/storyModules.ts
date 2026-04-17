export interface StoryItem {
  title: string;
  scenario: string;
  choices: string[];
  correct: number;
  feedback: string[];
}

export interface StoryModule {
  id: string;
  title: string;
  description: string;
  stories: StoryItem[];
}

const englishModules: StoryModule[] = [
  {
    id: "puberty-body-changes",
    title: "Puberty and Body Changes",
    description: "Understand normal body changes and when to ask for help.",
    stories: [
      {
        title: "First Signs of Puberty",
        scenario:
          "Yaw notices new body changes and feels embarrassed. His friends are making jokes. What is the healthiest response?",
        choices: [
          "Ignore it and believe something is wrong with him",
          "Ask a trusted adult or health worker if his changes are normal",
          "Buy random medicine online",
          "Stop eating to delay growth"
        ],
        correct: 1,
        feedback: [
          "Ignoring fear can increase anxiety.",
          "Correct. Trusted guidance helps normalize puberty and reduce fear.",
          "Unverified medicine is unsafe.",
          "Food restriction harms health and development."
        ]
      },
      {
        title: "Wet Dreams and Myths",
        scenario:
          "Kojo has his first wet dream and worries he is sick. What should he do?",
        choices: [
          "Feel ashamed and tell no one",
          "Understand it can be a normal puberty event and ask questions if worried",
          "Use harmful herbal mixtures",
          "Avoid sleep"
        ],
        correct: 1,
        feedback: [
          "Shame can make normal experiences feel frightening.",
          "Correct. Wet dreams are often normal during puberty.",
          "Harmful remedies can cause injury.",
          "Lack of sleep harms mental and physical health."
        ]
      }
    ]
  },
  {
    id: "menstrual-health",
    title: "Menstrual Health",
    description: "Learn practical period care, comfort, and warning signs.",
    stories: [
      {
        title: "First Period at School",
        scenario:
          "Esi gets her first period during class and feels panicked. What should she do first?",
        choices: [
          "Stay silent and hide bloodstains all day",
          "Ask a trusted teacher, nurse, or friend for menstrual support",
          "Use unsafe materials from the floor",
          "Skip washing for several days"
        ],
        correct: 1,
        feedback: [
          "Silence may increase stress and discomfort.",
          "Correct. Trusted support helps with hygiene and confidence.",
          "Unsafe materials increase infection risk.",
          "Hygiene is important during periods."
        ]
      },
      {
        title: "Painful Cramps",
        scenario:
          "Akos notices severe period pain every month that affects school attendance. What is best?",
        choices: [
          "Endure pain without support forever",
          "Track symptoms and visit a clinic for advice",
          "Take anyone else's medication blindly",
          "Stop drinking water entirely"
        ],
        correct: 1,
        feedback: [
          "Untreated severe pain can affect wellbeing.",
          "Correct. Persistent severe pain should be assessed by professionals.",
          "Unsafe medication use is dangerous.",
          "Hydration supports health during menstruation."
        ]
      }
    ]
  },
  {
    id: "consent-boundaries",
    title: "Consent and Boundaries",
    description: "Practice consent, respect, and boundary communication.",
    stories: [
      {
        title: "Unsure Means Stop",
        scenario:
          "During a date, one partner says they are unsure and want to pause. What is the right response?",
        choices: [
          "Pressure them until they agree",
          "Stop immediately and respect the boundary",
          "Ignore words and continue",
          "Threaten to end the relationship"
        ],
        correct: 1,
        feedback: [
          "Pressure is not consent.",
          "Correct. Consent must be clear, free, and ongoing.",
          "Ignoring consent can cause harm and legal consequences.",
          "Threats are abusive and unsafe."
        ]
      },
      {
        title: "Digital Pressure",
        scenario:
          "A partner asks for private photos and says, 'If you love me, prove it.' What is safest?",
        choices: [
          "Send photos to keep the relationship",
          "Say no, protect privacy, and seek support if pressured",
          "Share with one friend first",
          "Use a fake account but still send"
        ],
        correct: 1,
        feedback: [
          "Pressure is a red flag.",
          "Correct. Consent and digital safety matter online too.",
          "Forwarding intimate content can still be harmful.",
          "Anonymity does not remove risk once shared."
        ]
      }
    ]
  },
  {
    id: "contraception-family-planning",
    title: "Contraception and Family Planning",
    description: "Choose safer pregnancy prevention with informed decisions.",
    stories: [
      {
        title: "Choosing a Method",
        scenario:
          "A couple wants to prevent pregnancy and reduce STI risk. What is the best plan?",
        choices: [
          "Use no method during first sex",
          "Use condoms correctly and discuss a reliable contraceptive option",
          "Depend only on social media tips",
          "Switch methods every day without guidance"
        ],
        correct: 1,
        feedback: [
          "No protection increases risk.",
          "Correct. Condoms plus informed planning is safer.",
          "Online tips should be verified with health professionals.",
          "Inconsistent use lowers protection."
        ]
      },
      {
        title: "Emergency Contraception Timing",
        scenario:
          "Condom failure happens. What should happen next?",
        choices: [
          "Wait two weeks before acting",
          "Seek emergency contraception quickly and guidance from a pharmacist or clinic",
          "Take random painkillers",
          "Assume pregnancy is impossible"
        ],
        correct: 1,
        feedback: [
          "Delay can reduce effectiveness.",
          "Correct. Emergency contraception works best as soon as possible.",
          "Painkillers do not prevent pregnancy.",
          "Pregnancy risk can still exist after condom failure."
        ]
      }
    ]
  },
  {
    id: "sti-prevention-testing",
    title: "STI Prevention and Testing",
    description: "Recognize symptoms, prevention methods, and testing steps.",
    stories: [
      {
        title: "No Symptoms Does Not Mean No STI",
        scenario:
          "A friend says testing is unnecessary because they feel fine. What is accurate?",
        choices: [
          "No symptoms always means no STI",
          "Many STIs can be asymptomatic, so regular testing matters",
          "Only older adults can get STIs",
          "Testing is only needed after marriage"
        ],
        correct: 1,
        feedback: [
          "Some STIs have no early symptoms.",
          "Correct. Regular testing supports early care and protection.",
          "Anyone sexually active can be at risk.",
          "Testing decisions should be based on risk, not marital status."
        ]
      },
      {
        title: "Clinic Follow Through",
        scenario:
          "After a positive STI test, what is the best next step?",
        choices: [
          "Stop treatment when symptoms improve",
          "Complete treatment and follow clinic instructions",
          "Hide diagnosis from all partners permanently",
          "Use herbal remedies only"
        ],
        correct: 1,
        feedback: [
          "Stopping early may lead to relapse or resistance.",
          "Correct. Full treatment and follow-up are essential.",
          "Partner communication and clinic guidance help prevent spread.",
          "Unverified treatment may not cure infection."
        ]
      }
    ]
  },
  {
    id: "pregnancy-options-care",
    title: "Pregnancy Care and Options",
    description: "Learn early pregnancy steps, support, and safe care pathways.",
    stories: [
      {
        title: "Missed Period Concern",
        scenario:
          "Adwoa misses a period and feels stressed. What should she do first?",
        choices: [
          "Ignore it for months",
          "Take a reliable pregnancy test and seek confidential counseling",
          "Use unsafe methods from strangers",
          "Assume stress is the only reason"
        ],
        correct: 1,
        feedback: [
          "Delays can increase anxiety and reduce options.",
          "Correct. Early confirmation helps informed next steps.",
          "Unsafe methods can cause serious harm.",
          "Only testing can confirm pregnancy status."
        ]
      },
      {
        title: "Antenatal Start",
        scenario:
          "A teen confirms pregnancy and wants to stay healthy. What is recommended?",
        choices: [
          "Avoid clinic care to hide pregnancy",
          "Start antenatal care early and discuss nutrition and warning signs",
          "Take unprescribed drugs for energy",
          "Skip checkups unless emergency"
        ],
        correct: 1,
        feedback: [
          "Avoiding care can increase maternal and fetal risks.",
          "Correct. Early antenatal care improves outcomes.",
          "Unprescribed drugs may be unsafe in pregnancy.",
          "Regular checkups are important even without emergencies."
        ]
      }
    ]
  },
  {
    id: "healthy-relationships",
    title: "Healthy Relationships",
    description: "Spot red flags and build respectful communication habits.",
    stories: [
      {
        title: "Jealousy vs Care",
        scenario:
          "One partner checks phones, tracks locations, and controls clothing choices. What does this suggest?",
        choices: [
          "Normal love behavior",
          "Controlling behavior and a warning sign",
          "A temporary joke",
          "A healthy communication style"
        ],
        correct: 1,
        feedback: [
          "Control is not the same as care.",
          "Correct. Control and monitoring are relationship red flags.",
          "Patterns matter, not excuses.",
          "Healthy communication respects autonomy."
        ]
      },
      {
        title: "Conflict Resolution",
        scenario:
          "After an argument, what is the healthiest way to repair trust?",
        choices: [
          "Threaten breakup every time",
          "Use calm communication, accountability, and boundaries",
          "Post private details online",
          "Silent treatment for weeks"
        ],
        correct: 1,
        feedback: [
          "Threats increase insecurity.",
          "Correct. Respectful dialogue and accountability build trust.",
          "Public shaming harms safety and trust.",
          "Extended silence can escalate conflict."
        ]
      }
    ]
  },
  {
    id: "mental-health-help-seeking",
    title: "Mental Health and Help-Seeking",
    description: "Connect emotional wellbeing with SRH decision-making.",
    stories: [
      {
        title: "Overwhelmed and Isolated",
        scenario:
          "A student feels overwhelmed, cannot sleep, and avoids everyone after a stressful SRH event. What is the best next step?",
        choices: [
          "Handle everything alone",
          "Reach out to a trusted person and seek mental health support",
          "Use alcohol to sleep",
          "Quit school immediately"
        ],
        correct: 1,
        feedback: [
          "Isolation often worsens distress.",
          "Correct. Support seeking is a strength, not a weakness.",
          "Alcohol can worsen mental health symptoms.",
          "Major decisions should be made with support and planning."
        ]
      },
      {
        title: "Panic in Public",
        scenario:
          "A young person has sudden panic symptoms in public. What should a friend do first?",
        choices: [
          "Mock them to make them stop",
          "Move them to a safer space, breathe together, and call trusted support if needed",
          "Leave immediately without saying anything",
          "Force them to run"
        ],
        correct: 1,
        feedback: [
          "Mocking increases fear and shame.",
          "Correct. Calm support and safety-first action helps.",
          "Abandonment can worsen panic.",
          "Forcing activity can intensify symptoms."
        ]
      }
    ]
  }
];

export function getStoryModules(language: string): StoryModule[] {
  // For now, use English scenarios across locales until full translations are available.
  // This keeps Story Mode complete for every language selection.
  void language;
  return englishModules;
}
