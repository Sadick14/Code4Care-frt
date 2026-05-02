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
      },
      {
        title: "Growth Spurts at Different Times",
        scenario:
          "Amidu notices he is shorter than some friends and thinks he is falling behind. What is the best response?",
        choices: [
          "Assume something is permanently wrong",
          "Remember everyone develops at a different pace and ask a trusted adult if concerned",
          "Take unknown supplements from a friend",
          "Skip meals to become taller faster"
        ],
        correct: 1,
        feedback: [
          "Comparing yourself constantly can create unnecessary stress.",
          "Correct. Growth timing varies a lot during puberty.",
          "Unverified supplements can be unsafe.",
          "Skipping meals harms growth and energy."
        ]
      },
      {
        title: "Body Odor and Hygiene",
        scenario:
          "A girl notices stronger body odor after school sports and feels embarrassed. What should she do?",
        choices: [
          "Hide from everyone and stop exercising",
          "Shower regularly, wear clean clothes, and ask about hygiene if needed",
          "Use harsh chemicals on the skin",
          "Avoid drinking water all day"
        ],
        correct: 1,
        feedback: [
          "Avoiding activities is not the only option.",
          "Correct. Hygiene changes can help manage normal puberty body odor.",
          "Harsh products can irritate skin.",
          "Hydration supports health and activity."
        ]
      },
      {
        title: "Acne and Skin Changes",
        scenario:
          "A teenager gets acne and wants to scrub it hard until it disappears. What is safest?",
        choices: [
          "Scrub aggressively several times a day",
          "Use gentle washing and ask a health worker about skin care if needed",
          "Pick at every spot until it bleeds",
          "Use random oil mixtures from social media"
        ],
        correct: 1,
        feedback: [
          "Aggressive scrubbing can worsen irritation.",
          "Correct. Gentle skin care is usually better for acne.",
          "Picking can cause infection and scarring.",
          "Social media remedies are not always safe."
        ]
      },
      {
        title: "Voice Changes and Embarrassment",
        scenario:
          "A boy's voice cracks in class and everyone laughs. What is the healthiest response?",
        choices: [
          "Quit speaking forever",
          "Accept it as a normal change and speak to someone trusted if it feels upsetting",
          "Force the voice to change with medicine",
          "Start shouting to prove nothing changed"
        ],
        correct: 1,
        feedback: [
          "Avoiding speech can increase shame.",
          "Correct. Voice changes are common in puberty.",
          "Medicine is not needed for normal development.",
          "Trying to overcompensate can feel stressful."
        ]
      },
      {
        title: "Hair Growth and Privacy",
        scenario:
          "A young person notices new hair growth and worries classmates will tease them. What is a good response?",
        choices: [
          "Shave everything immediately without learning how",
          "Remember body hair is a normal puberty change and ask for support if needed",
          "Use dangerous removal chemicals",
          "Stop going to school"
        ],
        correct: 1,
        feedback: [
          "Rushing can lead to cuts or irritation.",
          "Correct. Body hair changes are common in puberty.",
          "Dangerous products can burn skin.",
          "School avoidance does not solve the problem."
        ]
      },
      {
        title: "Mood Swings at Home",
        scenario:
          "Tariq feels extra emotional and snaps at family members, then feels guilty. What is the healthiest next step?",
        choices: [
          "Keep everything bottled up forever",
          "Talk to someone trusted about the changes and practice calming skills",
          "Take random pills from a cabinet",
          "Stop sleeping to stay in control"
        ],
        correct: 1,
        feedback: [
          "Bottling emotions can make stress worse.",
          "Correct. Mood changes can happen during puberty and support helps.",
          "Taking unknown pills is unsafe.",
          "Sleep is important for mood and health."
        ]
      },
      {
        title: "When to Ask for Help",
        scenario:
          "A teen has sudden pain and bleeding that seems unusual. What should they do?",
        choices: [
          "Hide it and hope it disappears",
          "Tell a trusted adult or health worker and get checked",
          "Ask a friend to guess what it is",
          "Use only social media advice"
        ],
        correct: 1,
        feedback: [
          "Delaying help can make problems harder to manage.",
          "Correct. New or severe symptoms should be checked by a professional.",
          "Friends cannot diagnose medical concerns.",
          "Online advice cannot replace assessment."
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
      },
      {
        title: "Period Tracking",
        scenario:
          "A teen wants to predict their next period more accurately. What is helpful?",
        choices: [
          "Guess every month with no record",
          "Track dates and symptoms in a calendar or app",
          "Ignore all changes in the body",
          "Take random pills each cycle"
        ],
        correct: 1,
        feedback: [
          "Guessing makes planning harder.",
          "Correct. Tracking can help prepare for periods and notice changes.",
          "Ignoring symptoms can hide health issues.",
          "Random pills are unsafe."
        ]
      },
      {
        title: "Changing Pads on Time",
        scenario:
          "Mina uses one pad all day because she is worried others will notice. What is the safest response?",
        choices: [
          "Keep it on for as long as possible",
          "Change it regularly and carry supplies discreetly",
          "Never wash the area",
          "Use the same pad the next day too"
        ],
        correct: 1,
        feedback: [
          "Long use can increase discomfort and odor.",
          "Correct. Regular changes support hygiene and comfort.",
          "Cleaning helps prevent irritation.",
          "Reusing pads is not hygienic."
        ]
      },
      {
        title: "Severe Bleeding",
        scenario:
          "A girl soaks through pads very quickly and feels weak. What should she do?",
        choices: [
          "Ignore it because periods are always like this",
          "Tell a trusted adult and seek medical advice soon",
          "Exercise harder to stop bleeding",
          "Take someone else's medicine"
        ],
        correct: 1,
        feedback: [
          "Heavy bleeding can be a health concern.",
          "Correct. Unusually heavy bleeding should be checked.",
          "Exercise does not treat heavy bleeding.",
          "Unprescribed medicine can be harmful."
        ]
      },
      {
        title: "Managing Cramps at School",
        scenario:
          "A student has cramps during class and wants relief without panicking. What helps most?",
        choices: [
          "Hide silently and refuse all support",
          "Ask a teacher or nurse for support and use healthy coping steps",
          "Leave school without telling anyone",
          "Take unknown herbs from a stranger"
        ],
        correct: 1,
        feedback: [
          "Silent suffering can make pain feel worse.",
          "Correct. Trusted support can help manage period pain safely.",
          "Leaving without support can be risky.",
          "Unknown herbs may be unsafe."
        ]
      },
      {
        title: "Swimming During a Period",
        scenario:
          "A teen is invited to swim while on their period and feels unsure. What is true?",
        choices: [
          "Swimming is never possible during a period",
          "With the right menstrual products and comfort, many people can swim safely",
          "You must stay out of water for a month",
          "A period means all exercise must stop"
        ],
        correct: 1,
        feedback: [
          "Periods do not automatically ban swimming.",
          "Correct. Many people can stay active during menstruation.",
          "There is no month-long restriction.",
          "Movement is usually still possible if the person feels well."
        ]
      },
      {
        title: "Handling Leaks",
        scenario:
          "A student worries about leaking onto clothes at school. What is a helpful plan?",
        choices: [
          "Never leave the house again",
          "Carry backup pads, dark clothing, and know where to get support",
          "Use toilet paper alone all day",
          "Avoid drinking water"
        ],
        correct: 1,
        feedback: [
          "Avoiding life entirely is not practical.",
          "Correct. Preparation can reduce stress and embarrassment.",
          "Toilet paper is not a reliable long-term option.",
          "Hydration is still important."
        ]
      },
      {
        title: "Period Stigma",
        scenario:
          "Someone says periods are shameful and should be hidden from everyone. What is the best response?",
        choices: [
          "Agree and stay silent",
          "Explain that menstruation is normal and deserves respect",
          "Make fun of other people too",
          "Pretend periods do not exist"
        ],
        correct: 1,
        feedback: [
          "Silence can keep stigma alive.",
          "Correct. Respectful conversation helps reduce shame.",
          "Mocking others worsens stigma.",
          "Ignoring reality does not help anyone."
        ]
      },
      {
        title: "Missing School Plans",
        scenario:
          "A student worries a period will make them miss important school work. What helps most?",
        choices: [
          "Stop attending school every month",
          "Plan ahead with supplies and let a trusted adult know if support is needed",
          "Pretend nothing will ever happen",
          "Use random painkillers in advance"
        ],
        correct: 1,
        feedback: [
          "Planning can reduce disruption.",
          "Correct. Preparation helps keep school life on track.",
          "Ignoring the issue can increase stress.",
          "Medication should be used carefully and with guidance."
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
      },
      {
        title: "Asking Before Touching",
        scenario:
          "Two friends are hugging and one wants to hold hands. What is the best approach?",
        choices: [
          "Grab the hand without asking",
          "Ask first and respect the answer",
          "Assume the answer is always yes",
          "Make a joke and do it anyway"
        ],
        correct: 1,
        feedback: [
          "Touching without asking can feel unsafe.",
          "Correct. Simple questions show respect for boundaries.",
          "Assumptions are not consent.",
          "Jokes do not replace permission."
        ]
      },
      {
        title: "Changing Your Mind",
        scenario:
          "Someone agrees to a plan but later feels uncomfortable. What should happen?",
        choices: [
          "They are stuck forever once they agreed",
          "They can change their mind and the other person should stop",
          "They should be punished for being honest",
          "The other person should ignore the change"
        ],
        correct: 1,
        feedback: [
          "Consent can be withdrawn at any time.",
          "Correct. Ongoing consent matters in every situation.",
          "Honesty should be respected, not punished.",
          "Ignoring boundaries can cause harm."
        ]
      },
      {
        title: "Peer Pressure",
        scenario:
          "Friends push a teen to do something they do not want to do. What is a strong response?",
        choices: [
          "Give in immediately to fit in",
          "Say no clearly and leave if needed",
          "Blame yourself for feeling uncomfortable",
          "Wait until the pressure gets stronger"
        ],
        correct: 1,
        feedback: [
          "Giving in is not the same as choosing freely.",
          "Correct. Boundaries can protect safety and confidence.",
          "Pressure is not your fault.",
          "Delay can increase stress."
        ]
      },
      {
        title: "Sharing Screenshots",
        scenario:
          "A person wants to share a private chat to embarrass someone. What is the safest choice?",
        choices: [
          "Share it with everyone",
          "Respect privacy and keep private messages private",
          "Alter the chat and post it anyway",
          "Forward it to a group as a joke"
        ],
        correct: 1,
        feedback: [
          "Public shaming can cause serious harm.",
          "Correct. Respecting privacy is part of healthy boundaries.",
          "Manipulating messages is harmful and dishonest.",
          "Jokes can still hurt and violate trust."
        ]
      },
      {
        title: "Saying No to a Date",
        scenario:
          "A person is not interested in a relationship but does not want to upset the other person. What should they do?",
        choices: [
          "Pretend to agree and hope it goes away",
          "Say no respectfully and clearly",
          "Send mixed signals on purpose",
          "Agree just because of guilt"
        ],
        correct: 1,
        feedback: [
          "Mixed signals can create confusion.",
          "Correct. Honest communication is kinder and safer.",
          "Confusion can lead to more pressure.",
          "Guilt is not consent."
        ]
      },
      {
        title: "Respecting Space",
        scenario:
          "A friend says they need space after an argument. What is the healthiest reaction?",
        choices: [
          "Keep texting until they answer",
          "Respect the request and check in later if appropriate",
          "Spread rumors to punish them",
          "Show up without warning"
        ],
        correct: 1,
        feedback: [
          "Pushing harder can make things worse.",
          "Correct. Space can help calm a conflict.",
          "Rumors damage trust.",
          "Showing up uninvited can feel invasive."
        ]
      },
      {
        title: "Using Alcohol as Pressure",
        scenario:
          "Someone says a drink will make it easier to agree to something. What does that mean?",
        choices: [
          "It is a helpful way to relax someone",
          "It is pressure and a warning sign",
          "It means they care more",
          "It removes the need for consent"
        ],
        correct: 1,
        feedback: [
          "Pressuring with alcohol is not respectful.",
          "Correct. Consent cannot be built on pressure or intoxication.",
          "Care should never look like coercion.",
          "Consent is still required."
        ]
      },
      {
        title: "Walking Away Safely",
        scenario:
          "A person feels unsafe in a conversation and wants out. What is the best action?",
        choices: [
          "Stay until the other person wins",
          "Leave, seek support, and prioritize safety",
          "Escalate the fight so they can feel heard",
          "Pretend everything is fine"
        ],
        correct: 1,
        feedback: [
          "Safety should come first.",
          "Correct. Leaving a risky situation is a valid boundary.",
          "Escalation can increase danger.",
          "Ignoring discomfort does not protect anyone."
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
      },
      {
        title: "Missed Pill",
        scenario:
          "Someone on the pill forgets a dose and is worried. What is the best next step?",
        choices: [
          "Hide the mistake and do nothing",
          "Follow the pill instructions and seek advice if unsure",
          "Throw away all contraception immediately",
          "Take several pills at random"
        ],
        correct: 1,
        feedback: [
          "Ignoring instructions can lower protection.",
          "Correct. Reading the guidance helps after a missed pill.",
          "One mistake does not mean all protection is gone forever.",
          "Taking random pills is unsafe."
        ]
      },
      {
        title: "Withdrawal Method Myths",
        scenario:
          "A friend says withdrawal is always enough to prevent pregnancy. What is accurate?",
        choices: [
          "Withdrawal is the most reliable method",
          "Withdrawal is less reliable than using condoms or another proven method",
          "Pregnancy can never happen with withdrawal",
          "It works only for adults over 25"
        ],
        correct: 1,
        feedback: [
          "Reliability matters when preventing pregnancy.",
          "Correct. Proven methods offer better protection.",
          "Pregnancy can still happen.",
          "Age does not make withdrawal reliable."
        ]
      },
      {
        title: "Dual Protection",
        scenario:
          "A couple wants to lower pregnancy and STI risk. What is a strong plan?",
        choices: [
          "Use nothing and hope for the best",
          "Use condoms and discuss a reliable contraceptive method",
          "Depend only on one social media tip",
          "Switch methods every day"
        ],
        correct: 1,
        feedback: [
          "No protection increases risk.",
          "Correct. Dual protection improves safety.",
          "Online tips should be verified with professionals.",
          "Changing methods without guidance can reduce protection."
        ]
      },
      {
        title: "Talking to a Pharmacist",
        scenario:
          "A teen needs to understand contraception options but feels shy. What is helpful?",
        choices: [
          "Stay confused and avoid asking",
          "Speak to a pharmacist, clinic worker, or trusted health professional",
          "Ask strangers online for medicine",
          "Choose a method based on rumors"
        ],
        correct: 1,
        feedback: [
          "Avoidance can lead to mistakes.",
          "Correct. Trusted professionals can explain options safely.",
          "Strangers online are not a safe source.",
          "Rumors can be misleading."
        ]
      },
      {
        title: "Fertility After Stopping Contraception",
        scenario:
          "Someone worries they may never be able to get pregnant after stopping birth control. What is true?",
        choices: [
          "Most methods cause permanent infertility",
          "Fertility often returns after stopping many contraceptive methods",
          "Contraception only works by damaging the body",
          "Pregnancy is impossible after using contraception"
        ],
        correct: 1,
        feedback: [
          "This myth can create unnecessary fear.",
          "Correct. Many people become fertile again after stopping contraception.",
          "Contraception is designed to prevent pregnancy, not harm fertility.",
          "Contraception does not make pregnancy impossible forever."
        ]
      },
      {
        title: "Condom Storage",
        scenario:
          "A condom was kept in a hot wallet for weeks. What is the safest advice?",
        choices: [
          "Use it anyway because any condom is fine",
          "Replace it because heat and friction can damage condoms",
          "Stretch it first to make it stronger",
          "Freeze it before use"
        ],
        correct: 1,
        feedback: [
          "Damaged condoms may fail.",
          "Correct. Storage matters for effectiveness.",
          "Stretching can cause tears.",
          "Freezing can also damage the material."
        ]
      },
      {
        title: "Choosing a Long-Acting Method",
        scenario:
          "A person wants fewer daily reminders for pregnancy prevention. What should they do?",
        choices: [
          "Pick any method without advice",
          "Discuss long-acting options with a clinic or health worker",
          "Avoid all information and decide alone",
          "Use a method only because a friend said so"
        ],
        correct: 1,
        feedback: [
          "Safety improves with informed choice.",
          "Correct. A clinician can explain methods and side effects.",
          "Decisions made without information can be risky.",
          "Friends may not know what fits your needs."
        ]
      },
      {
        title: "Partner Discussion",
        scenario:
          "A couple disagrees about contraception. What is the healthiest next step?",
        choices: [
          "Shout until one person gives in",
          "Talk openly, respect boundaries, and seek accurate information together",
          "Ignore the issue completely",
          "Let social media choose for them"
        ],
        correct: 1,
        feedback: [
          "Conflict should not become control.",
          "Correct. Shared decisions work best with honest communication.",
          "Avoiding the issue can increase risk.",
          "Reliable health information is better than social media guesses."
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
      },
      {
        title: "Testing After Exposure",
        scenario:
          "Someone had unprotected sex and now feels worried about infection. What should they do?",
        choices: [
          "Wait forever and hope nothing happened",
          "Visit a clinic or health service to ask about testing and next steps",
          "Take antibiotics without advice",
          "Ignore the concern because there are no symptoms yet"
        ],
        correct: 1,
        feedback: [
          "Delay can make care harder.",
          "Correct. Getting advice early is safer after possible exposure.",
          "Antibiotics should not be taken without guidance.",
          "Many STIs have no symptoms at first."
        ]
      },
      {
        title: "Partner Testing",
        scenario:
          "One person tests positive for an STI. What is a responsible step?",
        choices: [
          "Keep it secret from everyone",
          "Encourage partners to test and get treatment if needed",
          "Blame a random person",
          "Stop all care after the first visit"
        ],
        correct: 1,
        feedback: [
          "Secrecy alone does not stop spread.",
          "Correct. Partner testing helps protect everyone involved.",
          "Blaming others is not useful or fair.",
          "Follow-up care matters."
        ]
      },
      {
        title: "Using Condoms Correctly",
        scenario:
          "A teen wants better protection from STIs. What matters most?",
        choices: [
          "Using a condom only halfway through sex",
          "Using condoms correctly every time",
          "Rinsing a condom and reusing it",
          "Keeping the condom in a hot pocket for months"
        ],
        correct: 1,
        feedback: [
          "Partial use lowers protection.",
          "Correct. Consistent correct use improves protection.",
          "Condoms should never be reused.",
          "Heat can weaken the material."
        ]
      },
      {
        title: "Asymptomatic Infections",
        scenario:
          "A friend says they feel healthy, so STI testing is unnecessary. What is accurate?",
        choices: [
          "Healthy feelings always mean no infection",
          "Some infections can be silent, so testing still matters",
          "Testing is only for married people",
          "Symptoms must always appear within one day"
        ],
        correct: 1,
        feedback: [
          "Symptoms are not the whole story.",
          "Correct. Silent infections are a real reason to test.",
          "Marital status does not remove risk.",
          "Some infections take time to show signs."
        ]
      },
      {
        title: "Finishing Treatment",
        scenario:
          "Symptoms improve after treatment starts, and the person wants to stop. What is best?",
        choices: [
          "Stop immediately because feeling better means cured",
          "Finish the treatment as directed by the clinic",
          "Share the pills with a friend",
          "Use extra herbal tea instead"
        ],
        correct: 1,
        feedback: [
          "Feeling better does not always mean the infection is gone.",
          "Correct. Follow instructions to reduce complications.",
          "Medication should not be shared.",
          "Herbal tea cannot replace treatment."
        ]
      },
      {
        title: "Avoiding Stigma",
        scenario:
          "A student worries people will judge them for getting tested. What is a helpful mindset?",
        choices: [
          "Testing is shameful",
          "Testing is a normal health decision and protects wellbeing",
          "Only 'bad' people get tested",
          "It is better to avoid health services entirely"
        ],
        correct: 1,
        feedback: [
          "Stigma keeps people from care.",
          "Correct. Testing is responsible health behavior.",
          "Anyone can need testing.",
          "Avoiding care can increase risk."
        ]
      },
      {
        title: "Knowing the Right Source",
        scenario:
          "A teen sees conflicting STI advice online. What should they trust most?",
        choices: [
          "The loudest comment",
          "A clinic, health worker, or trusted medical source",
          "A random rumor in a group chat",
          "A post with no evidence"
        ],
        correct: 1,
        feedback: [
          "Popularity does not equal accuracy.",
          "Correct. Trusted medical sources are safer.",
          "Rumors can spread misinformation.",
          "Evidence matters for health decisions."
        ]
      },
      {
        title: "Prevention Every Time",
        scenario:
          "Someone says they only need protection sometimes. What is correct?",
        choices: [
          "Protection should be used consistently if sex happens",
          "Skipping protection once is always fine",
          "Only one partner needs to worry about STIs",
          "Testing is unnecessary if both people feel healthy"
        ],
        correct: 0,
        feedback: [
          "Inconsistent protection leaves gaps in safety.",
          "Correct. Consistent use matters most.",
          "Both partners matter in STI prevention.",
          "Feeling healthy does not rule out infection."
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
      },
      {
        title: "Confirming a Test",
        scenario:
          "A person sees a positive home pregnancy test and feels overwhelmed. What should they do next?",
        choices: [
          "Assume it must be wrong and do nothing",
          "Confirm with a clinic or trusted health worker and discuss next steps",
          "Take random medicine immediately",
          "Hide from everyone for months"
        ],
        correct: 1,
        feedback: [
          "Ignoring the result can delay care.",
          "Correct. Confirming the result helps planning and support.",
          "Random medicine can be harmful.",
          "Support is important after a pregnancy test."
        ]
      },
      {
        title: "Warning Signs in Pregnancy",
        scenario:
          "A pregnant person has severe headache and swelling. What is the safest step?",
        choices: [
          "Wait and hope it passes",
          "Seek medical help promptly",
          "Exercise harder to fix it",
          "Stop drinking water completely"
        ],
        correct: 1,
        feedback: [
          "Some symptoms need urgent attention.",
          "Correct. Prompt care can protect mother and baby.",
          "Exercise does not replace medical assessment.",
          "Hydration is still important."
        ]
      },
      {
        title: "Nutrition Support",
        scenario:
          "A newly pregnant teen wants to stay strong and healthy. What is helpful?",
        choices: [
          "Skip meals to avoid weight gain",
          "Eat balanced meals and ask a health worker about nutrition",
          "Take pills from anyone who offers them",
          "Drink only energy drinks"
        ],
        correct: 1,
        feedback: [
          "Skipping meals can hurt both parent and baby.",
          "Correct. Nutrition supports healthy pregnancy.",
          "Unknown pills may be unsafe.",
          "Energy drinks are not a pregnancy plan."
        ]
      },
      {
        title: "Support After an Unplanned Pregnancy",
        scenario:
          "Someone is shocked by an unplanned pregnancy and does not know who to tell. What helps most?",
        choices: [
          "Handle everything alone forever",
          "Reach out to a trusted adult or counselor for confidential support",
          "Post it publicly for advice",
          "Use unsafe methods immediately"
        ],
        correct: 1,
        feedback: [
          "Isolation can make stress worse.",
          "Correct. Trusted support helps with safe decisions.",
          "Public posts can expose privacy.",
          "Unsafe methods can cause serious harm."
        ]
      },
      {
        title: "Avoiding Unsafe Methods",
        scenario:
          "A friend suggests a risky home method to end a pregnancy. What is the best response?",
        choices: [
          "Try it immediately",
          "Refuse unsafe methods and seek medical guidance",
          "Keep it secret and hope for the best",
          "Ask a stranger online to send pills"
        ],
        correct: 1,
        feedback: [
          "Risky methods can cause serious injury.",
          "Correct. Medical guidance is safer than dangerous shortcuts.",
          "Secrecy can increase harm.",
          "Unknown pills are not safe."
        ]
      },
      {
        title: "Clinic Visits",
        scenario:
          "A pregnant person feels fine and thinks checkups are unnecessary. What is true?",
        choices: [
          "Checkups are only needed when something is wrong",
          "Regular visits help monitor health even when things feel okay",
          "Pregnancy care is optional only at the end",
          "A friend can replace a clinic"
        ],
        correct: 1,
        feedback: [
          "Problems can exist before symptoms appear.",
          "Correct. Routine care helps catch issues early.",
          "Care matters throughout pregnancy.",
          "Friends cannot provide medical monitoring."
        ]
      },
      {
        title: "Birth Planning",
        scenario:
          "A young pregnant person wants to prepare safely for delivery. What is helpful?",
        choices: [
          "Avoid talking about a birth plan",
          "Discuss delivery plans, transport, and emergency contacts with a provider",
          "Wait until labor begins to think about anything",
          "Only ask friends on social media"
        ],
        correct: 1,
        feedback: [
          "Planning ahead reduces panic.",
          "Correct. Preparation supports safer delivery.",
          "Last-minute planning is stressful.",
          "Reliable support should come from trusted health services too."
        ]
      },
      {
        title: "Emotional Support",
        scenario:
          "A teen feels scared and ashamed about pregnancy. What should they be reminded?",
        choices: [
          "They must face it entirely alone",
          "They deserve respect, support, and confidential care",
          "They should be punished for asking questions",
          "Feeling scared means they cannot seek help"
        ],
        correct: 1,
        feedback: [
          "Shame should not block care.",
          "Correct. Support is important in pregnancy decisions.",
          "Judgment can make things harder.",
          "Fear is a reason to ask for help, not avoid it."
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
      },
      {
        title: "Respecting Alone Time",
        scenario:
          "One person in a relationship wants time alone to study. What is the healthiest response?",
        choices: [
          "Accuse them of hiding something",
          "Respect the request and support their goals",
          "Demand all of their time",
          "Punish them by ignoring them"
        ],
        correct: 1,
        feedback: [
          "Suspicion can become controlling.",
          "Correct. Healthy relationships allow individual space.",
          "Constant demands are not respectful.",
          "Punishment does not solve conflict."
        ]
      },
      {
        title: "Apologizing Well",
        scenario:
          "Someone hurts a friend and wants to make it right. What makes an apology real?",
        choices: [
          "Saying sorry and repeating the same behavior",
          "Taking responsibility and changing the behavior",
          "Blaming the other person for being upset",
          "Posting a public apology instead of talking"
        ],
        correct: 1,
        feedback: [
          "Empty apologies do not rebuild trust.",
          "Correct. Accountability matters.",
          "Blame shifts avoid responsibility.",
          "Real repair usually needs direct conversation."
        ]
      },
      {
        title: "Social Media Boundaries",
        scenario:
          "A partner wants all passwords and location sharing. What does that suggest?",
        choices: [
          "Trust and healthy closeness",
          "Possible control and weak boundaries",
          "Normal behavior in every relationship",
          "A joke with no real impact"
        ],
        correct: 1,
        feedback: [
          "Access is not the same as trust.",
          "Correct. Boundary respect matters online too.",
          "Not every relationship needs total access.",
          "Patterns of control can matter a lot."
        ]
      },
      {
        title: "Supporting a Friend",
        scenario:
          "A friend confides that they are being treated badly in a relationship. What is best?",
        choices: [
          "Tell them to ignore it always",
          "Listen, believe them, and help them find support",
          "Tell everyone else first",
          "Blame them for the abuse"
        ],
        correct: 1,
        feedback: [
          "Dismissing someone can isolate them.",
          "Correct. Support and belief can make a huge difference.",
          "Gossip can increase danger.",
          "Abuse is never the survivor's fault."
        ]
      },
      {
        title: "Healthy Jealousy?",
        scenario:
          "Someone says a partner checks their phone because they 'care too much.' What is accurate?",
        choices: [
          "Checking phones is always caring",
          "Constant monitoring is a red flag, not care",
          "Control is normal if people are dating",
          "Jealousy fixes trust problems"
        ],
        correct: 1,
        feedback: [
          "Control and care are not the same.",
          "Correct. Trust and respect are healthier.",
          "Relationship status does not justify control.",
          "Jealousy usually makes trust worse."
        ]
      },
      {
        title: "Making Time for Friends",
        scenario:
          "A relationship is taking over someone's life and they have no time for friends or hobbies. What is best?",
        choices: [
          "Cut off everyone else completely",
          "Keep balance and make space for other relationships and interests",
          "Ignore all personal needs",
          "Let one person control every choice"
        ],
        correct: 1,
        feedback: [
          "Isolation can be unhealthy.",
          "Correct. Balance supports wellbeing.",
          "Personal needs still matter.",
          "Control is not a healthy goal."
        ]
      },
      {
        title: "Saying No to Pressure",
        scenario:
          "A person is pressured to do something that feels wrong. What should they remember?",
        choices: [
          "Their comfort does not matter",
          "Their boundaries matter and they can say no",
          "They should agree to avoid conflict",
          "Pressure means the other person loves them"
        ],
        correct: 1,
        feedback: [
          "Your comfort matters.",
          "Correct. Boundaries deserve respect.",
          "Avoiding conflict is not worth ignoring safety.",
          "Pressure is not proof of love."
        ]
      },
      {
        title: "Red Flag Patterns",
        scenario:
          "A person notices repeated lying, threats, and control. What does that pattern suggest?",
        choices: [
          "A normal rough patch",
          "A serious red flag that needs attention",
          "A fun relationship challenge",
          "Proof of strong commitment"
        ],
        correct: 1,
        feedback: [
          "Repeated harm should not be minimized.",
          "Correct. Patterns matter in relationship safety.",
          "Harm is not a game.",
          "Control is not commitment."
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
      },
      {
        title: "Trouble Sleeping",
        scenario:
          "A student has not been sleeping well because they are stressed. What is a helpful step?",
        choices: [
          "Stay on the phone all night",
          "Create a calming bedtime routine and talk to someone if it continues",
          "Drink many energy drinks",
          "Skip water and meals"
        ],
        correct: 1,
        feedback: [
          "Screens and stimulants can make sleep harder.",
          "Correct. Routine and support can improve sleep.",
          "Energy drinks can worsen sleep problems.",
          "Basic self-care still matters."
        ]
      },
      {
        title: "Overthinking a Mistake",
        scenario:
          "Someone keeps replaying a small mistake and feels terrible. What can help?",
        choices: [
          "Call yourself names until it stops",
          "Use self-compassion and talk to a trusted person",
          "Pretend emotions do not exist",
          "Isolate completely"
        ],
        correct: 1,
        feedback: [
          "Harsh self-talk often makes distress worse.",
          "Correct. Compassion helps people recover from mistakes.",
          "Suppressing feelings does not solve them.",
          "Isolation can increase distress."
        ]
      },
      {
        title: "Grief and Stress",
        scenario:
          "A teen is grieving and struggling to focus at school. What is a reasonable response?",
        choices: [
          "Expect them to be fine immediately",
          "Encourage support from family, friends, or a counselor",
          "Tell them to stop feeling sad",
          "Ignore the loss"
        ],
        correct: 1,
        feedback: [
          "Grief does not follow a quick timeline.",
          "Correct. Support can ease the burden of grief.",
          "Feelings cannot be switched off on command.",
          "Acknowledging loss matters."
        ]
      },
      {
        title: "Coping Without Substances",
        scenario:
          "Someone wants to drink alcohol to stop feeling sad. What is a safer choice?",
        choices: [
          "Use alcohol because it works instantly",
          "Try healthy coping tools and ask for support",
          "Take random pills from a friend",
          "Do nothing and hope it disappears"
        ],
        correct: 1,
        feedback: [
          "Alcohol can worsen mood problems.",
          "Correct. Healthy coping is safer than substances.",
          "Unknown pills are dangerous.",
          "Support and coping strategies are more effective."
        ]
      },
      {
        title: "When To Ask For Help",
        scenario:
          "A person feels hopeless for several days and cannot keep up with normal life. What is best?",
        choices: [
          "Wait until it becomes unbearable",
          "Reach out to a trusted person or mental health professional soon",
          "Keep it secret forever",
          "Overwork to forget the feelings"
        ],
        correct: 1,
        feedback: [
          "Delaying can make things harder.",
          "Correct. Early support can prevent worsening distress.",
          "Silence can increase isolation.",
          "Exhaustion does not heal emotional pain."
        ]
      },
      {
        title: "Self-Harm Warning Signs",
        scenario:
          "A friend talks about wanting to disappear and withdraws from everyone. What should you do?",
        choices: [
          "Keep it secret and do nothing",
          "Tell a trusted adult or crisis support person right away",
          "Tell them to get over it",
          "Leave them alone for days"
        ],
        correct: 1,
        feedback: [
          "Safety concerns should be taken seriously.",
          "Correct. Immediate support is important.",
          "Minimizing distress can be dangerous.",
          "Isolation can increase risk."
        ]
      },
      {
        title: "Grounding in the Moment",
        scenario:
          "Someone feels overwhelmed and wants a quick calming strategy. What can help?",
        choices: [
          "Focus only on worst-case thoughts",
          "Slow breathing and noticing nearby objects or sounds",
          "Run until exhausted",
          "Argue with everyone around them"
        ],
        correct: 1,
        feedback: [
          "Rumination can intensify panic.",
          "Correct. Grounding can reduce intense stress in the moment.",
          "Exhaustion is not a coping skill.",
          "Conflict usually increases stress."
        ]
      },
      {
        title: "Checking In Daily",
        scenario:
          "A young person feels better some days and worse on others. What can help them track progress?",
        choices: [
          "Never notice patterns",
          "Jot down moods, sleep, and stressors to spot trends",
          "Judge every day as a failure",
          "Only ask for help when things are perfect"
        ],
        correct: 1,
        feedback: [
          "Patterns are useful information.",
          "Correct. Tracking can help identify triggers and supports.",
          "Harsh judgment can worsen symptoms.",
          "Support is useful before things become perfect."
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
