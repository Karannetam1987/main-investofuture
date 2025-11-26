# Hostinger पर वेबसाइट को चलाने (Host) करने की गाइड

इस वेबसाइट को Hostinger पर चलाने के लिए नीचे दिए गए स्टेप्स को फॉलो करें।

---

### पहला कदम: Firebase से अपनी API Keys निकालना

यह सबसे ज़रूरी कदम है। इसके बिना आपकी वेबसाइट का लॉगिन, रजिस्ट्रेशन और डेटाबेस काम नहीं करेगा।

1.  **Firebase Console पर जाएँ:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  अपना प्रोजेक्ट (`investo future`) खोलें।
3.  ऊपर बाईं ओर **Project Settings** (सेटिंग्स का आइकन) पर क्लिक करें।
4.  **General** टैब में, नीचे स्क्रॉल करके **Your apps** सेक्शन पर जाएँ।
5.  **Web app** (`investo future` या जो भी आपने नाम दिया हो) को चुनें।
6.  **SDK setup and configuration** में, **Config** ऑप्शन को चुनें।
7.  आपको कुछ ऐसा कोड दिखेगा:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIz...XXX",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "123...",
      appId: "1:123...",
      measurementId: "G-XXX..."
    };
    ```
8.  इसमें से `apiKey` की पूरी वैल्यू कॉपी करें।

---

### दूसरा कदम: Hostinger में API Key डालना

1.  अपने Hostinger hPanel में लॉगिन करें।
2.  **Websites** पर जाएँ और अपनी वेबसाइट के लिए **Manage** पर क्लिक करें।
3.  साइडबार में, **Files** सेक्शन के अंदर **File Manager** पर क्लिक करें।
4.  File Manager में, `public_html` फ़ोल्डर के अंदर जाएँ।
5.  यहाँ पर, एक नई फ़ाइल बनाएँ जिसका नाम `.env.local` हो।
6.  इस `.env.local` फ़ाइल को एडिट करें और उसमें नीचे दी गई लाइन पेस्ट करें। `XXX` की जगह पर अपनी कॉपी की हुई **Firebase API Key** डालें:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=XXX
    ```
7.  फ़ाइल को सेव करें।

---

### तीसरा कदम: कोड को GitHub पर डालना और Hostinger से जोड़ना

Hostinger आपके प्लान के आधार पर Next.js को डिप्लॉय करने के कई तरीके देता है। सबसे आम तरीका Git का उपयोग करना है।

1.  **GitHub पर एक नई रिपॉजिटरी बनाएँ:**
    *   [https://github.com/new](https://github.com/new) पर जाएँ।
    *   अपनी रिपॉजिटरी को कोई भी नाम दें (जैसे `investofuture-app`)।
    *   इसे **Private** या **Public** रख सकते हैं, यह आपकी मर्ज़ी है।
    *   **Create repository** पर क्लिक करें।

2.  **अपने कंप्यूटर से कोड को GitHub पर डालें (Push करें):**
    *   GitHub आपको कुछ कमांड्स दिखाएगा। "…or push an existing repository from the command line" वाले सेक्शन को देखें।
    *   अपने कंप्यूटर पर प्रोजेक्ट के फोल्डर में एक टर्मिनल खोलें।
    *   नीचे दिए गए कमांड्स को एक-एक करके चलाएँ। **ध्यान दें:** `git remote add origin` वाली लाइन GitHub से कॉपी करें, क्योंकि उसमें आपका यूज़रनेम और रिपॉजिटरी का नाम होगा।

        ```bash
        git init -b main
        git add .
        git commit -m "First commit"
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
        git push -u origin main
        ```
    *   यह आपके कोड को GitHub पर अपलोड कर देगा।

3.  **Hostinger में Git डिप्लॉयमेंट सेट करें:**
    *   Hostinger hPanel में, **Advanced** सेक्शन के अंदर **Git** पर क्लिक करें।
    *   **Create a new repository** सेक्शन में, अपनी GitHub रिपॉजिटरी का URL, ब्रांच (आमतौर पर `main`), और वह डायरेक्टरी डालें जहाँ कोड जाएगा (`public_html` या खाली छोड़ दें)।
    *   **Auto-deployment** को ऑन करें। इससे जब भी आप GitHub पर कोड डालेंगे, Hostinger अपने आप वेबसाइट को अपडेट कर देगा।

4.  **डिप्लॉय करें:**
    *   **Deploy** बटन पर क्लिक करें। Hostinger आपके कोड को GitHub से खींचेगा, ज़रूरी पैकेज (npm install) इंस्टॉल करेगा, और ऐप को बिल्ड (`npm run build`) करेगा।

**बस!** इन स्टेप्स के बाद, आपकी वेबसाइट आपके डोमेन पर लाइव हो जाएगी और सभी फंक्शन (लॉगिन, रजिस्ट्रेशन, डेटाबेस) सही से काम करेंगे। आपको और कुछ करने की ज़रूरत नहीं है।
