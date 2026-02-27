export type Hadith = {
  arabic: string;
  english: string;
  urdu: string;
  romanUrdu: string;
  narrator: string;
  reference: string;
};

export const DAILY_HADITHS: Hadith[] = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    english: "Actions are judged by intentions, and every person will get what they intended.",
    urdu: "اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔",
    romanUrdu: "Aamal ka daaromadaar niyyaton par hai aur har shakhs ko wohi milega jis ki us ne niyyat ki.",
    narrator: "Umar ibn Al-Khattab (RA)",
    reference: "Sahih Bukhari 1"
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    english: "None of you truly believes until he loves for his brother what he loves for himself.",
    urdu: "تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی نہ چاہے جو اپنے لیے چاہتا ہے۔",
    romanUrdu: "Tum mein se koi us waqt tak momin nahi ho sakta jab tak woh apne bhai ke liye wohi na chahe jo apne liye chahta hai.",
    narrator: "Anas bin Malik (RA)",
    reference: "Sahih Bukhari 13"
  },
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    english: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    urdu: "جو شخص اللہ اور آخرت کے دن پر ایمان رکھتا ہو وہ اچھی بات کہے یا خاموش رہے۔",
    romanUrdu: "Jo shakhs Allah aur aakhirat ke din par imaan rakhta ho woh achhi baat kahe ya khamosh rahe.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Bukhari 6018"
  },
  {
    arabic: "لَا تَغْضَبْ",
    english: "Do not get angry.",
    urdu: "غصہ نہ کرو۔",
    romanUrdu: "Gussa na karo.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Bukhari 6116"
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    english: "Cleanliness is half of faith.",
    urdu: "پاکیزگی نصف ایمان ہے۔",
    romanUrdu: "Paakizgi nisf imaan hai.",
    narrator: "Abu Malik Al-Ashari (RA)",
    reference: "Sahih Muslim 223"
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    english: "A Muslim is the one from whose tongue and hands other Muslims are safe.",
    urdu: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
    romanUrdu: "Musalman woh hai jis ki zuban aur haath se dusre Musalman mehfooz rahein.",
    narrator: "Abdullah ibn Amr (RA)",
    reference: "Sahih Bukhari 10"
  },
  {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    english: "Whoever takes a path in search of knowledge, Allah will make easy for him the path to Paradise.",
    urdu: "جو شخص علم حاصل کرنے کے لیے کوئی راستہ اختیار کرے، اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔",
    romanUrdu: "Jo shakhs ilm haasil karne ke liye koi raasta ikhtiyaar kare, Allah us ke liye Jannat ka raasta aasaan kar deta hai.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2699"
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    english: "The best of you are those who learn the Quran and teach it.",
    urdu: "تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
    romanUrdu: "Tum mein se behtareen woh hai jo Quran seekhe aur sikhaye.",
    narrator: "Uthman ibn Affan (RA)",
    reference: "Sahih Bukhari 5027"
  },
  {
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    english: "This world is a prison for the believer and a paradise for the disbeliever.",
    urdu: "دنیا مومن کے لیے قید خانہ ہے اور کافر کے لیے جنت ہے۔",
    romanUrdu: "Duniya momin ke liye qaid khaana hai aur kaafir ke liye jannat hai.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2956"
  },
  {
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    english: "Your smile for your brother is a charity.",
    urdu: "تمہارے بھائی کے سامنے مسکرانا صدقہ ہے۔",
    romanUrdu: "Tumhare bhai ke saamne muskurana sadqa hai.",
    narrator: "Abu Dharr (RA)",
    reference: "Tirmidhi 1956"
  },
  {
    arabic: "مَا مَلَأَ آدَمِيٌّ وِعَاءً شَرًّا مِنْ بَطْنٍ",
    english: "No human ever filled a vessel worse than the stomach.",
    urdu: "آدمی نے پیٹ سے بُرا کوئی برتن نہیں بھرا۔",
    romanUrdu: "Aadmi ne pait se bura koi bartan nahi bhara.",
    narrator: "Al-Miqdam ibn Ma'dikarib (RA)",
    reference: "Tirmidhi 2380"
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    english: "Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds.",
    urdu: "اللہ تمہاری صورتوں اور مالوں کو نہیں دیکھتا بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔",
    romanUrdu: "Allah tumhari suraton aur maalon ko nahi dekhta balkeh tumhare dilon aur aamal ko dekhta hai.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2564"
  },
  {
    arabic: "الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    english: "A believer to another believer is like a building whose different parts enforce each other.",
    urdu: "ایک مومن دوسرے مومن کے لیے عمارت کی طرح ہے جس کے حصے ایک دوسرے کو مضبوط کرتے ہیں۔",
    romanUrdu: "Ek momin dusre momin ke liye imaarat ki tarah hai jis ke hisse ek dusre ko mazboot karte hain.",
    narrator: "Abu Musa Al-Ashari (RA)",
    reference: "Sahih Bukhari 6026"
  },
  {
    arabic: "مَنْ لَا يَرْحَمُ لَا يُرْحَمُ",
    english: "He who does not show mercy will not be shown mercy.",
    urdu: "جو رحم نہیں کرتا اس پر رحم نہیں کیا جاتا۔",
    romanUrdu: "Jo reham nahi karta us par reham nahi kiya jaata.",
    narrator: "Jarir bin Abdullah (RA)",
    reference: "Sahih Bukhari 7376"
  },
  {
    arabic: "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ",
    english: "Allah is gentle and loves gentleness in all things.",
    urdu: "اللہ نرم ہے اور ہر معاملے میں نرمی پسند فرماتا ہے۔",
    romanUrdu: "Allah narm hai aur har maamle mein narmi pasand farmata hai.",
    narrator: "Aisha (RA)",
    reference: "Sahih Bukhari 6927"
  },
  {
    arabic: "الدَّالُّ عَلَى الْخَيْرِ كَفَاعِلِهِ",
    english: "The one who guides to good is like the one who does it.",
    urdu: "بھلائی کی رہنمائی کرنے والا بھلائی کرنے والے کی طرح ہے۔",
    romanUrdu: "Bhalai ki rehnumai karne wala bhalai karne wale ki tarah hai.",
    narrator: "Anas bin Malik (RA)",
    reference: "Tirmidhi 2670"
  },
  {
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    english: "Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.",
    urdu: "جہاں بھی ہو اللہ سے ڈرو، برائی کے بعد نیکی کرو وہ اسے مٹا دے گی، اور لوگوں سے اچھے اخلاق سے پیش آؤ۔",
    romanUrdu: "Jahan bhi ho Allah se daro, burai ke baad neki karo woh use mita degi, aur logon se achhe akhlaq se pesh aao.",
    narrator: "Abu Dharr (RA)",
    reference: "Tirmidhi 1987"
  },
  {
    arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا",
    english: "The most complete believers in faith are those with the best character.",
    urdu: "ایمان میں سب سے کامل وہ مومن ہے جس کے اخلاق سب سے اچھے ہوں۔",
    romanUrdu: "Imaan mein sab se kaamil woh momin hai jis ke akhlaq sab se achhe hon.",
    narrator: "Abu Hurairah (RA)",
    reference: "Tirmidhi 1162"
  },
  {
    arabic: "لَا تُكْثِرُوا الضَّحِكَ فَإِنَّ كَثْرَةَ الضَّحِكِ تُمِيتُ الْقَلْبَ",
    english: "Do not laugh too much, for excessive laughter kills the heart.",
    urdu: "زیادہ نہ ہنسو کیونکہ زیادہ ہنسنا دل کو مردہ کر دیتا ہے۔",
    romanUrdu: "Zyada na hanso kyunke zyada hansna dil ko murda kar deta hai.",
    narrator: "Abu Hurairah (RA)",
    reference: "Tirmidhi 2305"
  },
  {
    arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ",
    english: "Paradise lies beneath the feet of mothers.",
    urdu: "جنت ماؤں کے قدموں تلے ہے۔",
    romanUrdu: "Jannat maaon ke qadmon tale hai.",
    narrator: "Anas bin Malik (RA)",
    reference: "Nasa'i 3104"
  },
  {
    arabic: "كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ",
    english: "Each of you is a shepherd and each of you is responsible for his flock.",
    urdu: "تم میں سے ہر ایک نگران ہے اور ہر ایک سے اس کی رعایا کے بارے میں پوچھا جائے گا۔",
    romanUrdu: "Tum mein se har ek nigraan hai aur har ek se us ki raaya ke bare mein pucha jayega.",
    narrator: "Abdullah ibn Umar (RA)",
    reference: "Sahih Bukhari 7138"
  },
  {
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    english: "Charity does not decrease wealth.",
    urdu: "صدقہ مال میں کمی نہیں کرتا۔",
    romanUrdu: "Sadqa maal mein kami nahi karta.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 2588"
  },
  {
    arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    english: "When a person dies, his deeds are cut off except for three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.",
    urdu: "جب انسان مر جاتا ہے تو اس کے عمل بند ہو جاتے ہیں سوائے تین چیزوں کے: صدقہ جاریہ، فائدہ مند علم، یا نیک اولاد جو اس کے لیے دعا کرے۔",
    romanUrdu: "Jab insaan mar jaata hai to us ke amal band ho jaate hain siwaye teen cheezon ke: sadqa jariya, faidemand ilm, ya nek aulaad jo us ke liye dua kare.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 1631"
  },
  {
    arabic: "الْمُسْلِمُ أَخُو الْمُسْلِمِ لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ",
    english: "A Muslim is the brother of a Muslim. He does not wrong him nor does he forsake him.",
    urdu: "مسلمان مسلمان کا بھائی ہے نہ اس پر ظلم کرتا ہے نہ اسے بے یارو مددگار چھوڑتا ہے۔",
    romanUrdu: "Musalman Musalman ka bhai hai na us par zulm karta hai na use be yaro madadgaar chhodta hai.",
    narrator: "Abdullah ibn Umar (RA)",
    reference: "Sahih Bukhari 2442"
  },
  {
    arabic: "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
    english: "Whoever sends blessings upon me once, Allah will send blessings upon him tenfold.",
    urdu: "جو مجھ پر ایک بار درود بھیجے اللہ اس پر دس بار رحمت بھیجتا ہے۔",
    romanUrdu: "Jo mujh par ek baar durood bheje Allah us par das baar rehmat bhejta hai.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 384"
  },
  {
    arabic: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    english: "The most beloved deed to Allah is the most regular and constant even if it were little.",
    urdu: "اللہ کو سب سے محبوب عمل وہ ہے جو ہمیشہ کیا جائے خواہ تھوڑا ہو۔",
    romanUrdu: "Allah ko sab se mehboob amal woh hai jo hamesha kiya jaye khwah thoda ho.",
    narrator: "Aisha (RA)",
    reference: "Sahih Bukhari 6464"
  },
  {
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    english: "The best of people are those who are most beneficial to people.",
    urdu: "لوگوں میں سب سے بہتر وہ ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے۔",
    romanUrdu: "Logon mein sab se behtar woh hai jo logon ko sab se zyada faida pahunchaye.",
    narrator: "Jabir (RA)",
    reference: "Tabarani"
  },
  {
    arabic: "مَنْ غَشَّنَا فَلَيْسَ مِنَّا",
    english: "Whoever cheats us is not one of us.",
    urdu: "جو ہمیں دھوکا دے وہ ہم میں سے نہیں۔",
    romanUrdu: "Jo hamein dhoka de woh hum mein se nahi.",
    narrator: "Abu Hurairah (RA)",
    reference: "Sahih Muslim 102"
  },
  {
    arabic: "لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",
    english: "No one who has an atom's weight of arrogance in his heart will enter Paradise.",
    urdu: "جنت میں وہ شخص داخل نہیں ہوگا جس کے دل میں رائی کے دانے کے برابر تکبر ہوگا۔",
    romanUrdu: "Jannat mein woh shakhs daakhil nahi hoga jis ke dil mein rai ke daane ke baraabar takabbur hoga.",
    narrator: "Abdullah ibn Masud (RA)",
    reference: "Sahih Muslim 91"
  },
  {
    arabic: "الصَّلَاةُ عِمَادُ الدِّينِ",
    english: "Prayer is the pillar of religion.",
    urdu: "نماز دین کا ستون ہے۔",
    romanUrdu: "Namaaz deen ka sutoon hai.",
    narrator: "Umar ibn Al-Khattab (RA)",
    reference: "Musnad Ahmad"
  },
];
