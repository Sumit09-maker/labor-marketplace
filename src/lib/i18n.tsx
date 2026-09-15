"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "hi";

/* ------------------------------------------------------------------ */
/*  Dictionary — professional English & standard Hindi (kept separate) */
/* ------------------------------------------------------------------ */

const en = {
  nav: {
    home: "Home", findWorkers: "Find Workers", findWork: "Find Work",
    community: "Community", login: "Login", register: "Register Free",
    dashboard: "Dashboard", adminPanel: "Admin Panel", tagline: "Virtual Labour Chowk",
  },
  footer: {
    about:
      "India's virtual labour chowk — where skilled workers and employers connect directly. No middlemen, no commission, only honest work.",
    promise: "Dignity for every worker, work for every day.",
    quickLinks: "Quick Links", popularSkills: "Popular Skills", contact: "Contact",
    links: {
      home: "Home", register: "Worker Registration", findWorkers: "Find Workers",
      community: "Community", workerLogin: "Worker Login", adminLogin: "Admin Login",
    },
    address: "Labour Chowk HQ, Connaught Place, New Delhi — 110001",
    helpline: "Helpline: 1800-LABOUR-1 (toll free)",
    helplineNote: "Worker helpline is open — 7 AM to 9 PM, all seven days.",
    rights: "Labour Chowk. Built with pride for India's workforce.",
    words: "Find Work · Find Workers · Fair Wages",
  },
  hero: {
    badge: "Virtual Labour Chowk",
    titleA: "Find Work.", titleB: "Find Workers.",
    subtitle:
      "Turning daily struggles into daily opportunities. Skilled workers and employers connect directly — no middlemen, no commission.",
    ctaWorker: "I Need Work — Register Free", ctaEmployer: "I Need a Worker",
    stats: { members: "Active Members", jobs: "Jobs Completed", cities: "Cities Covered", rating: "Average Rating" },
  },
  paths: {
    kicker: "Get Started", title: "What Are You Looking For?",
    workerTitle: "I Need Work",
    workerDesc:
      "Are you a skilled worker? Join the virtual labour chowk. Get daily work, fair wages and grow your reputation!",
    workerCta: "Register as Worker",
    employerTitle: "I Need a Worker",
    employerDesc:
      "Need a worker? Instantly find skilled labour near your location. Browse by skill, check ratings and connect directly!",
    employerCta: "Find Workers Nearby",
  },
  steps: {
    kicker: "Simple Process", title: "How Does It Work?",
    subtitle: "For workers and employers — just 3 easy steps each.",
    forWorkers: "For Workers", forEmployers: "For Employers",
    w1t: "1. Register", w1d: "Create your digital profile — name, skill, daily rate and city. Only takes 2 minutes.",
    w2t: "2. Get Work", w2d: "Employers in your area will find you and call you directly. No need to travel far.",
    w3t: "3. Earn in Full", w3d: "No brokers, no cuts. The rate you agree on is the amount you keep.",
    e1t: "1. Search", e1d: "Find verified workers by skill, city and budget. Review ratings before you hire.",
    e2t: "2. Talk Directly", e2d: "Call or send a hire request. The worker speaks with you directly — zero commission.",
    e3t: "3. Get It Done", e3d: "Agree on a rate, get the work done and pay fair wages. Simple as that!",
  },
  skillsSec: {
    kicker: "Every Skill, One Platform", title: "Who Can You Find?",
    subtitle: "From construction to repairs — skilled workers of every trade.",
    verified: "Verified workers", viewAll: "View All", allWorkers: "All workers",
  },
  why: {
    kicker: "Pure Benefits", title: "Why Join?",
    items: [
      { t: "Digital Profile", d: "Your professional profile stays in front of thousands of employers — live 24x7." },
      { t: "Location Based", d: "Get work close to home. No more long-distance travel stress." },
      { t: "Fair Wages", d: "No middleman cuts. The full value of your hard work stays with you." },
      { t: "Build Reputation", d: "Every good job earns you ratings. Better ratings mean more work." },
      { t: "Connect Directly", d: "Workers and employers talk directly. No middlemen, no commission!" },
      { t: "Verified & Approved", d: "Every profile is reviewed by our team before it goes live — trust by default." },
    ],
  },
  stories: { kicker: "Success Stories", title: "What Do People Say?" },
  testimonials: [
    { name: "Raju Sharma", role: "Mason, Delhi", quote: "Earlier I waited at the chowk for hours. Now work finds me on my phone — daily jobs and better pay." },
    { name: "Priya Sharma", role: "Homeowner, Noida", quote: "I found a skilled plumber within 15 minutes of searching. Hired after checking ratings — completely stress free." },
    { name: "Ramesh Kumar", role: "Electrician, Mumbai", quote: "Good ratings changed everything for me. Customers now call me directly and there is always work in hand." },
    { name: "Anwar Khan", role: "Contractor, Delhi", quote: "I found 12 workers for my site in a single day. No broker fees — I spoke to every worker directly." },
  ] as { name: string; role: string; quote: string }[],
  cta: {
    title: "Start Today — Completely Free!",
    desc: "Register and get your Registration ID. After admin approval, your profile becomes visible to thousands of employers.",
    worker: "Register as Worker", employer: "Browse Workers",
  },
  skills: {
    mason: "Mason / Rajmistri", carpenter: "Carpenter", electrician: "Electrician",
    plumber: "Plumber", painter: "Painter", welder: "Welder",
    helper: "Helper / Labour", ac_mechanic: "AC Mechanic", tile_fitter: "Tile Fitter",
  },
  time: {
    justNow: "just now",
    min: (n: number) => `${n} min ago`,
    hr: (n: number) => `${n} hours ago`,
    day: (n: number) => `${n} days ago`,
    mon: (n: number) => `${n} months ago`,
    yr: (n: number) => `${n} years ago`,
  },
  reg: {
    kicker: "Free Registration",
    title: "Worker Registration",
    subtitle: "Create your digital profile — employers will find you themselves. Only 2 minutes!",
    steps: ["Personal", "Work", "Account"],
    s1title: "Personal Details",
    name: "Full Name *", namePh: "e.g., Raju Sharma",
    phone: "Mobile Number *", phonePh: "10-digit mobile number",
    aadhaar: "Aadhaar Number *", aadhaarPh: "XXXX XXXX XXXX",
    aadhaarNote: "Used only for verification — never shared.",
    s2title: "Work Details",
    skill: "Your Skill *",
    experience: "Experience *", selectExperience: "Please select experience",
    dailyRate: "Daily Rate (₹) *", ratePh: "e.g., 800",
    city: "City *", cityPh: "e.g., Delhi, Mumbai, Bangalore",
    area: "Area *", areaPh: "e.g., Lajpat Nagar",
    landmark: "Landmark", landmarkPh: "e.g., Near Metro Station, Lajpat Nagar",
    languages: "Languages", languagesPh: "e.g., Hindi, English, Punjabi",
    s3title: "Create Account",
    s3note:
      "Create your username & password to login later. You will manage availability, ratings and hire requests from your dashboard.",
    username: "Username *", usernamePh: "Enter username — min 4 characters",
    usernameNote: "Only letters, numbers & underscore. Min 4 characters.",
    password: "Password *", passwordPh: "Min 6 characters",
    confirm: "Confirm Password *", confirmPh: "Re-enter your password",
    terms: "I agree to the terms and conditions. I confirm that the information provided is correct.",
    next: "Next Step", back: "Back", homeBtn: "Home",
    registerNow: "Register Now", registering: "Registering...",
    haveAccount: "Already registered?", loginHere: "Login here",
    successTitle: "Registration Successful!",
    successMsg: (name: string) => `Congratulations ${name}! Your profile is under admin review.`,
    regIdLabel: "Your Registration ID", saveNote: "Save this ID for future reference",
    reviewNote:
      "Your profile is under review by admin. You will be visible to employers once approved. Meanwhile, explore your dashboard!",
    backHome: "Back to Home", goDashboard: "Go to Dashboard",
    err: {
      nameReq: "Name is required", nameMin: "Name must be at least 2 characters",
      phoneReq: "Phone is required", phoneValid: "Enter a valid 10-digit phone number",
      aadhaarReq: "Aadhaar is required", aadhaarValid: "Aadhaar must be 12 digits",
      skillReq: "Please select a skill", expReq: "Please select experience",
      rateReq: "Daily rate is required", rateValid: "Enter a valid daily rate",
      cityReq: "City is required", cityMin: "City must be at least 2 characters",
      areaReq: "Area is required",
      userReq: "Username is required", userMin: "Username must be at least 4 characters",
      userPattern: "Only letters, numbers & underscore allowed",
      passReq: "Password is required", passMin: "Password must be at least 6 characters",
      passMatch: "Passwords do not match", termsReq: "Please accept the terms to continue",
      network: "Network error. Please try again.", generic: "Registration failed. Please try again.",
    },
  },
  login: {
    title: "Worker Login", subtitle: "Sign in to your dashboard",
    username: "Username", password: "Password",
    usernamePh: "Enter your username", passwordPh: "Enter your password",
    btn: "Login", verifying: "Verifying...",
    newHere: "New here?", registerFree: "Register Free",
    backHome: "Back to Home", adminLogin: "Admin Login",
    demo: "Demo login — username: raju_sharma, password: worker123",
    bothRequired: "Please enter both username and password",
    network: "Network error. Please try again.", generic: "Login failed.",
  },
  workers: {
    badge: "Registered Workers",
    titleA: "Find", titleB: "Nearest Labour",
    subtitle: "Search verified workers by skill, rating and location — then call them directly. No middlemen!",
    searchPh: "Search by name, phone, ID, city, skill...",
    nearest: "Find Nearest Labour", nearMe: "Near Me",
    geoUnsupported: "Geolocation not supported by your browser",
    geoDenied: "Location access denied or unavailable",
    within5: "Active workers within 5 km of your current location",
    showMap: "Show Map", hideMap: "Hide Map",
    mapTitle: "Nearby Active Labour Map",
    nearbyCount: (n: number) => `${n} active worker${n === 1 ? "" : "s"} within 5 km of your current location`,
    loading: "Finding workers...",
    noneTitle: "No workers found!",
    noneDesc: "No workers match your search query. Try a different skill, city or name.",
    found: (n: number) => `${n} verified worker${n === 1 ? "" : "s"} found`,
    sorted: "sorted by distance",
    allSkills: "All Skills", availableNow: "Available Now",
    location: "Your current location",
  },
  card: {
    dailyRate: "Daily Rate", day: "/day", exp: "Exp.", noRatings: "No ratings yet",
    viewHire: "View & Hire", call: "Call directly",
  },
  profile: {
    back: "Back to Search", loading: "Loading profile...",
    notFound: "Worker not found.", notFoundDesc: "The profile may still be under review.",
    verified: "Verified", available: "Available for work", busy: "Busy right now",
    day: "/day", callNow: "Call Now",
    ratings: "ratings", noRatingsYet: "No ratings yet",
    jobs: "Jobs Completed", connections: "Connections", regId: "Registration ID",
    rateTitle: (name: string) => `Rate ${name}`,
    rateDesc: "Hired this worker? Share your experience — it helps others.",
    yourName: "Your name", commentOpt: "Comment (optional)",
    submitRating: "Submit Rating", ratingThanks: "Rating submitted. Thank you!",
    ratingError: "Please enter your name and select stars.",
    reviews: "Reviews", firstRating: "No ratings yet — be the first to review!",
    hireTitle: "Send Hire Request", hireDesc: "The worker will call you directly",
    hireNamePh: "Your name *", hirePhonePh: "Your 10-digit mobile *",
    hireMsgPh: "Work details — when, where, how many days...",
    hireError: "Please enter your name and a valid 10-digit phone number.",
    sendHire: "Send Hire Request",
    noMiddle: "No middlemen, no commission — talk to the worker directly.",
    network: "Network error. Please try again.",
  },
  dash: {
    loading: "Loading dashboard...",
    pendingT: "Pending Review",
    pendingD: "Your profile is under review by admin. You will be visible to employers once approved.",
    rejectedT: "Profile Not Approved",
    rejectedD: "Your profile was not approved. Please contact support or update your details.",
    liveT: "Profile Live!",
    liveD: "Your profile is live! Employers can find you and contact you for work.",
    loggedAs: "Logged in as",
    availOn: "Available", availOff: "Not available",
    rate: "Daily Rate", jobs: "Jobs Completed", avgRating: "Avg Rating",
    requests: "Hire Requests", noRequests: "No requests yet. Stay available and keep your profile active!",
    callBack: "Call Back",
    myRatings: "My Ratings", noRatings: "No ratings yet — do great work and ratings will follow!",
    details: "Profile Details",
    labels: {
      phone: "Phone", aadhaar: "Aadhaar", location: "Location", landmark: "Landmark",
      experience: "Experience", languages: "Languages", registeredOn: "Registered On",
    },
    notProvided: "Not provided",
    changePw: "Change Password",
    current: "Enter current password", newPw: "New password — min 6 characters", confirm: "Re-enter new password",
    update: "Update Password", logout: "Logout",
    approvalNote:
      "Approval usually takes 24 hours. Until then, keep your Registration ID safe:",
  },
  admin: {
    loginTitle: "Admin Login", loginSubtitle: "Registration review and approval panel",
    username: "Username", password: "Password",
    usernamePh: "Enter admin username", passwordPh: "Enter admin password",
    loginBtn: "Login as Admin", verifying: "Verifying...", back: "Back to Home",
    bothRequired: "Please enter both username and password.",
    network: "Network error. Please try again.", generic: "Login failed.",
    title: "Admin Panel", subtitle: "Worker registrations — review, approve, manage",
    total: "Total Registrations", pending: "Pending Review", approved: "Approved", rejected: "Rejected",
    searchPh: "Search by name, phone, ID, city, skill...",
    loading: "Loading registrations...",
    noneT: "No Registrations Found",
    noneD: "No workers have registered yet. Share the registration link!",
    openRegister: "Open Registration Page",
    approve: "Approve", reject: "Reject",
    available: "Available", busy: "Busy",
    registered: "Registered",
    toastApproved: "Worker approved!", toastRejected: "Worker rejected", toastDeleted: "Registration deleted",
    homeBtn: "Home", logout: "Logout",
  },
  comm: {
    badge: "Labour Chowk Family", title: "Community",
    subtitle: "Work tips, daily updates and mutual help — the workers' own community.",
    postTitle: "Community Posts",
    postingAs: "Posting as",
    namePh: "Your name *", cityPh: "City", skillPh: "Skill / Role",
    contentPh: "Share your experience, tips or work updates... (max 500 chars)",
    btn: "Post", sending: "Posting...",
    posted: "Post published!",
    loading: "Loading community posts...",
    noneT: "No posts yet", noneD: "Write the first post!",
    network: "Network error. Please try again.",
  },
};

export type Dict = typeof en;

const hi: Dict = {
  nav: {
    home: "होम", findWorkers: "वर्कर खोजें", findWork: "काम खोजें",
    community: "समुदाय", login: "लॉगिन", register: "मुफ़्त रजिस्टर करें",
    dashboard: "डैशबोर्ड", adminPanel: "एडमिन पैनल", tagline: "वर्चुअल लेबर चौक",
  },
  footer: {
    about:
      "भारत का वर्चुअल लेबर चौक — जहाँ कुशल कामगार और नियोक्ता सीधे जुड़ते हैं। कोई बिचौलिया नहीं, कोई कमीशन नहीं, केवल ईमानदारी का काम।",
    promise: "हर कामगार की गरिमा, हर दिन का काम।",
    quickLinks: "त्वरित लिंक", popularSkills: "लोकप्रिय स्किल्स", contact: "संपर्क",
    links: {
      home: "होम", register: "वर्कर रजिस्ट्रेशन", findWorkers: "वर्कर खोजें",
      community: "समुदाय", workerLogin: "वर्कर लॉगिन", adminLogin: "एडमिन लॉगिन",
    },
    address: "लेबर चौक मुख्यालय, कनॉट प्लेस, नई दिल्ली — 110001",
    helpline: "हेल्पलाइन: 1800-LABOUR-1 (टोल फ़्री)",
    helplineNote: "वर्कर हेल्पलाइन खुली है — सुबह 7 बजे से रात 9 बजे तक, सातों दिन।",
    rights: "लेबर चौक। भारत के कामगारों के लिए गर्व से निर्मित।",
    words: "काम खोजें · वर्कर खोजें · उचित वेतन",
  },
  hero: {
    badge: "वर्चुअल लेबर चौक",
    titleA: "काम खोजें।", titleB: "वर्कर खोजें।",
    subtitle:
      "दैनिक संघर्षों को दैनिक अवसरों में बदलना। कुशल कामगार और नियोक्ता सीधे जुड़ते हैं — बिना किसी बिचौलिए और कमीशन के।",
    ctaWorker: "मुझे काम चाहिए — मुफ़्त रजिस्टर करें", ctaEmployer: "मुझे वर्कर चाहिए",
    stats: { members: "सक्रिय सदस्य", jobs: "पूर्ण किए गए काम", cities: "कवर किए गए शहर", rating: "औसत रेटिंग" },
  },
  paths: {
    kicker: "शुरू करें", title: "आप क्या ढूँढ रहे हैं?",
    workerTitle: "मुझे काम चाहिए",
    workerDesc:
      "क्या आप कुशल कामगार हैं? वर्चुअल लेबर चौक से जुड़ें। रोज़ काम पाएँ, उचित वेतन लें और अपनी पहचान बढ़ाएँ!",
    workerCta: "वर्कर के रूप में रजिस्टर करें",
    employerTitle: "मुझे वर्कर चाहिए",
    employerDesc:
      "वर्कर चाहिए? अपने क्षेत्र के कुशल कामगारों को तुरंत खोजें। स्किल देखें, रेटिंग जाँचें और सीधे संपर्क करें!",
    employerCta: "नज़दीकी वर्कर खोजें",
  },
  steps: {
    kicker: "सरल प्रक्रिया", title: "यह कैसे काम करता है?",
    subtitle: "कामगारों और नियोक्ताओं — दोनों के लिए केवल 3 आसान चरण।",
    forWorkers: "कामगारों के लिए", forEmployers: "नियोक्ताओं के लिए",
    w1t: "1. रजिस्टर करें", w1d: "अपनी डिजिटल प्रोफ़ाइल बनाएँ — नाम, स्किल, दैनिक दर और शहर। केवल 2 मिनट लगते हैं।",
    w2t: "2. काम पाएँ", w2d: "आपके क्षेत्र के नियोक्ता आपको खोजेंगे और सीधे कॉल करेंगे। दूर जाने की ज़रूरत नहीं।",
    w3t: "3. पूरी कमाई करें", w3d: "कोई दलाल नहीं, कोई कटौती नहीं। जो दर तय होगी, पूरा पैसा आपका।",
    e1t: "1. खोजें", e1d: "स्किल, शहर और बजट के अनुसार सत्यापित वर्कर खोजें। रेटिंग देखकर निर्णय लें।",
    e2t: "2. सीधे बात करें", e2d: "कॉल करें या हायर रिक्वेस्ट भेजें। वर्कर खुद आपसे बात करेगा — शून्य कमीशन।",
    e3t: "3. काम करवाएँ", e3d: "दर तय करें, काम पूरा करवाएँ और उचित वेतन दें। बस इतना ही!",
  },
  skillsSec: {
    kicker: "हर स्किल, एक प्लेटफ़ॉर्म", title: "कौन-कौन मिलेगा?",
    subtitle: "निर्माण से लेकर मरम्मत तक — हर ट्रेड के कुशल कामगार।",
    verified: "सत्यापित वर्कर", viewAll: "सभी देखें", allWorkers: "सभी वर्कर",
  },
  why: {
    kicker: "फ़ायदे ही फ़ायदे", title: "क्यों जुड़ें?",
    items: [
      { t: "डिजिटल प्रोफ़ाइल", d: "आपकी प्रोफ़ेशनल प्रोफ़ाइल हज़ारों नियोक्ताओं के सामने — 24x7 लाइव।" },
      { t: "स्थान आधारित", d: "घर के पास काम मिलेगा। लंबी यात्रा की चिंता ख़त्म।" },
      { t: "उचित वेतन", d: "बिचौलियों की कोई कटौती नहीं। आपकी मेहनत का पूरा दाम आपको।" },
      { t: "पहचान बनाएँ", d: "हर अच्छे काम पर रेटिंग मिलेगी। बेहतर रेटिंग यानी ज़्यादा काम।" },
      { t: "सीधे जुड़ें", d: "वर्कर और नियोक्ता सीधे बात करें। कोई बिचौलिया नहीं, कोई कमीशन नहीं!" },
      { t: "सत्यापित और स्वीकृत", d: "लाइव होने से पहले हर प्रोफ़ाइल हमारी टीम द्वारा जाँची जाती है।" },
    ],
  },
  stories: { kicker: "सफलता की कहानियाँ", title: "लोग क्या कहते हैं?" },
  testimonials: [
    { name: "राजू शर्मा", role: "राजमिस्त्री, दिल्ली", quote: "पहले चौक पर घंटों इंतज़ार करता था। अब फ़ोन पर काम मिलता है — रोज़ाना काम और बेहतर कमाई।" },
    { name: "प्रिया शर्मा", role: "गृहस्वामी, नोएडा", quote: "खोज शुरू करने के 15 मिनट के भीतर मुझे कुशल प्लंबर मिल गया। रेटिंग देखकर हायर किया — बिल्कुल चिंता मुक्त।" },
    { name: "रमेश कुमार", role: "इलेक्ट्रीशियन, मुंबई", quote: "अच्छी रेटिंग ने सब कुछ बदल दिया। अब ग्राहक खुद मुझे कॉल करते हैं और काम हमेशा मिलता रहता है।" },
    { name: "अनवर ख़ान", role: "ठेकेदार, दिल्ली", quote: "मेरी साइट के लिए एक ही दिन में 12 कामगार मिल गए। दलाली शून्य — हर वर्कर से सीधे बात हुई।" },
  ] as { name: string; role: string; quote: string }[],
  cta: {
    title: "आज ही शुरुआत करें — बिल्कुल मुफ़्त!",
    desc: "रजिस्टर करें और अपनी रजिस्ट्रेशन आईडी पाएँ। एडमिन स्वीकृति के बाद आपकी प्रोफ़ाइल हज़ारों नियोक्ताओं को दिखेगी।",
    worker: "वर्कर के रूप में रजिस्टर करें", employer: "वर्कर देखें",
  },
  skills: {
    mason: "राजमिस्त्री / मेसन", carpenter: "बढ़ाई (कारपेंटर)", electrician: "इलेक्ट्रीशियन",
    plumber: "प्लंबर", painter: "पेंटर", welder: "वेल्डर",
    helper: "हेल्पर / मज़दूर", ac_mechanic: "एसी मैकेनिक", tile_fitter: "टाइल फ़िटर",
  },
  time: {
    justNow: "अभी-अभी",
    min: (n: number) => `${n} मिनट पहले`,
    hr: (n: number) => `${n} घंटे पहले`,
    day: (n: number) => `${n} दिन पहले`,
    mon: (n: number) => `${n} महीने पहले`,
    yr: (n: number) => `${n} साल पहले`,
  },
  reg: {
    kicker: "मुफ़्त रजिस्ट्रेशन",
    title: "वर्कर रजिस्ट्रेशन",
    subtitle: "अपनी डिजिटल प्रोफ़ाइल बनाएँ — नियोक्ता खुद आपको ढूँढेंगे। केवल 2 मिनट!",
    steps: ["व्यक्तिगत", "काम", "खाता"],
    s1title: "व्यक्तिगत विवरण",
    name: "पूरा नाम *", namePh: "जैसे, राजू शर्मा",
    phone: "मोबाइल नंबर *", phonePh: "10-अंकों का मोबाइल नंबर",
    aadhaar: "आधार नंबर *", aadhaarPh: "XXXX XXXX XXXX",
    aadhaarNote: "केवल सत्यापन के लिए — कभी साझा नहीं किया जाएगा।",
    s2title: "काम का विवरण",
    skill: "आपकी स्किल *",
    experience: "अनुभव *", selectExperience: "कृपया अनुभव चुनें",
    dailyRate: "दैनिक दर (₹) *", ratePh: "जैसे, 800",
    city: "शहर *", cityPh: "जैसे, दिल्ली, मुंबई, बैंगलोर",
    area: "क्षेत्र *", areaPh: "जैसे, लाजपत नगर",
    landmark: "पहचान चिन्ह", landmarkPh: "जैसे, मेट्रो स्टेशन के पास, लाजपत नगर",
    languages: "भाषाएँ", languagesPh: "जैसे, हिन्दी, अंग्रेज़ी, पंजाबी",
    s3title: "खाता बनाएँ",
    s3note:
      "बाद में लॉगिन करने के लिए अपना यूज़रनेम और पासवर्ड बनाएँ। डैशबोर्ड से आप उपलब्धता, रेटिंग और हायर रिक्वेस्ट प्रबंधित कर सकेंगे।",
    username: "यूज़रनेम *", usernamePh: "यूज़रनेम दर्ज करें — कम से कम 4 अक्षर",
    usernameNote: "केवल अक्षर, संख्या और अंडरस्कोर। कम से कम 4 अक्षर।",
    password: "पासवर्ड *", passwordPh: "कम से कम 6 अक्षर",
    confirm: "पासवर्ड की पुष्टि *", confirmPh: "पासवर्ड फिर से दर्ज करें",
    terms: "मैं नियमों और शर्तों से सहमत हूँ। मैं पुष्टि करता/करती हूँ कि दी गई जानकारी सही है।",
    next: "अगला कदम", back: "वापस", homeBtn: "होम",
    registerNow: "रजिस्टर करें", registering: "रजिस्टर हो रहा है...",
    haveAccount: "पहले से रजिस्टर हैं?", loginHere: "यहाँ लॉगिन करें",
    successTitle: "रजिस्ट्रेशन सफल!",
    successMsg: (name: string) => `बधाई हो ${name}! आपकी प्रोफ़ाइल एडमिन समीक्षा में है।`,
    regIdLabel: "आपकी रजिस्ट्रेशन आईडी", saveNote: "भविष्य के लिए यह आईडी सहेजकर रखें",
    reviewNote:
      "आपकी प्रोफ़ाइल एडमिन द्वारा समीक्षा में है। स्वीकृति के बाद ही आप नियोक्ताओं को दिखेंगे। तब तक अपना डैशबोर्ड देखें!",
    backHome: "होम पर वापस", goDashboard: "डैशबोर्ड पर जाएँ",
    err: {
      nameReq: "नाम आवश्यक है", nameMin: "नाम कम से कम 2 अक्षरों का होना चाहिए",
      phoneReq: "फ़ोन नंबर आवश्यक है", phoneValid: "मान्य 10-अंकों का फ़ोन नंबर दर्ज करें",
      aadhaarReq: "आधार आवश्यक है", aadhaarValid: "आधार 12 अंकों का होना चाहिए",
      skillReq: "कृपया स्किल चुनें", expReq: "कृपया अनुभव चुनें",
      rateReq: "दैनिक दर आवश्यक है", rateValid: "मान्य दैनिक दर दर्ज करें",
      cityReq: "शहर आवश्यक है", cityMin: "शहर कम से कम 2 अक्षरों का होना चाहिए",
      areaReq: "क्षेत्र आवश्यक है",
      userReq: "यूज़रनेम आवश्यक है", userMin: "यूज़रनेम कम से कम 4 अक्षरों का होना चाहिए",
      userPattern: "केवल अक्षर, संख्या और अंडरस्कोर की अनुमति है",
      passReq: "पासवर्ड आवश्यक है", passMin: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
      passMatch: "पासवर्ड मेल नहीं खाते", termsReq: "कृपया नियम स्वीकार करें",
      network: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।", generic: "रजिस्ट्रेशन विफल। कृपया पुनः प्रयास करें।",
    },
  },
  login: {
    title: "वर्कर लॉगिन", subtitle: "अपने डैशबोर्ड में साइन इन करें",
    username: "यूज़रनेम", password: "पासवर्ड",
    usernamePh: "अपना यूज़रनेम दर्ज करें", passwordPh: "अपना पासवर्ड दर्ज करें",
    btn: "लॉगिन", verifying: "सत्यापित हो रहा है...",
    newHere: "नए हैं?", registerFree: "मुफ़्त रजिस्टर करें",
    backHome: "होम पर वापस", adminLogin: "एडमिन लॉगिन",
    demo: "डेमो लॉगिन — यूज़रनेम: raju_sharma, पासवर्ड: worker123",
    bothRequired: "कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें",
    network: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।", generic: "लॉगिन विफल।",
  },
  workers: {
    badge: "पंजीकृत वर्कर",
    titleA: "खोजें", titleB: "नज़दीकी कामगार",
    subtitle: "स्किल, रेटिंग और स्थान के अनुसार सत्यापित वर्कर खोजें — फिर सीधे कॉल करें। कोई बिचौलिया नहीं!",
    searchPh: "नाम, फ़ोन, आईडी, शहर, स्किल से खोजें...",
    nearest: "नज़दीकी कामगार खोजें", nearMe: "मेरे पास",
    geoUnsupported: "आपका ब्राउज़र जियोलोकेशन समर्थित नहीं करता",
    geoDenied: "लोकेशन एक्सेस अस्वीकृत या अनुपलब्ध",
    within5: "आपके वर्तमान स्थान से 5 किमी के भीतर सक्रिय वर्कर",
    showMap: "मैप दिखाएँ", hideMap: "मैप छुपाएँ",
    mapTitle: "नज़दीकी सक्रिय कामगार मैप",
    nearbyCount: (n: number) => `आपके स्थान से 5 किमी के भीतर ${n} सक्रिय वर्कर`,
    loading: "वर्कर खोजे जा रहे हैं...",
    noneTitle: "कोई वर्कर नहीं मिला!",
    noneDesc: "आपकी खोज से कोई वर्कर मेल नहीं खाता। कोई दूसरी स्किल, शहर या नाम आज़माएँ।",
    found: (n: number) => `${n} सत्यापित वर्कर मिले`,
    sorted: "दूरी के अनुसार क्रमबद्ध",
    allSkills: "सभी स्किल्स", availableNow: "अभी उपलब्ध",
    location: "आपका वर्तमान स्थान",
  },
  card: {
    dailyRate: "दैनिक दर", day: "/दिन", exp: "अनुभव", noRatings: "अभी कोई रेटिंग नहीं",
    viewHire: "देखें और हायर करें", call: "सीधे कॉल करें",
  },
  profile: {
    back: "खोज पर वापस", loading: "प्रोफ़ाइल लोड हो रही है...",
    notFound: "वर्कर नहीं मिला।", notFoundDesc: "प्रोफ़ाइल अभी समीक्षा में हो सकती है।",
    verified: "सत्यापित", available: "काम के लिए उपलब्ध", busy: "अभी व्यस्त",
    day: "/दिन", callNow: "अभी कॉल करें",
    ratings: "रेटिंग", noRatingsYet: "अभी कोई रेटिंग नहीं",
    jobs: "पूर्ण किए गए काम", connections: "कनेक्शन", regId: "रजिस्ट्रेशन आईडी",
    rateTitle: (name: string) => `${name} को रेट करें`,
    rateDesc: "यह वर्कर काम कर चुका है? अपना अनुभव साझा करें — इससे दूसरों को मदद मिलेगी।",
    yourName: "आपका नाम", commentOpt: "टिप्पणी (वैकल्पिक)",
    submitRating: "रेटिंग जमा करें", ratingThanks: "रेटिंग जमा हो गई। धन्यवाद!",
    ratingError: "कृपया अपना नाम दर्ज करें और स्टार चुनें।",
    reviews: "समीक्षाएँ", firstRating: "अभी कोई रेटिंग नहीं — पहली समीक्षा आप दें!",
    hireTitle: "हायर रिक्वेस्ट भेजें", hireDesc: "वर्कर सीधे आपको कॉल करेगा",
    hireNamePh: "आपका नाम *", hirePhonePh: "आपका 10-अंकों का मोबाइल *",
    hireMsgPh: "काम का विवरण — कब, कहाँ, कितने दिन...",
    hireError: "कृपया अपना नाम और मान्य 10-अंकों का फ़ोन नंबर दर्ज करें।",
    sendHire: "हायर रिक्वेस्ट भेजें",
    noMiddle: "कोई बिचौलिया नहीं, कोई कमीशन नहीं — वर्कर से सीधे बात करें।",
    network: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
  },
  dash: {
    loading: "डैशबोर्ड लोड हो रहा है...",
    pendingT: "समीक्षा लंबित",
    pendingD: "आपकी प्रोफ़ाइल एडमिन द्वारा समीक्षा में है। स्वीकृति के बाद ही आप नियोक्ताओं को दिखेंगे।",
    rejectedT: "प्रोफ़ाइल स्वीकृत नहीं हुई",
    rejectedD: "आपकी प्रोफ़ाइल स्वीकृत नहीं हुई। कृपया सहायता से संपर्क करें या अपना विवरण अपडेट करें।",
    liveT: "प्रोफ़ाइल लाइव!",
    liveD: "आपकी प्रोफ़ाइल लाइव है! नियोक्ता आपको खोज सकते हैं और काम के लिए संपर्क कर सकते हैं।",
    loggedAs: "लॉगिन:",
    availOn: "उपलब्ध", availOff: "उपलब्ध नहीं",
    rate: "दैनिक दर", jobs: "पूर्ण किए गए काम", avgRating: "औसत रेटिंग",
    requests: "हायर रिक्वेस्ट", noRequests: "अभी कोई रिक्वेस्ट नहीं। उपलब्ध रहें और प्रोफ़ाइल सक्रिय रखें!",
    callBack: "वापस कॉल करें",
    myRatings: "मेरी रेटिंग", noRatings: "अभी कोई रेटिंग नहीं — अच्छा काम करें, रेटिंग मिलेगी!",
    details: "प्रोफ़ाइल विवरण",
    labels: {
      phone: "फ़ोन", aadhaar: "आधार", location: "स्थान", landmark: "पहचान चिन्ह",
      experience: "अनुभव", languages: "भाषाएँ", registeredOn: "रजिस्ट्रेशन तिथि",
    },
    notProvided: "उपलब्ध नहीं",
    changePw: "पासवर्ड बदलें",
    current: "वर्तमान पासवर्ड दर्ज करें", newPw: "नया पासवर्ड — कम से कम 6 अक्षर", confirm: "नया पासवर्ड फिर से दर्ज करें",
    update: "पासवर्ड अपडेट करें", logout: "लॉगआउट",
    approvalNote: "स्वीकृति में सामान्यतः 24 घंटे लगते हैं। तब तक अपनी रजिस्ट्रेशन आईडी सुरक्षित रखें:",
  },
  admin: {
    loginTitle: "एडमिन लॉगिन", loginSubtitle: "रजिस्ट्रेशन समीक्षा और स्वीकृति पैनल",
    username: "यूज़रनेम", password: "पासवर्ड",
    usernamePh: "एडमिन यूज़रनेम दर्ज करें", passwordPh: "एडमिन पासवर्ड दर्ज करें",
    loginBtn: "एडमिन के रूप में लॉगिन", verifying: "सत्यापित हो रहा है...", back: "होम पर वापस",
    bothRequired: "कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें।",
    network: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।", generic: "लॉगिन विफल।",
    title: "एडमिन पैनल", subtitle: "वर्कर रजिस्ट्रेशन — समीक्षा, स्वीकृति, प्रबंधन",
    total: "कुल रजिस्ट्रेशन", pending: "समीक्षा लंबित", approved: "स्वीकृत", rejected: "अस्वीकृत",
    searchPh: "नाम, फ़ोन, आईडी, शहर, स्किल से खोजें...",
    loading: "रजिस्ट्रेशन लोड हो रहे हैं...",
    noneT: "कोई रजिस्ट्रेशन नहीं मिला",
    noneD: "अभी किसी वर्कर ने रजिस्टर नहीं किया है। रजिस्ट्रेशन लिंक साझा करें!",
    openRegister: "रजिस्ट्रेशन पेज खोलें",
    approve: "स्वीकृत करें", reject: "अस्वीकृत करें",
    available: "उपलब्ध", busy: "व्यस्त",
    registered: "रजिस्टर्ड",
    toastApproved: "वर्कर स्वीकृत!", toastRejected: "वर्कर अस्वीकृत", toastDeleted: "रजिस्ट्रेशन हटाया गया",
    homeBtn: "होम", logout: "लॉगआउट",
  },
  comm: {
    badge: "लेबर चौक परिवार", title: "समुदाय",
    subtitle: "काम के सुझाव, दैनिक अपडेट और आपसी मदद — कामगारों का अपना समुदाय।",
    postTitle: "समुदाय पोस्ट",
    postingAs: "प्रकाशित कर रहे हैं",
    namePh: "आपका नाम *", cityPh: "शहर", skillPh: "स्किल / भूमिका",
    contentPh: "अपना अनुभव, सुझाव या काम के अपडेट साझा करें... (अधिकतम 500 अक्षर)",
    btn: "पोस्ट करें", sending: "पोस्ट हो रहा है...",
    posted: "पोस्ट प्रकाशित हो गई!",
    loading: "समुदाय पोस्ट लोड हो रही हैं...",
    noneT: "अभी कोई पोस्ट नहीं", noneD: "पहली पोस्ट आप लिखें!",
    network: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
  },
};

const dictionaries: Record<Lang, Dict> = { en, hi };

/* ---------------------------------- */
/*  Server message translation bridge  */
/* ---------------------------------- */

const serverMessagesHi: Record<string, string> = {
  "Username not found. Please check or register first.":
    "यूज़रनेम नहीं मिला। कृपया जाँचें या पहले रजिस्टर करें।",
  "Incorrect password. Please try again.": "गलत पासवर्ड। कृपया पुनः प्रयास करें।",
  "Please enter both username and password.": "कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें।",
  "This username is already taken. Please choose a different one.":
    "यह यूज़रनेम पहले से लिया गया है। कृपया दूसरा चुनें।",
  "This phone number is already registered. Please login instead.":
    "यह फ़ोन नंबर पहले से रजिस्टर है। कृपया लॉगिन करें।",
  "Please fix the errors in the form.": "कृपया फ़ॉर्म की त्रुटियाँ सुधारें।",
  "Registration failed. Please try again.": "रजिस्ट्रेशन विफल। कृपया पुनः प्रयास करें।",
  "Network error. Please try again.": "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
  "Session expired. Please login again.": "सत्र समाप्त हो गया। कृपया फिर से लॉगिन करें।",
  "Current password is incorrect.": "वर्तमान पासवर्ड गलत है।",
  "New password must be at least 6 characters.": "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
  "Passwords do not match.": "पासवर्ड मेल नहीं खाते।",
  "Password changed successfully!": "पासवर्ड सफलतापूर्वक बदल दिया गया!",
  "Enter current password.": "वर्तमान पासवर्ड दर्ज करें।",
  "Availability updated": "उपलब्धता अपडेट हो गई",
  "Request sent! Worker will contact you directly.":
    "रिक्वेस्ट भेज दी गई! वर्कर सीधे आपसे संपर्क करेगा।",
  "Worker not found.": "वर्कर नहीं मिला।",
  "Please enter your name.": "कृपया अपना नाम दर्ज करें।",
  "Please select a rating between 1 and 5.": "कृपया 1 से 5 के बीच रेटिंग चुनें।",
  "Enter a valid 10-digit phone number.": "मान्य 10-अंकों का फ़ोन नंबर दर्ज करें।",
  "Login failed.": "लॉगिन विफल।",
  "Incorrect admin credentials. Please try again.": "गलत एडमिन क्रेडेंशियल। पुनः प्रयास करें।",
  "Failed to load data": "डेटा लोड करने में विफल",
  "Action failed": "कार्रवाई विफल",
  "Post likhna zaroori hai.": "पोस्ट लिखना आवश्यक है।",
  "Post 500 characters se lamba nahi ho sakta.": "पोस्ट 500 अक्षरों से लंबी नहीं हो सकती।",
};

/* -------------------- */
/*  Context & provider  */
/* -------------------- */

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dict: Dict;
  skillName: (skill: string, fallback?: string) => string;
  expLabel: (experience: string) => string;
  timeAgo: (date: Date | string) => string;
  translateServer: (message: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  dict: en,
  skillName: (_s, fb) => fb ?? _s,
  expLabel: (e) => e,
  timeAgo: () => "",
  translateServer: (m) => m,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lc_lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("lc_lang", next);
    document.documentElement.lang = next === "hi" ? "hi" : "en";
  }, []);

  const dict = dictionaries[lang];

  const skillName = useCallback(
    (skill: string, fallback?: string) =>
      (dict.skills as Record<string, string>)[skill] ?? fallback ?? skill,
    [dict],
  );

  const expLabel = useCallback(
    (experience: string) =>
      lang === "hi" ? experience.replace("years", "वर्ष") : experience,
    [lang],
  );

  const timeAgo = useCallback(
    (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
      if (seconds < 60) return dict.time.justNow;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return dict.time.min(minutes);
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return dict.time.hr(hours);
      const days = Math.floor(hours / 24);
      if (days < 30) return dict.time.day(days);
      const months = Math.floor(days / 30);
      if (months < 12) return dict.time.mon(months);
      return dict.time.yr(Math.floor(months / 12));
    },
    [dict],
  );

  const translateServer = useCallback(
    (message: string) => (lang === "hi" ? (serverMessagesHi[message] ?? message) : message),
    [lang],
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, dict, skillName, expLabel, timeAgo, translateServer }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/* Small helper — EN/हिन्दी pill toggle */

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={`flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-bold shadow-sm ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 transition-all ${
          lang === "en" ? "bg-brand-800 text-white shadow" : "text-slate-500 hover:text-brand-700"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`rounded-full px-3 py-1.5 transition-all ${
          lang === "hi" ? "bg-brand-800 text-white shadow" : "text-slate-500 hover:text-brand-700"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
}
