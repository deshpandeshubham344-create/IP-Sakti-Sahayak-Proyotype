/*
  IP-SAKTI Sahayak — frontend application logic
  Split from index.html to keep structure, style, and behavior separate.
*/

/* ============================================================
   LANGUAGE TRANSLATIONS
   ============================================================ */

const translations = {

    en:{
        brand:"IP-SAKTI Sahayak",
        start:"Start Asking",
        eyebrow:"MULTILINGUAL • SOURCE-CITED AI",
        heroTitle:"Understand Ayurveda IP with evidence you can verify.",
        heroSubtitle:"Ask IP and regulatory questions in your language and receive answers grounded in sources.",
        askCTA:"Ask IP-SAKTI →",
        patentsCTA:"Explore Patents",
        trust1:"Multilingual",
        trust2:"Source-Cited",
        trust3:"Ayurveda-Focused",
        wf1:"ASK",wf2:"UNDERSTAND",wf3:"RETRIEVE",wf4:"VERIFY",wf5:"EVIDENCE",
        navAsk:"Ask IP-SAKTI",navPatents:"Patents",navKB:"Knowledge Base",
        askHeading:"Ask IP-SAKTI",
        askSubheading:"Ask an IP or regulatory question about Ayurveda.",
        composerTitle:"What would you like to understand?",
        composerHelp:"Ask about Ayurveda IP, patents or regulatory guidance...",
        placeholder:"Ask about Ayurveda IP, patents or regulatory guidance...",
        jurisdiction:"Jurisdiction:",
        askButton:"Ask IP-SAKTI →",
        tryAsking:"Try asking",
        suggestions:[
            "Can this Ayurvedic formulation be patented?",
            "How is traditional knowledge considered in patent examination?",
            "What IP protection may apply to an Ayurveda product?"
        ],
        understanding:"Understanding your query",
        language:"Language",
        intent:"Intent",
        ipType:"IP Type",
        jurisdictionKey:"Jurisdiction",
        steps:[
            "Understanding query",
            "Reformulating query",
            "Searching authoritative sources",
            "Hybrid retrieval",
            "Reranking evidence",
            "Generating grounded response",
            "Verifying citations"
        ],
        answer:"✦ IP-SAKTI Response",
        understood:"Understood as",
        generation:"How this answer was generated",
        genSteps:["Your Question","Understand intent and context","Retrieve authoritative evidence","Rank supporting evidence","Generate grounded response","Verify citations"],
        followup:"Ask a follow-up question...",
        askShort:"Ask",
        evidence:"Evidence",
        matched:"✓ Evidence Matched",
        authority:"Authority",
        document:"Document",
        jurisdiction2:"Jurisdiction",
        sectionPage:"Section / Page",
        supporting:"Supporting passage",
        originalEvidence:"Original Evidence",
        localized:"Localized Explanation",
        viewSource:"View Source ↗",
        verifyEvidence:"Verify Evidence",
        disclaimer:"This prototype provides preliminary information from a curated corpus. It is not legal advice or a legal determination.",
        verifyTitle:"Evidence Verification",
        close:"Close",
        patentHeading:"Patent & Innovation Explorer",
        patentSubheading:"Describe your innovation and explore potentially similar patent records.",
        innovationHeading:"Describe your innovation",
        innovationPlaceholder:"Describe the formulation, process, ingredients, intended use, or technical innovation...",
        findPatents:"Find Similar Patents →",
        innovationUnderstanding:"Innovation Understanding",
        similarRecords:"Similar Patent Records",
        viewDetails:"View Details →",
        semantic:"Semantic Similarity",
        why:"Why this result appeared",
        relevant:"Relevant Text",
        patentDisclaimer:"Semantic similarity indicates textual/conceptual relevance and does not determine patentability.",
        kbHeading:"Knowledge Base",
        kbSubheading:"View indexed sources and demonstrate how authoritative sources can be updated.",
        kbTitle:"Knowledge Base",
        addSource:"+ Add Source",
        kbSource:"Source",kbType:"Type",kbStatus:"Status",
        indexed:"✓ Indexed",
        count:"3 Sources Indexed",
        addKnowledge:"Add Knowledge Source",
        uploadPDF:"Upload PDF",
        dragDrop:"Drag & Drop or choose a file",
        authorityLabel:"Authority",
        documentType:"Document Type",
        kbJurisdiction:"Jurisdiction",
        cancel:"Cancel",
        addIndex:"Add & Index",
        noEvidence:"No evidence available yet."
    },

    hi:{
        brand:"IP-SAKTI सहायक",start:"पूछना शुरू करें",
        eyebrow:"बहुभाषी • स्रोत-उद्धृत AI",
        heroTitle:"प्रमाण के साथ आयुर्वेद IP को समझें और सत्यापित करें।",
        heroSubtitle:"अपनी भाषा में IP और नियामक प्रश्न पूछें और स्रोत-आधारित उत्तर प्राप्त करें।",
        askCTA:"IP-SAKTI से पूछें →",patentsCTA:"पेटेंट खोजें",
        trust1:"बहुभाषी",trust2:"स्रोत-उद्धृत",trust3:"आयुर्वेद-केंद्रित",
        wf1:"पूछें",wf2:"समझें",wf3:"खोजें",wf4:"सत्यापित करें",wf5:"प्रमाण",
        navAsk:"IP-SAKTI से पूछें",navPatents:"पेटेंट",navKB:"ज्ञान आधार",
        askHeading:"IP-SAKTI से पूछें",askSubheading:"आयुर्वेद से जुड़ा IP या नियामक प्रश्न पूछें।",
        composerTitle:"आप क्या समझना चाहते हैं?",composerHelp:"आयुर्वेद IP, पेटेंट या नियामक मार्गदर्शन के बारे में पूछें...",
        placeholder:"अपना प्रश्न पूछें...",jurisdiction:"अधिकार क्षेत्र:",askButton:"IP-SAKTI से पूछें →",
        tryAsking:"पूछकर देखें",
        suggestions:[
            "क्या इस आयुर्वेदिक फॉर्मूलेशन का पेटेंट कराया जा सकता है?",
            "पेटेंट परीक्षा में पारंपरिक ज्ञान को कैसे माना जाता है?",
            "आयुर्वेद उत्पाद पर कौन सा IP संरक्षण लागू हो सकता है?"
        ],
        understanding:"आपके प्रश्न को समझा जा रहा है",language:"भाषा",intent:"उद्देश्य",ipType:"IP प्रकार",jurisdictionKey:"अधिकार क्षेत्र",
        steps:["प्रश्न को समझना","प्रश्न को पुनर्गठित करना","आधिकारिक स्रोत खोजना","हाइब्रिड रिट्रीवल","प्रमाणों की रैंकिंग","ग्राउंडेड उत्तर बनाना","उद्धरण सत्यापित करना"],
        answer:"✦ IP-SAKTI उत्तर",understood:"समझा गया",
        generation:"यह उत्तर कैसे बनाया गया",genSteps:["आपका प्रश्न","उद्देश्य और संदर्भ समझना","आधिकारिक प्रमाण खोजना","समर्थन करने वाले प्रमाणों की रैंकिंग","ग्राउंडेड उत्तर बनाना","उद्धरण सत्यापित करना"],
        followup:"फॉलो-अप प्रश्न पूछें...",askShort:"पूछें",evidence:"प्रमाण",matched:"✓ प्रमाण मिला",
        authority:"प्राधिकरण",document:"दस्तावेज़",jurisdiction2:"अधिकार क्षेत्र",sectionPage:"धारा / पृष्ठ",
        supporting:"समर्थनकारी अंश",originalEvidence:"मूल प्रमाण",localized:"हिंदी स्पष्टीकरण",
        viewSource:"आधिकारिक स्रोत खोलें ↗",verifyEvidence:"प्रमाण सत्यापित करें",
        disclaimer:"यह प्रोटोटाइप सीमित स्रोत-संग्रह से प्रारंभिक जानकारी देता है। यह कानूनी सलाह या कानूनी निर्धारण नहीं है।",
        verifyTitle:"प्रमाण सत्यापन",close:"बंद करें",
        patentHeading:"पेटेंट और Innovation Explorer",patentSubheading:"अपना innovation बताएं और समान पेटेंट रिकॉर्ड खोजें.",
        innovationHeading:"अपना innovation बताएं",innovationPlaceholder:"फॉर्मूलेशन, प्रक्रिया, सामग्री, उपयोग या तकनीकी innovation का वर्णन करें...",
        findPatents:"समान पेटेंट खोजें →",innovationUnderstanding:"Innovation Understanding",similarRecords:"समान पेटेंट रिकॉर्ड",
        viewDetails:"विवरण देखें →",semantic:"Semantic Similarity",why:"यह परिणाम क्यों आया",relevant:"प्रासंगिक पाठ",
        patentDisclaimer:"Semantic Similarity केवल वैचारिक/पाठीय प्रासंगिकता बताती है; यह पेटेंट योग्यता निर्धारित नहीं करती।",
        kbHeading:"ज्ञान आधार",kbSubheading:"इंडेक्स किए गए स्रोत देखें और ज्ञान आधार अपडेट करने का तरीका प्रदर्शित करें。",
        kbTitle:"ज्ञान आधार",addSource:"+ स्रोत जोड़ें",kbSource:"स्रोत",kbType:"प्रकार",kbStatus:"स्थिति",
        indexed:"✓ इंडेक्स किया गया",count:"3 स्रोत इंडेक्स किए गए",addKnowledge:"ज्ञान स्रोत जोड़ें",uploadPDF:"PDF अपलोड करें",
        dragDrop:"ड्रैग एंड ड्रॉप या फ़ाइल चुनें",authorityLabel:"प्राधिकरण",documentType:"दस्तावेज़ प्रकार",kbJurisdiction:"अधिकार क्षेत्र",
        cancel:"रद्द करें",addIndex:"जोड़ें और इंडेक्स करें",noEvidence:"अभी कोई प्रमाण उपलब्ध नहीं है।"
    },

    mr:{
        brand:"IP-SAKTI सहाय्यक",start:"विचारायला सुरू करा",
        eyebrow:"बहुभाषिक • स्रोत-उद्धृत AI",
        heroTitle:"पुराव्यांसह आयुर्वेद IP समजून घ्या आणि पडताळा.",
        heroSubtitle:"आपल्या भाषेत IP आणि नियामक प्रश्न विचारा आणि स्रोताधारित उत्तरे मिळवा.",
        askCTA:"IP-SAKTI ला विचारा →",patentsCTA:"पेटंट शोधा",
        trust1:"बहुभाषिक",trust2:"स्रोत-उद्धृत",trust3:"आयुर्वेद-केंद्रित",
        wf1:"विचारा",wf2:"समजा",wf3:"शोधा",wf4:"पडताळा",wf5:"पुरावा",
        navAsk:"IP-SAKTI ला विचारा",navPatents:"पेटंट",navKB:"ज्ञान आधार",
        askHeading:"IP-SAKTI ला विचारा",askSubheading:"आयुर्वेदाशी संबंधित IP किंवा नियामक प्रश्न विचारा.",
        composerTitle:"आपल्याला काय समजून घ्यायचे आहे?",composerHelp:"आयुर्वेद IP, पेटंट किंवा नियामक मार्गदर्शनाबद्दल विचारा...",
        placeholder:"आपला प्रश्न विचारा...",jurisdiction:"अधिकार क्षेत्र:",askButton:"IP-SAKTI ला विचारा →",
        tryAsking:"असे विचारून पहा",
        suggestions:[
            "या आयुर्वेदिक फॉर्म्युलेशनचे पेटंट मिळू शकते का?",
            "पेटंट परीक्षेत पारंपरिक ज्ञानाचा कसा विचार केला जातो?",
            "आयुर्वेद उत्पादनाला कोणते IP संरक्षण लागू होऊ शकते?"
        ],
        understanding:"आपला प्रश्न समजून घेतला जात आहे",language:"भाषा",intent:"उद्देश",ipType:"IP प्रकार",jurisdictionKey:"अधिकार क्षेत्र",
        steps:["प्रश्न समजून घेणे","प्रश्नाची पुनर्रचना","अधिकृत स्रोत शोधणे","हायब्रिड रिट्रीव्हल","पुराव्यांची रँकिंग","ग्राउंडेड उत्तर तयार करणे","उद्धरणे पडताळणे"],
        answer:"✦ IP-SAKTI उत्तर",understood:"समजलेले",
        generation:"हे उत्तर कसे तयार झाले",genSteps:["आपला प्रश्न","उद्देश व संदर्भ समजणे","अधिकृत पुरावे शोधणे","समर्थक पुराव्यांची रँकिंग","ग्राउंडेड उत्तर तयार करणे","उद्धरणे पडताळणे"],
        followup:"फॉलो-अप प्रश्न विचारा...",askShort:"विचारा",evidence:"पुरावे",matched:"✓ पुरावा जुळला",
        authority:"प्राधिकरण",document:"दस्तऐवज",jurisdiction2:"अधिकार क्षेत्र",sectionPage:"कलम / पृष्ठ",
        supporting:"समर्थन करणारा उतारा",originalEvidence:"मूळ पुरावा",localized:"मराठी स्पष्टीकरण",
        viewSource:"अधिकृत स्रोत उघडा ↗",verifyEvidence:"पुरावा पडताळा",
        disclaimer:"हा प्रोटोटाइप मर्यादित स्रोत-संग्रहातून प्राथमिक माहिती देतो. हा कायदेशीर सल्ला किंवा कायदेशीर निर्णय नाही.",
        verifyTitle:"पुरावा पडताळणी",close:"बंद करा",
        patentHeading:"पेटंट आणि Innovation Explorer",patentSubheading:"आपल्या innovation चे वर्णन करा आणि समान पेटंट रेकॉर्ड शोधा.",
        innovationHeading:"आपल्या innovation चे वर्णन करा",innovationPlaceholder:"फॉर्म्युलेशन, प्रक्रिया, घटक, उपयोग किंवा तांत्रिक innovation चे वर्णन करा...",
        findPatents:"समान पेटंट शोधा →",innovationUnderstanding:"Innovation Understanding",similarRecords:"समान पेटंट रेकॉर्ड",
        viewDetails:"तपशील पहा →",semantic:"Semantic Similarity",why:"हा परिणाम का दिसला",relevant:"संबंधित मजकूर",
        patentDisclaimer:"Semantic Similarity फक्त मजकूर/संकल्पनेची संबंधितता दाखवते; ती पेटंटयोग्यता ठरवत नाही.",
        kbHeading:"ज्ञान आधार",kbSubheading:"इंडेक्स केलेले स्रोत पहा आणि ज्ञान आधार अपडेट करण्याची पद्धत दाखवा.",
        kbTitle:"ज्ञान आधार",addSource:"+ स्रोत जोडा",kbSource:"स्रोत",kbType:"प्रकार",kbStatus:"स्थिती",
        indexed:"✓ इंडेक्स केले",count:"3 स्रोत इंडेक्स केले",addKnowledge:"ज्ञान स्रोत जोडा",uploadPDF:"PDF अपलोड करा",
        dragDrop:"ड्रॅग अँड ड्रॉप किंवा फाइल निवडा",authorityLabel:"प्राधिकरण",documentType:"दस्तऐवज प्रकार",kbJurisdiction:"अधिकार क्षेत्र",
        cancel:"रद्द करा",addIndex:"जोडा आणि इंडेक्स करा",noEvidence:"अद्याप कोणताही पुरावा उपलब्ध नाही."
    },

    bn:{...{}},
    ta:{...{}},
    te:{...{}},
    kn:{...{}},
    gu:{...{}},
    ml:{...{}},
    pa:{...{}},
    sa:{...{}}
};

/* Fill the remaining languages by cloning English wording for
   structural UI and then overriding the visible language names.
   This keeps the interface functional while preserving the selected
   language for backend routing. */
const fallbackLanguageNames = {
    bn: "বাংলা",
    ta: "தமிழ்",
    te: "తెలుగు",
    kn: "ಕನ್ನಡ",
    gu: "ગુજરાતી",
    ml: "മലയാളം",
    pa: "ਪੰਜਾਬੀ",
    sa: "संस्कृतम्"
};

const languageOverrides = {
    bn: {
        brand:"IP-SAKTI সহায়ক", start:"জিজ্ঞাসা শুরু করুন", eyebrow:"বহুভাষিক • উৎস-উদ্ধৃত AI",
        heroTitle:"যাচাইযোগ্য প্রমাণসহ আয়ুর্বেদ IP বুঝুন।", heroSubtitle:"আপনার ভাষায় IP ও নিয়ন্ত্রক প্রশ্ন করুন এবং উৎসভিত্তিক উত্তর পান।",
        askCTA:"IP-SAKTI-কে জিজ্ঞাসা করুন →", patentsCTA:"পেটেন্ট অনুসন্ধান", trust1:"বহুভাষিক", trust2:"উৎস-উদ্ধৃত", trust3:"আয়ুর্বেদ-কেন্দ্রিক",
        wf1:"জিজ্ঞাসা", wf2:"বোঝা", wf3:"অনুসন্ধান", wf4:"যাচাই", wf5:"প্রমাণ", navAsk:"IP-SAKTI-কে জিজ্ঞাসা করুন", navPatents:"পেটেন্ট", navKB:"জ্ঞানভাণ্ডার",
        askHeading:"IP-SAKTI-কে জিজ্ঞাসা করুন", askSubheading:"আয়ুর্বেদ সম্পর্কিত IP বা নিয়ন্ত্রক প্রশ্ন করুন।", composerTitle:"আপনি কী বুঝতে চান?",
        composerHelp:"আয়ুর্বেদ IP, পেটেন্ট বা নিয়ন্ত্রক নির্দেশনা সম্পর্কে জিজ্ঞাসা করুন...", placeholder:"আপনার প্রশ্ন লিখুন...", jurisdiction:"অধিক্ষেত্র:", askButton:"IP-SAKTI-কে জিজ্ঞাসা করুন →", tryAsking:"এভাবে জিজ্ঞাসা করতে পারেন",
        suggestions:["এই আয়ুর্বেদিক ফর্মুলেশনের পেটেন্ট করা যাবে কি?","পেটেন্ট পরীক্ষায় ঐতিহ্যগত জ্ঞান কীভাবে বিবেচনা করা হয়?","আয়ুর্বেদ পণ্যে কোন IP সুরক্ষা প্রযোজ্য হতে পারে?"],
        jurisdictions:["ভারত","মার্কিন যুক্তরাষ্ট্র","যুক্তরাজ্য","আন্তর্জাতিক (WIPO/PCT)"],
        understanding:"আপনার প্রশ্ন বোঝা হচ্ছে", language:"ভাষা", intent:"উদ্দেশ্য", ipType:"IP ধরন", jurisdictionKey:"অধিক্ষেত্র",
        steps:["প্রশ্ন বোঝা","প্রশ্ন পুনর্গঠন","প্রামাণিক উৎস খোঁজা","হাইব্রিড রিট্রিভাল","প্রমাণ র‌্যাঙ্ক করা","ভিত্তিসম্পন্ন উত্তর তৈরি","উদ্ধৃতি যাচাই"],
        answer:"✦ IP-SAKTI উত্তর", understood:"যা বোঝা হয়েছে", generation:"এই উত্তর কীভাবে তৈরি হয়েছে",
        genSteps:["আপনার প্রশ্ন","উদ্দেশ্য ও প্রসঙ্গ বোঝা","প্রামাণিক প্রমাণ খোঁজা","সমর্থনকারী প্রমাণ র‌্যাঙ্ক করা","ভিত্তিসম্পন্ন উত্তর তৈরি","উদ্ধৃতি যাচাই"],
        followup:"ফলো-আপ প্রশ্ন করুন...", askShort:"জিজ্ঞাসা", evidence:"প্রমাণ", matched:"✓ প্রমাণ মিলেছে", authority:"কর্তৃপক্ষ", document:"নথি", jurisdiction2:"অধিক্ষেত্র", sectionPage:"ধারা / পৃষ্ঠা", supporting:"সহায়ক অংশ", originalEvidence:"মূল প্রমাণ", localizedExplanation:"বাংলা ব্যাখ্যা", viewSource:"সরকারি উৎস খুলুন ↗", verifyEvidence:"প্রমাণ যাচাই করুন",
        disclaimer:"এই প্রোটোটাইপ একটি সীমিত উৎসভাণ্ডার থেকে প্রাথমিক তথ্য দেয়। এটি আইনি পরামর্শ বা আইনি সিদ্ধান্ত নয়।",
        evidenceScope:"বর্তমান MVP প্রমাণভাণ্ডার: ভারত। অন্যান্য অধিক্ষেত্রের নির্বাচন স্কেলযোগ্য কার্যপ্রবাহ প্রদর্শন করে; দেশভিত্তিক উৎস অনুসন্ধান পূর্ণ বাস্তবায়নের অংশ।",
        patentHeading:"পেটেন্ট ও ইনোভেশন এক্সপ্লোরার", patentSubheading:"আপনার ইনোভেশন বর্ণনা করুন এবং সম্ভাব্য অনুরূপ পেটেন্ট রেকর্ড খুঁজুন।", innovationHeading:"আপনার ইনোভেশন বর্ণনা করুন", innovationPlaceholder:"ফর্মুলেশন, প্রক্রিয়া, উপাদান, ব্যবহার বা প্রযুক্তিগত ইনোভেশনের বর্ণনা দিন...", findPatents:"অনুরূপ পেটেন্ট খুঁজুন →", innovationUnderstanding:"ইনোভেশন বোঝাপড়া", similarRecords:"অনুরূপ পেটেন্ট রেকর্ড", semantic:"সেমান্টিক সাদৃশ্য", why:"এই ফল কেন এসেছে", relevant:"প্রাসঙ্গিক পাঠ", patentDisclaimer:"সেমান্টিক সাদৃশ্য শুধু পাঠ্য/ধারণাগত প্রাসঙ্গিকতা দেখায়; এটি পেটেন্টযোগ্যতা নির্ধারণ করে না।", addSource:"+ উৎস যোগ করুন", kbHeading:"জ্ঞানভাণ্ডার", kbSubheading:"ইনডেক্স করা উৎস দেখুন এবং প্রামাণিক উৎস আপডেটের পদ্ধতি দেখান।", kbTitle:"জ্ঞানভাণ্ডার", kbSource:"উৎস", kbType:"ধরন", kbStatus:"অবস্থা", count:"৩টি উৎস ইনডেক্স করা", addKnowledge:"জ্ঞান উৎস যোগ করুন", uploadPDF:"PDF আপলোড করুন", dragDrop:"ড্র্যাগ ও ড্রপ বা ফাইল নির্বাচন করুন", authorityLabel:"কর্তৃপক্ষ", documentType:"নথির ধরন", kbJurisdiction:"অধিক্ষেত্র", cancel:"বাতিল", addIndex:"যোগ ও ইনডেক্স করুন", noEvidence:"এখনও কোনো প্রমাণ নেই।", semanticLabel:"সেমান্টিক সাদৃশ্য", drawerWhy:"এই ফল কেন এসেছে", drawerRelevant:"প্রাসঙ্গিক পাঠ"
    },
    ta: {
        brand:"IP-SAKTI உதவியாளர்", start:"கேட்க தொடங்குங்கள்", eyebrow:"பல்மொழி • ஆதார மேற்கோள் AI",
        heroTitle:"சரிபார்க்கக்கூடிய ஆதாரங்களுடன் ஆயுர்வேத IP-ஐ புரிந்துகொள்ளுங்கள்.", heroSubtitle:"உங்கள் மொழியில் IP மற்றும் ஒழுங்குமுறை கேள்விகளை கேட்டு ஆதாரமுள்ள பதில்களைப் பெறுங்கள்.", askCTA:"IP-SAKTI-யிடம் கேளுங்கள் →", patentsCTA:"காப்புரிமைகளை ஆராயுங்கள்", trust1:"பல்மொழி", trust2:"ஆதார மேற்கோள்", trust3:"ஆயுர்வேத மையம்", wf1:"கேள்", wf2:"புரிந்து கொள்", wf3:"தேடு", wf4:"சரிபார்", wf5:"ஆதாரம்", navAsk:"IP-SAKTI-யிடம் கேளுங்கள்", navPatents:"காப்புரிமைகள்", navKB:"அறிவு தளம்", askHeading:"IP-SAKTI-யிடம் கேளுங்கள்", askSubheading:"ஆயுர்வேதம் தொடர்பான IP அல்லது ஒழுங்குமுறை கேள்வியை கேளுங்கள்.", composerTitle:"நீங்கள் எதைப் புரிந்துகொள்ள விரும்புகிறீர்கள்?", composerHelp:"ஆயுர்வேத IP, காப்புரிமைகள் அல்லது ஒழுங்குமுறை வழிகாட்டுதல் பற்றி கேளுங்கள்...", placeholder:"உங்கள் கேள்வியை கேளுங்கள்...", jurisdiction:"சட்டஅதிகாரம்:", askButton:"IP-SAKTI மூலம் கேளுங்கள் →", tryAsking:"இப்படி கேட்கலாம்", suggestions:["இந்த ஆயுர்வேத தயாரிப்புக்கு காப்புரிமை பெற முடியுமா?","காப்புரிமை பரிசோதனையில் பாரம்பரிய அறிவு எவ்வாறு கருதப்படுகிறது?","ஆயுர்வேத தயாரிப்புக்கு எந்த IP பாதுகாப்பு பொருந்தலாம்?"], jurisdictions:["இந்தியா","அமெரிக்கா","ஐக்கிய இராச்சியம்","சர்வதேசம் (WIPO/PCT)"], understanding:"உங்கள் கேள்வியைப் புரிந்துகொள்கிறோம்", language:"மொழி", intent:"நோக்கம்", ipType:"IP வகை", jurisdictionKey:"சட்டஅதிகாரம்", steps:["கேள்வியைப் புரிதல்","கேள்வியை மறுவடிவமைத்தல்","அதிகாரப்பூர்வ ஆதாரங்களைத் தேடுதல்","ஹைபிரிட் மீட்டெடுப்பு","ஆதாரங்களை தரவரிசைப்படுத்தல்","ஆதார அடிப்படையிலான பதில் உருவாக்கல்","மேற்கோள்களை சரிபார்த்தல்"], answer:"✦ IP-SAKTI பதில்", understood:"புரிந்துகொண்டது", generation:"இந்த பதில் எவ்வாறு உருவாக்கப்பட்டது", genSteps:["உங்கள் கேள்வி","நோக்கம் மற்றும் சூழலைப் புரிதல்","அதிகாரப்பூர்வ ஆதாரத்தை மீட்டெடுத்தல்","ஆதாரங்களை தரவரிசைப்படுத்தல்","ஆதார அடிப்படையிலான பதில் உருவாக்கல்","மேற்கோள்களை சரிபார்த்தல்"], followup:"தொடர்ச்சி கேள்வியை கேளுங்கள்...", askShort:"கேள்", evidence:"ஆதாரங்கள்", matched:"✓ ஆதாரம் பொருந்தியது", authority:"அதிகாரம்", document:"ஆவணம்", jurisdiction2:"சட்டஅதிகாரம்", sectionPage:"பிரிவு / பக்கம்", supporting:"ஆதரிக்கும் பகுதி", originalEvidence:"அசல் ஆதாரம்", localizedExplanation:"தமிழ் விளக்கம்", viewSource:"அதிகாரப்பூர்வ மூலத்தைத் திறக்கவும் ↗", verifyEvidence:"ஆதாரத்தை சரிபார்க்கவும்", disclaimer:"இந்த முன்மாதிரி வரையறுக்கப்பட்ட ஆதாரத் தொகுப்பிலிருந்து ஆரம்ப தகவலை வழங்குகிறது. இது சட்ட ஆலோசனை அல்லது சட்டத் தீர்மானம் அல்ல.", evidenceScope:"தற்போதைய MVP ஆதாரத் தொகுப்பு: இந்தியா. பிற சட்டஅதிகாரத் தேர்வுகள் அளவுகோல் கொண்ட செயல்முறையை காட்டுகின்றன; நாடு-சார்ந்த ஆதார மீட்டெடுப்பு முழு செயல்பாட்டில் சேர்க்கப்படும்.", patentHeading:"காப்புரிமை மற்றும் புதுமை எக்ஸ்ப்ளோரர்", patentSubheading:"உங்கள் புதுமையை விவரித்து, சாத்தியமான ஒத்த காப்புரிமை பதிவுகளை ஆராயுங்கள்.", innovationHeading:"உங்கள் புதுமையை விவரிக்கவும்", innovationPlaceholder:"உருவாக்கம், செயல்முறை, பொருட்கள், பயன்பாடு அல்லது தொழில்நுட்ப புதுமையை விவரிக்கவும்...", findPatents:"ஒத்த காப்புரிமைகளை கண்டறியவும் →", innovationUnderstanding:"புதுமை புரிதல்", similarRecords:"ஒத்த காப்புரிமை பதிவுகள்", semantic:"கருத்தியல் ஒற்றுமை", why:"இந்த முடிவு ஏன் வந்தது", relevant:"தொடர்புடைய உரை", patentDisclaimer:"கருத்தியல் ஒற்றுமை உரை/கருத்து தொடர்பைக் காட்டுகிறது; அது காப்புரிமைத் தகுதியை தீர்மானிக்காது.", addSource:"+ ஆதாரத்தைச் சேர்க்கவும்", kbHeading:"அறிவு தளம்", kbSubheading:"பட்டியலிடப்பட்ட ஆதாரங்களைப் பார்த்து, அதிகாரப்பூர்வ ஆதாரங்களை புதுப்பிக்கும் முறையை காட்டுங்கள்.", kbTitle:"அறிவு தளம்", kbSource:"ஆதாரம்", kbType:"வகை", kbStatus:"நிலை", count:"3 ஆதாரங்கள் குறியிடப்பட்டன", addKnowledge:"அறிவு ஆதாரத்தைச் சேர்க்கவும்", uploadPDF:"PDF பதிவேற்றவும்", dragDrop:"இழுத்து விடவும் அல்லது கோப்பைத் தேர்ந்தெடுக்கவும்", authorityLabel:"அதிகாரம்", documentType:"ஆவண வகை", kbJurisdiction:"சட்டஅதிகாரம்", cancel:"ரத்து", addIndex:"சேர்த்து குறியிடவும்", noEvidence:"இன்னும் ஆதாரம் இல்லை."
    },
    te: {
        brand:"IP-SAKTI సహాయకుడు", start:"ప్రశ్నించడం ప్రారంభించండి", eyebrow:"బహుభాషా • మూలాధార AI", heroTitle:"ఆధారాలతో ఆయుర్వేద IPని అర్థం చేసుకోండి.", heroSubtitle:"మీ భాషలో IP మరియు నియంత్రణ ప్రశ్నలు అడిగి ఆధారాలతో సమాధానాలు పొందండి.", askCTA:"IP-SAKTIని అడగండి →", patentsCTA:"పేటెంట్లను అన్వేషించండి", trust1:"బహుభాషా", trust2:"మూలాధారిత", trust3:"ఆయుర్వేద కేంద్రితం", wf1:"అడగండి", wf2:"అర్థం చేసుకోండి", wf3:"శోధించండి", wf4:"ధృవీకరించండి", wf5:"ఆధారం", navAsk:"IP-SAKTIని అడగండి", navPatents:"పేటెంట్లు", navKB:"జ్ఞాన భాండారం", askHeading:"IP-SAKTIని అడగండి", askSubheading:"ఆయుర్వేదానికి సంబంధించిన IP లేదా నియంత్రణ ప్రశ్న అడగండి.", composerTitle:"మీరు ఏమి అర్థం చేసుకోవాలనుకుంటున్నారు?", composerHelp:"ఆయుర్వేద IP, పేటెంట్లు లేదా నియంత్రణ మార్గదర్శకత్వం గురించి అడగండి...", placeholder:"మీ ప్రశ్న అడగండి...", jurisdiction:"చట్ట పరిధి:", askButton:"IP-SAKTIని అడగండి →", tryAsking:"ఇలా అడగండి", suggestions:["ఈ ఆయుర్వేద ఫార్ములేషన్‌కు పేటెంట్ పొందగలమా?","పేటెంట్ పరీక్షలో సాంప్రదాయ జ్ఞానాన్ని ఎలా పరిగణిస్తారు?","ఆయుర్వేద ఉత్పత్తికి ఏ IP రక్షణ వర్తించవచ్చు?"], jurisdictions:["భారతదేశం","యునైటెడ్ స్టేట్స్","యునైటెడ్ కింగ్‌డమ్","అంతర్జాతీయ (WIPO/PCT)"], understanding:"మీ ప్రశ్నను అర్థం చేసుకుంటున్నాము", language:"భాష", intent:"ఉద్దేశ్యం", ipType:"IP రకం", jurisdictionKey:"చట్ట పరిధి", steps:["ప్రశ్నను అర్థం చేసుకోవడం","ప్రశ్నను పునర్నిర్మించడం","అధికారిక మూలాలను శోధించడం","హైబ్రిడ్ రిట్రీవల్","ఆధారాలను ర్యాంక్ చేయడం","ఆధారిత సమాధానాన్ని రూపొందించడం","ఉల్లేఖనాలను ధృవీకరించడం"], answer:"✦ IP-SAKTI సమాధానం", understood:"అర్థం చేసుకున్నది", generation:"ఈ సమాధానం ఎలా రూపొందించబడింది", genSteps:["మీ ప్రశ్న","ఉద్దేశ్యం మరియు సందర్భాన్ని అర్థం చేసుకోవడం","అధికారిక ఆధారాలను పొందడం","మద్దతు ఆధారాలను ర్యాంక్ చేయడం","ఆధారిత సమాధానాన్ని రూపొందించడం","ఉల్లేఖనాలను ధృవీకరించడం"], followup:"ఫాలో-అప్ ప్రశ్న అడగండి...", askShort:"అడగండి", evidence:"ఆధారాలు", matched:"✓ ఆధారం సరిపోలింది", authority:"అధికారం", document:"పత్రం", jurisdiction2:"చట్ట పరిధి", sectionPage:"విభాగం / పేజీ", supporting:"మద్దతు భాగం", originalEvidence:"అసలు ఆధారం", localizedExplanation:"తెలుగు వివరణ", viewSource:"అధికారిక మూలాన్ని తెరవండి ↗", verifyEvidence:"ఆధారాన్ని ధృవీకరించండి", disclaimer:"ఈ ప్రోటోటైప్ పరిమిత మూలాల సమాహారం నుండి ప్రాథమిక సమాచారాన్ని అందిస్తుంది. ఇది న్యాయ సలహా లేదా న్యాయ నిర్ణయం కాదు.", evidenceScope:"ప్రస్తుత MVP ఆధారాల సమాహారం: భారతదేశం. ఇతర చట్ట పరిధులు ప్రదర్శన కోసం ఉన్నాయి; దేశ-నిర్దిష్ట మూలాల రిట్రీవల్ పూర్తి అమలులో చేర్చబడుతుంది.", patentHeading:"పేటెంట్ & ఇన్నోవేషన్ ఎక్స్‌ప్లోరర్", patentSubheading:"మీ ఇన్నోవేషన్‌ను వివరించి, సారూప్య పేటెంట్ రికార్డులను అన్వేషించండి.", innovationHeading:"మీ ఇన్నోవేషన్‌ను వివరించండి", innovationPlaceholder:"ఫార్ములేషన్, ప్రక్రియ, పదార్థాలు, ఉపయోగం లేదా సాంకేతిక ఇన్నోవేషన్‌ను వివరించండి...", findPatents:"సారూప్య పేటెంట్లను కనుగొనండి →", innovationUnderstanding:"ఇన్నోవేషన్ అవగాహన", similarRecords:"సారూప్య పేటెంట్ రికార్డులు", semantic:"సెమాంటిక్ సారూప్యత", why:"ఈ ఫలితం ఎందుకు వచ్చింది", relevant:"సంబంధిత పాఠ్యం", patentDisclaimer:"సెమాంటిక్ సారూప్యత సంబంధితతను మాత్రమే చూపుతుంది; ఇది పేటెంట్ అర్హతను నిర్ణయించదు.", addSource:"+ మూలాన్ని జోడించండి", kbHeading:"జ్ఞాన భాండారం", kbSubheading:"ఇండెక్స్ చేసిన మూలాలను చూడండి మరియు అధికారిక మూలాలను నవీకరించే విధానాన్ని చూపండి.", kbTitle:"జ్ఞాన భాండారం", kbSource:"మూలం", kbType:"రకం", kbStatus:"స్థితి", count:"3 మూలాలు ఇండెక్స్ చేయబడ్డాయి", addKnowledge:"జ్ఞాన మూలాన్ని జోడించండి", uploadPDF:"PDF అప్‌లోడ్ చేయండి", dragDrop:"డ్రాగ్ & డ్రాప్ లేదా ఫైల్ ఎంచుకోండి", authorityLabel:"అధికారం", documentType:"పత్ర రకం", kbJurisdiction:"చట్ట పరిధి", cancel:"రద్దు", addIndex:"జోడించి ఇండెక్స్ చేయండి", noEvidence:"ఇంకా ఆధారం లేదు."
    },
    kn: {
        brand:"IP-SAKTI ಸಹಾಯಕ", start:"ಕೇಳಲು ಪ್ರಾರಂಭಿಸಿ", eyebrow:"ಬಹುಭಾಷಾ • ಮೂಲ-ಉಲ್ಲೇಖಿತ AI", heroTitle:"ಪರಿಶೀಲಿಸಬಹುದಾದ ಸಾಕ್ಷ್ಯಗಳೊಂದಿಗೆ ಆಯುರ್ವೇದ IP ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.", heroSubtitle:"ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ IP ಮತ್ತು ನಿಯಂತ್ರಣ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಮತ್ತು ಮೂಲಾಧಾರಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ.", askCTA:"IP-SAKTI ಅನ್ನು ಕೇಳಿ →", patentsCTA:"ಪೇಟೆಂಟ್‌ಗಳನ್ನು ಅನ್ವೇಷಿಸಿ", trust1:"ಬಹುಭಾಷಾ", trust2:"ಮೂಲ-ಉಲ್ಲೇಖಿತ", trust3:"ಆಯುರ್ವೇದ ಕೇಂದ್ರಿತ", wf1:"ಕೇಳಿ", wf2:"ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ", wf3:"ಹುಡುಕಿ", wf4:"ಪರಿಶೀಲಿಸಿ", wf5:"ಸಾಕ್ಷ್ಯ", navAsk:"IP-SAKTI ಅನ್ನು ಕೇಳಿ", navPatents:"ಪೇಟೆಂಟ್‌ಗಳು", navKB:"ಜ್ಞಾನ ಸಂಗ್ರಹ", askHeading:"IP-SAKTI ಅನ್ನು ಕೇಳಿ", askSubheading:"ಆಯುರ್ವೇದಕ್ಕೆ ಸಂಬಂಧಿಸಿದ IP ಅಥವಾ ನಿಯಂತ್ರಣ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.", composerTitle:"ನೀವು ಏನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ?", composerHelp:"ಆಯುರ್ವೇದ IP, ಪೇಟೆಂಟ್‌ಗಳು ಅಥವಾ ನಿಯಂತ್ರಣ ಮಾರ್ಗದರ್ಶನದ ಬಗ್ಗೆ ಕೇಳಿ...", placeholder:"ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...", jurisdiction:"ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ:", askButton:"IP-SAKTI ಅನ್ನು ಕೇಳಿ →", tryAsking:"ಹೀಗೆ ಕೇಳಬಹುದು", suggestions:["ಈ ಆಯುರ್ವೇದ ಫಾರ್ಮುಲೇಶನ್‌ಗೆ ಪೇಟೆಂಟ್ ಪಡೆಯಬಹುದೇ?","ಪೇಟೆಂಟ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನವನ್ನು ಹೇಗೆ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ?","ಆಯುರ್ವೇದ ಉತ್ಪನ್ನಕ್ಕೆ ಯಾವ IP ರಕ್ಷಣೆ ಅನ್ವಯಿಸಬಹುದು?"], jurisdictions:["ಭಾರತ","ಯುನೈಟೆಡ್ ಸ್ಟೇಟ್ಸ್","ಯುನೈಟೆಡ್ ಕಿಂಗ್‌ಡಮ್","ಅಂತರರಾಷ್ಟ್ರೀಯ (WIPO/PCT)"], understanding:"ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ", language:"ಭಾಷೆ", intent:"ಉದ್ದೇಶ", ipType:"IP ವಿಧ", jurisdictionKey:"ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ", steps:["ಪ್ರಶ್ನೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು","ಪ್ರಶ್ನೆಯನ್ನು ಮರುರಚಿಸುವುದು","ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ಹುಡುಕುವುದು","ಹೈಬ್ರಿಡ್ ರಿಟ್ರೀವಲ್","ಸಾಕ್ಷ್ಯಗಳನ್ನು ರ್ಯಾಂಕ್ ಮಾಡುವುದು","ಆಧಾರಿತ ಉತ್ತರ ರಚಿಸುವುದು","ಉಲ್ಲೇಖಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು"], answer:"✦ IP-SAKTI ಉತ್ತರ", understood:"ಅರ್ಥಮಾಡಿಕೊಂಡದ್ದು", generation:"ಈ ಉತ್ತರವನ್ನು ಹೇಗೆ ರಚಿಸಲಾಗಿದೆ", genSteps:["ನಿಮ್ಮ ಪ್ರಶ್ನೆ","ಉದ್ದೇಶ ಮತ್ತು ಸಂದರ್ಭವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು","ಅಧಿಕೃತ ಸಾಕ್ಷ್ಯ ಪಡೆಯುವುದು","ಬೆಂಬಲಿತ ಸಾಕ್ಷ್ಯಗಳನ್ನು ರ್ಯಾಂಕ್ ಮಾಡುವುದು","ಆಧಾರಿತ ಉತ್ತರ ರಚಿಸುವುದು","ಉಲ್ಲೇಖಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು"], followup:"ಮುಂದುವರಿದ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...", askShort:"ಕೇಳಿ", evidence:"ಸಾಕ್ಷ್ಯ", matched:"✓ ಸಾಕ್ಷ್ಯ ಹೊಂದಿದೆ", authority:"ಪ್ರಾಧಿಕಾರ", document:"ದಾಖಲೆ", jurisdiction2:"ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ", sectionPage:"ವಿಭಾಗ / ಪುಟ", supporting:"ಬೆಂಬಲಿಸುವ ಭಾಗ", originalEvidence:"ಮೂಲ ಸಾಕ್ಷ್ಯ", localizedExplanation:"ಕನ್ನಡ ವಿವರಣೆ", viewSource:"ಅಧಿಕೃತ ಮೂಲ ತೆರೆಯಿರಿ ↗", verifyEvidence:"ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲಿಸಿ", disclaimer:"ಈ ಪ್ರೋಟೋಟೈಪ್ ಸೀಮಿತ ಮೂಲ ಸಂಗ್ರಹದಿಂದ ಪ್ರಾಥಮಿಕ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ಇದು ಕಾನೂನು ಸಲಹೆ ಅಥವಾ ಕಾನೂನು ನಿರ್ಧಾರವಲ್ಲ.", evidenceScope:"ಪ್ರಸ್ತುತ MVP ಸಾಕ್ಷ್ಯ ಸಂಗ್ರಹ: ಭಾರತ. ಇತರ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಗಳ ಆಯ್ಕೆ ವಿಸ್ತರಿಸಬಹುದಾದ ಕಾರ್ಯಪ್ರವಾಹವನ್ನು ತೋರಿಸುತ್ತದೆ; ದೇಶ-ನಿರ್ದಿಷ್ಟ ಮೂಲ ಮರುಪಡೆಯುವುದು ಪೂರ್ಣ ಅನುಷ್ಠಾನದ ಭಾಗವಾಗಿದೆ.", patentHeading:"ಪೇಟೆಂಟ್ ಮತ್ತು ನವೀನತೆ ಎಕ್ಸ್‌ಪ್ಲೋರರ್", patentSubheading:"ನಿಮ್ಮ ನವೀನತೆಯನ್ನು ವಿವರಿಸಿ ಮತ್ತು ಸಾಧ್ಯವಾದ ಸಮಾನ ಪೇಟೆಂಟ್ ದಾಖಲೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.", innovationHeading:"ನಿಮ್ಮ ನವೀನತೆಯನ್ನು ವಿವರಿಸಿ", innovationPlaceholder:"ಫಾರ್ಮುಲೇಶನ್, ಪ್ರಕ್ರಿಯೆ, ಪದಾರ್ಥಗಳು, ಬಳಕೆ ಅಥವಾ ತಾಂತ್ರಿಕ ನವೀನತೆಯನ್ನು ವಿವರಿಸಿ...", findPatents:"ಸಮಾನ ಪೇಟೆಂಟ್‌ಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ →", innovationUnderstanding:"ನವೀನತೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು", similarRecords:"ಸಮಾನ ಪೇಟೆಂಟ್ ದಾಖಲೆಗಳು", semantic:"ಸೆಮ್ಯಾಂಟಿಕ್ ಸಾಮ್ಯತೆ", why:"ಈ ಫಲಿತಾಂಶ ಏಕೆ ಬಂದಿದೆ", relevant:"ಸಂಬಂಧಿತ ಪಠ್ಯ", patentDisclaimer:"ಸೆಮ್ಯಾಂಟಿಕ್ ಸಾಮ್ಯತೆ ಸಂಬಂಧವನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ; ಅದು ಪೇಟೆಂಟ್ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ.", addSource:"+ ಮೂಲ ಸೇರಿಸಿ", kbHeading:"ಜ್ಞಾನ ಸಂಗ್ರಹ", kbSubheading:"ಇಂಡೆಕ್ಸ್ ಮಾಡಿದ ಮೂಲಗಳನ್ನು ನೋಡಿ ಮತ್ತು ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ನವೀಕರಿಸುವ ವಿಧಾನವನ್ನು ತೋರಿಸಿ.", kbTitle:"ಜ್ಞಾನ ಸಂಗ್ರಹ", kbSource:"ಮೂಲ", kbType:"ವಿಧ", kbStatus:"ಸ್ಥಿತಿ", count:"3 ಮೂಲಗಳು ಇಂಡೆಕ್ಸ್ ಮಾಡಲಾಗಿದೆ", addKnowledge:"ಜ್ಞಾನ ಮೂಲ ಸೇರಿಸಿ", uploadPDF:"PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", dragDrop:"ಡ್ರ್ಯಾಗ್ & ಡ್ರಾಪ್ ಅಥವಾ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ", authorityLabel:"ಪ್ರಾಧಿಕಾರ", documentType:"ದಾಖಲೆ ವಿಧ", kbJurisdiction:"ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ", cancel:"ರದ್ದು", addIndex:"ಸೇರಿಸಿ ಮತ್ತು ಇಂಡೆಕ್ಸ್ ಮಾಡಿ", noEvidence:"ಇನ್ನೂ ಸಾಕ್ಷ್ಯ ಲಭ್ಯವಿಲ್ಲ."
    },
    gu: {
        brand:"IP-SAKTI સહાયક", start:"પૂછવાનું શરૂ કરો", eyebrow:"બહુભાષી • સ્ત્રોત-ઉદ્ધૃત AI", heroTitle:"ચકાસી શકાય એવા પુરાવા સાથે આયુર્વેદ IP સમજો.", heroSubtitle:"તમારી ભાષામાં IP અને નિયમનકારી પ્રશ્નો પૂછો અને સ્ત્રોત આધારિત જવાબો મેળવો.", askCTA:"IP-SAKTI ને પૂછો →", patentsCTA:"પેટન્ટ શોધો", trust1:"બહુભાષી", trust2:"સ્ત્રોત-ઉદ્ધૃત", trust3:"આયુર્વેદ કેન્દ્રિત", wf1:"પૂછો", wf2:"સમજો", wf3:"શોધો", wf4:"ચકાસો", wf5:"પુરાવો", navAsk:"IP-SAKTI ને પૂછો", navPatents:"પેટન્ટ", navKB:"જ્ઞાન આધાર", askHeading:"IP-SAKTI ને પૂછો", askSubheading:"આયુર્વેદ સંબંધિત IP અથવા નિયમનકારી પ્રશ્ન પૂછો.", composerTitle:"તમે શું સમજવા માંગો છો?", composerHelp:"આયુર્વેદ IP, પેટન્ટ અથવા નિયમનકારી માર્ગદર્શન વિશે પૂછો...", placeholder:"તમારો પ્રશ્ન પૂછો...", jurisdiction:"અધિકારક્ષેત્ર:", askButton:"IP-SAKTI ને પૂછો →", tryAsking:"આ રીતે પૂછો", suggestions:["શું આ આયુર્વેદિક ફોર્મ્યુલેશનને પેટન્ટ કરી શકાય?","પેટન્ટ પરીક્ષણમાં પરંપરાગત જ્ઞાનને કેવી રીતે ધ્યાનમાં લેવામાં આવે છે?","આયુર્વેદ ઉત્પાદન પર કયું IP રક્ષણ લાગુ પડી શકે?"], jurisdictions:["ભારત","યુનાઇટેડ સ્ટેટ્સ","યુનાઇટેડ કિંગડમ","આંતરરાષ્ટ્રીય (WIPO/PCT)"], understanding:"તમારો પ્રશ્ન સમજવામાં આવી રહ્યો છે", language:"ભાષા", intent:"ઉદ્દેશ", ipType:"IP પ્રકાર", jurisdictionKey:"અધિકારક્ષેત્ર", steps:["પ્રશ્ન સમજવો","પ્રશ્નનું પુનર્ગઠન","અધિકૃત સ્ત્રોતો શોધવા","હાઇબ્રિડ રિટ્રીવલ","પુરાવાઓને રેન્ક કરવું","પુરાવા આધારિત જવાબ બનાવવો","ઉદ્ધરણ ચકાસવું"], answer:"✦ IP-SAKTI જવાબ", understood:"સમજાયું", generation:"આ જવાબ કેવી રીતે બનાવાયો", genSteps:["તમારો પ્રશ્ન","ઉદ્દેશ અને સંદર્ભ સમજવો","અધિકૃત પુરાવા મેળવવા","સહાયક પુરાવાઓને રેન્ક કરવું","પુરાવા આધારિત જવાબ બનાવવો","ઉદ્ધરણ ચકાસવું"], followup:"ફોલો-અપ પ્રશ્ન પૂછો...", askShort:"પૂછો", evidence:"પુરાવા", matched:"✓ પુરાવો મળ્યો", authority:"સત્તા", document:"દસ્તાવેજ", jurisdiction2:"અધિકારક્ષેત્ર", sectionPage:"કલમ / પાનું", supporting:"સમર્થક અંશ", originalEvidence:"મૂળ પુરાવો", localizedExplanation:"ગુજરાતી સમજૂતી", viewSource:"અધિકૃત સ્ત્રોત ખોલો ↗", verifyEvidence:"પુરાવો ચકાસો", disclaimer:"આ પ્રોટોટાઇપ મર્યાદિત સ્ત્રોત સંગ્રહમાંથી પ્રાથમિક માહિતી આપે છે. આ કાનૂની સલાહ અથવા કાનૂની નિર્ણય નથી.", evidenceScope:"વર્તમાન MVP પુરાવા સંગ્રહ: ભારત. અન્ય અધિકારક્ષેત્રોની પસંદગી સ્કેલેબલ કાર્યપ્રવાહ દર્શાવે છે; દેશ-વિશિષ્ટ સ્ત્રોત શોધ પૂર્ણ અમલીકરણનો ભાગ છે.", patentHeading:"પેટન્ટ અને ઇનોવેશન એક્સપ્લોરર", patentSubheading:"તમારા ઇનોવેશનનું વર્ણન કરો અને સમાન પેટન્ટ રેકોર્ડ શોધો.", innovationHeading:"તમારા ઇનોવેશનનું વર્ણન કરો", innovationPlaceholder:"ફોર્મ્યુલેશન, પ્રક્રિયા, સામગ્રી, ઉપયોગ અથવા ટેકનિકલ ઇનોવેશનનું વર્ણન કરો...", findPatents:"સમાન પેટન્ટ શોધો →", innovationUnderstanding:"ઇનોવેશન સમજ", similarRecords:"સમાન પેટન્ટ રેકોર્ડ", semantic:"સેમેન્ટિક સમાનતા", why:"આ પરિણામ કેમ આવ્યું", relevant:"સંબંધિત લખાણ", patentDisclaimer:"સેમેન્ટિક સમાનતા માત્ર સંબંધિતતા દર્શાવે છે; તે પેટન્ટયોગ્યતા નક્કી કરતી નથી.", addSource:"+ સ્ત્રોત ઉમેરો", kbHeading:"જ્ઞાન આધાર", kbSubheading:"ઇન્ડેક્સ કરેલા સ્ત્રોતો જુઓ અને અધિકૃત સ્ત્રોતો અપડેટ કરવાની પ્રક્રિયા દર્શાવો.", kbTitle:"જ્ઞાન આધાર", kbSource:"સ્ત્રોત", kbType:"પ્રકાર", kbStatus:"સ્થિતિ", count:"3 સ્ત્રોત ઇન્ડેક્સ થયેલ", addKnowledge:"જ્ઞાન સ્ત્રોત ઉમેરો", uploadPDF:"PDF અપલોડ કરો", dragDrop:"ડ્રેગ અને ડ્રોપ અથવા ફાઇલ પસંદ કરો", authorityLabel:"સત્તા", documentType:"દસ્તાવેજ પ્રકાર", kbJurisdiction:"અધિકારક્ષેત્ર", cancel:"રદ કરો", addIndex:"ઉમેરો અને ઇન્ડેક્સ કરો", noEvidence:"હજુ કોઈ પુરાવો ઉપલબ્ધ નથી."
    },
    ml: {
        brand:"IP-SAKTI സഹായി", start:"ചോദിക്കാൻ തുടങ്ങുക", eyebrow:"ബഹുഭാഷാ • ഉറവിട-ഉദ്ധരിച്ച AI", heroTitle:"പരിശോധിക്കാവുന്ന തെളിവുകളോടെ ആയുർവേദ IP മനസ്സിലാക്കുക.", heroSubtitle:"നിങ്ങളുടെ ഭാഷയിൽ IP, നിയന്ത്രണ ചോദ്യങ്ങൾ ചോദിച്ച് ഉറവിടാധിഷ്ഠിത ഉത്തരങ്ങൾ നേടുക.", askCTA:"IP-SAKTIയോട് ചോദിക്കുക →", patentsCTA:"പേറ്റന്റുകൾ അന്വേഷിക്കുക", trust1:"ബഹുഭാഷാ", trust2:"ഉറവിട-ഉദ്ധരിച്ച", trust3:"ആയുർവേദ കേന്ദ്രീകൃത", wf1:"ചോദിക്കുക", wf2:"മനസ്സിലാക്കുക", wf3:"തിരയുക", wf4:"പരിശോധിക്കുക", wf5:"തെളിവ്", navAsk:"IP-SAKTIയോട് ചോദിക്കുക", navPatents:"പേറ്റന്റുകൾ", navKB:"അറിവ് ശേഖരം", askHeading:"IP-SAKTIയോട് ചോദിക്കുക", askSubheading:"ആയുർവേദവുമായി ബന്ധപ്പെട്ട IP അല്ലെങ്കിൽ നിയന്ത്രണ ചോദ്യങ്ങൾ ചോദിക്കുക.", composerTitle:"നിങ്ങൾ എന്താണ് മനസ്സിലാക്കാൻ ആഗ്രഹിക്കുന്നത്?", composerHelp:"ആയുർവേദ IP, പേറ്റന്റുകൾ അല്ലെങ്കിൽ നിയന്ത്രണ മാർഗ്ഗനിർദ്ദേശം ചോദിക്കുക...", placeholder:"നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക...", jurisdiction:"നിയമപരിധി:", askButton:"IP-SAKTIയോട് ചോദിക്കുക →", tryAsking:"ഇങ്ങനെ ചോദിക്കാം", suggestions:["ഈ ആയുർവേദ ഫോർമുലേഷനിന് പേറ്റന്റ് ലഭിക്കുമോ?","പേറ്റന്റ് പരിശോധനയിൽ പരമ്പരാഗത അറിവ് എങ്ങനെ പരിഗണിക്കുന്നു?","ആയുർവേദ ഉൽപ്പന്നത്തിന് ഏത് IP സംരക്ഷണം ബാധകമാകും?"], jurisdictions:["ഇന്ത്യ","യുണൈറ്റഡ് സ്റ്റേറ്റ്സ്","യുണൈറ്റഡ് കിംഗ്ഡം","അന്താരാഷ്ട്രം (WIPO/PCT)"], understanding:"നിങ്ങളുടെ ചോദ്യം മനസ്സിലാക്കുന്നു", language:"ഭാഷ", intent:"ഉദ്ദേശ്യം", ipType:"IP തരം", jurisdictionKey:"നിയമപരിധി", steps:["ചോദ്യം മനസ്സിലാക്കൽ","ചോദ്യം പുനഃസംഘടിപ്പിക്കൽ","അധികൃത ഉറവിടങ്ങൾ തിരയൽ","ഹൈബ്രിഡ് റിട്രീവൽ","തെളിവുകൾ റാങ്ക് ചെയ്യൽ","തെളിവ് അടിസ്ഥാനമായ മറുപടി സൃഷ്ടിക്കൽ","ഉദ്ധരണികൾ പരിശോധിക്കൽ"], answer:"✦ IP-SAKTI മറുപടി", understood:"മനസ്സിലാക്കിയത്", generation:"ഈ മറുപടി എങ്ങനെ സൃഷ്ടിച്ചു", genSteps:["നിങ്ങളുടെ ചോദ്യം","ഉദ്ദേശ്യവും സാഹചര്യവും മനസ്സിലാക്കൽ","അധികൃത തെളിവ് കണ്ടെത്തൽ","പിന്തുണയുള്ള തെളിവുകൾ റാങ്ക് ചെയ്യൽ","തെളിവ് അടിസ്ഥാനമായ മറുപടി സൃഷ്ടിക്കൽ","ഉദ്ധരണികൾ പരിശോധിക്കൽ"], followup:"തുടർചോദ്യം ചോദിക്കുക...", askShort:"ചോദിക്കുക", evidence:"തെളിവുകൾ", matched:"✓ തെളിവ് ലഭിച്ചു", authority:"അധികാരം", document:"രേഖ", jurisdiction2:"നിയമപരിധി", sectionPage:"വിഭാഗം / പേജ്", supporting:"പിന്തുണയ്ക്കുന്ന ഭാഗം", originalEvidence:"യഥാർത്ഥ തെളിവ്", localizedExplanation:"മലയാളം വിശദീകരണം", viewSource:"ഔദ്യോഗിക ഉറവിടം തുറക്കുക ↗", verifyEvidence:"തെളിവ് പരിശോധിക്കുക", disclaimer:"ഈ പ്രോട്ടോടൈപ്പ് പരിമിതമായ ഉറവിട ശേഖരത്തിൽ നിന്ന് പ്രാഥമിക വിവരങ്ങൾ നൽകുന്നു. ഇത് നിയമോപദേശമോ നിയമപരമായ തീരുമാനമോ അല്ല.", evidenceScope:"നിലവിലെ MVP തെളിവ് ശേഖരം: ഇന്ത്യ. മറ്റ് നിയമപരിധികൾ പ്രദർശനത്തിനായി; രാജ്യ-നിർദ്ദിഷ്ട ഉറവിട തിരച്ചിൽ പൂർണ്ണ നടപ്പാക്കലിൽ ചേർക്കും.", patentHeading:"പേറ്റന്റ് & ഇന്നൊവേഷൻ എക്സ്പ്ലോറർ", patentSubheading:"നിങ്ങളുടെ ഇന്നൊവേഷൻ വിവരിച്ച് സമാനമായ പേറ്റന്റ് രേഖകൾ അന്വേഷിക്കുക.", innovationHeading:"നിങ്ങളുടെ ഇന്നൊവേഷൻ വിവരിക്കുക", innovationPlaceholder:"ഫോർമുലേഷൻ, പ്രക്രിയ, ഘടകങ്ങൾ, ഉപയോഗം അല്ലെങ്കിൽ സാങ്കേതിക ഇന്നൊവേഷൻ വിവരിക്കുക...", findPatents:"സമാന പേറ്റന്റുകൾ കണ്ടെത്തുക →", innovationUnderstanding:"ഇന്നൊവേഷൻ മനസ്സിലാക്കൽ", similarRecords:"സമാന പേറ്റന്റ് രേഖകൾ", semantic:"സെമാന്റിക് സാമ്യം", why:"ഈ ഫലം എന്തുകൊണ്ട് വന്നു", relevant:"ബന്ധപ്പെട്ട വാചകം", patentDisclaimer:"സെമാന്റിക് സാമ്യം പാഠ/ആശയ ബന്ധം മാത്രം കാണിക്കുന്നു; ഇത് പേറ്റന്റ് യോഗ്യത നിർണ്ണയിക്കുന്നില്ല.", addSource:"+ ഉറവിടം ചേർക്കുക", kbHeading:"അറിവ് ശേഖരം", kbSubheading:"ഇൻഡെക്സ് ചെയ്ത ഉറവിടങ്ങൾ കാണുകയും ഔദ്യോഗിക ഉറവിടങ്ങൾ അപ്ഡേറ്റ് ചെയ്യുന്ന രീതി കാണിക്കുകയും ചെയ്യുക.", kbTitle:"അറിവ് ശേഖരം", kbSource:"ഉറവിടം", kbType:"തരം", kbStatus:"നില", count:"3 ഉറവിടങ്ങൾ ഇൻഡെക്സ് ചെയ്തു", addKnowledge:"അറിവ് ഉറവിടം ചേർക്കുക", uploadPDF:"PDF അപ്‌ലോഡ് ചെയ്യുക", dragDrop:"ഡ്രാഗ് & ഡ്രോപ്പ് അല്ലെങ്കിൽ ഫയൽ തിരഞ്ഞെടുക്കുക", authorityLabel:"അധികാരം", documentType:"രേഖ തരം", kbJurisdiction:"നിയമപരിധി", cancel:"റദ്ദാക്കുക", addIndex:"ചേർത്ത് ഇൻഡെക്സ് ചെയ്യുക", noEvidence:"ഇപ്പോൾ തെളിവൊന്നും ലഭ്യമല്ല."
    },
    pa: {
        brand:"IP-SAKTI ਸਹਾਇਕ", start:"ਪੁੱਛਣਾ ਸ਼ੁਰੂ ਕਰੋ", eyebrow:"ਬਹੁਭਾਸ਼ੀ • ਸਰੋਤ-ਹਵਾਲਾ AI", heroTitle:"ਪ੍ਰਮਾਣਿਤ ਕੀਤੇ ਜਾ ਸਕਣ ਵਾਲੇ ਸਬੂਤ ਨਾਲ ਆਯੁਰਵੇਦ IP ਨੂੰ ਸਮਝੋ.", heroSubtitle:"ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ IP ਅਤੇ ਨਿਯਮਕ ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਸਰੋਤ-ਆਧਾਰਿਤ ਜਵਾਬ ਲਵੋ.", askCTA:"IP-SAKTI ਨੂੰ ਪੁੱਛੋ →", patentsCTA:"ਪੇਟੈਂਟ ਖੋਜੋ", trust1:"ਬਹੁਭਾਸ਼ੀ", trust2:"ਸਰੋਤ-ਹਵਾਲਾ", trust3:"ਆਯੁਰਵੇਦ ਕੇਂਦਰਿਤ", wf1:"ਪੁੱਛੋ", wf2:"ਸਮਝੋ", wf3:"ਖੋਜੋ", wf4:"ਜਾਂਚੋ", wf5:"ਸਬੂਤ", navAsk:"IP-SAKTI ਨੂੰ ਪੁੱਛੋ", navPatents:"ਪੇਟੈਂਟ", navKB:"ਗਿਆਨ ਆਧਾਰ", askHeading:"IP-SAKTI ਨੂੰ ਪੁੱਛੋ", askSubheading:"ਆਯੁਰਵੇਦ ਨਾਲ ਸੰਬੰਧਿਤ IP ਜਾਂ ਨਿਯਮਕ ਸਵਾਲ ਪੁੱਛੋ।", composerTitle:"ਤੁਸੀਂ ਕੀ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹੋ?", composerHelp:"ਆਯੁਰਵੇਦ IP, ਪੇਟੈਂਟ ਜਾਂ ਨਿਯਮਕ ਮਾਰਗਦਰਸ਼ਨ ਬਾਰੇ ਪੁੱਛੋ...", placeholder:"ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ...", jurisdiction:"ਅਧਿਕਾਰ-ਖੇਤਰ:", askButton:"IP-SAKTI ਨੂੰ ਪੁੱਛੋ →", tryAsking:"ਇੰਝ ਪੁੱਛੋ", suggestions:["ਕੀ ਇਸ ਆਯੁਰਵੇਦਿਕ ਫਾਰਮੂਲੇਸ਼ਨ ਦਾ ਪੇਟੈਂਟ ਹੋ ਸਕਦਾ ਹੈ?","ਪੇਟੈਂਟ ਜਾਂਚ ਵਿੱਚ ਰਵਾਇਤੀ ਗਿਆਨ ਨੂੰ ਕਿਵੇਂ ਵਿਚਾਰਿਆ ਜਾਂਦਾ ਹੈ?","ਆਯੁਰਵੇਦ ਉਤਪਾਦ ਉੱਤੇ ਕਿਹੜੀ IP ਸੁਰੱਖਿਆ ਲਾਗੂ ਹੋ ਸਕਦੀ ਹੈ?"], jurisdictions:["ਭਾਰਤ","ਸੰਯੁਕਤ ਰਾਜ","ਯੂਨਾਈਟਡ ਕਿੰਗਡਮ","ਅੰਤਰਰਾਸ਼ਟਰੀ (WIPO/PCT)"], understanding:"ਤੁਹਾਡੇ ਸਵਾਲ ਨੂੰ ਸਮਝਿਆ ਜਾ ਰਿਹਾ ਹੈ", language:"ਭਾਸ਼ਾ", intent:"ਉਦੇਸ਼", ipType:"IP ਕਿਸਮ", jurisdictionKey:"ਅਧਿਕਾਰ-ਖੇਤਰ", steps:["ਸਵਾਲ ਨੂੰ ਸਮਝਣਾ","ਸਵਾਲ ਨੂੰ ਦੁਬਾਰਾ ਬਣਾਉਣਾ","ਅਧਿਕਾਰਤ ਸਰੋਤ ਖੋਜਣਾ","ਹਾਈਬ੍ਰਿਡ ਰਿਟਰੀਵਲ","ਸਬੂਤ ਰੈਂਕ ਕਰਨਾ","ਸਬੂਤ-ਆਧਾਰਿਤ ਜਵਾਬ ਬਣਾਉਣਾ","ਹਵਾਲੇ ਜਾਂਚਣਾ"], answer:"✦ IP-SAKTI ਜਵਾਬ", understood:"ਸਮਝਿਆ ਗਿਆ", generation:"ਇਹ ਜਵਾਬ ਕਿਵੇਂ ਬਣਾਇਆ ਗਿਆ", genSteps:["ਤੁਹਾਡਾ ਸਵਾਲ","ਉਦੇਸ਼ ਅਤੇ ਸੰਦਰਭ ਸਮਝਣਾ","ਅਧਿਕਾਰਤ ਸਬੂਤ ਪ੍ਰਾਪਤ ਕਰਨਾ","ਸਹਾਇਕ ਸਬੂਤਾਂ ਨੂੰ ਰੈਂਕ ਕਰਨਾ","ਸਬੂਤ-ਆਧਾਰਿਤ ਜਵਾਬ ਬਣਾਉਣਾ","ਹਵਾਲੇ ਜਾਂਚਣਾ"], followup:"ਫਾਲੋ-ਅੱਪ ਸਵਾਲ ਪੁੱਛੋ...", askShort:"ਪੁੱਛੋ", evidence:"ਸਬੂਤ", matched:"✓ ਸਬੂਤ ਮਿਲਿਆ", authority:"ਅਧਿਕਾਰ", document:"ਦਸਤਾਵੇਜ਼", jurisdiction2:"ਅਧਿਕਾਰ-ਖੇਤਰ", sectionPage:"ਧਾਰਾ / ਪੰਨਾ", supporting:"ਸਹਾਇਕ ਅੰਸ਼", originalEvidence:"ਮੂਲ ਸਬੂਤ", localizedExplanation:"ਪੰਜਾਬੀ ਵਿਆਖਿਆ", viewSource:"ਅਧਿਕਾਰਤ ਸਰੋਤ ਖੋਲ੍ਹੋ ↗", verifyEvidence:"ਸਬੂਤ ਦੀ ਜਾਂਚ ਕਰੋ", disclaimer:"ਇਹ ਪ੍ਰੋਟੋਟਾਈਪ ਸੀਮਿਤ ਸਰੋਤ ਸੰਗ੍ਰਹਿ ਤੋਂ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ। ਇਹ ਕਾਨੂੰਨੀ ਸਲਾਹ ਜਾਂ ਕਾਨੂੰਨੀ ਫੈਸਲਾ ਨਹੀਂ ਹੈ.", evidenceScope:"ਮੌਜੂਦਾ MVP ਸਬੂਤ ਸੰਗ੍ਰਹਿ: ਭਾਰਤ। ਹੋਰ ਅਧਿਕਾਰ-ਖੇਤਰ ਡੈਮੋ ਲਈ ਹਨ; ਦੇਸ਼-ਵਿਸ਼ੇਸ਼ ਸਰੋਤ ਰਿਟਰੀਵਲ ਪੂਰੇ ਲਾਗੂਕਰਨ ਵਿੱਚ ਜੋੜਿਆ ਜਾਵੇਗਾ.", patentHeading:"ਪੇਟੈਂਟ ਅਤੇ ਇਨੋਵੇਸ਼ਨ ਐਕਸਪਲੋਰਰ", patentSubheading:"ਆਪਣੇ ਇਨੋਵੇਸ਼ਨ ਦਾ ਵੇਰਵਾ ਦਿਓ ਅਤੇ ਸੰਭਾਵੀ ਸਮਾਨ ਪੇਟੈਂਟ ਰਿਕਾਰਡ ਲੱਭੋ.", innovationHeading:"ਆਪਣੇ ਇਨੋਵੇਸ਼ਨ ਦਾ ਵੇਰਵਾ ਦਿਓ", innovationPlaceholder:"ਫਾਰਮੂਲੇਸ਼ਨ, ਪ੍ਰਕਿਰਿਆ, ਸਮੱਗਰੀ, ਵਰਤੋਂ ਜਾਂ ਤਕਨੀਕੀ ਇਨੋਵੇਸ਼ਨ ਦਾ ਵੇਰਵਾ ਦਿਓ...", findPatents:"ਸਮਾਨ ਪੇਟੈਂਟ ਲੱਭੋ →", innovationUnderstanding:"ਇਨੋਵੇਸ਼ਨ ਸਮਝ", similarRecords:"ਸਮਾਨ ਪੇਟੈਂਟ ਰਿਕਾਰਡ", semantic:"ਸੈਮਾਂਟਿਕ ਸਮਾਨਤਾ", why:"ਇਹ ਨਤੀਜਾ ਕਿਉਂ ਆਇਆ", relevant:"ਸੰਬੰਧਿਤ ਪਾਠ", patentDisclaimer:"ਸੈਮਾਂਟਿਕ ਸਮਾਨਤਾ ਸਿਰਫ਼ ਪਾਠ/ਧਾਰਨਾ ਦੀ ਸੰਬੰਧਿਤਤਾ ਦਿਖਾਉਂਦੀ ਹੈ; ਇਹ ਪੇਟੈਂਟ ਯੋਗਤਾ ਤੈਅ ਨਹੀਂ ਕਰਦੀ।", addSource:"+ ਸਰੋਤ ਸ਼ਾਮਲ ਕਰੋ", kbHeading:"ਗਿਆਨ ਆਧਾਰ", kbSubheading:"ਇੰਡੈਕਸ ਕੀਤੇ ਸਰੋਤ ਵੇਖੋ ਅਤੇ ਅਧਿਕਾਰਤ ਸਰੋਤ ਅਪਡੇਟ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਦਿਖਾਓ।", kbTitle:"ਗਿਆਨ ਆਧਾਰ", kbSource:"ਸਰੋਤ", kbType:"ਕਿਸਮ", kbStatus:"ਸਥਿਤੀ", count:"3 ਸਰੋਤ ਇੰਡੈਕਸ ਕੀਤੇ", addKnowledge:"ਗਿਆਨ ਸਰੋਤ ਸ਼ਾਮਲ ਕਰੋ", uploadPDF:"PDF ਅਪਲੋਡ ਕਰੋ", dragDrop:"ਡ੍ਰੈਗ ਅਤੇ ਡ੍ਰਾਪ ਜਾਂ ਫਾਈਲ ਚੁਣੋ", authorityLabel:"ਅਧਿਕਾਰ", documentType:"ਦਸਤਾਵੇਜ਼ ਕਿਸਮ", kbJurisdiction:"ਅਧਿਕਾਰ-ਖੇਤਰ", cancel:"ਰੱਦ ਕਰੋ", addIndex:"ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਇੰਡੈਕਸ ਕਰੋ", noEvidence:"ਅਜੇ ਕੋਈ ਸਬੂਤ ਉਪਲਬਧ ਨਹੀਂ।"
    },
    sa: {
        brand:"IP-SAKTI सहायिका", start:"पृच्छितुं प्रारभताम्", eyebrow:"बहुभाषिकम् • स्रोत-उद्धृत AI", heroTitle:"प्रमाणैः सह आयुर्वेद-IP अवगच्छतु।", heroSubtitle:"स्वभाषया IP तथा नियामकप्रश्नान् पृच्छतु, स्रोताधारितानि उत्तराणि च प्राप्नोतु।", askCTA:"IP-SAKTI इत्यस्मै पृच्छतु →", patentsCTA:"पेटेण्ट्-अन्वेषणम्", trust1:"बहुभाषिकम्", trust2:"स्रोत-उद्धृतम्", trust3:"आयुर्वेद-केन्द्रितम्", wf1:"पृच्छतु", wf2:"अवगच्छतु", wf3:"अन्वेषयतु", wf4:"परीक्षताम्", wf5:"प्रमाणम्", navAsk:"IP-SAKTI इत्यस्मै पृच्छतु", navPatents:"पेटेण्टानि", navKB:"ज्ञानसङ्ग्रहः", askHeading:"IP-SAKTI इत्यस्मै पृच्छतु", askSubheading:"आयुर्वेदसम्बद्धं IP अथवा नियामकप्रश्नं पृच्छतु।", composerTitle:"भवान् किम् अवगन्तुम् इच्छति?", composerHelp:"आयुर्वेद-IP, पेटेण्ट् अथवा नियामकमार्गदर्शनविषये पृच्छतु...", placeholder:"स्वप्रश्नं पृच्छतु...", jurisdiction:"अधिकारक्षेत्रम्:", askButton:"IP-SAKTI इत्यस्मै पृच्छतु →", tryAsking:"एवं पृच्छतु", suggestions:["किं अस्य आयुर्वेदिक-सूत्रीकरणस्य पेटेण्ट् प्राप्तुं शक्यते?","पेटेण्ट्-परीक्षणे पारम्परिकं ज्ञानं कथं विचार्यते?","आयुर्वेदिक-उत्पादाय कः IP-संरक्षणप्रकारः प्रयोज्यः?"], jurisdictions:["भारतदेशः","संयुक्तराज्यानि","यूनाइटेड किङ्ग्डम्","अन्तर्राष्ट्रीयम् (WIPO/PCT)"], understanding:"भवतः प्रश्नम् अवगम्यते", language:"भाषा", intent:"उद्देश्यम्", ipType:"IP प्रकारः", jurisdictionKey:"अधिकारक्षेत्रम्", steps:["प्रश्नस्य अवबोधनम्","प्रश्नस्य पुनर्रचना","अधिकृत-स्रोत-अन्वेषणम्","हाइब्रिड् रिट्रीवल्","प्रमाणानां क्रमाङ्कनम्","प्रमाणाधारित-उत्तर-निर्माणम्","उद्धरण-परीक्षणम्"], answer:"✦ IP-SAKTI उत्तरम्", understood:"अवगतं रूपम्", generation:"इदं उत्तरं कथं निर्मितम्", genSteps:["भवतः प्रश्नः","उद्देश्य-सन्दर्भयोः अवबोधनम्","अधिकृत-प्रमाणस्य प्राप्तिः","समर्थक-प्रमाणानां क्रमाङ्कनम्","प्रमाणाधारित-उत्तर-निर्माणम्","उद्धरण-परीक्षणम्"], followup:"अनुवर्ती प्रश्नं पृच्छतु...", askShort:"पृच्छतु", evidence:"प्रमाणानि", matched:"✓ प्रमाणं प्राप्तम्", authority:"प्राधिकरणम्", document:"दस्तावेजः", jurisdiction2:"अधिकारक्षेत्रम्", sectionPage:"धारा / पृष्ठम्", supporting:"समर्थक-अंशः", originalEvidence:"मूलप्रमाणम्", localizedExplanation:"संस्कृतव्याख्या", viewSource:"अधिकृतं स्रोतं उद्घाटयतु ↗", verifyEvidence:"प्रमाणं परीक्षताम्", disclaimer:"अयं प्रोटोटाइपः सीमित-स्रोतसङ्ग्रहात् प्रारम्भिकां सूचनां ददाति। एषः कानूनी परामर्शः नास्ति, न च कानूनी निर्णयः।", evidenceScope:"वर्तमान-MVP-प्रमाणसङ्ग्रहः: भारतम्। अन्येषाम् अधिकारक्षेत्राणां चयनं प्रदर्शनार्थम्; देश-विशिष्ट-स्रोत-अन्वेषणं पूर्णकार्यान्वयने योजयिष्यते।", patentHeading:"पेटेण्ट् तथा नवोन्मेष-अन्वेषकः", patentSubheading:"स्वस्य नवोन्मेषं वर्णयतु तथा समान-पेटेण्ट्-अभिलेखान् अन्वेषयतु।", innovationHeading:"स्वस्य नवोन्मेषं वर्णयतु", innovationPlaceholder:"सूत्रीकरणं, प्रक्रिया, द्रव्याणि, उपयोगं अथवा तान्त्रिकं नवोन्मेषं वर्णयतु...", findPatents:"समानानि पेटेण्टानि अन्वेषयतु →", innovationUnderstanding:"नवोन्मेष-अवबोधनम्", similarRecords:"समान-पेटेण्ट्-अभिलेखाः", semantic:"सार्थक-साम्यम्", why:"एतत् फलितं कुतः आगतम्", relevant:"सम्बद्धः पाठः", patentDisclaimer:"सार्थक-साम्यं केवलं पाठ/अवधारणा-सम्बन्धं दर्शयति; तत् पेटेण्ट्-योग्यतां न निर्धारयति।", addSource:"+ स्रोतं योजयतु", kbHeading:"ज्ञानसङ्ग्रहः", kbSubheading:"अनुक्रमित-स्रोतान् पश्यतु तथा अधिकृत-स्रोत-परिवर्तनस्य प्रक्रियां दर्शयतु।", kbTitle:"ज्ञानसङ्ग्रहः", kbSource:"स्रोतः", kbType:"प्रकारः", kbStatus:"स्थितिः", count:"३ स्रोताः अनुक्रमिताः", addKnowledge:"ज्ञानस्रोतं योजयतु", uploadPDF:"PDF उपारोपयतु", dragDrop:"ड्रैग्-ड्रॉप् वा सञ्चिकां चिनुतु", authorityLabel:"प्राधिकरणम्", documentType:"दस्तावेज-प्रकारः", kbJurisdiction:"अधिकारक्षेत्रम्", cancel:"निरस्यताम्", addIndex:"योजयित्वा अनुक्रमयतु", noEvidence:"अद्यापि प्रमाणं न उपलब्धम्।"
    }
};

// Provide full field compatibility to the existing UI renderer.
for (const code of Object.keys(languageOverrides)) {
    const o = languageOverrides[code];
    const common = {
        wf1:o.wf1, wf2:o.wf2, wf3:o.wf3, wf4:o.wf4, wf5:o.wf5,
        genSteps:o.genSteps,
        evidence:o.evidence,
        viewSource:o.viewSource,
        verifyEvidence:o.verifyEvidence,
        patentHeading:o.patentHeading,
        patentSubheading:o.patentSubheading,
        addSource:o.addSource,
        kbSource:o.kbSource,
        kbType:o.kbType,
        kbStatus:o.kbStatus,
        semantic:o.semantic,
        why:o.why,
        relevant:o.relevant,
        noEvidence:o.noEvidence
    };
    languageOverrides[code] = {...o, ...common};
}

for (const code of Object.keys(fallbackLanguageNames)) {
    translations[code] = {
        ...translations.en,
        ...(languageOverrides[code] || {}),
        brand: languageOverrides[code]?.brand || `IP-SAKTI ${fallbackLanguageNames[code]}`,
        language: languageOverrides[code]?.language || fallbackLanguageNames[code],
        wf1: languageOverrides[code]?.wf1 || fallbackLanguageNames[code],
        wf2: languageOverrides[code]?.wf2 || translations.en.wf2,
        wf3: languageOverrides[code]?.wf3 || translations.en.wf3,
        wf4: languageOverrides[code]?.wf4 || translations.en.wf4,
        wf5: languageOverrides[code]?.wf5 || translations.en.wf5
    };
}


let currentLanguage = localStorage.getItem("ipSaktiLanguage") || "en";
let currentScreen = "landing";
let lastSources = [];
let activeSourceIndex = 0;
let currentPatent = null;
let lastQuestion = "";
let currentJurisdiction = "IN";


/* ============================================================
   HELPERS
   ============================================================ */

function t(){
    return translations[currentLanguage] || translations.en;
}

function esc(value){
    return String(value ?? "")
        .replace(/[&<>"']/g, ch => ({
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#039;"
        }[ch]));
}

function languageName(code){
    const names = {
        en:"English", hi:"Hindi", mr:"Marathi", bn:"Bengali",
        ta:"Tamil", te:"Telugu", kn:"Kannada", gu:"Gujarati",
        ml:"Malayalam", pa:"Punjabi", sa:"Sanskrit"
    };
    return names[code] || "English";
}


/* ============================================================
   TRANSLATION / UI
   ============================================================ */

function changeLanguage(){

    currentLanguage =
        document.getElementById("lang").value;

    localStorage.setItem(
        "ipSaktiLanguage",
        currentLanguage
    );

    applyTranslations();

    const jurisdictionSelect =
        document.getElementById("jurisdiction");

    if(jurisdictionSelect){
        jurisdictionSelect.value =
            ["IN","US","UK","WIPO"].includes(currentJurisdiction)
            ? currentJurisdiction
            : "IN";
    }

    updateJurisdictionPreview();

    // If results already exist, only rerender labels around them.
    if(lastSources.length){
        renderSources(lastSources);
        updateEvidencePanel(activeSourceIndex);
    }

    // Keep current screen; changing language should not navigate.
}

function applyTranslations(){
    const x=t();
    document.documentElement.lang=currentLanguage;

    document.getElementById("brandText").textContent=x.brand;
    document.getElementById("startButton").textContent=x.start;
    document.getElementById("heroEyebrow").textContent=x.eyebrow;
    document.getElementById("heroTitle").textContent=x.heroTitle;
    document.getElementById("heroSubtitle").textContent=x.heroSubtitle;
    document.getElementById("landingAsk").textContent=x.askCTA;
    document.getElementById("landingPatents").textContent=x.patentsCTA;
    document.getElementById("trust1").textContent=x.trust1;
    document.getElementById("trust2").textContent=x.trust2;
    document.getElementById("trust3").textContent=x.trust3;

    const wf=["wf1","wf2","wf3","wf4","wf5"];
    wf.forEach((id,i)=>document.getElementById(id).textContent=x[id] || x.wf?.[i] || "");

    document.getElementById("navAsk").textContent=x.navAsk;
    document.getElementById("navPatents").textContent=x.navPatents;
    document.getElementById("navKB").textContent=x.navKB;
    document.getElementById("askHeading").textContent=x.askHeading;
    document.getElementById("askSubheading").textContent=x.askSubheading;
    document.getElementById("composerTitle").textContent=x.composerTitle;
    document.getElementById("composerHelp").textContent=x.composerHelp;
    document.getElementById("query").placeholder=x.placeholder;
    document.getElementById("jurisdictionLabel").textContent=x.jurisdiction;
    document.getElementById("jurisdictionScope").textContent=x.scope || x.jurisdictionScope || "";

    const js=document.getElementById("jurisdiction");
    if(js && x.jurisdictions){
        [...js.options].forEach((o,i)=>{ if(x.jurisdictions[i]) o.textContent=x.jurisdictions[i]; });
    }

    document.getElementById("askButton").textContent=x.askButton;
    document.getElementById("tryAsking").textContent=x.tryAsking;
    document.querySelectorAll(".suggestion").forEach((el,i)=>{
        if(x.suggestions?.[i]){el.textContent=x.suggestions[i];el.dataset.suggestion=x.suggestions[i];}
    });

    document.getElementById("understandingTitle").textContent=x.understanding;
    const labels=x.labels || [x.language,x.intent,x.ipType,x.jurisdictionKey];
    ["chipLanguageLabel","chipIntentLabel","chipIPTypeLabel","chipJurisdictionLabel"].forEach((id,i)=>document.getElementById(id).textContent=labels[i] || "");
    const steps=x.steps || [];
    ["step1Text","step2Text","step3Text","step4Text","step5Text","step6Text","step7Text"].forEach((id,i)=>document.getElementById(id).textContent=steps[i] || "");

    document.getElementById("answerHeading").textContent=x.answer;
    document.getElementById("understoodTitle").textContent=x.understood;
    document.getElementById("generationTitle").textContent=x.generation;
    document.getElementById("followupInput").placeholder=x.followup;
    document.getElementById("followupButton").textContent=x.askShort;
    document.getElementById("evidenceHeading").textContent=x.evidence;
    document.getElementById("evidenceStatus").textContent=x.matched;
    const meta=x.meta || [x.authority,x.document,x.jurisdiction2,x.sectionPage];
    ["authorityKey","documentKey","jurisdictionKey","sectionKey"].forEach((id,i)=>document.getElementById(id).textContent=meta[i] || "");
    document.getElementById("supportingTitle").textContent=x.supporting;
    document.getElementById("viewSourceButton").textContent=x.viewSource;
    document.getElementById("verifyButton").textContent=x.verifyEvidence;
    document.getElementById("resultDisclaimer").textContent=x.disclaimer;
    document.getElementById("jurisdictionEvidenceNote").textContent=x.evidenceScope || "";

    (x.genSteps || x.gen || []).slice(0,6).forEach((value,i)=>{
        const id=["generation1","generation2","generation3","generation4","generation5","generation6"][i];
        document.getElementById(id).textContent=value;
    });

    document.getElementById("patentHeading").textContent=x.patentHeading;
    document.getElementById("patentSubheading").textContent=x.patentSubheading;
    document.getElementById("innovationHeading").textContent=x.innovationHeading;
    document.getElementById("innovationInput").placeholder=x.innovationPlaceholder;
    document.getElementById("findPatentsButton").textContent=x.findPatents;
    document.getElementById("innovationUnderstandingHeading").textContent=x.innovationUnderstanding;
    document.getElementById("similarRecordsHeading").textContent=x.similarRecords;
    const metricNote =
        document.getElementById("patentMetricNote");

    if(metricNote){
        const metricNotes = {
            en:"Prototype similarity uses TF-IDF cosine similarity. It indicates textual/conceptual relevance and does not determine patentability.",
            hi:"प्रोटोटाइप similarity TF-IDF cosine similarity का उपयोग करती है। यह केवल पाठ/संकल्पना की प्रासंगिकता दर्शाती है और पेटेंट योग्यता निर्धारित नहीं करती।",
            mr:"प्रोटोटाइप similarity साठी TF-IDF cosine similarity वापरली जाते. ही फक्त मजकूर/संकल्पनेची संबंधितता दर्शवते; पेटंटयोग्यता ठरवत नाही.",
            bn:"প্রোটোটাইপ similarity TF-IDF cosine similarity ব্যবহার করে। এটি কেবল পাঠ্য/ধারণাগত প্রাসঙ্গিকতা দেখায় এবং পেটেন্টযোগ্যতা নির্ধারণ করে না।",
            ta:"முன்மாதிரி similarity TF-IDF cosine similarity-ஐ பயன்படுத்துகிறது. இது உரை/கருத்து தொடர்பை மட்டுமே காட்டுகிறது; காப்புரிமைத் தகுதியை நிர்ணயிக்காது.",
            te:"ప్రోటోటైప్ similarity TF-IDF cosine similarity ను ఉపయోగిస్తుంది. ఇది కేవలం పాఠ్య/భావ సంబంధాన్ని చూపుతుంది; పేటెంట్ అర్హతను నిర్ణయించదు.",
            kn:"ಪ್ರೋಟೋಟೈಪ್ similarity TF-IDF cosine similarity ಅನ್ನು ಬಳಸುತ್ತದೆ. ಇದು ಪಠ್ಯ/ಪರಿಕಲ್ಪನೆಯ ಸಂಬಂಧವನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ; ಪೇಟೆಂಟ್ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ.",
            gu:"પ્રોટોટાઇપ similarity TF-IDF cosine similarity નો ઉપયોગ કરે છે. તે માત્ર લખાણ/વિચારની સંબંધિતતા દર્શાવે છે; પેટન્ટયોગ્યતા નક્કી કરતી નથી.",
            ml:"പ്രോട്ടോടൈപ്പ് similarity TF-IDF cosine similarity ഉപയോഗിക്കുന്നു. ഇത് പാഠ/ആശയ പ്രസക്തി മാത്രം കാണിക്കുന്നു; പേറ്റന്റ് യോഗ്യത നിർണ്ണയിക്കുന്നില്ല.",
            pa:"ਪ੍ਰੋਟੋਟਾਈਪ similarity TF-IDF cosine similarity ਵਰਤਦੀ ਹੈ। ਇਹ ਸਿਰਫ਼ ਪਾਠ/ਧਾਰਨਾ ਦੀ ਸੰਬੰਧਿਤਤਾ ਦਿਖਾਉਂਦੀ ਹੈ; ਪੇਟੈਂਟ ਯੋਗਤਾ ਨਹੀਂ ਤੈਅ ਕਰਦੀ।",
            sa:"प्रोटोटाइप्-similarity TF-IDF cosine similarity प्रयुङ्क्ते। एतत् केवलं पाठ-संकल्पनयोः सम्बद्धतां दर्शयति; पेटेण्ट्-योग्यतां न निर्धारयति।"
        };

        metricNote.textContent =
            metricNotes[currentLanguage] ||
            metricNotes.en;
    }


    document.getElementById("kbHeading").textContent=x.kbHeading;
    document.getElementById("kbSubheading").textContent=x.kbSubheading;
    document.getElementById("kbTitle").textContent=x.kbTitle;
    document.getElementById("addSourceButton").textContent=x.addSource;
    document.getElementById("kbSourceHeader").textContent=x.kbSource;
    document.getElementById("kbTypeHeader").textContent=x.kbType;
    document.getElementById("kbStatusHeader").textContent=x.kbStatus;
    document.getElementById("kbCount").textContent=x.count;

    document.getElementById("drawerTitle").textContent=x.viewDetails || "Patent Details";
    document.getElementById("similarityLabel").textContent=x.semantic;
    document.getElementById("whyResultHeading").textContent=x.why;
    document.getElementById("relevantTextHeading").textContent=x.relevant;
    document.getElementById("drawerSourceButton").textContent=x.viewSource;
    document.getElementById("drawerDisclaimer").textContent=x.patentDisclaimer;

    document.getElementById("addKnowledgeTitle").textContent=x.addKnowledge;
    document.getElementById("uploadPDF").textContent=x.uploadPDF;
    document.getElementById("dragDrop").textContent=x.dragDrop;
    document.getElementById("authorityLabel").textContent=x.authorityLabel;
    document.getElementById("documentTypeLabel").textContent=x.documentType;
    document.getElementById("kbJurisdictionLabel").textContent=x.kbJurisdiction;
    document.getElementById("cancelKBButton").textContent=x.cancel;
    document.getElementById("indexKBButton").textContent=x.addIndex;
    document.getElementById("verifyModalTitle").textContent=x.verifyTitle;
    document.getElementById("verifyCloseButton").textContent=x.close;

    const prototypeStatusTranslations = {

        en: {
            title: "Prototype Status",
            description:
                "The current demo proves the core IP research and evidence-verification workflow.",

            implementedTitle: "Currently Implemented",

            implemented1:
                "Multilingual Ayurveda IP interaction across 11 supported languages",

            implemented2:
                "Jurisdiction-aware IP and regulatory retrieval",

            implemented3:
                "Evidence-grounded answers with traceable source citations",

            implemented4:
                "Curated India, UK, US and WIPO knowledge sources",

            implemented5:
                "User PDF upload, text extraction and indexing",

            implemented6:
                "Short evidence excerpts with source verification and View Source",

            implemented7:
                "Dynamic Ayurveda patent similarity search",

            implemented8:
                "ASK · EXPLORE · VERIFY workflow",

            roadmapTitle:
                "Full Implementation Roadmap",

            roadmap1:
                "LLM-powered grounded answer generation and synthesis",

            roadmap2:
                "Multilingual embeddings with hybrid retrieval and advanced reranking",

            roadmap3:
                "Qdrant vector database for scalable semantic search",

            roadmap4:
                "PostgreSQL for production-grade document and user data management",

            roadmap5:
                "OCR and large-scale document ingestion for scanned sources",

            roadmap6:
                "Expanded authoritative sources, languages and jurisdictions",

            roadmap7:
                "Continuous source updating and provenance/version management"
        },


        hi: {
            title: "प्रोटोटाइप स्थिति",
            description:
                "वर्तमान डेमो मुख्य IP अनुसंधान और प्रमाण-सत्यापन कार्यप्रवाह को प्रदर्शित करता है।",

            implementedTitle: "वर्तमान में लागू",

            implemented1:
                "11 समर्थित भाषाओं में बहुभाषी आयुर्वेद IP इंटरैक्शन",

            implemented2:
                "अधिकार क्षेत्र के अनुसार IP और नियामक जानकारी की खोज",

            implemented3:
                "प्रमाण-आधारित उत्तर और ट्रेस करने योग्य स्रोत संदर्भ",

            implemented4:
                "भारत, यूके, अमेरिका और WIPO के चयनित ज्ञान स्रोत",

            implemented5:
                "उपयोगकर्ता PDF अपलोड, टेक्स्ट निष्कर्षण और इंडेक्सिंग",

            implemented6:
                "संक्षिप्त प्रमाण अंश, स्रोत सत्यापन और View Source",

            implemented7:
                "डायनेमिक आयुर्वेद पेटेंट समानता खोज",

            implemented8:
                "पूछें · खोजें · सत्यापित करें कार्यप्रवाह",

            roadmapTitle:
                "पूर्ण कार्यान्वयन रोडमैप",

            roadmap1:
                "LLM-आधारित ग्राउंडेड उत्तर निर्माण और संश्लेषण",

            roadmap2:
                "बहुभाषी एम्बेडिंग, हाइब्रिड रिट्रीवल और उन्नत रीरैंकिंग",

            roadmap3:
                "स्केलेबल सिमेंटिक खोज के लिए Qdrant वेक्टर डेटाबेस",

            roadmap4:
                "प्रोडक्शन-ग्रेड दस्तावेज़ और उपयोगकर्ता डेटा प्रबंधन के लिए PostgreSQL",

            roadmap5:
                "स्कैन किए गए स्रोतों के लिए OCR और बड़े पैमाने पर दस्तावेज़ इनजेशन",

            roadmap6:
                "अधिक आधिकारिक स्रोत, भाषाएँ और अधिकार क्षेत्र",

            roadmap7:
                "निरंतर स्रोत अपडेट और प्रोवेनेंस/संस्करण प्रबंधन"
        },


        mr: {
            title: "प्रोटोटाइप स्थिती",
            description:
                "सध्याचा डेमो मुख्य IP संशोधन आणि पुरावा-पडताळणी कार्यप्रवाह दाखवतो.",

            implementedTitle: "सध्या कार्यान्वित",

            implemented1:
                "11 समर्थित भाषांमध्ये बहुभाषिक आयुर्वेद IP संवाद",

            implemented2:
                "अधिकारक्षेत्रानुसार IP आणि नियामक माहितीचे रिट्रीव्हल",

            implemented3:
                "पुराव्यावर आधारित उत्तरे आणि ट्रेस करता येणारे स्रोत संदर्भ",

            implemented4:
                "भारत, यूके, अमेरिका आणि WIPO मधील निवडक ज्ञानस्रोत",

            implemented5:
                "वापरकर्ता PDF अपलोड, मजकूर निष्कर्षण आणि इंडेक्सिंग",

            implemented6:
                "संक्षिप्त पुरावा अंश, स्रोत पडताळणी आणि View Source",

            implemented7:
                "डायनॅमिक आयुर्वेद पेटंट समानता शोध",

            implemented8:
                "विचारा · शोधा · पडताळा कार्यप्रवाह",

            roadmapTitle:
                "पूर्ण अंमलबजावणी रोडमॅप",

            roadmap1:
                "LLM-आधारित ग्राउंडेड उत्तर निर्मिती आणि संश्लेषण",

            roadmap2:
                "बहुभाषिक एम्बेडिंग, हायब्रिड रिट्रीव्हल आणि प्रगत रीरँकिंग",

            roadmap3:
                "स्केलेबल सिमेंटिक शोधासाठी Qdrant वेक्टर डेटाबेस",

            roadmap4:
                "प्रोडक्शन-ग्रेड दस्तऐवज आणि वापरकर्ता डेटा व्यवस्थापनासाठी PostgreSQL",

            roadmap5:
                "स्कॅन केलेल्या स्रोतांसाठी OCR आणि मोठ्या प्रमाणातील दस्तऐवज इनजेशन",

            roadmap6:
                "अधिकृत स्रोत, भाषा आणि अधिकारक्षेत्रांचा विस्तार",

            roadmap7:
                "सतत स्रोत अद्ययावत करणे आणि प्रोव्हनन्स/आवृत्ती व्यवस्थापन"
        },


        bn: {
            title: "প্রোটোটাইপের অবস্থা",
            description:
                "বর্তমান ডেমো মূল IP গবেষণা এবং প্রমাণ যাচাইকরণ কার্যপ্রবাহ প্রদর্শন করে।",

            implementedTitle: "বর্তমানে বাস্তবায়িত",

            implemented1:
                "১১টি সমর্থিত ভাষায় বহুভাষিক আয়ুর্বেদ IP ইন্টারঅ্যাকশন",

            implemented2:
                "অধিক্ষেত্রভিত্তিক IP এবং নিয়ন্ত্রক তথ্য অনুসন্ধান",

            implemented3:
                "প্রমাণভিত্তিক উত্তর এবং ট্রেসযোগ্য উৎস উদ্ধৃতি",

            implemented4:
                "ভারত, যুক্তরাজ্য, যুক্তরাষ্ট্র এবং WIPO-এর নির্বাচিত জ্ঞান উৎস",

            implemented5:
                "ব্যবহারকারীর PDF আপলোড, টেক্সট নিষ্কাশন এবং ইনডেক্সিং",

            implemented6:
                "সংক্ষিপ্ত প্রমাণাংশ, উৎস যাচাই এবং View Source",

            implemented7:
                "ডায়নামিক আয়ুর্বেদ পেটেন্ট সাদৃশ্য অনুসন্ধান",

            implemented8:
                "জিজ্ঞাসা · অনুসন্ধান · যাচাই কার্যপ্রবাহ",

            roadmapTitle:
                "পূর্ণ বাস্তবায়ন রোডম্যাপ",

            roadmap1:
                "LLM-চালিত ভিত্তিসম্পন্ন উত্তর তৈরি ও সংশ্লেষণ",

            roadmap2:
                "বহুভাষিক এমবেডিং, হাইব্রিড রিট্রিভাল এবং উন্নত রির‍্যাঙ্কিং",

            roadmap3:
                "স্কেলযোগ্য সেমান্টিক অনুসন্ধানের জন্য Qdrant ভেক্টর ডেটাবেস",

            roadmap4:
                "প্রোডাকশন-গ্রেড ডকুমেন্ট এবং ব্যবহারকারী ডেটা ব্যবস্থাপনার জন্য PostgreSQL",

            roadmap5:
                "স্ক্যান করা উৎসের জন্য OCR এবং বৃহৎ পরিসরের ডকুমেন্ট ইনজেশন",

            roadmap6:
                "আরও প্রামাণিক উৎস, ভাষা এবং অধিক্ষেত্র",

            roadmap7:
                "নিয়মিত উৎস আপডেট এবং প্রোভেন্যান্স/সংস্করণ ব্যবস্থাপনা"
        },


        ta: {
            title: "முன்மாதிரி நிலை",
            description:
                "தற்போதைய டெமோ முக்கிய IP ஆராய்ச்சி மற்றும் ஆதார சரிபார்ப்பு பணிச்சுற்றை நிரூபிக்கிறது.",

            implementedTitle: "தற்போது செயல்பாட்டில்",

            implemented1:
                "11 ஆதரிக்கப்படும் மொழிகளில் பல்மொழி ஆயுர்வேத IP தொடர்பு",

            implemented2:
                "சட்டஅதிகார அடிப்படையிலான IP மற்றும் ஒழுங்குமுறை தகவல் மீட்டெடுப்பு",

            implemented3:
                "ஆதார அடிப்படையிலான பதில்கள் மற்றும் கண்காணிக்கக்கூடிய மூல மேற்கோள்கள்",

            implemented4:
                "இந்தியா, UK, US மற்றும் WIPO-வின் தேர்ந்தெடுக்கப்பட்ட அறிவு ஆதாரங்கள்",

            implemented5:
                "பயனர் PDF பதிவேற்றம், உரை பிரித்தெடுத்தல் மற்றும் இன்டெக்சிங்",

            implemented6:
                "சுருக்கமான ஆதாரப் பகுதிகள், மூல சரிபார்ப்பு மற்றும் View Source",

            implemented7:
                "டைனமிக் ஆயுர்வேத காப்புரிமை ஒற்றுமை தேடல்",

            implemented8:
                "கேள் · ஆராய் · சரிபார் பணிச்சுற்று",

            roadmapTitle:
                "முழுமையான செயல்படுத்தல் திட்டம்",

            roadmap1:
                "LLM அடிப்படையிலான ஆதாரமூலமான பதில் உருவாக்கம் மற்றும் தொகுப்பு",

            roadmap2:
                "பல்மொழி embeddings, hybrid retrieval மற்றும் மேம்பட்ட reranking",

            roadmap3:
                "அளவிடக்கூடிய semantic search க்கான Qdrant vector database",

            roadmap4:
                "Production-grade ஆவண மற்றும் பயனர் தரவு மேலாண்மைக்கான PostgreSQL",

            roadmap5:
                "ஸ்கேன் செய்யப்பட்ட ஆதாரங்களுக்கான OCR மற்றும் பெரிய அளவிலான document ingestion",

            roadmap6:
                "மேலும் அதிகாரப்பூர்வ ஆதாரங்கள், மொழிகள் மற்றும் சட்டஅதிகாரங்கள்",

            roadmap7:
                "தொடர்ச்சியான மூல புதுப்பிப்புகள் மற்றும் provenance/version management"
        },


        te: {
            title: "ప్రోటోటైప్ స్థితి",
            description:
                "ప్రస్తుత డెమో ప్రధాన IP పరిశోధన మరియు ఆధార ధృవీకరణ వర్క్‌ఫ్లోను చూపిస్తుంది.",

            implementedTitle: "ప్రస్తుతం అమలులో ఉన్నవి",

            implemented1:
                "11 మద్దతు ఉన్న భాషల్లో బహుభాషా ఆయుర్వేద IP ఇంటరాక్షన్",

            implemented2:
                "జ్యూరిస్డిక్షన్ ఆధారిత IP మరియు నియంత్రణ సమాచార రిట్రీవల్",

            implemented3:
                "ఆధార ఆధారిత సమాధానాలు మరియు ట్రేస్ చేయగల మూల సూచనలు",

            implemented4:
                "భారత్, UK, US మరియు WIPO ఎంపిక చేసిన జ్ఞాన మూలాలు",

            implemented5:
                "వినియోగదారు PDF అప్లోడ్, టెక్స్ట్ ఎక్స్‌ట్రాక్షన్ మరియు ఇండెక్సింగ్",

            implemented6:
                "సంక్షిప్త ఆధార భాగాలు, మూల ధృవీకరణ మరియు View Source",

            implemented7:
                "డైనమిక్ ఆయుర్వేద పేటెంట్ సాదృశ్య శోధన",

            implemented8:
                "అడుగు · అన్వేషించు · ధృవీకరించు వర్క్‌ఫ్లో",

            roadmapTitle:
                "పూర్తి అమలు రోడ్‌మ్యాప్",

            roadmap1:
                "LLM ఆధారిత గ్రౌండెడ్ సమాధానాల తయారీ మరియు సింథసిస్",

            roadmap2:
                "బహుభాషా embeddings, hybrid retrieval మరియు advanced reranking",

            roadmap3:
                "స్కేలబుల్ semantic search కోసం Qdrant vector database",

            roadmap4:
                "production-grade పత్రాలు మరియు వినియోగదారు డేటా నిర్వహణకు PostgreSQL",

            roadmap5:
                "స్కాన్ చేసిన మూలాల కోసం OCR మరియు పెద్ద స్థాయి document ingestion",

            roadmap6:
                "మరిన్ని అధికారిక మూలాలు, భాషలు మరియు జ్యూరిస్డిక్షన్లు",

            roadmap7:
                "నిరంతర మూల నవీకరణలు మరియు provenance/version management"
        },


        kn: {
            title: "ಪ್ರೋಟೋಟೈಪ್ ಸ್ಥಿತಿ",
            description:
                "ಪ್ರಸ್ತುತ ಡೆಮೋ ಮುಖ್ಯ IP ಸಂಶೋಧನೆ ಮತ್ತು ಪುರಾವೆ ಪರಿಶೀಲನೆ ಕಾರ್ಯಪ್ರವಾಹವನ್ನು ತೋರಿಸುತ್ತದೆ.",

            implementedTitle: "ಪ್ರಸ್ತುತ ಜಾರಿಯಲ್ಲಿರುವವು",

            implemented1:
                "11 ಬೆಂಬಲಿತ ಭಾಷೆಗಳಲ್ಲಿ ಬಹುಭಾಷಾ ಆಯುರ್ವೇದ IP ಸಂವಹನ",

            implemented2:
                "ಅಧಿಕಾರ ಕ್ಷೇತ್ರ ಆಧಾರಿತ IP ಮತ್ತು ನಿಯಂತ್ರಣ ಮಾಹಿತಿಯ ರಿಟ್ರೀವಲ್",

            implemented3:
                "ಪುರಾವೆ ಆಧಾರಿತ ಉತ್ತರಗಳು ಮತ್ತು ಪತ್ತೆಹಚ್ಚಬಹುದಾದ ಮೂಲ ಉಲ್ಲೇಖಗಳು",

            implemented4:
                "ಭಾರತ, UK, US ಮತ್ತು WIPO ಆಯ್ಕೆ ಮಾಡಿದ ಜ್ಞಾನ ಮೂಲಗಳು",

            implemented5:
                "ಬಳಕೆದಾರ PDF ಅಪ್‌ಲೋಡ್, ಪಠ್ಯ ಹೊರತೆಗೆಯುವಿಕೆ ಮತ್ತು ಇಂಡೆಕ್ಸಿಂಗ್",

            implemented6:
                "ಸಂಕ್ಷಿಪ್ತ ಪುರಾವೆ ಭಾಗಗಳು, ಮೂಲ ಪರಿಶೀಲನೆ ಮತ್ತು View Source",

            implemented7:
                "ಡೈನಮಿಕ್ ಆಯುರ್ವೇದ ಪೇಟೆಂಟ್ ಸಾಮ್ಯತೆ ಹುಡುಕಾಟ",

            implemented8:
                "ಕೇಳಿ · ಅನ್ವೇಷಿಸಿ · ಪರಿಶೀಲಿಸಿ ಕಾರ್ಯಪ್ರವಾಹ",

            roadmapTitle:
                "ಸಂಪೂರ್ಣ ಅನುಷ್ಠಾನ ರೋಡ್‌ಮ್ಯಾಪ್",

            roadmap1:
                "LLM ಆಧಾರಿತ ಗ್ರೌಂಡೆಡ್ ಉತ್ತರ ನಿರ್ಮಾಣ ಮತ್ತು ಸಂಯೋಜನೆ",

            roadmap2:
                "ಬಹುಭಾಷಾ embeddings, hybrid retrieval ಮತ್ತು advanced reranking",

            roadmap3:
                "ಸ್ಕೇಲಬಲ್ semantic search ಗಾಗಿ Qdrant vector database",

            roadmap4:
                "production-grade ದಾಖಲೆ ಮತ್ತು ಬಳಕೆದಾರ ಡೇಟಾ ನಿರ್ವಹಣೆಗೆ PostgreSQL",

            roadmap5:
                "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಮೂಲಗಳಿಗಾಗಿ OCR ಮತ್ತು ದೊಡ್ಡ ಪ್ರಮಾಣದ document ingestion",

            roadmap6:
                "ಹೆಚ್ಚುವರಿ ಅಧಿಕೃತ ಮೂಲಗಳು, ಭಾಷೆಗಳು ಮತ್ತು ಅಧಿಕಾರ ಕ್ಷೇತ್ರಗಳು",

            roadmap7:
                "ನಿರಂತರ ಮೂಲ ನವೀಕರಣ ಮತ್ತು provenance/version management"
        },


        gu: {
            title: "પ્રોટોટાઇપ સ્થિતિ",
            description:
                "વર્તમાન ડેમો મુખ્ય IP સંશોધન અને પુરાવા ચકાસણી વર્કફ્લો દર્શાવે છે.",

            implementedTitle: "હાલમાં અમલમાં",

            implemented1:
                "11 સપોર્ટેડ ભાષાઓમાં બહુભાષી આયુર્વેદ IP ઇન્ટરૅક્શન",

            implemented2:
                "અધિકારક્ષેત્ર આધારિત IP અને નિયમનકારી માહિતી રિટ્રિવલ",

            implemented3:
                "પુરાવા આધારિત જવાબો અને ટ્રેસ કરી શકાય તેવા સ્રોત સંદર્ભો",

            implemented4:
                "ભારત, UK, US અને WIPOના પસંદ કરેલા જ્ઞાન સ્રોતો",

            implemented5:
                "વપરાશકર્તા PDF અપલોડ, ટેક્સ્ટ નિષ્કર્ષણ અને ઇન્ડેક્સિંગ",

            implemented6:
                "ટૂંકા પુરાવા અંશો, સ્રોત ચકાસણી અને View Source",

            implemented7:
                "ડાયનેમિક આયુર્વેદ પેટન્ટ સમાનતા શોધ",

            implemented8:
                "પૂછો · શોધો · ચકાસો વર્કફ્લો",

            roadmapTitle:
                "સંપૂર્ણ અમલીકરણ રોડમૅપ",

            roadmap1:
                "LLM આધારિત ગ્રાઉન્ડેડ જવાબ જનરેશન અને સિન્થેસિસ",

            roadmap2:
                "બહુભાષી embeddings, hybrid retrieval અને advanced reranking",

            roadmap3:
                "સ્કેલેબલ સેમેન્ટિક શોધ માટે Qdrant vector database",

            roadmap4:
                "પ્રોડક્શન-ગ્રેડ દસ્તાવેજ અને વપરાશકર્તા ડેટા મેનેજમેન્ટ માટે PostgreSQL",

            roadmap5:
                "સ્કેન કરેલા સ્રોતો માટે OCR અને મોટા પાયે document ingestion",

            roadmap6:
                "વધુ અધિકૃત સ્રોતો, ભાષાઓ અને અધિકારક્ષેત્રો",

            roadmap7:
                "સતત સ્રોત અપડેટ અને provenance/version management"
        },


        ml: {
            title: "പ്രോട്ടോടൈപ്പ് നില",
            description:
                "നിലവിലെ ഡെമോ പ്രധാന IP ഗവേഷണവും തെളിവ് പരിശോധനാ പ്രവർത്തനരീതിയും കാണിക്കുന്നു.",

            implementedTitle: "നിലവിൽ നടപ്പാക്കിയിരിക്കുന്നത്",

            implemented1:
                "11 പിന്തുണയ്ക്കുന്ന ഭാഷകളിലെ ബഹുഭാഷാ ആയുർവേദ IP ഇടപെടൽ",

            implemented2:
                "അധികാരപരിധി അടിസ്ഥാനമാക്കിയുള്ള IP, നിയന്ത്രണ വിവര റിട്രീവൽ",

            implemented3:
                "തെളിവ് അടിസ്ഥാനമാക്കിയുള്ള ഉത്തരങ്ങളും പിന്തുടരാവുന്ന ഉറവിട ഉദ്ധരണികളും",

            implemented4:
                "ഇന്ത്യ, UK, US, WIPO എന്നിവയുടെ തെരഞ്ഞെടുത്ത ജ്ഞാന ഉറവിടങ്ങൾ",

            implemented5:
                "ഉപയോക്തൃ PDF അപ്‌ലോഡ്, ടെക്സ്റ്റ് എക്സ്ട്രാക്ഷൻ, ഇൻഡെക്സിംഗ്",

            implemented6:
                "ചുരുക്കിയ തെളിവ് ഭാഗങ്ങൾ, ഉറവിട പരിശോധന, View Source",

            implemented7:
                "ഡൈനാമിക് ആയുർവേദ പേറ്റന്റ് സാമ്യം തിരച്ചിൽ",

            implemented8:
                "ചോദിക്കുക · പരിശോധിക്കുക · ഉറപ്പാക്കുക പ്രവർത്തനരീതി",

            roadmapTitle:
                "പൂർണ്ണ നടപ്പാക്കൽ റോഡ്മാപ്പ്",

            roadmap1:
                "LLM അടിസ്ഥാനമാക്കിയുള്ള തെളിവ്-ആധാരിത ഉത്തര നിർമ്മാണവും സംയോജനവും",

            roadmap2:
                "ബഹുഭാഷാ embeddings, hybrid retrieval, advanced reranking",

            roadmap3:
                "സ്കെയിലബിൾ semantic search നായി Qdrant vector database",

            roadmap4:
                "production-grade ഡോക്യുമെന്റ്, ഉപയോക്തൃ ഡാറ്റ മാനേജ്മെന്റിനായി PostgreSQL",

            roadmap5:
                "സ്കാൻ ചെയ്ത ഉറവിടങ്ങൾക്കായി OCR, വലിയ തോതിലുള്ള document ingestion",

            roadmap6:
                "കൂടുതൽ ഔദ്യോഗിക ഉറവിടങ്ങൾ, ഭാഷകൾ, അധികാരപരിധികൾ",

            roadmap7:
                "തുടർച്ചയായ ഉറവിട അപ്ഡേറ്റുകളും provenance/version management"
        },


        pa: {
            title: "ਪ੍ਰੋਟੋਟਾਈਪ ਸਥਿਤੀ",
            description:
                "ਮੌਜੂਦਾ ਡੈਮੋ ਮੁੱਖ IP ਖੋਜ ਅਤੇ ਸਬੂਤ-ਜਾਂਚ ਵਰਕਫਲੋ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।",

            implementedTitle: "ਮੌਜੂਦਾ ਤੌਰ 'ਤੇ ਲਾਗੂ",

            implemented1:
                "11 ਸਮਰਥਿਤ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਬਹੁਭਾਸ਼ੀ ਆਯੁਰਵੇਦ IP ਇੰਟਰੈਕਸ਼ਨ",

            implemented2:
                "ਅਧਿਕਾਰ-ਖੇਤਰ ਅਨੁਸਾਰ IP ਅਤੇ ਨਿਯਮਕ ਜਾਣਕਾਰੀ ਦੀ ਖੋਜ",

            implemented3:
                "ਸਬੂਤ-ਆਧਾਰਿਤ ਜਵਾਬ ਅਤੇ ਟ੍ਰੇਸ ਕੀਤੇ ਜਾ ਸਕਣ ਵਾਲੇ ਸਰੋਤ ਹਵਾਲੇ",

            implemented4:
                "ਭਾਰਤ, UK, US ਅਤੇ WIPO ਦੇ ਚੁਣੇ ਹੋਏ ਗਿਆਨ ਸਰੋਤ",

            implemented5:
                "ਯੂਜ਼ਰ PDF ਅੱਪਲੋਡ, ਟੈਕਸਟ ਐਕਸਟ੍ਰੈਕਸ਼ਨ ਅਤੇ ਇੰਡੈਕਸਿੰਗ",

            implemented6:
                "ਛੋਟੇ ਸਬੂਤ ਅੰਸ਼, ਸਰੋਤ ਜਾਂਚ ਅਤੇ View Source",

            implemented7:
                "ਡਾਇਨਾਮਿਕ ਆਯੁਰਵੇਦ ਪੇਟੈਂਟ ਸਮਾਨਤਾ ਖੋਜ",

            implemented8:
                "ਪੁੱਛੋ · ਖੋਜੋ · ਜਾਂਚੋ ਵਰਕਫਲੋ",

            roadmapTitle:
                "ਪੂਰਾ ਲਾਗੂਕਰਨ ਰੋਡਮੈਪ",

            roadmap1:
                "LLM-ਅਧਾਰਿਤ ਗ੍ਰਾਊਂਡਡ ਜਵਾਬ ਤਿਆਰ ਕਰਨਾ ਅਤੇ ਸੰਸ਼ਲੇਸ਼ਣ",

            roadmap2:
                "ਬਹੁਭਾਸ਼ੀ embeddings, hybrid retrieval ਅਤੇ advanced reranking",

            roadmap3:
                "ਸਕੇਲੇਬਲ semantic search ਲਈ Qdrant vector database",

            roadmap4:
                "production-grade ਦਸਤਾਵੇਜ਼ ਅਤੇ ਯੂਜ਼ਰ ਡੇਟਾ ਪ੍ਰਬੰਧਨ ਲਈ PostgreSQL",

            roadmap5:
                "ਸਕੈਨ ਕੀਤੇ ਸਰੋਤਾਂ ਲਈ OCR ਅਤੇ ਵੱਡੇ ਪੱਧਰ ਦਾ document ingestion",

            roadmap6:
                "ਹੋਰ ਅਧਿਕਾਰਤ ਸਰੋਤ, ਭਾਸ਼ਾਵਾਂ ਅਤੇ ਅਧਿਕਾਰ ਖੇਤਰ",

            roadmap7:
                "ਲਗਾਤਾਰ ਸਰੋਤ ਅਪਡੇਟ ਅਤੇ provenance/version management"
        },


        sa: {
            title: "प्रोटोटाइप-स्थितिः",
            description:
                "वर्तमान-प्रदर्शनं मुख्यं IP-अनुसन्धानं प्रमाण-सत्यापन-कार्यप्रवाहं च प्रदर्शयति।",

            implementedTitle: "वर्तमानतः कार्यान्वितम्",

            implemented1:
                "एकादशसमर्थितभाषासु बहुभाषिकम् आयुर्वेद-IP-संवादम्",

            implemented2:
                "अधिकारक्षेत्रानुसारं IP तथा नियामक-सूचना-अन्वेषणम्",

            implemented3:
                "प्रमाणाधारिताः उत्तराः तथा अनुगम्याः स्रोत-सन्दर्भाः",

            implemented4:
                "भारत-यूके-अमेरिका-WIPO चयनिताः ज्ञानस्रोताः",

            implemented5:
                "उपयोक्तृ-PDF-अपलोड्, पाठ-निष्कर्षणम् तथा अनुक्रमणम्",

            implemented6:
                "संक्षिप्ताः प्रमाणांशाः, स्रोत-सत्यापनम् तथा View Source",

            implemented7:
                "गतिशीलम् आयुर्वेद-पेटेण्ट्-सादृश्य-अन्वेषणम्",

            implemented8:
                "पृच्छतु · अन्वेषयतु · सत्यापयतु कार्यप्रवाहः",

            roadmapTitle:
                "पूर्ण-कार्यान्वयन-रोडमैप",

            roadmap1:
                "LLM-आधारितं प्रमाणसमर्थित-उत्तर-निर्माणं संश्लेषणं च",

            roadmap2:
                "बहुभाषिकानि embeddings, hybrid retrieval तथा उन्नतं reranking",

            roadmap3:
                "स्केलेबल-सिमान्टिक-अन्वेषणाय Qdrant vector database",

            roadmap4:
                "production-grade दस्तावेज-उपयोक्तृ-दत्तांश-व्यवस्थापनाय PostgreSQL",

            roadmap5:
                "स्कैन्-स्रोतेभ्यः OCR तथा बृहद्-दस्तावेज-आयातः",

            roadmap6:
                "अधिकाः प्रामाणिकाः स्रोताः, भाषाः तथा अधिकारक्षेत्राणि",

            roadmap7:
                "निरन्तर-स्रोत-अद्यतनं तथा provenance/version management"
        }

    };


    const p =
        prototypeStatusTranslations[currentLanguage] ||
        prototypeStatusTranslations.en;

    document.getElementById("prototypeStatusTitle").textContent =
        p.title;

    document.getElementById("prototypeDescription").textContent =
        p.description;

    document.getElementById("implementedTitle").textContent =
        p.implementedTitle;

    document.getElementById("implemented1").textContent =
        p.implemented1;

    document.getElementById("implemented2").textContent =
        p.implemented2;

    document.getElementById("implemented3").textContent =
        p.implemented3;

    document.getElementById("implemented4").textContent =
        p.implemented4;

    document.getElementById("implemented5").textContent =
        p.implemented5;

    document.getElementById("implemented6").textContent =
        p.implemented6;

    document.getElementById("implemented7").textContent =
        p.implemented7;

    document.getElementById("implemented8").textContent =
        p.implemented8;

    document.getElementById("roadmapTitle").textContent =
        p.roadmapTitle;

    document.getElementById("roadmap1").textContent =
        p.roadmap1;

    document.getElementById("roadmap2").textContent =
        p.roadmap2;

    document.getElementById("roadmap3").textContent =
        p.roadmap3;

    document.getElementById("roadmap4").textContent =
        p.roadmap4;

    document.getElementById("roadmap5").textContent =
        p.roadmap5;

    document.getElementById("roadmap6").textContent =
        p.roadmap6;

    document.getElementById("roadmap7").textContent =
        p.roadmap7;
}

function changeJurisdiction() {

    const select =
        document.getElementById("jurisdiction");

    if (!select) {
        return;
    }

    // Get the newly selected jurisdiction
    currentJurisdiction = select.value;

    // Save the selection
    localStorage.setItem(
        "ipSaktiJurisdiction",
        currentJurisdiction
    );

    console.log(
        "Selected jurisdiction:",
        currentJurisdiction
    );

    // ============================================================
    // JURISDICTION-SPECIFIC SUGGESTED QUESTIONS
    // ============================================================

    const suggestions = {

        IN: [
            "Can an Ayurvedic invention based on traditional knowledge be patented in India?",
            "How is traditional knowledge treated during patent examination in India?",
            "What IP protection may apply to an Ayurvedic product in India?"
        ],

        US: [
            "What are the basic patentability requirements in the United States?",
            "What requirements must a new invention satisfy for US patent protection?",
            "Can the name of an Ayurvedic product be protected as a trademark in the United States?"
        ],

        UK: [
            "What are the basic patentability requirements in the United Kingdom?",
            "What does UK patent law require for a new invention?",
            "Can the name of an Ayurvedic product be protected as a trademark in the United Kingdom?"
        ],

        WIPO: [
            "What are the basic requirements for international patent protection?",
            "How does the international patent system support patent applicants?",
            "What IP information can be explored through WIPO and PCT sources?"
        ]

    };

    const selectedSuggestions =
        suggestions[currentJurisdiction] ||
        suggestions.IN;

    // ============================================================
    // UPDATE THE THREE BUTTONS
    // ============================================================

    const buttons =
        document.querySelectorAll(
            ".suggestion"
        );

    buttons.forEach(
        function(button, index) {

            if (!selectedSuggestions[index]) {
                return;
            }

            button.textContent =
                selectedSuggestions[index];

            button.dataset.suggestion =
                selectedSuggestions[index];
        }
    );

    // ============================================================
    // UPDATE JURISDICTION LABEL
    // ============================================================

    const scope =
        document.getElementById(
            "jurisdictionScope"
        );

    if (scope) {

        const labels = {

            IN: "India",
            US: "United States",
            UK: "United Kingdom",
            WIPO: "International (WIPO/PCT)"

        };

        scope.textContent =
            "Suggested questions for " +
            (
                labels[currentJurisdiction] ||
                "India"
            );
    }
}

function getSourceUrl(source) {

    if (!source) {
        return "#";
    }

    const url =
        source.url || "";

    if (
        url.startsWith(
            "/static/uploads/"
        )
    ) {

        const filename =
            url.substring(
                "/static/uploads/".length
            );

        return (
            "/api/documents/" +
            encodeURIComponent(filename) +
            "/source"
        );
    }

    return url || "#";
}

function updateJurisdictionPreview(){
    const select=document.getElementById("jurisdiction");
    if(select) select.value=currentJurisdiction;
    const label=select?.options[select.selectedIndex]?.textContent || "India";
    const chip=document.getElementById("chipJurisdiction");
    const result=document.getElementById("resultJurisdiction");
    if(chip) chip.textContent=label;
    if(result) result.textContent=label;
}

function getSelectedJurisdictionLabel(){
    const select=document.getElementById("jurisdiction");
    return select?.options[select.selectedIndex]?.textContent || "India";
}


/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */

function openApp(screen){

    currentScreen = screen;

    document.getElementById("landing")
        .classList.add("hidden");

    document.getElementById("application")
        .classList.remove("hidden");

    const screens = {
        ask:"screenAsk",
        processing:"screenProcessing",
        result:"screenResult",
        patents:"screenPatents",
        kb:"screenKB"
    };

    Object.values(screens).forEach(id => {
        document.getElementById(id).classList.add("hidden");
    });

    document.getElementById(screens[screen] || screens.ask)
        .classList.remove("hidden");

    document.getElementById("navAsk").classList.toggle("active", screen === "ask" || screen === "processing" || screen === "result");
    document.getElementById("navPatents").classList.toggle("active", screen === "patents");
    document.getElementById("navKB").classList.toggle("active", screen === "kb");
}


/* ============================================================
   SUGGESTIONS
   ============================================================ */

function useSuggestion(button){

    document.getElementById("query").value =
        button.dataset.suggestion || "";

    document.getElementById("query").focus();
}


/* ============================================================
   QUERY UNDERSTANDING HEURISTICS
   ============================================================ */

function classifyQuestion(query){

    const q = query.toLowerCase();

    let intent = "Patentability";
    let ipType = "Patent";

    if(
        q.includes("traditional") ||
        q.includes("ज्ञान") ||
        q.includes("पारंपरिक")
    ){
        intent = "Traditional Knowledge";
    }

    if(
        q.includes("trademark") ||
        q.includes("brand") ||
        q.includes("logo")
    ){
        intent = "IP Protection";
        ipType = "Trademark";
    }

    if(
        q.includes("treatment") ||
        q.includes("चिकित्सा") ||
        q.includes("उपचार") ||
        q.includes("medicine")
    ){
        intent = "Regulatory / Treatment";
    }

    if(q.includes("design")){
        ipType = "Design";
    }

    return {
        intent,
        ipType
    };
}


/* ============================================================
   PROCESSING ANIMATION
   ============================================================ */

function setProcessingStep(activeIndex){

    for(let i=1;i<=7;i++){

        const el =
            document.getElementById("step"+i);

        el.classList.remove(
            "active-step",
            "done",
            "pending"
        );

        const indicator =
            el.querySelector(".indicator");

        if(i < activeIndex){
            el.classList.add("done");
            indicator.textContent = "✓";
        }
        else if(i === activeIndex){
            el.classList.add("active-step");
            indicator.textContent = "●";
        }
        else{
            el.classList.add("pending");
            indicator.textContent = "○";
        }
    }
}


/* ============================================================
   SUBMIT QUESTION
   ============================================================ */

async function submitQuestion(){

    const query =
        document.getElementById("query").value.trim();

    if(!query){
        document.getElementById("query").focus();
        return;
    }

    lastQuestion = query;

    const meta = classifyQuestion(query);

    document.getElementById("processingQuery").textContent =
        `"${query}"`;

    document.getElementById("chipLanguage").textContent =
        languageName(currentLanguage);

    document.getElementById("chipIntent").textContent =
        meta.intent;

    document.getElementById("chipIPType").textContent =
        meta.ipType;

    updateJurisdictionPreview();

    openApp("processing");
    setProcessingStep(1);

    try{

        const steps = [1,2,3,4,5];

        for(const step of steps){
            await wait(350);
            setProcessingStep(step + 1);
        }
        
        const response =
            await fetch("/api/chat",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    query,
                    language:currentLanguage,
                    jurisdiction:
                        document.getElementById(
                         "jurisdiction" ).value
                })
            });

        if(!response.ok){
            throw new Error("Backend request failed");
        }

        const data =
            await response.json();

        lastSources = data.sources || [];

        setProcessingStep(6);
        await wait(450);

        setProcessingStep(7);
        await wait(450);

        renderResult(data, meta);

        openApp("result");

    }
    catch(error){

        console.error(error);

        document.getElementById("answerText").textContent =
            currentLanguage === "mr"
            ? "सिस्टमशी कनेक्शन झाले नाही. कृपया VS Code मधील Uvicorn terminal तपासा."
            : currentLanguage === "hi"
            ? "सिस्टम से कनेक्शन नहीं हो पाया। कृपया VS Code में Uvicorn terminal देखें."
            : "The system could not connect to the backend. Check the Uvicorn terminal in VS Code.";

        lastSources = [];
        renderSources([]);
        openApp("result");

    }
}


function wait(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}


/* ============================================================
   RESULT RENDERING
   ============================================================ */

function renderResult(data, meta){

    const x = t();

    document.getElementById("resultMode").textContent =
        data.mode || "RAG-MVP";

    document.getElementById("answerText").textContent =
        data.answer || "";

    const chips = [
        `${x.language}: ${languageName(data.detected_language || currentLanguage)}`,
        `${x.intent}: ${meta.intent}`,
        `${x.ipType}: ${meta.ipType}`,
        `${x.jurisdiction2}: ${getSelectedJurisdictionLabel()}`
    ];

    document.getElementById("understoodChips").innerHTML =
        chips.map(c =>
            `<span class="mini-chip">${esc(c)}</span>`
        ).join("");

    renderSources(data.sources || []);

    activeSourceIndex = 0;

    if(lastSources.length){
        updateEvidencePanel(0);
    }
}


function renderSources(sources){

    const row =
        document.getElementById("citationRow");

    if(!sources.length){
        row.innerHTML = "";
        document.getElementById("documentValue").textContent = "—";
        document.getElementById("sectionValue").textContent = "—";
        document.getElementById("passage").textContent = t().noEvidence || "No evidence available.";
        document.getElementById("localizedEvidence").textContent = "";
        return;
    }

    row.innerHTML =
        sources.map((s,i)=>`
            <button
                class="citation-chip ${i===activeSourceIndex ? "active":""}"
                onclick="selectCitation(${i})">
                [${i+1}] ${esc(s.source || "Source")}
            </button>
        `).join("");

    updateEvidencePanel(activeSourceIndex);
}


function selectCitation(index){

    activeSourceIndex = index;

    document.querySelectorAll(".citation-chip")
        .forEach((chip,i)=>{
            chip.classList.toggle(
                "active",
                i === index
            );
        });

    updateEvidencePanel(index);
}


function updateEvidencePanel(index){

    if(!lastSources.length){
        return;
    }

    const source =
        lastSources[index];

    document.getElementById("authorityValue").textContent =
        source.source || "—";

    document.getElementById("documentValue").textContent =
        source.title || "—";

   document.getElementById("resultJurisdiction").textContent =
    source.jurisdiction || "—";

    document.getElementById("sectionValue").textContent =
        [source.section, source.page]
            .filter(Boolean)
            .join(" · ") || "—";
    
    function getShortEvidence(text, maxSentences = 3) {

    if (!text) {
        return "";
    }

    const cleaned =
        String(text)
            .replace(/\s+/g, " ")
            .trim();

    const sentences =
        cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];

    return sentences
        .slice(0, maxSentences)
        .join(" ")
        .trim();
}

    const shortEvidence =
    getShortEvidence(
        source.text,
        3
    );

document.getElementById("passage").innerHTML =
    `<strong>${esc(t().originalEvidence)}:</strong><br><br>${esc(shortEvidence)}`;

    document.getElementById("localizedEvidence").innerHTML =
    source.localized_explanation
    ? `
        <div class="evidence-section">
            <strong>🌐 ${esc(t().localized || "Localized Explanation")}:</strong>
            <div class="evidence-text localized-text">
                ${esc(source.localized_explanation)}
            </div>
        </div>
      `
    : "";

    renderSourcesOnly();

}

function renderSourcesOnly(){

    const row =
        document.getElementById("citationRow");

    row.innerHTML =
        lastSources.map((s,i)=>`
            <button
                class="citation-chip ${i===activeSourceIndex ? "active":""}"
                onclick="selectCitation(${i})">
                [${i+1}] ${esc(s.source || "Source")}
            </button>
        `).join("");
}


/* ============================================================
   SOURCE ACTIONS
   ============================================================ */

function openCurrentSource(){

    if(!lastSources.length){
        return;
    }

    const source =
        lastSources[activeSourceIndex];

   if (source.url) {

    let sourceUrl = source.url;

    if (
        sourceUrl.startsWith(
            "/static/uploads/"
        )
    ) {

        const filename =
            sourceUrl.substring(
                "/static/uploads/".length
            );

        sourceUrl =
            "/api/documents/" +
            encodeURIComponent(filename) +
            "/source";
    }

    window.open(
        sourceUrl,
        "_blank",
        "noopener,noreferrer"
    );
}
}

function showVerifyPanel(){

    if(!lastSources.length){
        return;
    }

    const source =
        lastSources[activeSourceIndex];

    document.getElementById("verifyModalBody").innerHTML =
        `<strong>${esc(source.title || "")}</strong><br><br>${esc(source.text || "")}`;

    document.getElementById("verifyModalLocalized").innerHTML =
        source.localized_explanation
        ? `<strong>${esc(t().localized || "Localized Explanation")}:</strong><br><br>${esc(source.localized_explanation)}`
        : "";

    document.getElementById("verifyModal")
        .classList.remove("hidden");
}

function closeVerifyModal(event){

    if(event && event.target.id !== "verifyModal"){
        return;
    }

    document.getElementById("verifyModal")
        .classList.add("hidden");
}


/* ============================================================
   FOLLOW-UP
   ============================================================ */

function submitFollowup(){

    const input =
        document.getElementById("followupInput");

    const q =
        input.value.trim();

    if(!q){
        return;
    }

    document.getElementById("query").value = q;
    input.value = "";

    submitQuestion();
}


/* ============================================================
   PATENT EXPLORER
   ============================================================ */

let patentResults = [];

function formatSimilarity(value){
    const n = Number(value);
    if(!Number.isFinite(n)) return "—";

    const words = {
        en:"Similar", hi:"समान", mr:"समान", bn:"সাদৃশ্য",
        ta:"ஒத்த", te:"సారూప్యం", kn:"ಸಮಾನ", gu:"સમાન",
        ml:"സമാനം", pa:"ਸਮਾਨ", sa:"समानम्"
    };

    return `${n.toFixed(1)}% ${words[currentLanguage] || words.en}`;
}

async function findSimilarPatents(){

    const description =
        document.getElementById("innovationInput")
            .value
            .trim();

    if(!description){
        document.getElementById("innovationInput").focus();
        return;
    }

    const button =
        document.getElementById("findPatentsButton");

    button.disabled = true;

    const searching = {
        en:"Searching patents...",
        hi:"पेटेंट खोजे जा रहे हैं...",
        mr:"पेटंट शोधले जात आहेत...",
        bn:"পেটেন্ট খোঁজা হচ্ছে...",
        ta:"காப்புரிமைகள் தேடப்படுகின்றன...",
        te:"పేటెంట్లు వెతుకుతున్నాము...",
        kn:"ಪೇಟೆಂಟ್‌ಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
        gu:"પેટન્ટ શોધી રહ્યા છીએ...",
        ml:"പേറ്റന്റുകൾ തിരയുന്നു...",
        pa:"ਪੇਟੈਂਟ ਲੱਭੇ ਜਾ ਰਹੇ ਹਨ...",
        sa:"पेटेण्टानि अन्विष्यन्ते..."
    };

    button.textContent =
        searching[currentLanguage] || searching.en;

    try{

        const response =
            await fetch(
                "/api/patents/search",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        innovation:description,
                        jurisdiction:currentJurisdiction || "IN",
                        top_k:5
                    })
                }
            );

        if(!response.ok){
            throw new Error(
                `Patent search failed: ${response.status}`
            );
        }

        const data =
            await response.json();

        patentResults =
            data.results || [];

        document.getElementById("innovationConcepts")
            .innerHTML =
            (data.concepts || [])
                .slice(0,3)
                .map(
                    c => `<span class="mini-chip">${esc(c)}</span>`
                )
                .join("");

        const list =
            document.getElementById("patentList");

        if(!patentResults.length){

            const messages = {
                en:"No matching patent records found for the selected jurisdiction.",
                hi:"चयनित अधिकार क्षेत्र के लिए कोई मिलते-जुलते पेटेंट रिकॉर्ड नहीं मिले।",
                mr:"निवडलेल्या अधिकार क्षेत्रासाठी समान पेटंट रेकॉर्ड सापडले नाहीत.",
                bn:"নির্বাচিত অধিক্ষেত্রের জন্য কোনো মিলযুক্ত পেটেন্ট রেকর্ড পাওয়া যায়নি।",
                ta:"தேர்ந்தெடுக்கப்பட்ட சட்டஅதிகாரத்திற்கு ஒத்த காப்புரிமை பதிவுகள் கிடைக்கவில்லை.",
                te:"ఎంచుకున్న చట్ట పరిధికి సరిపోలే పేటెంట్ రికార్డులు కనుగొనబడలేదు.",
                kn:"ಆಯ್ಕೆಮಾಡಿದ ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿಗೆ ಹೊಂದುವ ಪೇಟೆಂಟ್ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ.",
                gu:"પસંદ કરેલા અધિકારક્ષેત્ર માટે સમાન પેટન્ટ રેકોર્ડ મળ્યા નથી.",
                ml:"തിരഞ്ഞെടുത്ത നിയമപരിധിക്ക് അനുയോജ്യമായ പേറ്റന്റ് രേഖകൾ കണ്ടെത്താനായില്ല.",
                pa:"ਚੁਣੇ ਅਧਿਕਾਰ-ਖੇਤਰ ਲਈ ਕੋਈ ਮਿਲਦੇ ਪੇਟੈਂਟ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ।",
                sa:"चयनिते अधिकारक्षेत्रे समानाः पेटेण्ट्-अभिलेखाः न प्राप्ताः।"
            };

            list.innerHTML = `
                <div class="patent-card">
                    <div class="patent-title">
                        ${esc(messages[currentLanguage] || messages.en)}
                    </div>
                </div>
            `;

        } else {

            list.innerHTML =
                patentResults.map(
                    (p,index)=>`
                        <div class="patent-card">

                            <div class="patent-top">

                                <div class="patent-title">
                                    ${esc(p.title || "")}
                                </div>

                                <div class="similarity">
                                    ${formatSimilarity(p.similarity)}
                                </div>

                            </div>

                            <div class="patent-meta">
                                ${esc(p.publication || "")}
                                ·
                                ${esc(p.jurisdiction || "")}
                            </div>

                            <div class="concept-row">
                                ${(p.relevant_concepts || [])
                                    .slice(0,3)
                                    .map(
                                        c => `<span class="mini-chip">${esc(c)}</span>`
                                    )
                                    .join("")}
                            </div>

                            <div>
                                <button
                                    class="source-button"
                                    onclick="openPatentDrawer(${index})">
                                    ${esc(t().viewDetails)}
                                </button>
                            </div>

                        </div>
                    `
                ).join("");
        }

        document.getElementById("patentResults")
            .classList.remove("hidden");

    }
    catch(error){

        console.error(error);

        document.getElementById("patentResults")
            .classList.remove("hidden");

        document.getElementById("patentList")
            .innerHTML = `
                <div class="patent-card">
                    <div class="patent-title">
                        Patent search error
                    </div>
                    <div class="patent-meta">
                        Check the Uvicorn terminal and ensure
                        updated app.py and patents.json are present.
                    </div>
                </div>
            `;

    }
    finally{

        button.disabled = false;
        button.textContent =
            t().findPatents;

    }
}

function getPatentDrawerLocalizedText() {

    const labels = {

        en: {
            title: "Patent Details",
            patentTitle: "Patent Title",
            publication: "Publication Number",
            jurisdiction: "Jurisdiction",
            applicant: "Applicant",
            semantic: "Semantic Similarity",
            why: "Why this result appeared",
            relevant: "Relevant Text",
            viewSource: "View Source ↗",
            disclaimer: "Semantic similarity indicates textual/conceptual relevance and does not determine patentability."
        },

        hi: {
            title: "पेटेंट विवरण",
            patentTitle: "पेटेंट शीर्षक",
            publication: "प्रकाशन संख्या",
            jurisdiction: "अधिकार क्षेत्र",
            applicant: "आवेदक",
            semantic: "सिमेंटिक समानता",
            why: "यह परिणाम क्यों आया",
            relevant: "प्रासंगिक पाठ",
            viewSource: "स्रोत देखें ↗",
            disclaimer: "सिमेंटिक समानता केवल पाठ/संकल्पना की प्रासंगिकता दर्शाती है और पेटेंट योग्यता निर्धारित नहीं करती।"
        },

        mr: {
            title: "पेटंट तपशील",
            patentTitle: "पेटंट शीर्षक",
            publication: "प्रकाशन क्रमांक",
            jurisdiction: "अधिकार क्षेत्र",
            applicant: "अर्जदार",
            semantic: "सिमेंटिक समानता",
            why: "हा परिणाम का दिसला",
            relevant: "संबंधित मजकूर",
            viewSource: "स्रोत पहा ↗",
            disclaimer: "सिमेंटिक समानता फक्त मजकूर/संकल्पनेची संबंधितता दर्शवते; ती पेटंटयोग्यता ठरवत नाही."
        },

        bn: {
            title: "পেটেন্টের বিবরণ",
            patentTitle: "পেটেন্টের শিরোনাম",
            publication: "প্রকাশনা নম্বর",
            jurisdiction: "অধিক্ষেত্র",
            applicant: "আবেদনকারী",
            semantic: "সেমান্টিক সাদৃশ্য",
            why: "এই ফলাফল কেন এসেছে",
            relevant: "প্রাসঙ্গিক পাঠ",
            viewSource: "উৎস দেখুন ↗",
            disclaimer: "সেমান্টিক সাদৃশ্য কেবল পাঠ্য/ধারণাগত প্রাসঙ্গিকতা দেখায় এবং পেটেন্টযোগ্যতা নির্ধারণ করে না।"
        },

        ta: {
            title: "காப்புரிமை விவரங்கள்",
            patentTitle: "காப்புரிமை தலைப்பு",
            publication: "வெளியீட்டு எண்",
            jurisdiction: "சட்டஅதிகாரம்",
            applicant: "விண்ணப்பதாரர்",
            semantic: "கருத்தியல் ஒற்றுமை",
            why: "இந்த முடிவு ஏன் வந்தது",
            relevant: "தொடர்புடைய உரை",
            viewSource: "மூலத்தைப் பார்க்கவும் ↗",
            disclaimer: "கருத்தியல் ஒற்றுமை உரை/கருத்து தொடர்பை மட்டுமே காட்டுகிறது; காப்புரிமைத் தகுதியை நிர்ணயிக்காது."
        },

        te: {
            title: "పేటెంట్ వివరాలు",
            patentTitle: "పేటెంట్ శీర్షిక",
            publication: "ప్రచురణ సంఖ్య",
            jurisdiction: "చట్ట పరిధి",
            applicant: "దరఖాస్తుదారు",
            semantic: "సెమాంటిక్ సారూప్యత",
            why: "ఈ ఫలితం ఎందుకు వచ్చింది",
            relevant: "సంబంధిత పాఠ్యం",
            viewSource: "మూలాన్ని చూడండి ↗",
            disclaimer: "సెమాంటిక్ సారూప్యత పాఠ్య/భావ సంబంధాన్ని మాత్రమే చూపుతుంది; పేటెంట్ అర్హతను నిర్ణయించదు."
        },

        kn: {
            title: "ಪೇಟೆಂಟ್ ವಿವರಗಳು",
            patentTitle: "ಪೇಟೆಂಟ್ ಶೀರ್ಷಿಕೆ",
            publication: "ಪ್ರಕಟಣೆ ಸಂಖ್ಯೆ",
            jurisdiction: "ಅಧಿಕಾರ ವ್ಯಾಪ್ತಿ",
            applicant: "ಅರ್ಜಿದಾರ",
            semantic: "ಸೆಮ್ಯಾಂಟಿಕ್ ಸಾಮ್ಯತೆ",
            why: "ಈ ಫಲಿತಾಂಶ ಏಕೆ ಬಂದಿದೆ",
            relevant: "ಸಂಬಂಧಿತ ಪಠ್ಯ",
            viewSource: "ಮೂಲವನ್ನು ನೋಡಿ ↗",
            disclaimer: "ಸೆಮ್ಯಾಂಟಿಕ್ ಸಾಮ್ಯತೆ ಪಠ್ಯ/ಪರಿಕಲ್ಪನೆಯ ಸಂಬಂಧವನ್ನು ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ; ಪೇಟೆಂಟ್ ಅರ್ಹತೆಯನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ."
        },

        gu: {
            title: "પેટન્ટ વિગતો",
            patentTitle: "પેટન્ટ શીર્ષક",
            publication: "પ્રકાશન નંબર",
            jurisdiction: "અધિકારક્ષેત્ર",
            applicant: "અરજદાર",
            semantic: "સેમેન્ટિક સમાનતા",
            why: "આ પરિણામ કેમ આવ્યું",
            relevant: "સંબંધિત લખાણ",
            viewSource: "સ્ત્રોત જુઓ ↗",
            disclaimer: "સેમેન્ટિક સમાનતા માત્ર લખાણ/વિચારની સંબંધિતતા દર્શાવે છે; તે પેટન્ટયોગ્યતા નક્કી કરતી નથી."
        },

        ml: {
            title: "പേറ്റന്റ് വിശദാംശങ്ങൾ",
            patentTitle: "പേറ്റന്റ് ശീർഷകം",
            publication: "പ്രസിദ്ധീകരണ നമ്പർ",
            jurisdiction: "നിയമപരിധി",
            applicant: "അപേക്ഷകൻ",
            semantic: "സെമാന്റിക് സാമ്യം",
            why: "ഈ ഫലം എന്തുകൊണ്ട് വന്നു",
            relevant: "ബന്ധപ്പെട്ട വാചകം",
            viewSource: "ഉറവിടം കാണുക ↗",
            disclaimer: "സെമാന്റിക് സാമ്യം പാഠ/ആശയ പ്രസക്തി മാത്രം കാണിക്കുന്നു; പേറ്റന്റ് യോഗ്യത നിർണ്ണയിക്കുന്നില്ല."
        },

        pa: {
            title: "ਪੇਟੈਂਟ ਵੇਰਵੇ",
            patentTitle: "ਪੇਟੈਂਟ ਸਿਰਲੇਖ",
            publication: "ਪ੍ਰਕਾਸ਼ਨ ਨੰਬਰ",
            jurisdiction: "ਅਧਿਕਾਰ-ਖੇਤਰ",
            applicant: "ਬਿਨੈਕਾਰ",
            semantic: "ਸੈਮਾਂਟਿਕ ਸਮਾਨਤਾ",
            why: "ਇਹ ਨਤੀਜਾ ਕਿਉਂ ਆਇਆ",
            relevant: "ਸੰਬੰਧਿਤ ਪਾਠ",
            viewSource: "ਸਰੋਤ ਵੇਖੋ ↗",
            disclaimer: "ਸੈਮਾਂਟਿਕ ਸਮਾਨਤਾ ਸਿਰਫ਼ ਪਾਠ/ਧਾਰਨਾ ਦੀ ਸੰਬੰਧਿਤਤਾ ਦਿਖਾਉਂਦੀ ਹੈ; ਇਹ ਪੇਟੈਂਟ ਯੋਗਤਾ ਨਹੀਂ ਤੈਅ ਕਰਦੀ।"
        },

        sa: {
            title: "पेटेण्ट्-विवरणम्",
            patentTitle: "पेटेण्ट्-शीर्षकम्",
            publication: "प्रकाशन-सङ्ख्या",
            jurisdiction: "अधिकारक्षेत्रम्",
            applicant: "आवेदकः",
            semantic: "सार्थक-साम्यम्",
            why: "एतत् फलितं कुतः आगतम्",
            relevant: "सम्बद्धः पाठः",
            viewSource: "स्रोतं पश्यतु ↗",
            disclaimer: "सार्थक-साम्यं केवलं पाठ-संकल्पनयोः सम्बद्धतां दर्शयति; पेटेण्ट्-योग्यतां न निर्धारयति।"
        }

    };

    return labels[currentLanguage] || labels.en;
}


function applyPatentDrawerTranslation() {

    const x = getPatentDrawerLocalizedText();

    const ids = {
        drawerTitle: "title",
        drawerPatentTitleKey: "patentTitle",
        drawerPublicationKey: "publication",
        drawerJurisdictionKey: "jurisdiction",
        drawerApplicantKey: "applicant",
        similarityLabel: "semantic",
        whyResultHeading: "why",
        relevantTextHeading: "relevant",
        drawerSourceButton: "viewSource",
        drawerDisclaimer: "disclaimer"
    };

    Object.entries(ids).forEach(([id, key]) => {

        const element =
            document.getElementById(id);

        if (element && x[key]) {
            element.textContent = x[key];
        }

    });
}

function localizePatentReason(reason) {

    const translations = {

        "Related formulation concept": {
            en: "Related formulation concept",
            hi: "संबंधित फॉर्मूलेशन अवधारणा",
            mr: "संबंधित फॉर्म्युलेशन संकल्पना",
            bn: "সম্পর্কিত ফর্মুলেশন ধারণা",
            ta: "தொடர்புடைய உருவாக்கக் கருத்து",
            te: "సంబంధిత ఫార్ములేషన్ భావన",
            kn: "ಸಂಬಂಧಿತ ಫಾರ್ಮುಲೇಶನ್ ಪರಿಕಲ್ಪನೆ",
            gu: "સંબંધિત ફોર્મ્યુલેશન વિચાર",
            ml: "ബന്ധപ്പെട്ട ഫോർമുലേഷൻ ആശയം",
            pa: "ਸੰਬੰਧਿਤ ਫਾਰਮੂਲੇਸ਼ਨ ਧਾਰਨਾ",
            sa: "सम्बद्धं सूत्रीकरण-संकल्पनम्"
        },

        "Related herbal terminology": {
            en: "Related herbal terminology",
            hi: "संबंधित हर्बल शब्दावली",
            mr: "संबंधित हर्बल संज्ञा",
            bn: "সম্পর্কিত হারবাল পরিভাষা",
            ta: "தொடர்புடைய மூலிகைச் சொற்கள்",
            te: "సంబంధిత హెర్బల్ పదజాలం",
            kn: "ಸಂಬಂಧಿತ ಹರ್ಬಲ್ ಪದಪ್ರಯೋಗ",
            gu: "સંબંધિત હર્બલ પરિભાષા",
            ml: "ബന്ധപ്പെട്ട ഹർബൽ പദാവലി",
            pa: "ਸੰਬੰਧਿਤ ਹਰਬਲ ਸ਼ਬਦਾਵਲੀ",
            sa: "सम्बद्धाः औषधीय-वनस्पति-शब्दाः"
        },

        "Related Ayurveda domain": {
            en: "Related Ayurveda domain",
            hi: "संबंधित आयुर्वेद क्षेत्र",
            mr: "संबंधित आयुर्वेद क्षेत्र",
            bn: "সম্পর্কিত আয়ুর্বেদ ক্ষেত্র",
            ta: "தொடர்புடைய ஆயுர்வேதத் துறை",
            te: "సంబంధిత ఆయుర్వేద రంగం",
            kn: "ಸಂಬಂಧಿತ ಆಯುರ್ವೇದ ಕ್ಷೇತ್ರ",
            gu: "સંબંધિત આયુર્વેદ ક્ષેત્ર",
            ml: "ബന്ധപ്പെട്ട ആയുർവേദ മേഖല",
            pa: "ਸੰਬੰਧਿਤ ਆਯੁਰਵੇਦ ਖੇਤਰ",
            sa: "सम्बद्धम् आयुर्वेद-क्षेत्रम्"
        },

        "Related extraction/process terminology": {
            en: "Related extraction/process terminology",
            hi: "संबंधित निष्कर्षण/प्रक्रिया शब्दावली",
            mr: "संबंधित निष्कर्षण/प्रक्रिया संज्ञा",
            bn: "সম্পর্কিত নিষ্কাশন/প্রক্রিয়া পরিভাষা",
            ta: "தொடர்புடைய பிரித்தெடுத்தல்/செயல்முறைச் சொற்கள்",
            te: "సంబంధిత వెలికితీత/ప్రక్రియ పదజాలం",
            kn: "ಸಂಬಂಧಿತ ಹೊರತೆಗೆಯುವಿಕೆ/ಪ್ರಕ್ರಿಯೆ ಪದಪ್ರಯೋಗ",
            gu: "સંબંધિત નિષ્કર્ષણ/પ્રક્રિયા પરિભાષા",
            ml: "ബന്ധപ്പെട്ട എക്സ്ട്രാക്ഷൻ/പ്രക്രിയ പദാവലി",
            pa: "ਸੰਬੰਧਿਤ ਐਕਸਟ੍ਰੈਕਸ਼ਨ/ਪ੍ਰਕਿਰਿਆ ਸ਼ਬਦਾਵਲੀ",
            sa: "सम्बद्धं निष्कर्षण-प्रक्रिया-पारिभाषिकम्"
        },

        "Similar technical terminology": {
            en: "Similar technical terminology",
            hi: "समान तकनीकी शब्दावली",
            mr: "समान तांत्रिक संज्ञा",
            bn: "সাদৃশ্যপূর্ণ প্রযুক্তিগত পরিভাষা",
            ta: "ஒத்த தொழில்நுட்பச் சொற்கள்",
            te: "సారూప్య సాంకేతిక పదజాలం",
            kn: "ಸಮಾನ ತಾಂತ್ರಿಕ ಪದಪ್ರಯೋಗ",
            gu: "સમાન તકનીકી પરિભાષા",
            ml: "സമാന സാങ്കേതിക പദാവലി",
            pa: "ਸਮਾਨ ਤਕਨੀਕੀ ਸ਼ਬਦਾਵਲੀ",
            sa: "समानं तान्त्रिक-पारिभाषिकम्"
        },

        "Textual/conceptual overlap in the prototype corpus": {
            en: "Textual/conceptual overlap in the prototype corpus",
            hi: "प्रोटोटाइप कॉर्पस में पाठ/अवधारणा का मेल",
            mr: "प्रोटोटाइप कॉर्पसमध्ये मजकूर/संकल्पनेची संबंधितता",
            bn: "প্রোটোটাইপ কর্পাসে পাঠ্য/ধারণাগত মিল",
            ta: "முன்மாதிரி தொகுப்பில் உரை/கருத்து ஒற்றுமை",
            te: "ప్రోటోటైప్ కార్పస్‌లో పాఠ్య/భావ పరమైన సారూప్యత",
            kn: "ಪ್ರೋಟೋಟೈಪ್ ಕಾರ್ಪಸ್‌ನಲ್ಲಿ ಪಠ್ಯ/ಪರಿಕಲ್ಪನೆಯ ಸಾಮ್ಯತೆ",
            gu: "પ્રોટોટાઇપ કોર્પસમાં લખાણ/વિચારની સંબંધિતતા",
            ml: "പ്രോട്ടോടൈപ്പ് കോർപ്പസിലെ പാഠ/ആശയ സാമ്യം",
            pa: "ਪ੍ਰੋਟੋਟਾਈਪ ਕਾਰਪਸ ਵਿੱਚ ਪਾਠ/ਧਾਰਨਾ ਦੀ ਸਮਾਨਤਾ",
            sa: "प्रोटोटाइप्-स्रोतसि पाठ-संकल्पनयोः साम्यम्"
        }

    };

    return (
        translations[reason] &&
        translations[reason][currentLanguage]
    )
        ? translations[reason][currentLanguage]
        : reason;
}

function openPatentDrawer(index){

    currentPatent =
        patentResults[index];

    if(!currentPatent){
        return;
    }

    const p = currentPatent;

applyPatentDrawerTranslation();

document.getElementById("drawerPatentTitle")

    document.getElementById("drawerPatentTitle")
        .textContent = p.title || "—";

    document.getElementById("drawerPublication")
        .textContent = p.publication || "—";

    document.getElementById("drawerJurisdiction")
        .textContent = p.jurisdiction || "—";

    document.getElementById("drawerApplicant")
        .textContent = p.applicant || "—";

    document.getElementById("drawerSimilarity")
        .textContent =
        formatSimilarity(p.similarity);

    const similarity =
        Number(p.similarity);

    document.getElementById("drawerMeter")
        .style.width =
        `${Math.max(
            0,
            Math.min(
                100,
                Number.isFinite(similarity)
                    ? similarity
                    : 0
            )
        )}%`;

    document.getElementById("drawerReasons")
        .innerHTML =
        (p.reasons || [])
    .slice(0,3)
    .map(
        reason => `<li>${esc(localizePatentReason(reason))}</li>`
    )
    .join("")

    document.getElementById("drawerRelevantText")
        .textContent =
        p.text || "—";

    document.getElementById("drawerOverlay")
        .classList.remove("hidden");
}

function closeDrawer(event){

    // Always close when the X button is clicked
    if (
        event &&
        event.target &&
        event.target.closest &&
        event.target.closest(".close")
    ) {
        document.getElementById("drawerOverlay")
            .classList.add("hidden");

        currentPatent = null;
        return;
    }

    // Close when clicking the dark background
    if (
        event &&
        event.target &&
        event.target.id !== "drawerOverlay"
    ) {
        return;
    }

    document.getElementById("drawerOverlay")
        .classList.add("hidden");

    currentPatent = null;
}

function openDrawerSource(){

    if(
        currentPatent &&
        currentPatent.url
    ){

        window.open(
            currentPatent.url,
            "_blank",
            "noopener,noreferrer"
        );

        return;
    }

    alert(
        currentLanguage === "hi"
        ? "इस रिकॉर्ड के लिए स्रोत लिंक उपलब्ध नहीं है।"
        : currentLanguage === "mr"
        ? "या रेकॉर्डसाठी स्रोत लिंक उपलब्ध नाही."
        : "No source link is available for this record."
    );
}


/* ============================================================
   KNOWLEDGE BASE UI
   ============================================================ */

function openKBModal(){
    document.getElementById("kbModal")
        .classList.remove("hidden");
}

async function uploadKnowledgeSource() {

    const fileInput =
        document.getElementById("kbFile");

    const authority =
        document.getElementById("kbAuthority")
            .value
            .trim();

    const documentType =
        document.getElementById("kbType")
            .value;

    const jurisdiction =
        document.getElementById("kbJurisdiction")
            .value
            .trim();

    const button =
        document.getElementById("indexKBButton");

    if (!fileInput.files.length) {
        alert("Please select a PDF file.");
        return;
    }

    if (!authority) {
        alert("Please enter the authority name.");
        return;
    }

    if (!jurisdiction) {
        alert("Please enter the jurisdiction.");
        return;
    }

    const file =
        fileInput.files[0];

    if (
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {
        alert("Only PDF files are supported.");
        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    formData.append(
        "authority",
        authority
    );

    formData.append(
        "document_type",
        documentType
    );

    formData.append(
        "jurisdiction",
        jurisdiction
    );

    button.disabled = true;

    button.textContent =
        "Processing...";

    try {

        const response =
            await fetch(
                "/api/documents/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Document upload failed."
            );
        }

        button.textContent =
            "✓ Indexed";

        await refreshKnowledgeBase();

        setTimeout(
            () => {

                closeKBModal();

                button.disabled = false;

                button.textContent =
                    "Add & Index";

                fileInput.value = "";

                document.getElementById(
                    "kbSelectedFile"
                ).textContent = "";

                document.getElementById(
                    "kbAuthority"
                ).value = "";

            },
            900
        );

    } catch (error) {

        console.error(
            "Knowledge Base upload error:",
            error
        );

        alert(
            error.message ||
            "Document upload failed."
        );

        button.disabled = false;

        button.textContent =
            "Add & Index";
    }
}
async function refreshKnowledgeBase() {

    try {

        const response =
            await fetch("/api/documents");

        if (!response.ok) {
            throw new Error(
                "Failed to load documents."
            );
        }

        const data =
            await response.json();

        const documents =
            data.documents || [];

        const body =
            document.getElementById("kbBody");

        if (!body) {
            return;
        }

        body.innerHTML = "";

        documents.forEach(function (item) {

    const source =
        item.authority ||
        item.source ||
        item.title ||
        "Unknown Source";

    const type =
        item.document_type ||
        item.type ||
        "IP";

    const row =
        document.createElement("tr");

    const sourceCell =
        document.createElement("td");

    sourceCell.textContent =
        source;

    const typeCell =
        document.createElement("td");

    typeCell.textContent =
        type;

    const statusCell =
        document.createElement("td");

    statusCell.className =
        "indexed";

    statusCell.textContent =
        "✓ Indexed";

    row.appendChild(sourceCell);
    row.appendChild(typeCell);
    row.appendChild(statusCell);

    body.appendChild(row);
});

        const count =
            document.getElementById(
                "kbCount"
            );

        if (count) {

            count.textContent =
                `${documents.length} Sources Indexed`;
        }

    } catch (error) {

        console.error(
            "Knowledge Base refresh failed:",
            error
        );
    }
}

const kbScreen =
    document.getElementById("screenKB");

if (kbScreen) {

    const kbObserver =
        new MutationObserver(
            () => {

                const isVisible =
                    !kbScreen.classList.contains(
                        "hidden"
                    );

                if (isVisible) {
                    refreshKnowledgeBase();
                }

            }
        );

    kbObserver.observe(
        kbScreen,
        {
            attributes: true,
            attributeFilter: ["class"]
        }
    );
}

function closeKBModal(){
    document.getElementById("kbModal")
        .classList.add("hidden");
}

async function simulateIndexing(){

    const authority =
        document.getElementById("kbAuthority").value.trim();

    if(!authority){
        document.getElementById("kbAuthority").focus();
        return;
    }

    const button =
        document.getElementById("indexKBButton");

    button.disabled = true;

    const original =
        button.textContent;

    button.textContent =
        "Uploaded → Extracting → Chunking → Indexing...";

    await wait(1000);

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${esc(authority)}</td>
        <td>${esc(document.getElementById("kbType").value)}</td>
        <td class="indexed">✓ Indexed</td>
    `;

    document.getElementById("kbBody")
        .appendChild(row);

    const count =
        document.getElementById("kbBody")
            .querySelectorAll("tr").length;

    document.getElementById("kbCount").textContent =
        `${count} Sources Indexed`;

    button.disabled = false;
    button.textContent =
        original;

    closeKBModal();
}


/* ============================================================
   INITIALIZE
   ============================================================ */

document.addEventListener("DOMContentLoaded",()=>{

    document.getElementById("lang").value =
        translations[currentLanguage]
        ? currentLanguage
        : "en";

    document.getElementById("jurisdiction").value = ["IN","US","UK","WIPO"].includes(currentJurisdiction) ? currentJurisdiction : "IN";
    applyTranslations();
    updateJurisdictionPreview();

    openApp("ask");

});

// ============================================================
// PATENT DRAWER - RELIABLE CLOSE BUTTON
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const drawerOverlay =
        document.getElementById("drawerOverlay");

    if (!drawerOverlay) {
        console.error("drawerOverlay not found.");
        return;
    }

    const closeButton =
        drawerOverlay.querySelector(".close");

    if (!closeButton) {
        console.error("Patent drawer close button not found.");
        return;
    }

    closeButton.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        drawerOverlay.classList.add("hidden");
        currentPatent = null;

        console.log("Patent drawer closed.");
    });

});
document.addEventListener("DOMContentLoaded", function () {

    const overlay =
        document.getElementById("drawerOverlay");

    if (!overlay) {
        console.error("drawerOverlay not found");
        return;
    }

    overlay.addEventListener("click", function (event) {

        // Only close when the actual dark backdrop is clicked.
        if (event.target === overlay) {
            overlay.classList.add("hidden");

            if (typeof currentPatent !== "undefined") {
                currentPatent = null;
            }
        }

    });

});
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const fileInput =
            document.getElementById(
                "kbFile"
            );

        if (!fileInput) {
            return;
        }

        fileInput.addEventListener(
            "change",
            function () {

                const display =
                    document.getElementById(
                        "kbSelectedFile"
                    );

                if (!display) {
                    return;
                }

                if (this.files.length) {

                    display.textContent =
                        `Selected: ${this.files[0].name}`;

                } else {

                    display.textContent =
                        "";
                }

            }
        );

    }
);
document.addEventListener("DOMContentLoaded", function () {
    refreshKnowledgeBase();
});
applyPatentDrawerTranslation();