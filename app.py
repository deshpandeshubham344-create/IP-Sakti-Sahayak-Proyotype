from pathlib import Path
import json
import re
import shutil
from typing import List, Dict, Any
import os
from supabase import create_client, Client

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException,
)
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================
# PATHS
# ============================================================

BASE = Path(__file__).resolve().parent
DATA = BASE / "data" / "corpus_multijurisdiction_expanded.json"
PATENTS_DATA = BASE / "data" / "patents.json"
STATIC = BASE / "static"
UPLOADS = BASE / "data" / "uploads"
UPLOADS.mkdir(
    parents=True,
    exist_ok=True
)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL and SUPABASE_KEY must be configured."
    )

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# ============================================================
# LOAD DATA
# ============================================================

if not DATA.exists():
    raise FileNotFoundError(f"Knowledge base not found: {DATA}")

if not PATENTS_DATA.exists():
    raise FileNotFoundError(f"Patent corpus not found: {PATENTS_DATA}")

with DATA.open("r", encoding="utf-8") as f:
    DOCUMENTS: List[Dict[str, Any]] = json.load(f)

with PATENTS_DATA.open("r", encoding="utf-8") as f:
    PATENTS: List[Dict[str, Any]] = json.load(f)

if not DOCUMENTS:
    raise ValueError("corpus.json is empty.")

if not PATENTS:
    raise ValueError("patents.json is empty.")


app = FastAPI(
    title="IP-SAKTI Sahayak MVP",
    description="Multilingual evidence-grounded Ayurveda IP assistant"
)
 
app.mount(
    "/static/uploads",
    StaticFiles(directory=UPLOADS),
    name="uploaded-files"
)

app.mount(
    "/static",
    StaticFiles(directory=STATIC),
    name="static"
)

# ============================================================
# SUPPORTED LANGUAGES
# ============================================================

SUPPORTED_LANGUAGES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "gu": "Gujarati",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "sa": "Sanskrit",
}


SUPPORTED_JURISDICTIONS = {
    "IN": "India",
    "US": "United States",
    "UK": "United Kingdom",
    "WIPO": "International (WIPO/PCT)",
}


# ============================================================
# REQUEST MODELS
# ============================================================

class ChatRequest(BaseModel):
    query: str
    language: str = "en"
    jurisdiction: str = "IN"


class PatentSearchRequest(BaseModel):
    innovation: str
    jurisdiction: str = "IN"
    top_k: int = 5


# ============================================================
# MULTILINGUAL QUERY NORMALIZATION
# ============================================================

TERM_MAP = {
    # Hindi
    "पारंपरिक ज्ञान": "traditional knowledge",
    "पारंपरिक": "traditional",
    "ज्ञान": "knowledge",
    "आयुर्वेदिक": "ayurvedic",
    "आयुर्वेद": "ayurveda",
    "औषधि": "medicine",
    "दवा": "medicine",
    "फॉर्मूलेशन": "formulation",
    "फॉर्मुलेशन": "formulation",
    "पेटेंट योग्यता": "patentability",
    "पेटेंट योग्य": "patentability",
    "पेटेंट": "patent",
    "उपचार": "treatment",
    "चिकित्सा": "treatment",
    "ज्ञात": "known",
    "नया उपयोग": "new use",
    "नया रूप": "new form",

    # Marathi
    "पारंपरिक ज्ञानामुळे": "traditional knowledge",
    "पारंपरिक ज्ञान": "traditional knowledge",
    "पारंपरिक": "traditional",
    "आयुर्वेदिक": "ayurvedic",
    "आयुर्वेद": "ayurveda",
    "औषध": "medicine",
    "फॉर्म्युलेशनच्या": "formulation",
    "फॉर्म्युलेशन": "formulation",
    "पेटंटयोग्यतेवर": "patentability",
    "पेटंटयोग्यता": "patentability",
    "पेटंट": "patent",
    "उपचार": "treatment",
    "चिकित्सा": "treatment",
    "ज्ञात": "known",
    "नवीन उपयोग": "new use",
    "नवीन स्वरूप": "new form",

    # Bengali
    "ঐতিহ্যগত জ্ঞান": "traditional knowledge",
    "ঐতিহ্যগত": "traditional",
    "জ্ঞান": "knowledge",
    "আয়ুর্বেদিক": "ayurvedic",
    "আয়ুর্বেদ": "ayurveda",
    "ওষুধ": "medicine",
    "ফর্মুলেশন": "formulation",
    "পেটেন্টযোগ্যতা": "patentability",
    "পেটেন্ট": "patent",
    "চিকিৎসা": "treatment",

    # Tamil
    "பாரம்பரிய அறிவு": "traditional knowledge",
    "பாரம்பரிய": "traditional",
    "அறிவு": "knowledge",
    "ஆயுர்வேத": "ayurvedic",
    "ஆயுர்வேதம்": "ayurveda",
    "மருந்து": "medicine",
    "உருவாக்கம்": "formulation",
    "காப்புரிமைத் தகுதி": "patentability",
    "காப்புரிமை": "patent",
    "சிகிச்சை": "treatment",

    # Telugu
    "సాంప్రదాయ జ్ఞానం": "traditional knowledge",
    "సాంప్రదాయ": "traditional",
    "జ్ఞానం": "knowledge",
    "ఆయుర్వేద": "ayurvedic",
    "ఆయుర్వేదం": "ayurveda",
    "మందు": "medicine",
    "ఫార్ములేషన్": "formulation",
    "పేటెంట్ అర్హత": "patentability",
    "పేటెంట్": "patent",
    "చికిత్స": "treatment",

    # Kannada
    "ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನ": "traditional knowledge",
    "ಸಾಂಪ್ರದಾಯಿಕ": "traditional",
    "ಜ್ಞಾನ": "knowledge",
    "ಆಯುರ್ವೇದ": "ayurvedic",
    "ಔಷಧ": "medicine",
    "ಫಾರ್ಮುಲೇಶನ್": "formulation",
    "ಪೇಟೆಂಟ್ ಅರ್ಹತೆ": "patentability",
    "ಪೇಟೆಂಟ್": "patent",
    "ಚಿಕಿತ್ಸೆ": "treatment",

    # Gujarati
    "પરંપરાગત જ્ઞાન": "traditional knowledge",
    "પરંપરાગત": "traditional",
    "જ્ઞાન": "knowledge",
    "આયુર્વેદિક": "ayurvedic",
    "આયુર્વેદ": "ayurveda",
    "દવા": "medicine",
    "ફોર્મ્યુલેશન": "formulation",
    "પેટન્ટયોગ્યતા": "patentability",
    "પેટન્ટ": "patent",
    "સારવાર": "treatment",

    # Malayalam
    "പരമ്പരാഗത അറിവ്": "traditional knowledge",
    "പരമ്പരാഗത": "traditional",
    "അറിവ്": "knowledge",
    "ആയുർവേദ": "ayurvedic",
    "മരുന്ന്": "medicine",
    "ഫോർമുലേഷൻ": "formulation",
    "പേറ്റന്റ് യോഗ്യത": "patentability",
    "പേറ്റന്റ്": "patent",
    "ചികിത്സ": "treatment",

    # Punjabi
    "ਰਵਾਇਤੀ ਗਿਆਨ": "traditional knowledge",
    "ਰਵਾਇਤੀ": "traditional",
    "ਗਿਆਨ": "knowledge",
    "ਆਯੁਰਵੇਦ": "ayurvedic",
    "ਦਵਾਈ": "medicine",
    "ਫਾਰਮੂਲੇਸ਼ਨ": "formulation",
    "ਪੇਟੈਂਟ ਯੋਗਤਾ": "patentability",
    "ਪੇਟੈਂਟ": "patent",
    "ਇਲਾਜ": "treatment",

    # Sanskrit
    "पारम्परिक ज्ञानम्": "traditional knowledge",
    "पारम्परिकज्ञानम्": "traditional knowledge",
    "पारम्परिक": "traditional",
    "ज्ञानम्": "knowledge",
    "आयुर्वेदिक": "ayurvedic",
    "आयुर्वेद": "ayurveda",
    "औषधम्": "medicine",
    "औषध": "medicine",
    "पेटेण्ट": "patent",
    "चिकित्सा": "treatment",
}


def normalize_multilingual(query: str) -> str:
    normalized = query.lower()

    for source_term in sorted(
        TERM_MAP,
        key=len,
        reverse=True
    ):
        normalized = normalized.replace(
            source_term.lower(),
            f" {TERM_MAP[source_term]} "
        )

    return re.sub(
        r"\s+",
        " ",
        normalized
    ).strip()


# ============================================================
# RETRIEVAL INDEX
# ============================================================

RETRIEVAL_TEXTS: List[str] = []

VECTORIZER = None
MATRIX = None


def rebuild_retrieval_index():

    global RETRIEVAL_TEXTS
    global VECTORIZER
    global MATRIX

    RETRIEVAL_TEXTS = []

    for document in DOCUMENTS:

        keywords = document.get(
            "keywords",
            []
        )

        if not isinstance(
            keywords,
            list
        ):
            keywords = []

        retrieval_text = " ".join(
            [
                str(
                    document.get(
                        "title",
                        ""
                    )
                ),

                str(
                    document.get(
                        "section",
                        ""
                    )
                ),

                str(
                    document.get(
                        "text",
                        ""
                    )
                ),

                " ".join(
                    str(k)
                    for k in keywords
                )
            ]
        )

        RETRIEVAL_TEXTS.append(
            retrieval_text
        )

    VECTORIZER = TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        stop_words="english",
    )

    MATRIX = VECTORIZER.fit_transform(
        RETRIEVAL_TEXTS
    )


rebuild_retrieval_index()


# ============================================================
# LOCALIZED EVIDENCE
# ============================================================

EVIDENCE_TRANSLATIONS = {
    "3(p)": {
        "en": "Section 3(p) excludes an invention that in effect is traditional knowledge, or an aggregation or duplication of known properties of traditionally known components.",
        "hi": "धारा 3(p) ऐसे आविष्कारों को अपवर्जित करती है जो वास्तव में पारंपरिक ज्ञान हैं या पारंपरिक रूप से ज्ञात घटकों के ज्ञात गुणों का संकलन या दोहराव हैं।",
        "mr": "कलम 3(p) नुसार, जे आविष्कार प्रत्यक्षात पारंपरिक ज्ञान आहेत किंवा पारंपरिकरीत्या ज्ञात घटकांच्या ज्ञात गुणधर्मांचे संकलन किंवा पुनरावृत्ती आहेत, ते वगळले जातात.",
        "bn": "ধারা 3(p) এমন আবিষ্কারকে বাদ দেয় যা মূলত ঐতিহ্যগত জ্ঞান বা ঐতিহ্যগতভাবে পরিচিত উপাদানের পরিচিত বৈশিষ্ট্যের সংকলন বা পুনরাবৃত্তি।",
        "ta": "பிரிவு 3(p), முக்கியமாக பாரம்பரிய அறிவாக உள்ள கண்டுபிடிப்புகள் அல்லது பாரம்பரியமாக அறியப்பட்ட கூறுகளின் அறியப்பட்ட பண்புகளின் தொகுப்பு அல்லது மறுபதிப்பை விலக்குகிறது.",
        "te": "సెక్షన్ 3(p) ప్రధానంగా సాంప్రదాయ జ్ఞానంగా ఉన్న ఆవిష్కరణలను లేదా సాంప్రదాయంగా తెలిసిన భాగాల తెలిసిన లక్షణాల సమాహారం లేదా పునరావృతిని మినహాయిస్తుంది.",
        "kn": "ವಿಭಾಗ 3(p) ಮೂಲತಃ ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನವಾಗಿರುವ ಆವಿಷ್ಕಾರಗಳನ್ನು ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ತಿಳಿದಿರುವ ಘಟಕಗಳ ಪರಿಚಿತ ಗುಣಗಳ ಸಂಯೋಜನೆ ಅಥವಾ ಪುನರಾವರ್ತನೆಯನ್ನು ಹೊರತುಪಡಿಸುತ್ತದೆ.",
        "gu": "કલમ 3(p) એવા આવિષ્કારોને બાકાત રાખે છે જે વાસ્તવમાં પરંપરાગત જ્ઞાન છે અથવા પરંપરાગત રીતે જાણીતા ઘટકોના જાણીતા ગુણધર્મોનું સંકલન અથવા પુનરાવર્તન છે.",
        "ml": "വകുപ്പ് 3(p) യഥാർത്ഥത്തിൽ പരമ്പരാഗത അറിവായിരിക്കുന്ന കണ്ടുപിടിത്തങ്ങളെയും പരമ്പരാഗതമായി അറിയപ്പെടുന്ന ഘടകങ്ങളുടെ അറിയപ്പെട്ട ഗുണങ്ങളുടെ സംയോജനം അല്ലെങ്കിൽ ആവർത്തനം ഉൾപ്പെടെയുള്ള വിഷയങ്ങളെയും ഒഴിവാക്കുന്നു.",
        "pa": "ਧਾਰਾ 3(p) ਉਹਨਾਂ ਆਵਿਸ਼ਕਾਰਾਂ ਨੂੰ ਬਾਹਰ ਰੱਖਦੀ ਹੈ ਜੋ ਅਸਲ ਵਿੱਚ ਰਵਾਇਤੀ ਗਿਆਨ ਹਨ ਜਾਂ ਰਵਾਇਤੀ ਤੌਰ 'ਤੇ ਜਾਣੇ ਜਾਂਦੇ ਘਟਕਾਂ ਦੇ ਜਾਣੇ-ਪਛਾਣੇ ਗੁਣਾਂ ਦਾ ਸੰਕਲਨ ਜਾਂ ਦੁਹਰਾਵਾ ਹਨ।",
        "sa": "धारा 3(p) तान् आविष्कारान् वर्जयति ये वस्तुतः पारम्परिकज्ञानम् अथवा पारम्परिकतया ज्ञातानां घटकानां ज्ञातगुणानां सङ्कलनं वा पुनरावृत्तिः सन्ति।",
    },
    "3(d)": {
        "en": "Section 3(d) addresses certain new forms or new uses of known substances and sets conditions under which such subject matter is not treated as an invention.",
        "hi": "धारा 3(d) ज्ञात पदार्थों के कुछ नए रूपों या नए उपयोगों को संबोधित करती है और यह निर्धारित करती है कि किन परिस्थितियों में ऐसा विषय आविष्कार नहीं माना जाता।",
        "mr": "कलम 3(d) ज्ञात पदार्थांच्या काही नवीन स्वरूपांना किंवा नवीन उपयोगांना संबोधित करते आणि कोणत्या परिस्थितीत असा विषय आविष्कार मानला जात नाही हे ठरवते.",
        "bn": "ধারা 3(d) পরিচিত পদার্থের কিছু নতুন রূপ বা নতুন ব্যবহারকে বিবেচনা করে এবং কোন পরিস্থিতিতে তা আবিষ্কার হিসেবে গণ্য হয় না তা নির্ধারণ করে।",
        "ta": "பிரிவு 3(d) அறியப்பட்ட பொருட்களின் சில புதிய வடிவங்கள் அல்லது புதிய பயன்பாடுகளைப் பற்றி குறிப்பிடுகிறது மற்றும் எந்த சூழலில் அவை கண்டுபிடிப்பாக கருதப்படாது என்பதை கூறுகிறது.",
        "te": "సెక్షన్ 3(d) తెలిసిన పదార్థాల కొన్ని కొత్త రూపాలు లేదా కొత్త ఉపయోగాలను పరిశీలిస్తుంది మరియు అవి ఆవిష్కరణగా పరిగణించబడని పరిస్థితులను నిర్దేశిస్తుంది.",
        "kn": "ವಿಭಾಗ 3(d) ತಿಳಿದಿರುವ ಪದಾರ್ಥಗಳ ಕೆಲವು ಹೊಸ ರೂಪಗಳು ಅಥವಾ ಹೊಸ ಬಳಕೆಗಳನ್ನು ಕುರಿತು ಚರ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಯಾವ ಸಂದರ್ಭಗಳಲ್ಲಿ ಅವುಗಳನ್ನು ಆವಿಷ್ಕಾರ ಎಂದು ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ನಿಗದಿಪಡಿಸುತ್ತದೆ.",
        "gu": "કલમ 3(d) જાણીતા પદાર્થોના કેટલાક નવા સ્વરૂપો અથવા નવા ઉપયોગોને આવરી લે છે અને કયા સંજોગોમાં તેને આવિષ્કાર માનવામાં આવતું નથી તે નક્કી કરે છે.",
        "ml": "വകുപ്പ് 3(d) അറിയപ്പെടുന്ന വസ്തുക്കളുടെ ചില പുതിയ രൂപങ്ങളെയോ പുതിയ ഉപയോഗങ്ങളെയോ പരിഗണിക്കുകയും ഏത് സാഹചര്യത്തിലാണ് അവ കണ്ടുപിടിത്തമായി കണക്കാക്കാത്തതെന്ന് വ്യക്തമാക്കുകയും ചെയ്യുന്നു.",
        "pa": "ਧਾਰਾ 3(d) ਜਾਣੇ-ਪਛਾਣੇ ਪਦਾਰਥਾਂ ਦੇ ਕੁਝ ਨਵੇਂ ਰੂਪਾਂ ਜਾਂ ਨਵੇਂ ਉਪਯੋਗਾਂ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰਦੀ ਹੈ ਅਤੇ ਉਹਨਾਂ ਸਥਿਤੀਆਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ ਜਿੱਥੇ ਉਹਨਾਂ ਨੂੰ ਆਵਿਸ਼ਕਾਰ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ।",
        "sa": "धारा 3(d) ज्ञातपदार्थानां केषाञ्चित् नवरूपाणि नवोपयोगांश्च सम्बोधयति तथा च केषु परिस्थितिषु तत् आविष्कारत्वेन न स्वीक्रियते इति निर्दिशति।",
    },
    "3(i)": {
        "en": "Section 3(i) excludes specified methods of medicinal, surgical, curative, prophylactic, diagnostic or therapeutic treatment.",
        "hi": "धारा 3(i) कुछ औषधीय, शल्य, उपचारात्मक, रोगनिरोधी, निदानात्मक या चिकित्सीय उपचार की विधियों को अपवर्जित करती है।",
        "mr": "कलम 3(i) काही औषधी, शस्त्रक्रियात्मक, उपचारात्मक, प्रतिबंधात्मक, निदानात्मक किंवा चिकित्सीय उपचारांच्या पद्धतींना वगळते.",
        "bn": "ধারা 3(i) নির্দিষ্ট ঔষধি, অস্ত্রোপচার, নিরাময়মূলক, প্রতিরোধমূলক, রোগনির্ণয় বা চিকিৎসামূলক পদ্ধতিকে বাদ দেয়।",
        "ta": "பிரிவு 3(i), சில மருத்துவ, அறுவைச் சிகிச்சை, குணப்படுத்தும், தடுப்பு, நோயறிதல் அல்லது சிகிச்சை முறைகளை விலக்குகிறது.",
        "te": "సెక్షన్ 3(i) కొన్ని ఔషధ, శస్త్రచికిత్స, చికిత్సా, నివారణ, నిర్ధారణ లేదా థెరప్యూటిక్ పద్ధతులను మినహాయిస్తుంది.",
        "kn": "ವಿಭಾಗ 3(i) ಕೆಲವು ಔಷಧೀಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ, ಚಿಕಿತ್ಸಾತ್ಮಕ, ತಡೆಗಟ್ಟುವ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ಚಿಕಿತ್ಸಾ ವಿಧಾನಗಳನ್ನು ಹೊರತುಪಡಿಸುತ್ತದೆ.",
        "gu": "કલમ 3(i) કેટલીક ઔષધીય, શસ્ત્રક્રિયાત્મક, ઉપચારાત્મક, નિવારક, નિદાનાત્મક અથવા થેરાપ્યુટિક પદ્ધતિઓને બાકાત રાખે છે.",
        "ml": "വകുപ്പ് 3(i) ചില ഔഷധ, ശസ്ത്രക്രിയ, ചികിത്സാ, പ്രതിരോധ, രോഗനിർണയ അല്ലെങ്കിൽ ചികിത്സാ രീതികളെ ഒഴിവാക്കുന്നു.",
        "pa": "ਧਾਰਾ 3(i) ਕੁਝ ਔਸ਼ਧੀ, ਸਰਜੀਕਲ, ਇਲਾਜ, ਰੋਕਥਾਮ, ਨਿਦਾਨ ਜਾਂ ਥੈਰੇਪੀ ਵਾਲੀਆਂ ਵਿਧੀਆਂ ਨੂੰ ਬਾਹਰ ਰੱਖਦੀ ਹੈ।",
        "sa": "धारा 3(i) कतिपयान् औषधीयान्, शल्यक्रियात्मकान्, उपचारात्मकान्, रोगप्रतिबन्धकान्, निदानात्मकान् वा चिकित्सात्मकान् उपचारविधीन् वर्जयति।",
    },
    "64(1)(q)": {
        "en": "Section 64(1)(q) includes a ground relating to anticipation by knowledge available within a local or indigenous community.",
        "hi": "धारा 64(1)(q) स्थानीय या स्वदेशी समुदाय में उपलब्ध ज्ञान के आधार पर anticipation से संबंधित एक आधार को शामिल करती है।",
        "mr": "कलम 64(1)(q) स्थानिक किंवा स्वदेशी समुदायामध्ये उपलब्ध ज्ञानावर आधारित anticipation शी संबंधित एक आधार समाविष्ट करते.",
        "bn": "ধারা 64(1)(q) স্থানীয় বা আদিবাসী সম্প্রদায়ে উপলব্ধ জ্ঞানের ভিত্তিতে anticipation-এর সঙ্গে সম্পর্কিত একটি ভিত্তি অন্তর্ভুক্ত করে।",
        "ta": "பிரிவு 64(1)(q), உள்ளூர் அல்லது பழங்குடியினர் சமூகத்தில் கிடைக்கும் அறிவை அடிப்படையாகக் கொண்ட anticipation தொடர்பான ஒரு காரணத்தை உள்ளடக்குகிறது.",
        "te": "సెక్షన్ 64(1)(q) స్థానిక లేదా స్వదేశీ సమాజంలో అందుబాటులో ఉన్న జ్ఞానానికి ఆధారమైన anticipation‌కు సంబంధించిన ఒక కారణాన్ని కలిగి ఉంటుంది.",
        "kn": "ವಿಭಾಗ 64(1)(q) ಸ್ಥಳೀಯ ಅಥವಾ ಸ್ವದೇಶಿ ಸಮುದಾಯದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಜ್ಞಾನವನ್ನು ಆಧರಿಸಿದ anticipation ಗೆ ಸಂಬಂಧಿಸಿದ ಒಂದು ಆಧಾರವನ್ನು ಒಳಗೊಂಡಿದೆ.",
        "gu": "કલમ 64(1)(q) સ્થાનિક અથવા સ્વદેશી સમુદાયમાં ઉપલબ્ધ જ્ઞાનના આધારે anticipation સાથે સંબંધિત એક આધારનો સમાવેશ કરે છે.",
        "ml": "വകുപ്പ് 64(1)(q) പ്രാദേശികമോ സ്വദേശീയമോ ആയ സമൂഹത്തിൽ ലഭ്യമായ അറിവിനെ അടിസ്ഥാനമാക്കിയുള്ള anticipation-നുമായി ബന്ധപ്പെട്ട ഒരു കാരണം ഉൾക്കൊള്ളുന്നു.",
        "pa": "ਧਾਰਾ 64(1)(q) ਸਥਾਨਕ ਜਾਂ ਸਵਦੇਸ਼ੀ ਭਾਈਚਾਰੇ ਵਿੱਚ ਉਪਲਬਧ ਗਿਆਨ ਦੇ ਆਧਾਰ 'ਤੇ anticipation ਨਾਲ ਸੰਬੰਧਿਤ ਇੱਕ ਆਧਾਰ ਸ਼ਾਮਲ ਕਰਦੀ ਹੈ।",
        "sa": "धारा 64(1)(q) स्थानीय-स्वदेशि-समुदाये उपलब्धेन ज्ञानेन आधारितम् anticipation-सम्बद्धम् एकं कारणं समावेशयति।",
    },
    "64(1)(p)": {
        "en": "Section 64 includes a ground where the complete specification does not disclose or wrongly mentions the source or geographical origin of biological material used.",
        "hi": "धारा 64 में ऐसा आधार शामिल है जहाँ पूर्ण विनिर्देशन उपयोग किए गए जैविक पदार्थ के स्रोत या भौगोलिक मूल का सही खुलासा नहीं करता या गलत उल्लेख करता है।",
        "mr": "कलम 64 मध्ये असा आधार आहे की वापरलेल्या जैविक पदार्थाचा स्रोत किंवा भौगोलिक उत्पत्ती पूर्ण विनिर्देशनात योग्यरीत्या नमूद केलेली नसल्यास किंवा चुकीची नमूद केल्यास.",
        "bn": "ধারা 64-এ এমন একটি ভিত্তি রয়েছে যেখানে ব্যবহৃত জৈব উপাদানের উৎস বা ভৌগোলিক উৎপত্তি সম্পূর্ণ বিবরণে প্রকাশ করা হয়নি বা ভুলভাবে উল্লেখ করা হয়েছে।",
        "ta": "பிரிவு 64-இல் பயன்படுத்தப்பட்ட உயிரியல் பொருளின் மூலாதாரம் அல்லது புவியியல் தோற்றம் முழுமையான விவரக்குறிப்பில் வெளிப்படுத்தப்படாதது அல்லது தவறாக குறிப்பிடப்படுவது தொடர்பான காரணம் உள்ளது.",
        "te": "సెక్షన్ 64లో ఉపయోగించిన జీవ పదార్థం యొక్క మూలం లేదా భౌగోళిక ఉత్పత్తి పూర్తి స్పెసిఫికేషన్‌లో వెల్లడించకపోవడం లేదా తప్పుగా పేర్కొనడం ఒక కారణంగా ఉంది.",
        "kn": "ವಿಭಾಗ 64ರಲ್ಲಿ ಬಳಸಿದ ಜೈವಿಕ ವಸ್ತುವಿನ ಮೂಲ ಅಥವಾ ಭೌಗೋಳಿಕ ಉಗಮವನ್ನು ಸಂಪೂರ್ಣ ವಿವರಣೆಯಲ್ಲಿ ಬಹಿರಂಗಪಡಿಸದಿರುವುದು ಅಥವಾ ತಪ್ಪಾಗಿ ನಮೂದಿಸಿರುವುದು ಒಂದು ಆಧಾರವಾಗಿದೆ.",
        "gu": "કલમ 64માં એવો આધાર છે કે ઉપયોગમાં લેવાયેલા જૈવિક પદાર્થના સ્ત્રોત અથવા ભૌગોલિક મૂળનો સંપૂર્ણ સ્પષ્ટીકરણમાં યોગ્ય ખુલાસો ન થયો હોય અથવા ખોટો ઉલ્લેખ થયો હોય.",
        "ml": "വകുപ്പ് 64-ൽ ഉപയോഗിച്ച ജൈവ വസ്തുവിന്റെ ഉറവിടമോ ഭൂമിശാസ്ത്രപരമായ ഉത്ഭവമോ പൂർണ്ണ വിശദീകരണത്തിൽ വെളിപ്പെടുത്താതിരിക്കുക അല്ലെങ്കിൽ തെറ്റായി രേഖപ്പെടുത്തുക എന്നത് ഒരു അടിസ്ഥാനമാണ്.",
        "pa": "ਧਾਰਾ 64 ਵਿੱਚ ਉਹ ਆਧਾਰ ਸ਼ਾਮਲ ਹੈ ਜਿੱਥੇ ਵਰਤੇ ਗਏ ਜੈਵਿਕ ਪਦਾਰਥ ਦੇ ਸਰੋਤ ਜਾਂ ਭੂਗੋਲਿਕ ਮੂਲ ਦਾ ਪੂਰੇ ਵੇਰਵੇ ਵਿੱਚ ਖੁਲਾਸਾ ਨਹੀਂ ਕੀਤਾ ਗਿਆ ਜਾਂ ਗਲਤ ਦਰਸਾਇਆ ਗਿਆ ਹੈ।",
        "sa": "धारा 64 मध्ये तादृशः आधारः अस्ति यत्र प्रयुक्तस्य जैविकपदार्थस्य स्रोतः वा भौगोलिकमूलं पूर्णविनिर्देशे न प्रकाश्यते अथवा मिथ्या निर्दिश्यते।",
    },
}

# ============================================================
# RETRIEVE EVIDENCE
# ============================================================

def retrieve(
    query: str,
    jurisdiction: str = "IN",
    k: int = 4,
) -> List[Dict[str, Any]]:

    normalized_query = normalize_multilingual(
        query
    )

    # Convert query into TF-IDF vector
    query_vector = VECTORIZER.transform(
        [normalized_query]
    )

    # Calculate similarity against all documents
    similarities = cosine_similarity(
        query_vector,
        MATRIX
    ).flatten()

    # Highest similarity first
    ranked_indices = similarities.argsort()[::-1]

    results = []

    for index in ranked_indices:

        score = float(
            similarities[index]
        )

        # Ignore irrelevant documents
        if score <= 0:
            continue

        document = DOCUMENTS[index]

        # ----------------------------------------------------
        # Jurisdiction filtering
        # ----------------------------------------------------

        doc_jurisdiction = str(
            document.get(
                "jurisdiction",
                ""
            )
        ).strip().lower()

        requested_jurisdiction = str(
            jurisdiction
        ).strip().lower()

        jurisdiction_aliases = {
            "in": ["in", "india"],
            "uk": ["uk", "united kingdom", "gb"],
            "us": ["us", "usa", "united states"],
            "wipo": [ "wipo", "wo","international","wipo/pct","international (wipo/pct)"]
        }

        allowed_values = jurisdiction_aliases.get(
            requested_jurisdiction,
            [requested_jurisdiction]
        )

        if (
            doc_jurisdiction
            and doc_jurisdiction not in allowed_values
        ):
            continue

        # Copy document so we don't modify DOCUMENTS itself
        item = dict(document)

        item["score"] = round(
            score,
            4
        )

        results.append(
            item
        )

        if len(results) >= k:
            break

    return results
# ============================================================
# ANSWER LOGIC
# ============================================================

ANSWER_TEXT = {
    "traditional": {
        "en": (
            "The retrieved IP India material indicates that traditional-knowledge-related "
            "subject matter can raise a patentability issue. Section 3(p) addresses inventions "
            "that in effect are traditional knowledge or an aggregation or duplication of known "
            "properties of traditionally known components. Section 64(1)(q) also identifies "
            "anticipation based on knowledge available within a local or indigenous community "
            "as a relevant ground."
        ),
        "hi": "प्राप्त IP India सामग्री के अनुसार, पारंपरिक ज्ञान से संबंधित विषय पेटेंट योग्यता पर प्रभाव डाल सकते हैं। धारा 3(p) ऐसे आविष्कारों को संबोधित करती है जो वास्तव में पारंपरिक ज्ञान हैं या पारंपरिक रूप से ज्ञात घटकों के ज्ञात गुणों का संकलन या दोहराव हैं। धारा 64(1)(q) स्थानीय या स्वदेशी समुदाय में उपलब्ध ज्ञान के आधार पर anticipation से संबंधित आधार भी बताती है।",
        "mr": "प्राप्त IP India माहितीनुसार, पारंपरिक ज्ञानाशी संबंधित विषय पेटंटयोग्यतेवर परिणाम करू शकतात. कलम 3(p) मध्ये जे आविष्कार प्रत्यक्षात पारंपरिक ज्ञान आहेत किंवा पारंपरिकरीत्या ज्ञात घटकांच्या ज्ञात गुणधर्मांचे संकलन किंवा पुनरावृत्ती आहेत, ते वगळले जातात. कलम 64(1)(q) स्थानिक किंवा स्वदेशी समुदायामध्ये उपलब्ध ज्ञानावर आधारित anticipation शी संबंधित आधार देखील नमूद करते.",
        "bn": "প্রাপ্ত IP India তথ্য অনুযায়ী, ঐতিহ্যগত জ্ঞানের সঙ্গে সম্পর্কিত বিষয় পেটেন্টযোগ্যতাকে প্রভাবিত করতে পারে। ধারা 3(p) এমন বিষয়কে সম্বোধন করে যা মূলত ঐতিহ্যগত জ্ঞান বা ঐতিহ্যগতভাবে পরিচিত উপাদানের পরিচিত বৈশিষ্ট্যের সংকলন বা পুনরাবৃত্তি।",
        "ta": "பெறப்பட்ட IP India தகவலின்படி, பாரம்பரிய அறிவுடன் தொடர்புடைய பொருட்கள் காப்புரிமைத் தகுதியை பாதிக்கக்கூடும். பிரிவு 3(p) பாரம்பரிய அறிவாக உள்ள கண்டுபிடிப்புகள் அல்லது பாரம்பரியமாக அறியப்பட்ட கூறுகளின் அறியப்பட்ட பண்புகளின் தொகுப்பு அல்லது மறுபதிப்பை குறிப்பிடுகிறது.",
        "te": "పొందిన IP India సమాచార ప్రకారం, సాంప్రదాయ జ్ఞానానికి సంబంధించిన విషయాలు పేటెంట్ అర్హతపై ప్రభావం చూపవచ్చు. సెక్షన్ 3(p) సాంప్రదాయ జ్ఞానంగా ఉన్న ఆవిష్కరణలు లేదా సాంప్రదాయంగా తెలిసిన భాగాల తెలిసిన లక్షణాల సమాహారం లేదా పునరావృతిని సూచిస్తుంది.",
        "kn": "ಪಡೆಯಲಾದ IP India ಮಾಹಿತಿಯ ಪ್ರಕಾರ, ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ವಿಷಯಗಳು ಪೇಟೆಂಟ್ ಅರ್ಹತೆಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಬಹುದು. ವಿಭಾಗ 3(p) ಮೂಲತಃ ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನವಾಗಿರುವ ಆವಿಷ್ಕಾರಗಳು ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ತಿಳಿದಿರುವ ಘಟಕಗಳ ಪರಿಚಿತ ಗುಣಗಳ ಸಂಯೋಜನೆ ಅಥವಾ ಪುನರಾವರ್ತನೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
        "gu": "પ્રાપ્ત IP India માહિતી મુજબ, પરંપરાગત જ્ઞાન સાથે સંબંધિત વિષયો પેટન્ટયોગ્યતા પર અસર કરી શકે છે. કલમ 3(p) એવા આવિષ્કારોને સંબોધે છે જે વાસ્તવમાં પરંપરાગત જ્ઞાન છે અથવા પરંપરાગત રીતે જાણીતા ઘટકોના જાણીતા ગુણધર્મોનું સંકલન અથવા પુનરાવર્તન છે.",
        "ml": "ലഭിച്ച IP India വിവരങ്ങൾ പ്രകാരം, പരമ്പരാഗത അറിവുമായി ബന്ധപ്പെട്ട വിഷയങ്ങൾ പേറ്റന്റ് യോഗ്യതയെ ബാധിക്കാം. വകുപ്പ് 3(p) യഥാർത്ഥത്തിൽ പരമ്പരാഗത അറിവായിരിക്കുന്ന കണ്ടുപിടിത്തങ്ങളെയും പരമ്പരാഗതമായി അറിയപ്പെടുന്ന ഘടകങ്ങളുടെ അറിയപ്പെട്ട ഗുണങ്ങളുടെ സംയോജനത്തെയും പരിഗണിക്കുന്നു.",
        "pa": "ਪ੍ਰਾਪਤ IP India ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ, ਰਵਾਇਤੀ ਗਿਆਨ ਨਾਲ ਸੰਬੰਧਿਤ ਵਿਸ਼ੇ ਪੇਟੈਂਟ ਯੋਗਤਾ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦੇ ਹਨ। ਧਾਰਾ 3(p) ਉਹਨਾਂ ਆਵਿਸ਼ਕਾਰਾਂ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰਦੀ ਹੈ ਜੋ ਅਸਲ ਵਿੱਚ ਰਵਾਇਤੀ ਗਿਆਨ ਹਨ ਜਾਂ ਰਵਾਇਤੀ ਤੌਰ 'ਤੇ ਜਾਣੇ ਜਾਂਦੇ ਘਟਕਾਂ ਦੇ ਜਾਣੇ-ਪਛਾਣੇ ਗੁਣਾਂ ਦਾ ਸੰਕਲਨ ਜਾਂ ਦੁਹਰਾਵਾ ਹਨ।",
        "sa": "प्राप्त-IP-India-सामग्रीनुसारं पारम्परिक-ज्ञानसम्बद्धं विषयं पेटेण्ट्-योग्यतां प्रभावितुं शक्नोति। धारा 3(p) तान् आविष्कारान् सम्बोधयति ये वस्तुतः पारम्परिकज्ञानम् अथवा पारम्परिकतया ज्ञातानां घटकानां ज्ञातगुणानां सङ्कलनं वा पुनरावृत्तिः सन्ति।",
    },
    "treatment": {
        "en": "The retrieved IP India material indicates that certain medicinal, surgical, curative, prophylactic, diagnostic or therapeutic treatment methods are excluded under Section 3(i). The exact treatment of a particular invention depends on its claims and facts.",
        "hi": "प्राप्त IP India सामग्री के अनुसार, कुछ औषधीय, शल्य, उपचारात्मक, रोगनिरोधी, निदानात्मक या चिकित्सीय उपचार की विधियाँ धारा 3(i) के अंतर्गत अपवर्जित हैं। किसी विशेष आविष्कार का मूल्यांकन उसके दावों और तथ्यों पर निर्भर करता है।",
        "mr": "प्राप्त IP India माहितीनुसार, काही औषधी, शस्त्रक्रियात्मक, उपचारात्मक, प्रतिबंधात्मक, निदानात्मक किंवा चिकित्सीय उपचारांच्या पद्धती कलम 3(i) अंतर्गत वगळल्या आहेत. विशिष्ट आविष्काराचे मूल्यमापन त्याच्या दाव्यांवर आणि तथ्यांवर अवलंबून असते.",
        "bn": "প্রাপ্ত IP India তথ্য অনুযায়ী, নির্দিষ্ট কিছু ঔষধি, অস্ত্রোপচার, নিরাময়মূলক, প্রতিরোধমূলক, রোগনির্ণয় বা চিকিৎসামূলক পদ্ধতি ধারা 3(i)-এর অধীনে বাদ পড়ে।",
        "ta": "பெறப்பட்ட IP India தகவலின்படி, சில மருத்துவ, அறுவைச் சிகிச்சை, குணப்படுத்தும், தடுப்பு, நோயறிதல் அல்லது சிகிச்சை முறைகள் பிரிவு 3(i) கீழ் விலக்கப்படுகின்றன.",
        "te": "పొందిన IP India సమాచార ప్రకారం, కొన్ని ఔషధ, శస్త్రచికిత్స, చికిత్సా, నివారణ, నిర్ధారణ లేదా థెరప్యూటిక్ పద్ధతులు సెక్షన్ 3(i) కింద మినహాయించబడతాయి.",
        "kn": "ಪಡೆಯಲಾದ IP India ಮಾಹಿತಿಯ ಪ್ರಕಾರ, ಕೆಲವು ಔಷಧೀಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ, ಚಿಕಿತ್ಸಾತ್ಮಕ, ತಡೆಗಟ್ಟುವ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ಚಿಕಿತ್ಸಾ ವಿಧಾನಗಳು ವಿಭಾಗ 3(i) ಅಡಿಯಲ್ಲಿ ಹೊರತುಪಡಿಸಲ್ಪಡುತ್ತವೆ.",
        "gu": "પ્રાપ્ત IP India માહિતી મુજબ, કેટલીક ઔષધીય, શસ્ત્રક્રિયાત્મક, ઉપચારાત્મક, નિવારક, નિદાનાત્મક અથવા થેરાપ્યુટિક પદ્ધતિઓ કલમ 3(i) હેઠળ બહાર રાખવામાં આવે છે.",
        "ml": "ലഭിച്ച IP India വിവരങ്ങൾ പ്രകാരം, ചില ഔഷധ, ശസ്ത്രക്രിയ, ചികിത്സാ, പ്രതിരോധ, രോഗനിർണയ അല്ലെങ്കിൽ ചികിത്സാ രീതികൾ വകുപ്പ് 3(i) പ്രകാരം ഒഴിവാക്കപ്പെടുന്നു.",
        "pa": "ਪ੍ਰਾਪਤ IP India ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ, ਕੁਝ ਔਸ਼ਧੀ, ਸਰਜੀਕਲ, ਇਲਾਜ, ਰੋਕਥਾਮ, ਨਿਦਾਨ ਜਾਂ ਥੈਰੇਪੀ ਵਾਲੀਆਂ ਵਿਧੀਆਂ ਧਾਰਾ 3(i) ਅਧੀਨ ਬਾਹਰ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।",
        "sa": "प्राप्त-IP-India-सामग्र्यनुसारं केचन औषधीयाः, शल्यक्रियात्मकाः, उपचारात्मकाः, रोगप्रतिबन्धकाः, निदानात्मकाः वा चिकित्सात्मकाः उपचारविधयः धारा 3(i) अन्तर्गतं वर्जिताः सन्ति।",
    },
    "known": {
        "en": "The retrieved IP India material indicates that Section 3(d) addresses certain new forms or new uses of known substances and sets conditions for when such subject matter is not treated as an invention.",
        "hi": "प्राप्त IP India सामग्री के अनुसार, धारा 3(d) ज्ञात पदार्थों के कुछ नए रूपों या नए उपयोगों को संबोधित करती है और यह निर्धारित करती है कि किन परिस्थितियों में ऐसा विषय आविष्कार नहीं माना जाता।",
        "mr": "प्राप्त IP India माहितीनुसार, कलम 3(d) ज्ञात पदार्थांच्या काही नवीन स्वरूपांना किंवा नवीन उपयोगांना संबोधित करते आणि कोणत्या परिस्थितीत असा विषय आविष्कार मानला जात नाही हे ठरवते.",
        "bn": "প্রাপ্ত IP India তথ্য অনুযায়ী, ধারা 3(d) পরিচিত পদার্থের কিছু নতুন রূপ বা নতুন ব্যবহারকে বিবেচনা করে এবং কোন পরিস্থিতিতে তা আবিষ্কার হিসেবে গণ্য হয় না তা নির্ধারণ করে।",
        "ta": "பெறப்பட்ட IP India தகவலின்படி, பிரிவு 3(d) அறியப்பட்ட பொருட்களின் சில புதிய வடிவங்கள் அல்லது புதிய பயன்பாடுகளைப் பற்றி குறிப்பிடுகிறது மற்றும் எந்த சூழலில் அவை கண்டுபிடிப்பாக கருதப்படாது என்பதை கூறுகிறது.",
        "te": "పొందిన IP India సమాచార ప్రకారం, సెక్షన్ 3(d) తెలిసిన పదార్థాల కొన్ని కొత్త రూపాలు లేదా కొత్త ఉపయోగాలను పరిశీలిస్తుంది మరియు అవి ఆవిష్కరణగా పరిగణించబడని పరిస్థితులను నిర్దేశిస్తుంది.",
        "kn": "ಪಡೆಯಲಾದ IP India ಮಾಹಿತಿಯ ಪ್ರಕಾರ, ವಿಭಾಗ 3(d) ತಿಳಿದಿರುವ ಪದಾರ್ಥಗಳ ಕೆಲವು ಹೊಸ ರೂಪಗಳು ಅಥವಾ ಹೊಸ ಬಳಕೆಗಳನ್ನು ಕುರಿತು ಚರ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಯಾವ ಸಂದರ್ಭಗಳಲ್ಲಿ ಅವುಗಳನ್ನು ಆವಿಷ್ಕಾರ ಎಂದು ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ನಿಗದಿಪಡಿಸುತ್ತದೆ.",
        "gu": "પ્રાપ્ત IP India માહિતી મુજબ, કલમ 3(d) જાણીતા પદાર્થોના કેટલાક નવા સ્વરૂપો અથવા નવા ઉપયોગોને આવરી લે છે અને કયા સંજોગોમાં તેને આવિષ્કાર માનવામાં આવતું નથી તે નક્કી કરે છે.",
        "ml": "ലഭിച്ച IP India വിവരങ്ങൾ പ്രകാരം, വകുപ്പ് 3(d) അറിയപ്പെടുന്ന വസ്തുക്കളുടെ ചില പുതിയ രൂപങ്ങളെയോ പുതിയ ഉപയോഗങ്ങളെയോ പരിഗണിക്കുന്നു, കൂടാതെ ഏത് സാഹചര്യത്തിലാണ് അവ കണ്ടുപിടിത്തമായി കണക്കാക്കാത്തതെന്ന് വ്യക്തമാക്കുന്നു.",
        "pa": "ਪ੍ਰਾਪਤ IP India ਜਾਣਕਾਰੀ ਅਨੁਸਾਰ, ਧਾਰਾ 3(d) ਜਾਣੇ-ਪਛਾਣੇ ਪਦਾਰਥਾਂ ਦੇ ਕੁਝ ਨਵੇਂ ਰੂਪਾਂ ਜਾਂ ਨਵੇਂ ਉਪਯੋਗਾਂ ਨੂੰ ਸੰਬੋਧਿਤ ਕਰਦੀ ਹੈ ਅਤੇ ਉਹਨਾਂ ਸਥਿਤੀਆਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ ਜਿੱਥੇ ਉਹਨਾਂ ਨੂੰ ਆਵਿਸ਼ਕਾਰ ਨਹੀਂ ਮੰਨਿਆ ਜਾਂਦਾ।",
        "sa": "प्राप्त-IP-India-सामग्र्यनुसारं धारा 3(d) ज्ञातपदार्थानां केषाञ्चित् नवरूपाणि नवोपयोगांश्च सम्बोधयति, तथा च केषु परिस्थितिषु तत् आविष्कारत्वेन न स्वीक्रियते इति निर्दिशति।",
    },
}
def choose_answer(
    normalized_query: str,
    language: str,
    hits: List[Dict[str, Any]],
    jurisdiction: str = "IN"
) -> str:

    # ============================================================
    # NO EVIDENCE
    # ============================================================

    if not hits:

        no_evidence = {

            "en":
                "I could not find sufficiently relevant evidence "
                "in the current source collection.",

            "hi":
                "वर्तमान स्रोत-संग्रह में पर्याप्त प्रासंगिक प्रमाण नहीं मिला।",

            "mr":
                "सध्याच्या स्रोत-संग्रहात पुरेसा संबंधित पुरावा मिळाला नाही.",

            "bn":
                "বর্তমান উৎসভাণ্ডারে পর্যাপ্ত প্রাসঙ্গিক প্রমাণ পাওয়া যায়নি।",

            "ta":
                "தற்போதைய ஆதாரத் தொகுப்பில் போதுமான தொடர்புடைய ஆதாரம் கிடைக்கவில்லை.",

            "te":
                "ప్రస్తుత మూలాల సమాహారంలో తగిన సంబంధిత ఆధారం కనుగొనబడలేదు.",

            "kn":
                "ಪ್ರಸ್ತುತ ಮೂಲಗಳ ಸಂಗ್ರಹದಲ್ಲಿ ಸಾಕಷ್ಟು ಸಂಬಂಧಿತ ಸಾಕ್ಷ್ಯ ದೊರಕಲಿಲ್ಲ.",

            "gu":
                "હાલના સ્ત્રોત સંગ્રહમાં પૂરતો સંબંધિત પુરાવો મળ્યો નથી.",

            "ml":
                "നിലവിലെ ഉറവിട ശേഖരത്തിൽ മതിയായ പ്രസക്തമായ തെളിവ് ലഭ്യമല്ല.",

            "pa":
                "ਮੌਜੂਦਾ ਸਰੋਤ ਸੰਗ੍ਰਹਿ ਵਿੱਚ ਕਾਫ਼ੀ ਸੰਬੰਧਿਤ ਸਬੂਤ ਨਹੀਂ ਮਿਲਿਆ।",

            "sa":
                "वर्तमान-स्रोत-सङ्ग्रहे पर्याप्तं सम्बद्धं प्रमाणं न प्राप्तम्।"
        }

        return no_evidence.get(
            language,
            no_evidence["en"]
        )

    # ============================================================
    # FIND RELEVANT SECTIONS
    # ============================================================

    sections = []

    for hit in hits:

        section = str(
            hit.get(
                "section",
                ""
            )
        ).strip()

        if (
            section
            and section not in sections
        ):
            sections.append(section)

    sections = sections[:3]

    # ============================================================
    # GET LOCALIZED EVIDENCE EXPLANATIONS
    # ============================================================

    explanations = []

    for section in sections:

        explanation = get_localized_explanation(
            section,
            language
        )

        if explanation:
            explanations.append(
                explanation
            )

    # ============================================================
    # JURISDICTION NAMES
    # ============================================================

    jurisdiction_names = {

        "IN": {
            "en": "Indian patent-law",
            "hi": "भारतीय पेटेंट-कानून",
            "mr": "भारतीय पेटंट-कायदा",
            "bn": "ভারতীয় পেটেন্ট আইন",
            "ta": "இந்திய காப்புரிமைச் சட்டம்",
            "te": "భారతీయ పేటెంట్ చట్టం",
            "kn": "ಭಾರತೀಯ ಪೇಟೆಂಟ್ ಕಾನೂನು",
            "gu": "ભારતીય પેટન્ટ કાયદો",
            "ml": "ഇന്ത്യൻ പേറ്റന്റ് നിയമം",
            "pa": "ਭਾਰਤੀ ਪੇਟੈਂਟ ਕਾਨੂੰਨ",
            "sa": "भारतीय-पेटेण्ट्-कानूनः"
        },

        "UK": {
            "en": "UK patent-law",
            "hi": "यूके पेटेंट-कानून",
            "mr": "यूके पेटंट-कायदा",
            "bn": "যুক্তরাজ্যের পেটেন্ট আইন",
            "ta": "இங்கிலாந்து காப்புரிமைச் சட்டம்",
            "te": "యూకే పేటెంట్ చట్టం",
            "kn": "ಯುಕೆ ಪೇಟೆಂಟ್ ಕಾನೂನು",
            "gu": "યુકે પેટન્ટ કાયદો",
            "ml": "യുകെ പേറ്റന്റ് നിയമം",
            "pa": "ਯੂਕੇ ਪੇਟੈਂਟ ਕਾਨੂੰਨ",
            "sa": "यूके-पेटेण्ट्-कानूनः"
        },

        "US": {
            "en": "US patent-law",
            "hi": "अमेरिकी पेटेंट-कानून",
            "mr": "अमेरिकन पेटंट-कायदा",
            "bn": "মার্কিন পেটেন্ট আইন",
            "ta": "அமெரிக்க காப்புரிமைச் சட்டம்",
            "te": "అమెరికా పేటెంట్ చట్టం",
            "kn": "ಅಮೆರಿಕನ್ ಪೇಟೆಂಟ್ ಕಾನೂನು",
            "gu": "અમેરિકન પેટન્ટ કાયદો",
            "ml": "യുഎസ് പേറ്റന്റ് നിയമം",
            "pa": "ਅਮਰੀਕੀ ਪੇਟੈਂਟ ਕਾਨੂੰਨ",
            "sa": "अमेरिकी-पेटेण्ट्-कानूनः"
        },

        "WIPO": {
            "en": "international patent sources",
            "hi": "अंतरराष्ट्रीय पेटेंट स्रोत",
            "mr": "आंतरराष्ट्रीय पेटंट स्रोत",
            "bn": "আন্তর্জাতিক পেটেন্ট উৎস",
            "ta": "சர்வதேச காப்புரிமை ஆதாரங்கள்",
            "te": "అంతర్జాతీయ పేటెంట్ మూలాలు",
            "kn": "ಅಂತರರಾಷ್ಟ್ರೀಯ ಪೇಟೆಂಟ್ ಮೂಲಗಳು",
            "gu": "આંતરરાષ્ટ્રીય પેટન્ટ સ્ત્રોતો",
            "ml": "അന്താരാഷ്ട്ര പേറ്റന്റ് ഉറവിടങ്ങൾ",
            "pa": "ਅੰਤਰਰਾਸ਼ਟਰੀ ਪੇਟੈਂਟ ਸਰੋਤ",
            "sa": "अन्ताराष्ट्रिय-पेटेण्ट्-स्रोतांसि"
        }
    }

    

    jurisdiction_text = (
        jurisdiction_names
        .get(
            jurisdiction,
            jurisdiction_names["IN"]
        )
        .get(
            language,
            jurisdiction_names["IN"]["en"]
        )
    )

    # ============================================================
    # LEAD-IN
    # ============================================================

    lead = {

        "en":
            f"Based on the retrieved {jurisdiction_text} sources, "
            f"the provisions most relevant to your question indicate:",

        "hi":
            f"प्राप्त {jurisdiction_text} के स्रोतों के आधार पर, "
            f"आपके प्रश्न से संबंधित प्रमुख प्रावधान बताते हैं:",

        "mr":
            f"प्राप्त {jurisdiction_text} स्रोतांच्या आधारे, "
            f"तुमच्या प्रश्नाशी संबंधित प्रमुख तरतुदी पुढीलप्रमाणे आहेत:",

        "bn":
            f"প্রাপ্ত {jurisdiction_text} উৎসের ভিত্তিতে, "
            f"আপনার প্রশ্নের সঙ্গে সম্পর্কিত প্রধান বিধানগুলো হলো:",

        "ta":
            f"பெறப்பட்ட {jurisdiction_text} ஆதாரங்களின் அடிப்படையில், "
            f"உங்கள் கேள்விக்கு தொடர்புடைய முக்கிய விதிகள் பின்வருமாறு:",

        "te":
            f"పొందిన {jurisdiction_text} మూలాల ఆధారంగా, "
            f"మీ ప్రశ్నకు సంబంధించిన ప్రధాన నిబంధనలు ఇవి:",

        "kn":
            f"ಪಡೆಯಲಾದ {jurisdiction_text} ಮೂಲಗಳ ಆಧಾರದ ಮೇಲೆ, "
            f"ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಮುಖ ವಿಧಿಗಳು ಹೀಗಿವೆ:",

        "gu":
            f"પ્રાપ્ત {jurisdiction_text} સ્ત્રોતોના આધારે, "
            f"તમારા પ્રશ્ન સાથે સંબંધિત મુખ્ય જોગવાઈઓ આ મુજબ છે:",

        "ml":
            f"ലഭിച്ച {jurisdiction_text} ഉറവിടങ്ങളുടെ അടിസ്ഥാനത്തിൽ, "
            f"നിങ്ങളുടെ ചോദ്യവുമായി ബന്ധപ്പെട്ട പ്രധാന വ്യവസ്ഥകൾ ഇവയാണ്:",

        "pa":
            f"ਪ੍ਰਾਪਤ {jurisdiction_text} ਸਰੋਤਾਂ ਦੇ ਆਧਾਰ 'ਤੇ, "
            f"ਤੁਹਾਡੇ ਸਵਾਲ ਨਾਲ ਸੰਬੰਧਿਤ ਮੁੱਖ ਧਾਰਾਵਾਂ ਇਹ ਹਨ:",

        "sa":
            f"प्राप्त {jurisdiction_text}-स्रोतानाम् आधारेण, "
            f"भवतः प्रश्नसम्बद्धाः मुख्याः धाराः एताः सन्ति:"
    }

    # ============================================================
    # BUILD ANSWER
    # ============================================================

    if explanations:

        combined = []

        for index, explanation in enumerate(
            explanations
        ):

            section = sections[index]

            combined.append(
                f"{section}: {explanation}"
            )

        answer = (
            lead.get(
                language,
                lead["en"]
            )
            + " "
            + " ".join(combined)
        )

    else:

        hit = hits[0]

        source_text = str(
            hit.get(
                "text",
                ""
            )
        ).strip()

        section = str(
            hit.get(
                "section",
                ""
            )
        ).strip()

        # --------------------------------------------------------
        # SHORT SOURCE-GROUNDED FALLBACK
        # --------------------------------------------------------
        # Uploaded documents can contain many pages of extracted
        # text. Do not dump the entire document into the answer.
        # Instead, select a small number of sentences that overlap
        # with the user's query. This keeps the answer concise
        # without inventing new facts.
        # --------------------------------------------------------

        import re

        query_terms = [
            term
            for term in re.findall(
                r"[A-Za-z0-9][A-Za-z0-9/-]*",
                normalized_query.lower()
            )
            if len(term) > 2
        ]

        raw_sentences = re.split(
            r"(?<=[.!?])\s+|\n{2,}",
            source_text
        )

        sentences = []

        for sentence in raw_sentences:

            cleaned = re.sub(
                r"\s+",
                " ",
                sentence
            ).strip()

            if cleaned:
                sentences.append(
                    cleaned
                )

        scored_sentences = []

        for position, sentence in enumerate(sentences):

            sentence_lower = sentence.lower()

            score = sum(
                1
                for term in query_terms
                if term in sentence_lower
            )

            scored_sentences.append(
                (
                    score,
                    position,
                    sentence
                )
            )

        scored_sentences.sort(
            key=lambda item: (
                -item[0],
                item[1]
            )
        )

        selected_sentences = [
            item[2]
            for item in scored_sentences[:4]
            if item[0] > 0
        ]

        # If no sentence directly overlaps with the query,
        # fall back to the first few source sentences.
        if not selected_sentences:
            selected_sentences = sentences[:3]

        short_source_text = " ".join(
            selected_sentences[:4]
        ).strip()

        # Hard safety limit for the prototype UI.
        if len(short_source_text) > 900:
            short_source_text = (
                short_source_text[:900]
                .rsplit(" ", 1)[0]
                + "..."
            )

        fallback_answers = {

            "en":
                f"The retrieved {jurisdiction_text} source "
                f"contains a relevant provision under {section}. "
                f"The relevant source evidence indicates: "
                f"{short_source_text}",

            "hi":
                f"प्राप्त {jurisdiction_text} स्रोत में {section} "
                f"के अंतर्गत आपके प्रश्न से संबंधित प्रावधान मिला है। "
                f"प्रासंगिक स्रोत-साक्ष्य के अनुसार: "
                f"{short_source_text}",

            "mr":
                f"प्राप्त {jurisdiction_text} स्रोतामध्ये {section} "
                f"अंतर्गत तुमच्या प्रश्नाशी संबंधित तरतूद आढळली. "
                f"संबंधित स्रोत-साक्ष्यानुसार: "
                f"{short_source_text}",

            "bn":
                f"প্রাপ্ত {jurisdiction_text} উৎসে {section}-এর অধীনে "
                f"আপনার প্রশ্নের সঙ্গে সম্পর্কিত একটি বিধান পাওয়া গেছে। "
                f"প্রাসঙ্গিক উৎস-প্রমাণ অনুযায়ী: "
                f"{short_source_text}",

            "ta":
                f"பெறப்பட்ட {jurisdiction_text} ஆதாரத்தில் {section} "
                f"கீழ் உங்கள் கேள்விக்கு தொடர்புடைய விதி உள்ளது. "
                f"தொடர்புடைய ஆதாரத்தின் படி: "
                f"{short_source_text}",

            "te":
                f"పొందిన {jurisdiction_text} మూలంలో {section} "
                f"కింద మీ ప్రశ్నకు సంబంధించిన నిబంధన ఉంది. "
                f"సంబంధిత మూలాధారం ప్రకారం: "
                f"{short_source_text}",

            "kn":
                f"ಪಡೆಯಲಾದ {jurisdiction_text} ಮೂಲದಲ್ಲಿ {section} "
                f"ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದ ವಿಧಿ ಇದೆ. "
                f"ಸಂಬಂಧಿತ ಮೂಲಾಧಾರದ ಪ್ರಕಾರ: "
                f"{short_source_text}",

            "gu":
                f"પ્રાપ્ત {jurisdiction_text} સ્ત્રોતમાં {section} "
                f"હેઠળ તમારા પ્રશ્ન સાથે સંબંધિત જોગવાઈ મળી છે. "
                f"સંબંધિત સ્ત્રોત પુરાવા મુજબ: "
                f"{short_source_text}",

            "ml":
                f"ലഭിച്ച {jurisdiction_text} ഉറവിടത്തിൽ {section} "
                f"പ്രകാരം നിങ്ങളുടെ ചോദ്യവുമായി ബന്ധപ്പെട്ട വ്യവസ്ഥയുണ്ട്. "
                f"ബന്ധപ്പെട്ട ഉറവിട തെളിവ് പ്രകാരം: "
                f"{short_source_text}",

            "pa":
                f"ਪ੍ਰਾਪਤ {jurisdiction_text} ਸਰੋਤ ਵਿੱਚ {section} "
                f"ਅਧੀਨ ਤੁਹਾਡੇ ਸਵਾਲ ਨਾਲ ਸੰਬੰਧਿਤ ਧਾਰਾ ਮਿਲੀ ਹੈ। "
                f"ਸੰਬੰਧਿਤ ਸਰੋਤ ਸਬੂਤ ਅਨੁਸਾਰ: "
                f"{short_source_text}",

            "sa":
                f"प्राप्ते {jurisdiction_text}-स्रोति {section} "
                f"अन्तर्गते भवतः प्रश्नसम्बद्धा धारा प्राप्ता। "
                f"सम्बद्ध-स्रोत-प्रमाणानुसारम्: "
                f"{short_source_text}"
        }

        answer = fallback_answers.get(
            language,
            fallback_answers["en"]
        )

    # ============================================================
    # DISCLAIMER
    # ============================================================

    disclaimers = {

        "en":
            "This is preliminary, source-grounded information and not a legal determination.",

        "hi":
            "यह प्रारंभिक, स्रोत-आधारित जानकारी है और कानूनी निर्धारण नहीं है।",

        "mr":
            "ही प्राथमिक, स्रोत-आधारित माहिती आहे; हा कायदेशीर निर्णय नाही.",

        "bn":
            "এটি প্রাথমিক, উৎস-ভিত্তিক তথ্য এবং কোনো আইনি সিদ্ধান্ত নয়।",

        "ta":
            "இது ஆரம்பகட்ட, ஆதார அடிப்படையிலான தகவல்; சட்டத் தீர்மானம் அல்ல.",

        "te":
            "ఇది ప్రాథమిక, మూలాధార ఆధారిత సమాచారం మాత్రమే; న్యాయ నిర్ణయం కాదు.",

        "kn":
            "ಇದು ಪ್ರಾಥಮಿಕ, ಮೂಲಾಧಾರಿತ ಮಾಹಿತಿ ಮಾತ್ರ; ಕಾನೂನು ನಿರ್ಧಾರವಲ್ಲ.",

        "gu":
            "આ પ્રાથમિક, સ્ત્રોત આધારિત માહિતી છે; કાનૂની નિર્ણય નથી.",

        "ml":
            "ഇത് പ്രാഥമികവും ഉറവിടാധിഷ്ഠിതവുമായ വിവരമാണ്; നിയമപരമായ തീരുമാനം അല്ല.",

        "pa":
            "ਇਹ ਮੁੱਢਲੀ, ਸਰੋਤ-ਆਧਾਰਿਤ ਜਾਣਕਾਰੀ ਹੈ; ਕਾਨੂੰਨੀ ਫੈਸਲਾ ਨਹੀਂ।",

        "sa":
            "इयं प्रारम्भिकी स्रोताधारिता सूचना अस्ति; कानूनी निर्णयः नास्ति।"
    }

    return (
        answer
        + " "
        + disclaimers.get(
            language,
            disclaimers["en"]
        )
    )
def get_localized_explanation(
    section: str,
    language: str
) -> str:

    key = re.sub(
        r"^section\s+",
        "",
        str(section).strip(),
        flags=re.IGNORECASE,
    )

    translations = EVIDENCE_TRANSLATIONS.get(
        key
    )

    if not translations:
        return ""

    return translations.get(
        language,
        translations["en"],
    )

# ============================================================
# PATENT SEARCH
# ============================================================

def extract_concepts(text: str) -> List[str]:

    q = normalize_multilingual(text)

    concept_map = [
        ("Ayurveda", ["ayurveda", "ayurvedic"]),
        ("Formulation", ["formulation", "composition"]),
        ("Herbal", ["herbal", "herb", "botanical", "plant"]),
        ("Extraction", ["extract", "extraction"]),
        ("Turmeric", ["turmeric", "curcuma"]),
        ("Tulsi", ["tulsi", "ocimum"]),
        ("Amla", ["amla", "amlaki", "emblica"]),
        ("Ointment", ["ointment", "topical", "cream"]),
        ("Treatment", ["treatment", "therapeutic", "medicine"]),
        ("Delivery", ["tablet", "capsule", "oral"]),
    ]

    concepts: List[str] = []

    for label, terms in concept_map:

        if any(term in q for term in terms):
            concepts.append(label)

    if not concepts:
        concepts.append("Key Concept")

    return concepts[:3]


def search_patents(
    innovation: str,
    jurisdiction: str = "IN",
    top_k: int = 5,
) -> List[Dict[str, Any]]:

    normalized = normalize_multilingual(
        innovation
    )

    query_vector = PATENT_VECTORIZER.transform(
        [normalized]
    )

    scores = cosine_similarity(
        query_vector,
        PATENT_MATRIX
    ).ravel()

    candidates = []

    for index, score in enumerate(scores):

        patent = PATENTS[index]

        if (
            jurisdiction
            and jurisdiction != "ALL"
            and patent.get("jurisdiction_code") != jurisdiction
        ):
            continue

        score_value = float(score)

        # Keep low-score results out if there is enough evidence.
        candidates.append(
            (
                score_value,
                patent
            )
        )

    candidates.sort(
        key=lambda item: item[0],
        reverse=True
    )

    selected = candidates[: max(1, min(top_k, 10))]

    results: List[Dict[str, Any]] = []

    query_concepts = extract_concepts(
        innovation
    )

    for score_value, patent in selected:

        item = dict(patent)

        # Prototype similarity:
        # TF-IDF cosine similarity converted to percentage.
        item["similarity"] = round(
            score_value * 100,
            1
        )

        item["method"] = (
            "TF-IDF cosine similarity (prototype)"
        )

        item["relevant_concepts"] = [
            c for c in query_concepts
            if c in patent.get("keywords", [])
            or c.lower() in patent.get("text", "").lower()
            or c.lower() in patent.get("title", "").lower()
        ]

        if not item["relevant_concepts"]:
            item["relevant_concepts"] = query_concepts[:2]

        item["relevant_concepts"] = (
            item["relevant_concepts"][:3]
        )

        item["reasons"] = []

        if "Formulation" in item["relevant_concepts"]:
            item["reasons"].append(
                "Related formulation concept"
            )

        if "Herbal" in item["relevant_concepts"]:
            item["reasons"].append(
                "Related herbal terminology"
            )

        if "Ayurveda" in item["relevant_concepts"]:
            item["reasons"].append(
                "Related Ayurveda domain"
            )

        if "Extraction" in item["relevant_concepts"]:
            item["reasons"].append(
                "Related extraction/process terminology"
            )

        if not item["reasons"]:
            item["reasons"].append(
                "Textual/conceptual overlap in the prototype corpus"
            )

        results.append(item)

    return results


# ============================================================
# ROUTES
# ============================================================

@app.get("/")
def root():
    return FileResponse(
        STATIC / "landing.html"
    )

@app.get("/app")
def application():
    return FileResponse(
        STATIC / "index.html"
    )

@app.get("/api/health")
def health():

    return {
        "status": "ok",
        "retriever": "TF-IDF + multilingual query normalization",
        "documents": len(DOCUMENTS),
        "patents": len(PATENTS),
        "supported_languages": len(SUPPORTED_LANGUAGES),
        "languages": SUPPORTED_LANGUAGES,
        "jurisdictions": SUPPORTED_JURISDICTIONS,
        "generator": "local evidence-grounded synthesizer",
        "llm": False,
        "patent_search": "TF-IDF cosine similarity",
    }


@app.get("/api/languages")
def languages():

    return {
        "languages": SUPPORTED_LANGUAGES
    }


@app.get("/api/jurisdictions")
def jurisdictions():

    return {
        "jurisdictions": SUPPORTED_JURISDICTIONS
    }

# ============================================================
# KNOWLEDGE BASE UPLOAD / INDEX
# ============================================================

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    authority: str = Form(...),
    document_type: str = Form(...),
    jurisdiction: str = Form(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    if not file.filename.lower().endswith(
        ".pdf"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    safe_name = Path(
        file.filename
    ).name

    try:

        # ----------------------------------------------------
        # Read uploaded PDF into memory
        # ----------------------------------------------------

        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        # ----------------------------------------------------
        # Upload PDF to Supabase Storage
        # ----------------------------------------------------

        storage_path = (
            f"uploads/{safe_name}"
        )

        supabase.storage \
            .from_("ip-sakti-documents") \
            .upload(
                storage_path,
                file_bytes,
                {
                    "content-type": "application/pdf",
                    "upsert": "true"
                }
            )

        # ----------------------------------------------------
        # Get public PDF URL
        # ----------------------------------------------------

        public_url = (
            supabase.storage
            .from_("ip-sakti-documents")
            .get_public_url(
                storage_path
            )
        )

        # ----------------------------------------------------
        # Extract PDF text
        # ----------------------------------------------------

        import fitz

        pdf_document = fitz.open(
            stream=file_bytes,
            filetype="pdf"
        )

        pages = []

        for page in pdf_document:

            page_text = page.get_text(
                "text"
            ).strip()

            if page_text:
                pages.append(
                    page_text
                )

        pdf_document.close()

        extracted_text = "\n\n".join(
            pages
        ).strip()

        if not extracted_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No extractable text was found "
                    "in the uploaded PDF."
                )
            )

        # ----------------------------------------------------
        # Create searchable document
        # ----------------------------------------------------

        new_document = {

            "title":
                safe_name,

            "source":
                authority.strip(),

            "authority":
                authority.strip(),

            "document_type":
                document_type.strip(),

            "jurisdiction":
                jurisdiction.strip(),

            "section":
                "Uploaded document",

            "text":
                extracted_text,

            "keywords":
                [
                    authority.strip(),
                    document_type.strip(),
                    jurisdiction.strip(),
                ],

            "url":
                public_url,

            "status":
                "Indexed"
        }

        # ----------------------------------------------------
        # Add to in-memory corpus
        # ----------------------------------------------------

        DOCUMENTS.append(
            new_document
        )

        # ----------------------------------------------------
        # Persist corpus
        # ----------------------------------------------------

        with DATA.open(
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                DOCUMENTS,
                f,
                ensure_ascii=False,
                indent=2
            )

        # ----------------------------------------------------
        # Rebuild retrieval index
        # ----------------------------------------------------

        rebuild_retrieval_index()

        return {

            "success":
                True,

            "message":
                "Source successfully indexed.",

            "document":
                new_document,

            "documents":
                len(DOCUMENTS)
        }

    except HTTPException:
        raise

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document processing failed: {exc}"
            )
        )
    
@app.get("/api/documents")
def documents():
    return {
        "documents": DOCUMENTS
    }


@app.get(
    "/api/documents/{filename}/source"
)
def document_source(
    filename: str
):

    safe_name = Path(
        filename
    ).name

    file_path = (
        UPLOADS /
        safe_name
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=safe_name
    )


@app.get("/api/patents")
def patents():

    return {
        "patents": PATENTS
    }


@app.post("/api/chat")
def chat(req: ChatRequest):

    query = req.query.strip()

    language = (
        req.language
        if req.language in SUPPORTED_LANGUAGES
        else "en"
    )

    jurisdiction = (
        req.jurisdiction
        if req.jurisdiction in SUPPORTED_JURISDICTIONS
        else "IN"
    )

    if not query:

        return {
            "answer": "Please enter a question.",
            "detected_language": language,
            "language_name": SUPPORTED_LANGUAGES[language],
            "jurisdiction": jurisdiction,
            "jurisdiction_name": SUPPORTED_JURISDICTIONS[jurisdiction],
            "mode": "RAG-MVP",
            "normalized_query": "",
            "sources": [],
        }

    normalized_query = normalize_multilingual(
        query
    )

    hits = retrieve(
        req.query,
        jurisdiction=jurisdiction,
        k=4,
    )

    answer = choose_answer(
    normalized_query,
    language,
    hits,
    jurisdiction
)
    localized_sources = []

    for hit in hits:

        item = dict(hit)

        item["localized_explanation"] = (
            get_localized_explanation(
                hit.get("section", ""),
                language
            )
        )

        localized_sources.append(item)

    return {
        "answer": answer,
        "detected_language": language,
        "language_name": SUPPORTED_LANGUAGES[language],
        "jurisdiction": jurisdiction,
        "jurisdiction_name": SUPPORTED_JURISDICTIONS[jurisdiction],
        "mode": "RAG-MVP",
        "normalized_query": normalized_query,
        "sources": localized_sources,
    }


@app.post("/api/patents/search")
def patent_search(req: PatentSearchRequest):

    innovation = req.innovation.strip()

    jurisdiction = (
        req.jurisdiction
        if req.jurisdiction in SUPPORTED_JURISDICTIONS
        else "IN"
    )

    if not innovation:

        return {
            "innovation": "",
            "jurisdiction": jurisdiction,
            "jurisdiction_name": SUPPORTED_JURISDICTIONS[jurisdiction],
            "concepts": [],
            "results": [],
        }

    results = search_patents(
        innovation,
        jurisdiction=jurisdiction,
        top_k=req.top_k,
    )

    return {
        "innovation": innovation,
        "jurisdiction": jurisdiction,
        "jurisdiction_name": SUPPORTED_JURISDICTIONS[jurisdiction],
        "concepts": extract_concepts(innovation),
        "results": results,
        "metric": "Semantic Similarity (prototype: TF-IDF cosine similarity)",
        "disclaimer": (
            "Similarity indicates textual/conceptual relevance in this prototype "
            "and does not determine patentability."
        ),
    }