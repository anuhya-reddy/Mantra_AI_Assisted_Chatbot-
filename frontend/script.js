// =============================
// LANGUAGE + STATE MANAGEMENT
// =============================
let currentUserId = null;
let currentLanguage = null;
let currentStep = "language";
let therapies = null;
let currentPatch = null;
let currentCategory = null;

// =============================
// SELF ASSESSMENT STATE
// =============================

let assessmentIndex = 0;
let totalScore = 0;
let safetyFlag = false;
let relapseFlag = false;
let activeAssessment = null;

let userData = {
    role: "",
    name: "",
    specialization: "",
    mobile: "",
    selectedPatch: ""
};

// =============================
// TRANSLATIONS
// =============================

const translations = {
    en: {
        selectLanguage: "Please select your preferred language.",
        welcome: "Hello! 👋 I’m Mantra Bot, your smart companion from PatchMantra—bringing you science-backed, hassle-free patch therapy for relief, wellness and recovery. Let’s start with a few quick details.",
        selectRole: "Please select your role.",
        doctor: "I am Doctor",
        consumer: "I am Consumer",
        askName: "Great! Nice to meet you 👋 What's your name?",
        selectSpecialization: "Please select your specialization:",
        enterMobile: "Please enter your mobile number:",
        enterSpecialization: "Please enter your specialization:",
        greeting: "Hello",
        invalidMobile: "Please enter a valid mobile number.",
        exploreTopics: "Nice! Let's explore the main topics for",
        therapy: "therapy 👋",
        perfectThanks: "Perfect thank you",
        selectPatchBelow: "Please select a patch below:",
        backToTherapies: "← Back to Therapies",
        specializations: [
            "Cardiology",
            "Dermatology",
            "Psychiatry",
            "Pulmonology",
            "General Medicine",
            "Other"
        ],
        patchMenuTitle: "Nice! What would you like to do for",
        startAssessment: "🧪 Start Self Assessment",
        learnPatch: "📘 Learn About This Patch",
        bookConsultation: "👨‍⚕️ Book Consultation",
        backToTherapies: "← Back to Therapies",
        assessmentResult: "Assessment Result",
        scoreLabel: "Score",
        dependenceLevel: "Dependence Level",
        recommendedDose: "Recommended Dose",
        exploreNext: "What would you like to explore next?",
        quitPlan: "📋 View 12-Week Quit Plan",
        risks: "⚕️ Risks & Safety Guidance",
        whyNitof: "💊 Why Nitof Works",
        lifestyle: "🍎 Lifestyle & Diet Support",
        bookConsult: "📅 Book Consultation"
    },

    hi: {
        selectLanguage: "कृपया अपनी पसंदीदा भाषा चुनें।",
        welcome: "नमस्ते! 👋 मैं मंत्रा बॉट हूँ, PatchMantra से आपका स्मार्ट साथी—जो आपको वैज्ञानिक रूप से प्रमाणित, आसान पैच थेरेपी समाधान प्रदान करता है। आइए कुछ महत्वपूर्ण विवरणों से शुरुआत करें।",
        selectRole: "कृपया अपनी भूमिका चुनें।",
        doctor: "मैं डॉक्टर हूँ",
        consumer: "मैं उपभोक्ता हूँ",
        askName: "बहुत अच्छा! आपसे मिलकर खुशी हुई 👋 आपका नाम क्या है?",
        selectSpecialization: "कृपया अपनी विशेषज्ञता चुनें:",
        enterMobile: "कृपया अपना मोबाइल नंबर दर्ज करें:",
        enterSpecialization: "कृपया अपनी विशेषज्ञता दर्ज करें:",
        greeting: "नमस्ते",
        invalidMobile: "कृपया एक मान्य मोबाइल नंबर दर्ज करें।",
        exploreTopics: "शानदार! आइए इसके मुख्य विषयों का पता लगाएं",
        therapy: "थेरेपी 👋",
        perfectThanks: "पूर्ण धन्यवाद",
        selectPatchBelow: "कृपया नीचे एक पैच चुनें:",
        backToTherapies: "← थेरेपी पर वापस जाएं",
        specializations: [
            "कार्डियोलॉजी",
            "त्वचा रोग",
            "मनोचिकित्सा",
            "पल्मोनोलॉजी",
            "जनरल मेडिसिन",
            "अन्य"
        ],
        patchMenuTitle: "अच्छा! आप",
        startAssessment: "🧪 स्व-मूल्यांकन शुरू करें",
        learnPatch: "📘 इस पैच के बारे में जानें",
        bookConsultation: "👨‍⚕️ परामर्श बुक करें",
        backToTherapies: "← थेरेपी पर वापस जाएं",
        doctorCategories: {
            "Consumer Selection": "रोगी चयन",
            "Dosing and Duration": "खुराक और क्रमिक वृद्धि",
            "Monitoring and Follow-up": "निगरानी और अनुसरण",
            "Evidence and Guidelines": "साक्ष्य और दिशानिर्देश",
            
},
        patientCategories: {
            "Product Information & Clinical Background": "उत्पाद जानकारी और नैदानिक पृष्ठभूमि",
            "Usage & Application": "उपयोग और प्रशासन",
            "Advantages & Benefits": "फायदे और लाभ",
            "Safety & Considerations": "सुरक्षा और दुष्प्रभाव",
           
        },
        assessmentResult: "मूल्यांकन परिणाम",
        scoreLabel: "स्कोर",
        dependenceLevel: "निकोटिन निर्भरता स्तर",
        recommendedDose: "अनुशंसित खुराक",
        exploreNext: "आप आगे क्या जानना चाहेंगे?",
        quitPlan: "📋 12-सप्ताह की छोड़ने की योजना देखें",
        risks: "⚕️ जोखिम और सुरक्षा मार्गदर्शन",
        whyNitof: "💊 Nitof क्यों प्रभावी है?",
        lifestyle: "🍎 जीवनशैली और आहार समर्थन",
        bookConsult: "📅 परामर्श बुक करें"
    },

    te: {
        selectLanguage: "దయచేసి మీ భాషను ఎంచుకోండి.",
        welcome: "హలో! 👋 నేను మంత్రా బాట్, PatchMantra నుండి మీ స్మార్ట్ సహచరుడు—శాస్త్రీయంగా మద్దతు పొందిన, సులభమైన ప్యాచ్ థెరపీ పరిష్కారాలను మీకు అందిస్తున్నాను. కొన్ని ముఖ్యమైన వివరాలతో ప్రారంభిద్దాం.",
        selectRole: "దయచేసి మీ పాత్రను ఎంచుకోండి.",
        doctor: "నేను డాక్టర్‌ని",
        consumer: "నేను వినియోగదారిని",
        askName: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది 👋 మీ పేరు ఏమిటి?",
        selectSpecialization: "దయచేసి మీ విశేషత ఎంచుకోండి:",
        enterMobile: "దయచేసి మీ మొబైల్ నంబర్ నమోదు చేయండి:",
        enterSpecialization: "దయచేసి మీ విశేషత నమోదు చేయండి:",
        greeting: "హలో",
        invalidMobile: "దయచేసి సరైన మొబైల్ నంబర్ నమోదు చేయండి.",
        exploreTopics: "చక్కగా! చెప్పుకోండి ఈ విషయాల విషయం",
        therapy: "థెరపీ 👋",
        perfectThanks: "సంపూర్ణ ధన్యవాదాలు",
        selectPatchBelow: "దయచేసి క్రింద ఒక ప్యాచ్ ఎంచుకోండి:",
        backToTherapies: "← థెరపీలకు తిరిగి వెళ్లండి:",
        specializations: [
            "కార్డియాలజీ",
            "డెర్మటాలజీ",
            "సైకియాట్రీ",
            "పల్మనాలజీ",
            "జనరల్ మెడిసిన్",
            "ఇతర"
        ],
        patchMenuTitle: "బాగుంది! మీరు",
        startAssessment: "🧪 స్వీయ మూల్యాంకనం ప్రారంభించండి",
        learnPatch: "📘 ఈ ప్యాచ్ గురించి తెలుసుకోండి",
        bookConsultation: "👨‍⚕️ కన్సల్టేషన్ బుక్ చేయండి",
        backToTherapies: "← థెరపీలకు తిరిగి వెళ్లండి",
        doctorCategories: {
            "Consumer Selection": "వినియోగదారుల ఎంపిక",
            "Dosing and Duration": "మోతాదు మరియు క్రమంగా పెంపు",
            "Monitoring and Follow-up": "పర్యవేక్షణ మరియు అనుసరణ",
            "Evidence and Guidelines": "సాక్ష్యాలు మరియు దిశానిర్దేశాలు",

},
        patientCategories: {
            "Product Information & Clinical Background": "ఉత్పత్తి సమాచారం మరియు నైదానిక పృష్ఠభూమి",
            "Usage & Application": "వినియోగం మరియు అనువర్తనం",
            "Advantages & Benefits": "లాభాలు మరియు ఫలితాలు",
            "Safety & Considerations": "భద్రత మరియు పరీక్షలు",
    
        },
        assessmentResult: "మూల్యాంకన ఫలితం",
        scoreLabel: "స్కోర్",
        dependenceLevel: "నికోటిన్ ఆధారపడే స్థాయి",
        recommendedDose: "సిఫార్సు చేసిన మోతాదు",
        exploreNext: "మీరు తర్వాత ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        quitPlan: "📋 12 వారాల విడిచే ప్రణాళిక చూడండి",
        risks: "⚕️ ప్రమాదాలు మరియు భద్రత మార్గదర్శకాలు",
        whyNitof: "💊 Nitof ఎందుకు ప్రభావవంతంగా ఉంటుంది?",
        lifestyle: "🍎 జీవనశైలి మరియు ఆహార సూచనలు",
        bookConsult: "📅 కన్సల్టేషన్ బుక్ చేయండి"
    }
};

// =============================
// HEADER FACT + TIP TICKER DATA
// =============================

const didYouKnowFacts = [

"Did you know? Nicotine patches can double quit success rates compared to quitting without support.",

"Did you know? Within 48 hours of quitting smoking, taste and smell begin improving.",

"Did you know? Nicotine replacement therapy helps reduce withdrawal symptoms.",

"Did you know? Lung function begins improving within weeks of quitting smoking.",

"Did you know? Nitof patches deliver steady nicotine to reduce cravings."

];

const quitTips = [

"Tip: Drink water when cravings hit to reduce withdrawal symptoms.",

"Tip: Take a short walk to distract yourself from cravings.",

"Tip: Avoid smoking triggers like alcohol or stress.",

"Tip: Use nicotine patches consistently for best results.",

"Tip: Deep breathing can help manage sudden cravings."

];

// =============================
// NITOF SELF-ASSESSMENT MODEL
// =============================

const assessmentModels = {
    "Nitof": [
        {
            id: "cigarettes_per_day",
            type: "score",
            question: "How many cigarettes do you smoke per day?",
            options: [
                { text: "1–5", score: 0 },
                { text: "6–10", score: 1 },
                { text: "11–20", score: 2 },
                { text: "21–30", score: 3 },
                { text: ">30", score: 4 }
            ]
        },
        {
            id: "time_to_first",
            type: "score",
            question: "How soon after waking do you smoke your first cigarette?",
            options: [
                { text: "After 60 minutes", score: 0 },
                { text: "31–60 minutes", score: 1 },
                { text: "6–30 minutes", score: 2 },
                { text: "Within 5 minutes", score: 3 }
            ]
        },
        {
            id: "no_smoking_difficulty",
            type: "score",
            question: "Do you find it difficult to avoid smoking in no-smoking areas?",
            options: [
                { text: "No", score: 0 },
                { text: "Yes", score: 1 }
            ]
        },
        {
            id: "safety_screen",
            type: "safety",
            question: "Do you have any of the following conditions?",
            options: [
                { text: "Recent heart attack (<2 weeks)" },
                { text: "Serious heart rhythm problems" },
                { text: "Pregnant or breastfeeding" },
                { text: "Using other nicotine products" },
                { text: "Severe skin allergies to patches" },
                { text: "None of the above" }
            ]
        },
        {
            id: "relapse_risk",
            type: "relapse",
            question: "Have you previously failed quitting due to strong cravings?",
            options: [
                { text: "No", score: 0 },
                { text: "Yes", score: 1 }
            ]
        }
    ]
};

// =============================
// CATEGORY TRANSLATOR
// =============================

function getTranslatedCategoryName(categoryName, role) {
    const categoryType = role === "doctor" ? "doctorCategories" : "patientCategories";
    const categoryTranslations = translations[currentLanguage][categoryType];
    return categoryTranslations ? categoryTranslations[categoryName] || categoryName : categoryName;
}


// =============================
// DOM ELEMENTS
// =============================

const chatToggle = document.getElementById("chatToggle");
const chatModal = document.getElementById("chatModal");
const closeChat = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const languageSelect = document.getElementById("languageSelect");
const voiceBtn = document.getElementById("voiceBtn");

// =============================
// START HEADER FACT TICKER
// =============================

let tickerStarted = false;

function startFactTicker(){

if(tickerStarted) return;
tickerStarted = true;

const ticker = document.getElementById("factTicker");

if(!ticker) return;

function updateFact(){

let sourceArray;

if(Math.random() > 0.5){
    sourceArray = didYouKnowFacts;
}else{
    sourceArray = quitTips;
}

const randomFact = sourceArray[Math.floor(Math.random()*sourceArray.length)];

ticker.style.opacity = 0;

setTimeout(()=>{
    ticker.textContent = "💡 " + randomFact;
    ticker.style.opacity = 1;
},300);

}

// first change after 4 seconds
setTimeout(updateFact,4000);

// rotate every 10 seconds
setInterval(updateFact,10000);

}

// =============================
// MESSAGE FUNCTION
// =============================

function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(sender === "bot" ? "bot-message" : "user-message");
    if (text.trim().startsWith("<")) {
    messageDiv.innerHTML = text;
} else {
    messageDiv.innerHTML = marked.parse(text);
}
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message");
    typingDiv.classList.add("bot-message");
    typingDiv.classList.add("typing-indicator");
    typingDiv.id = "typingIndicator";

    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) {
        indicator.remove();
    }
}

// =============================
// LANGUAGE BUTTONS
// =============================

function showLanguageButtons() {

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    ["en", "hi", "te"].forEach(code => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = code === "en" ? "English" : code === "hi" ? "Hindi" : "Telugu";

        btn.addEventListener("click", function () {

            currentLanguage = code;
            currentStep = "role";
            languageSelect.value = code;

            addMessage(btn.textContent, "user");
            container.remove();

            addMessage(translations[currentLanguage].welcome, "bot");
            addMessage(translations[currentLanguage].selectRole, "bot");

            showRoleButtons();
        });

        container.appendChild(btn);
    });

    chatBody.appendChild(container);
}

// =============================
// ROLE BUTTONS
// =============================

function showRoleButtons() {

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    ["doctor", "consumer"].forEach(role => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = translations[currentLanguage][role];

        btn.addEventListener("click", function () {

            userData.role = role;
            addMessage(btn.textContent, "user");
            container.remove();

            currentStep = "name";
            addMessage(translations[currentLanguage].askName, "bot");
        });

        container.appendChild(btn);
    });

    chatBody.appendChild(container);
}

// =============================
// PATCH BUTTONS
// =============================

function showPatchButtons() {

    if (!therapies || !therapies[userData.role] || !therapies[userData.role][currentLanguage]) {
        addMessage("Error loading therapies. Please refresh the page.", "bot");
        return;
    }

    const container = document.createElement("div");
    container.classList.add("patch-card-container");

    Object.keys(therapies[userData.role][currentLanguage]).forEach(patchName => {

        const card = document.createElement("div");
        card.classList.add("patch-card");

        // IMAGE PATH
        const imagePath = `/frontend/images/${patchName}.png`;

        card.innerHTML = `
            <img src="${imagePath}" class="patch-image" alt="${patchName}">
            <div class="patch-info">
                <h3>${patchName}</h3>
                <p>${getPatchDescription(patchName)}</p>
            </div>
        `;

        card.addEventListener("click", function () {

            userData.selectedPatch = patchName;
            fetch("/api/update-patch", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user_id: currentUserId,
        selected_patch: patchName
    })
});
            addMessage(patchName, "user");
            container.remove();

            showPatchMenu(patchName);
        });

        container.appendChild(card);
    });

    chatBody.appendChild(container);
}

function getPatchDescription(name) {
    const descriptions = {
        "Nitof": "Nicotine patch - helps manage smoking cessation",
        "Hetriva": "Rivastigmine patch - helps manage dementia & cognitive support",
        "K-Plast": "Ketoprofen patch - provides localized pain relief",
        "Trans-D": "Diclofenac patch - anti-inflammatory pain management"
    };

    return descriptions[name] || "";
}

// =============================
// PATCH HOME MENU
// =============================

function showPatchMenu(patchName) {

    // Reset category context
    currentPatch = patchName;
    currentCategory = null;

    addMessage(
    translations[currentLanguage].patchMenuTitle +
    " " + patchName + " " +
    translations[currentLanguage].therapy,
    "bot"
);

    startFactTicker();

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    // 🧪 SELF ASSESSMENT BUTTON
    const assessBtn = document.createElement("button");
    assessBtn.classList.add("language-btn", "assessment-main-btn");
    assessBtn.textContent = translations[currentLanguage].startAssessment;

    assessBtn.addEventListener("click", function () {
        container.remove();
        startSelfAssessment(patchName);
    });

    // 📘 LEARN BUTTON
    const learnBtn = document.createElement("button");
    learnBtn.classList.add("language-btn");
    learnBtn.textContent = translations[currentLanguage].learnPatch;

    learnBtn.addEventListener("click", function () {
        container.remove();
        showCategories(patchName);
    });

    // 👨‍⚕️ CONSULTATION BUTTON
    const consultBtn = document.createElement("button");
    consultBtn.classList.add("language-btn");
    consultBtn.textContent = translations[currentLanguage].bookConsultation;

    consultBtn.addEventListener("click", function () {
        container.remove();
        showConsultationForm();
    });

    // ⬅ BACK TO THERAPIES
    const backBtn = document.createElement("button");
    backBtn.classList.add("language-btn");
    backBtn.textContent = translations[currentLanguage].backToTherapies;

    backBtn.addEventListener("click", function () {
        container.remove();
        showPatchButtons();
    });

    container.appendChild(assessBtn);
    container.appendChild(learnBtn);
    container.appendChild(consultBtn);
    container.appendChild(backBtn);

    chatBody.appendChild(container);
}

// =============================
// START SELF ASSESSMENT
// =============================

function startSelfAssessment(patchName) {

    activeAssessment = assessmentModels[patchName];

    if (!activeAssessment) {
        addMessage("Assessment not available.", "bot");
        showPatchMenu(patchName);
        return;
    }

    assessmentIndex = 0;
    totalScore = 0;
    safetyFlag = false;
    relapseFlag = false;

    addMessage("This self-assessment is for informational purposes only.", "bot");

    showAssessmentQuestion();
}

function showConsultationForm() {
    addMessage(
        "Consultation booking feature coming soon. Our team will contact you shortly.",
        "bot"
    );

    // Return to patch menu after message
    setTimeout(() => {
        showPatchMenu(currentPatch);
    }, 1500);
}

// =============================
// CATEGORY BUTTONS
// =============================

function showCategories(patchName) {

    addMessage(
        translations[currentLanguage].exploreTopics + " " +
        patchName + " " +
        translations[currentLanguage].therapy,
        "bot"
    );

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    const patchData = therapies[userData.role][currentLanguage][patchName];

    Object.keys(patchData).forEach(categoryName => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = getTranslatedCategoryName(categoryName, userData.role);

        btn.addEventListener("click", function () {

            container.remove();
            showQuestions(patchName, categoryName);
        });

        container.appendChild(btn);
    });
    // =============================
// BACK TO PATCH MENU BUTTON
// =============================

const backBtn = document.createElement("button");
backBtn.classList.add("language-btn");

backBtn.textContent = "← Back to Patch Menu";

backBtn.addEventListener("click", function () {

    container.remove();

    const oldQA = document.querySelectorAll(".qa-container");
    oldQA.forEach(c => c.remove());

    showPatchMenu(currentPatch);
});

    container.appendChild(backBtn);

    chatBody.appendChild(container);
}

// =============================
// SHOW ASSESSMENT QUESTION
// =============================

function showAssessmentQuestion() {

    const questionObj = activeAssessment[assessmentIndex];

    addMessage(questionObj.question, "bot");

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    questionObj.options.forEach(option => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = option.text;

        btn.addEventListener("click", function () {

            if (questionObj.type === "score") {
                totalScore += option.score;
            }

            if (questionObj.type === "safety") {
                if (option.text !== "None of the above") {
                    safetyFlag = true;
                }
            }

            if (questionObj.type === "relapse") {
                if (option.score === 1) {
                    relapseFlag = true;
                }
            }

            addMessage(option.text, "user");
            container.remove();

            assessmentIndex++;

            if (assessmentIndex < activeAssessment.length) {
                showAssessmentQuestion();
            } else {
                finalizeAssessment();
            }

        });

        container.appendChild(btn);
    });

    chatBody.appendChild(container);
}

function finalizeAssessment() {

    let startingDose = "";

    if (totalScore <= 2) {
        startingDose = "7mg";
    } else if (totalScore <= 5) {
        startingDose = "14mg";
    } else {
        startingDose = "21mg";
    }

    showTypingIndicator();

    fetch("/api/ai-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            assessment: true,
            score: totalScore,
            dose: startingDose,
            safetyFlag: safetyFlag,
            relapseFlag: relapseFlag,
            base_answer: "",
            language: currentLanguage
        })
    })
    .then(response => response.json())
    .then(data => {

        removeTypingIndicator();

        if (data.answer) {

    addMessage("🎉 Great job completing your nicotine assessment!", "bot");

    renderAssessmentCard(totalScore, startingDose);

    showNitofAdvantages();

    showAssessmentActionHub();

} else {
    addMessage("Error generating assessment result.", "bot");
}

    })
    .catch(error => {
        removeTypingIndicator();
        addMessage("Assessment error occurred.", "bot");
    });

}

function renderAssessmentCard(score, dose) {

        let level = "";
        let color = "#4CAF50";
        let insight = "";
        let successRate = "";


    if (score <= 2){
        level = "Low";
        color = "#4CAF50";
        insight = "Your nicotine dependence appears low. You have a strong chance of quitting successfully with proper guidance.";
        successRate = "Estimated quit success with patch therapy: ~80%";
    }
    else if (score <= 6) {
        level = "Moderate";
        color = "#FFC107";
        insight = "Your nicotine dependence is moderate. With proper support and adherence to the patch therapy, you can significantly improve your chances of quitting.";
        successRate = "Estimated quit success with patch therapy: ~60%";
    }
    else {
        level = "High";
        color = "#F44336";
        insight = "Your nicotine dependence is high. It's important to seek comprehensive support and consider combination therapy for better outcomes.";
        successRate = "Estimated quit success with patch therapy: ~40%";
    }

    const percentage = (score / 10) * 100;

    const cardHTML = `
        <div class="assessment-card">

            <h3>🧪 ${translations[currentLanguage].assessmentResult}</h3>

            <p><strong>${translations[currentLanguage].scoreLabel}:</strong> ${score} / 10</p>

            <div class="score-bar">
                <div class="score-fill" style="width:${percentage}%; background:${color};"></div>
            </div>

            <p><strong>${translations[currentLanguage].dependenceLevel}:</strong> ${level}</p>

            <p><strong>${translations[currentLanguage].recommendedDose}:</strong> Nitof ${dose}</p>
            <p style="color:#5a3819;font-weight:500;">
            Nitof delivers controlled nicotine release to help reduce cravings and withdrawal symptoms.
            </p>

            <p class="assessment-insight">${insight}</p>

            <p class="quit-success">${successRate}</p>

        </div>
    `;

    addMessage(cardHTML, "bot");
}
function showNitofAdvantages(){

const html = `
<div class="nitof-adv-card">

<h4>💊 Why Nitof Works</h4>

<ul>
<li>✔ One patch lasts up to 72 hours</li>
<li>✔ Steady nicotine delivery reduces cravings</li>
<li>✔ Discreet and easy to use</li>
<li>✔ Clinically proven smoking cessation support</li>
</ul>

</div>
`;

addMessage(html,"bot");

}

function showAssessmentActionHub() {

    addMessage(translations[currentLanguage].exploreNext + " 👇", "bot");

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    const options = [
        { label: translations[currentLanguage].quitPlan, type: "plan" },
        { label: translations[currentLanguage].risks, type: "risks" },
        { label: translations[currentLanguage].whyNitof, type: "marketing" },
        { label: translations[currentLanguage].lifestyle, type: "lifestyle" },
        { label: translations[currentLanguage].bookConsult, type: "consult" }
    ];

    options.forEach(option => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = option.label;

        btn.addEventListener("click", function () {
            container.remove();
            handleAssessmentOption(option.type);
        });

        container.appendChild(btn);
    });

    const backBtn = document.createElement("button");
backBtn.classList.add("language-btn");
backBtn.textContent = "← Back to Patch Menu";

backBtn.addEventListener("click", function () {
    container.remove();
    showPatchMenu(currentPatch);
});

container.appendChild(backBtn);

    chatBody.appendChild(container);
}

function handleAssessmentOption(type) {

    showTypingIndicator();

    let questionPrompt = "";

    if (type === "plan") {
        questionPrompt = "Provide a detailed 12-week structured quit plan using Nitof.";
    }
    else if (type === "risks") {
        questionPrompt = "Explain safety considerations and risks while using Nitof nicotine patch.";
    }
    else if (type === "marketing") {
        questionPrompt = "Explain why Nitof 72-hour patch is effective compared to other nicotine patches.";
    }
    else if (type === "lifestyle") {
        questionPrompt = "Provide lifestyle and dietary suggestions to improve smoking cessation success.";
    }
    else if (type === "consult") {
        removeTypingIndicator();
        showConsultationForm();
        return;
    }

    fetch("/api/ai-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question: questionPrompt,
            base_answer: "",
            language: currentLanguage
        })
    })
    .then(response => response.json())
    .then(data => {

        removeTypingIndicator();

        if (data.answer) {
            addMessage(data.answer, "bot");
        } else {
            addMessage("Unable to load details.", "bot");
        }

        showAssessmentActionHub();
    })
    .catch(() => {
        removeTypingIndicator();
        addMessage("Error occurred.", "bot");
    });
}

   


// =============================
// QUESTION BUTTONS
// =============================

function showQuestions(patchName, categoryName) {
    currentPatch = patchName;
    currentCategory = categoryName;

    // CLEAR any previous question containers
    const oldContainers = document.querySelectorAll(".qa-container");
    oldContainers.forEach(c => c.remove());

    const container = document.createElement("div");
    container.classList.add("language-buttons");
    container.classList.add("qa-container");

    const qaList = therapies[userData.role][currentLanguage][patchName][categoryName];

    qaList.forEach(qa => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = qa.question;

        btn.addEventListener("click", function () {

            container.remove();
            addMessage(qa.question, "user");

            showTypingIndicator();

            //  AI CALL
            fetch("/api/ai-answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: qa.question,
                    base_answer: qa.answer,
                    language: currentLanguage
                })
            })
            .then(response => response.json())
            .then(data => {
                removeTypingIndicator();

                if (data.answer) {
                    addMessage(data.answer, "bot");
                } else {
                    addMessage("Error generating answer.", "bot");
                }

                showRemainingQuestions(patchName, categoryName, qa.question);
            })
            .catch(error => {
                removeTypingIndicator();
                console.error("AI error:", error);
                addMessage("AI error occurred.", "bot");
            });

        });

        container.appendChild(btn);
    });

    // BACK BUTTON
    const backBtn = document.createElement("button");
    backBtn.classList.add("language-btn");
    backBtn.textContent = translations[currentLanguage].backToTherapies;

    backBtn.addEventListener("click", function () {
        container.remove();
        showCategories(patchName);
    });

    container.appendChild(backBtn);

    chatBody.appendChild(container);
}

function showRemainingQuestions(patchName, categoryName, selectedQuestion) {

    const container = document.createElement("div");
    container.classList.add("language-buttons");
    container.classList.add("qa-container");

    const qaList = therapies[userData.role][currentLanguage][patchName][categoryName];

    qaList.forEach(qa => {

        if (qa.question !== selectedQuestion) {

            const btn = document.createElement("button");
            btn.classList.add("language-btn");
            btn.textContent = qa.question;

            btn.addEventListener("click", function () {

                container.remove();
                addMessage(qa.question, "user");

                //  AI CALL
                fetch("/api/ai-answer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: qa.question,
                        base_answer: qa.answer,
                        language: currentLanguage
                    })
                })
                .then(response => response.json())
                .then(data => {

                    if (data.answer) {
                        addMessage(data.answer, "bot");
                    } else {
                        addMessage("Error generating answer.", "bot");
                    }

                    showRemainingQuestions(patchName, categoryName, qa.question);
                })
                .catch(error => {
                    console.error("AI error:", error);
                    addMessage("AI error occurred.", "bot");
                });

            });

            container.appendChild(btn);
        }
    });

    // BACK BUTTON AGAIN
    const backBtn = document.createElement("button");
    backBtn.classList.add("language-btn");
    backBtn.textContent = translations[currentLanguage].backToTherapies;

    backBtn.addEventListener("click", function () {
        container.remove();
        showCategories(patchName);
    });

    container.appendChild(backBtn);

    chatBody.appendChild(container);
}

// =============================
// SEND HANDLER
// =============================

function handleSendMessage() {

    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, "user");

    // STEP: NAME
    if (currentStep === "name") {

    userData.name = text;

    if (userData.role === "doctor") {
        currentStep = "specialization";
        addMessage(translations[currentLanguage].selectSpecialization, "bot");
        showSpecializationButtons();
    } else {
        currentStep = "mobile";
        addMessage(
            translations[currentLanguage].greeting + " " + text +
            " 😊 " + translations[currentLanguage].enterMobile,
            "bot"
        );
    }
}

    // STEP: MOBILE
    else if (currentStep === "mobile") {

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(text)) {
            addMessage(translations[currentLanguage].invalidMobile, "bot");
            userInput.value = "";
            return;
        }

        userData.mobile = text;

        // Save user data to backend
        // Save user data to backend
fetch("/api/save-user", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
})
.then(response => response.json())
.then(data => {
    console.log("User data saved:", data);
    currentUserId = data.user_id;   
})
.catch(error => {
    console.error("Error saving user data:", error);
});
        addMessage(
            translations[currentLanguage].perfectThanks + ", " + userData.name + "!",
            "bot"
        );

        addMessage(translations[currentLanguage].selectPatchBelow, "bot");

        currentStep = "patchSelection";
        showPatchButtons();
    }

    // =============================
    // GENERAL AI MODE
    // =============================
    else {

        showTypingIndicator();

        // Force browser to render typing bubbles first
        setTimeout(() => {

            fetch("/api/ai-answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: text,
                    base_answer: "",
                    language: currentLanguage
                })
            })
            .then(response => response.json())
            .then(data => {

                removeTypingIndicator();

                if (data.answer) {
                    addMessage(data.answer, "bot");
                } else {
                    addMessage("Error generating answer.", "bot");
                }

                // Clear old question containers
                const oldContainers = document.querySelectorAll(".qa-container");
                oldContainers.forEach(c => c.remove());

                // Show remaining questions if inside category
                if (currentPatch && currentCategory) {
                    showRemainingQuestions(currentPatch, currentCategory, null);
                }

            })
            .catch(error => {

                removeTypingIndicator();
                console.error("AI error:", error);
                addMessage("AI error occurred.", "bot");

            });

        }, 200); // 200ms ensures repaint
    }

    userInput.value = "";
}

function showSpecializationButtons() {

    const container = document.createElement("div");
    container.classList.add("language-buttons");

    translations[currentLanguage].specializations.forEach(spec => {

        const btn = document.createElement("button");
        btn.classList.add("language-btn");
        btn.textContent = spec;

        btn.addEventListener("click", function () {

            userData.specialization = spec;
            addMessage(spec, "user");
            container.remove();

            currentStep = "mobile";
            addMessage(
                translations[currentLanguage].enterMobile,
                "bot"
            );
        });

        container.appendChild(btn);
    });

    chatBody.appendChild(container);
}

// =============================
// EVENTS
// =============================

chatToggle.addEventListener("click", function () {
    chatModal.classList.remove("hidden");

    if (chatBody.children.length === 0) {
        addMessage(translations.en.selectLanguage, "bot");
        showLanguageButtons();
    }
});

closeChat.addEventListener("click", function () {
    chatModal.classList.add("hidden");
});

sendBtn.addEventListener("click", handleSendMessage);

userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

languageSelect.addEventListener("change", function () {
    currentLanguage = this.value;
});

// =============================
// LOAD THERAPIES FROM BACKEND
// =============================

document.addEventListener('DOMContentLoaded', function() {

    fetch('/api/therapies')
        .then(response => response.json())
        .then(data => {
            therapies = data;
        })
        .catch(error => {
            console.error("Error loading therapies:", error);
        });

});
// =============================
//  SPEECH RECOGNITION
// =============================

if ('webkitSpeechRecognition' in window) {

    const recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
    };

    voiceBtn.addEventListener("click", function () {

        // Match speech language to selected UI language
        if (currentLanguage === "hi") {
            recognition.lang = "hi-IN";
        } 
        else if (currentLanguage === "te") {
            recognition.lang = "te-IN";
        } 
        else {
            recognition.lang = "en-US";
        }

        recognition.start();
    });

} else {

    console.log("Speech recognition not supported in this browser.");

}