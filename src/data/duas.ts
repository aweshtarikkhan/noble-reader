export type DuaTranslation = {
  arabic: string;
  english: string;
  urdu: string;
  romanUrdu: string;
  reference?: string;
};

export type DuaCategory = {
  id: string;
  name: string;
  duas: DuaTranslation[];
};

export const DUA_CATEGORIES: DuaCategory[] = [
  // ===== DAILY ESSENTIALS =====
  {
    id: "waking-up",
    name: "When Waking Up",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        english: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
        urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں زندگی دی مارنے کے بعد اور اسی کی طرف لوٹنا ہے۔",
        romanUrdu: "Tamam tareefein Allah ke liye hain jis ne hamein zindagi di maarne ke baad aur usi ki taraf lotna hai.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "before-sleeping",
    name: "Before Sleeping",
    duas: [
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        english: "In Your name O Allah, I live and die.",
        urdu: "اے اللہ! تیرے نام سے میں مرتا ہوں اور جیتا ہوں۔",
        romanUrdu: "Aye Allah! Tere naam se mein marta hoon aur jeeta hoon.",
        reference: "Sahih Bukhari"
      },
      {
        arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا وَبِاسْمِكَ أَمُوتُ",
        english: "O Allah, in Your name I live and in Your name I die.",
        urdu: "اے اللہ تیرے نام سے جیتا ہوں اور تیرے نام سے مرتا ہوں۔",
        romanUrdu: "Aye Allah tere naam se jeeta hoon aur tere naam se marta hoon.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "entering-home",
    name: "Upon Entering Home",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
        english: "In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.",
        urdu: "اللہ کے نام سے ہم داخل ہوئے اور اللہ کے نام سے ہم نکلے اور اپنے رب پر ہم نے بھروسہ کیا۔",
        romanUrdu: "Allah ke naam se hum daakhil hue aur Allah ke naam se hum nikle aur apne Rab par hum ne bharosa kiya.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "leaving-home",
    name: "When Leaving Home",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        english: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
        urdu: "اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا اور اللہ کے بغیر کوئی طاقت اور قوت نہیں۔",
        romanUrdu: "Allah ke naam se, mein ne Allah par bharosa kiya aur Allah ke baghair koi taaqat aur quwwat nahi.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "entering-mosque",
    name: "Upon Entering Mosque",
    duas: [
      {
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        english: "O Allah, open for me the doors of Your mercy.",
        urdu: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
        romanUrdu: "Aye Allah! Mere liye apni rehmat ke darwaze khol de.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "leaving-mosque",
    name: "Upon Leaving Mosque",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        english: "O Allah, I ask You from Your favour.",
        urdu: "اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔",
        romanUrdu: "Aye Allah! Mein tujh se tere fazal ka sawaal karta hoon.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "before-entering-toilet",
    name: "Before Entering Toilet",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        english: "In the name of Allah. O Allah, I seek refuge with You from evil and evil ones (male and female).",
        urdu: "اللہ کے نام سے۔ اے اللہ! میں تیری پناہ مانگتا ہوں ناپاک جنوں اور جنیوں سے۔",
        romanUrdu: "Allah ke naam se. Aye Allah! Mein teri panah maangta hoon napaak jinon aur jiniyon se.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "after-leaving-toilet",
    name: "After Leaving Toilet",
    duas: [
      {
        arabic: "غُفْرَانَكَ",
        english: "I ask You (Allah) for forgiveness.",
        urdu: "اے اللہ! میں تجھ سے بخشش مانگتا ہوں۔",
        romanUrdu: "Aye Allah! Mein tujh se bakhshish maangta hoon.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "starting-ablution",
    name: "When Starting Ablution",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ",
        english: "In the name of Allah.",
        urdu: "اللہ کے نام سے۔",
        romanUrdu: "Allah ke naam se.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "completing-ablution",
    name: "Upon Completing Ablution",
    duas: [
      {
        arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        english: "I bear witness that none has the right to be worshipped except Allah, alone without partner, and I bear witness that Muhammad is His slave and Messenger.",
        urdu: "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔",
        romanUrdu: "Mein gawahi deta hoon ke Allah ke siwa koi mabood nahi woh akela hai us ka koi shareek nahi aur mein gawahi deta hoon ke Muhammad us ke bande aur Rasool hain.",
        reference: "Sahih Muslim"
      }
    ]
  },
  // ===== MEALS =====
  {
    id: "beginning-meal",
    name: "When Beginning a Meal",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
        english: "In the name of Allah and with the blessings of Allah.",
        urdu: "اللہ کے نام سے اور اللہ کی برکت پر۔",
        romanUrdu: "Allah ke naam se aur Allah ki barkat par.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "after-meal",
    name: "After Finishing a Meal",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        english: "All praise is due to Allah Who has fed us, given us drink, and made us Muslims.",
        urdu: "تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں کھلایا اور پلایا اور ہمیں مسلمان بنایا۔",
        romanUrdu: "Tamam tareefein Allah ke liye hain jis ne hamein khilaya aur pilaya aur hamein Musalman banaya.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "drinking-milk",
    name: "Upon Drinking Milk",
    duas: [
      {
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ",
        english: "O Allah, bless it for us and give us more of it.",
        urdu: "اے اللہ! ہمارے لیے اس میں برکت دے اور ہمیں اور زیادہ عطا فرما۔",
        romanUrdu: "Aye Allah! Hamare liye is mein barkat de aur hamein aur zyada ata farma.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "given-drink",
    name: "When Given a Drink",
    duas: [
      {
        arabic: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
        english: "O Allah, feed the one who fed me and give drink to the one who gave me drink.",
        urdu: "اے اللہ! جس نے مجھے کھلایا اسے کھلا اور جس نے مجھے پلایا اسے پلا۔",
        romanUrdu: "Aye Allah! Jis ne mujhe khilaya use khila aur jis ne mujhe pilaya use pila.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "dining-at-someones-house",
    name: "When Dining at Someone's House",
    duas: [
      {
        arabic: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
        english: "O Allah, feed the one who has fed me and give drink to the one who has given me drink.",
        urdu: "اے اللہ! جس نے مجھے کھانا کھلایا اسے کھلا اور جس نے مجھے پانی پلایا اسے پلا۔",
        romanUrdu: "Aye Allah! Jis ne mujhe khana khilaya use khila aur jis ne mujhe paani pilaya use pila.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "someone-offers-meal",
    name: "For Someone Who Offers You a Meal",
    duas: [
      {
        arabic: "اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ",
        english: "O Allah, bless them in what You have provided for them, forgive them, and have mercy upon them.",
        urdu: "اے اللہ! تو نے انہیں جو رزق دیا ہے اس میں برکت دے، انہیں بخش دے اور ان پر رحم فرما۔",
        romanUrdu: "Aye Allah! Tu ne inhein jo rizq diya hai us mein barkat de, inhein bakhsh de aur un par reham farma.",
        reference: "Sahih Muslim"
      }
    ]
  },
  // ===== PRAYER RELATED =====
  {
    id: "after-takbeer",
    name: "After Takbeer (Start of Prayer)",
    duas: [
      {
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
        english: "Glory be to You O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty. There is no god but You.",
        urdu: "اے اللہ! تو پاک ہے اور تعریف تیرے لیے ہے، تیرا نام بابرکت ہے، تیری شان بلند ہے اور تیرے سوا کوئی معبود نہیں۔",
        romanUrdu: "Aye Allah! Tu paak hai aur tareef tere liye hai, tera naam ba-barkat hai, teri shaan buland hai aur tere siwa koi mabood nahi.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "during-ruku",
    name: "During Ruku (Bowing Down)",
    duas: [
      {
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        english: "Glory be to my Lord, the Most Great.",
        urdu: "پاک ہے میرا رب بہت عظمت والا۔",
        romanUrdu: "Paak hai mera Rab bohat azmat wala.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "when-prostrating",
    name: "When Prostrating (In Sujood)",
    duas: [
      {
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
        english: "Glory be to my Lord, the Most High.",
        urdu: "پاک ہے میرا رب سب سے بلند۔",
        romanUrdu: "Paak hai mera Rab sab se buland.",
        reference: "Sahih Muslim"
      },
      {
        arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ",
        english: "O Allah, forgive me all my sins, great and small, first and last, open and secret.",
        urdu: "اے اللہ! میرے سارے گناہ معاف فرما دے، چھوٹے بھی بڑے بھی، پہلے بھی اور بعد کے بھی، ظاہر بھی اور پوشیدہ بھی۔",
        romanUrdu: "Aye Allah! Mere saare gunaah maaf farma de, chhote bhi bare bhi, pehle bhi aur baad ke bhi, zaahir bhi aur poshida bhi.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "between-two-sujood",
    name: "When Sitting Between Two Sujood",
    duas: [
      {
        arabic: "رَبِّ اغْفِرْ لِي رَبِّ اغْفِرْ لِي",
        english: "My Lord, forgive me. My Lord, forgive me.",
        urdu: "اے میرے رب! مجھے بخش دے۔ اے میرے رب! مجھے بخش دے۔",
        romanUrdu: "Aye mere Rab! Mujhe bakhsh de. Aye mere Rab! Mujhe bakhsh de.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "tashahhud",
    name: "After Tashahhud / Sitting in Prayer",
    duas: [
      {
        arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        english: "All compliments, prayers, and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that none has the right to be worshipped except Allah, and I bear witness that Muhammad is His slave and Messenger.",
        urdu: "تمام زبانی، بدنی اور مالی عبادتیں اللہ کے لیے ہیں۔ اے نبی! آپ پر سلام ہو اور اللہ کی رحمت اور برکتیں ہوں۔ ہم پر اور اللہ کے نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔",
        romanUrdu: "Tamam zabani, badni aur maali ibaadatein Allah ke liye hain. Aye Nabi! Aap par salaam ho aur Allah ki rehmat aur barkaten hon. Hum par aur Allah ke nek bandon par salaam ho. Mein gawahi deta hoon ke Allah ke siwa koi mabood nahi aur mein gawahi deta hoon ke Muhammad us ke bande aur Rasool hain.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "darood-ibrahimi",
    name: "Darood-e-Ibrahimi",
    duas: [
      {
        arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
        english: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad as You blessed Ibrahim and the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.",
        urdu: "اے اللہ! محمد پر اور محمد کی آل پر رحمت بھیج جیسے تو نے ابراہیم پر اور ابراہیم کی آل پر رحمت بھیجی۔ بے شک تو تعریف والا بزرگی والا ہے۔ اے اللہ! محمد پر اور محمد کی آل پر برکت نازل فرما جیسے تو نے ابراہیم پر اور ابراہیم کی آل پر برکت نازل فرمائی۔ بے شک تو تعریف والا بزرگی والا ہے۔",
        romanUrdu: "Aye Allah! Muhammad par aur Muhammad ki aal par rehmat bhej jaise tu ne Ibrahim par aur Ibrahim ki aal par rehmat bheji. Be-shak tu tareef wala buzurgi wala hai. Aye Allah! Muhammad par aur Muhammad ki aal par barkat naazil farma jaise tu ne Ibrahim par aur Ibrahim ki aal par barkat naazil farmai. Be-shak tu tareef wala buzurgi wala hai.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "dua-qunoot",
    name: "Dua e Qunoot (Witr Prayer)",
    duas: [
      {
        arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ وَلَا يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
        english: "O Allah, guide me among those You have guided, pardon me among those You have pardoned, turn to me in friendship among those on whom You have turned in friendship, and bless me in what You have bestowed, and save me from the evil of what You have decreed. For verily You decree and none can decree against You. He whom You support shall never be humiliated and he whom You oppose shall never be honoured. Blessed are You, our Lord, and Exalted.",
        urdu: "اے اللہ! مجھے ہدایت دے ان لوگوں میں جنہیں تو نے ہدایت دی، مجھے عافیت دے ان لوگوں میں جنہیں تو نے عافیت دی، میری سرپرستی فرما ان لوگوں میں جن کی تو نے سرپرستی فرمائی، اور جو تو نے مجھے عطا کیا ہے اس میں برکت دے، اور جو تو نے فیصلہ کیا ہے اس کے شر سے مجھے بچا۔ بے شک تو فیصلہ فرماتا ہے اور تیرے خلاف فیصلہ نہیں ہو سکتا۔ بے شک وہ ذلیل نہیں ہوتا جس سے تو دوستی رکھے اور وہ عزت نہیں پاتا جس سے تو دشمنی رکھے۔ بابرکت ہے تو اے ہمارے رب اور بلند ہے تو۔",
        romanUrdu: "Aye Allah! Mujhe hidayat de un logon mein jinhein tu ne hidayat di, mujhe aafiyat de un logon mein jinhein tu ne aafiyat di, meri sarparasti farma un logon mein jin ki tu ne sarparasti farmai, aur jo tu ne mujhe ata kiya hai us mein barkat de, aur jo tu ne faisla kiya hai us ke shar se mujhe bacha. Be-shak tu faisla farmata hai aur tere khilaaf faisla nahi ho sakta. Be-shak woh zaleel nahi hota jis se tu dosti rakhe aur woh izzat nahi paata jis se tu dushmani rakhe. Ba-barkat hai tu aye hamare Rab aur buland hai tu.",
        reference: "Abu Dawud, Tirmidhi, Nasa'i"
      }
    ]
  },
  {
    id: "after-salah-tasbeeh",
    name: "After Salah Tasbeeh",
    duas: [
      {
        arabic: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٣) لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        english: "SubhanAllah (33 times), Alhamdulillah (33 times), Allahu Akbar (33 times), then: There is no deity except Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent.",
        urdu: "سبحان اللہ (۳۳ مرتبہ)، الحمد للہ (۳۳ مرتبہ)، اللہ اکبر (۳۳ مرتبہ)، پھر: اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔",
        romanUrdu: "SubhanAllah (33 martaba), Alhamdulillah (33 martaba), Allahu Akbar (33 martaba), phir: Allah ke siwa koi mabood nahi woh akela hai us ka koi shareek nahi, baadshahi usi ki hai aur tareef usi ki hai aur woh har cheez par qaadir hai.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "remembrance-after-prayer",
    name: "Remembrance After Prayer",
    duas: [
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ أَسْتَغْفِرُ اللَّهَ اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        english: "I seek Allah's forgiveness (3 times). O Allah, You are Peace and from You is peace. Blessed are You, O Owner of majesty and honour.",
        urdu: "میں اللہ سے بخشش مانگتا ہوں (۳ بار)۔ اے اللہ! تو سلامتی والا ہے اور تجھ سے ہی سلامتی ہے۔ بابرکت ہے تو اے عظمت اور بزرگی والے۔",
        romanUrdu: "Mein Allah se bakhshish maangta hoon (3 baar). Aye Allah! Tu salaamti wala hai aur tujh se hi salaamti hai. Ba-barkat hai tu aye azmat aur buzurgi wale.",
        reference: "Sahih Muslim"
      }
    ]
  },
  // ===== FORGIVENESS =====
  {
    id: "for-forgiveness",
    name: "For Forgiveness",
    duas: [
      {
        arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        english: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
        urdu: "اے ہمارے رب! ہم نے اپنے آپ پر ظلم کیا اور اگر تو نے ہمیں معاف نہ کیا اور ہم پر رحم نہ کیا تو ہم ضرور نقصان اٹھانے والوں میں سے ہوں گے۔",
        romanUrdu: "Aye hamare Rab! Hum ne apne aap par zulm kiya aur agar tu ne hamein maaf na kiya aur hum par reham na kiya to hum zaroor nuqsaan uthane walon mein se honge.",
        reference: "Quran 7:23"
      },
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
        english: "I seek forgiveness from Allah, the One whom there is no deity worthy of worship except Him, the Ever-Living, the Sustainer, and I repent to Him.",
        urdu: "میں اللہ سے مغفرت مانگتا ہوں جس کے سوا کوئی معبود نہیں وہ زندہ ہے قائم رہنے والا ہے اور میں اس کی طرف توبہ کرتا ہوں۔",
        romanUrdu: "Mein Allah se maghfirat maangta hoon jis ke siwa koi mabood nahi woh zinda hai qaim rehne wala hai aur mein us ki taraf taubah karta hoon.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "forgiveness-mercy",
    name: "For Forgiveness and Allah's Mercy",
    duas: [
      {
        arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
        english: "My Lord, forgive and have mercy, and You are the best of the merciful.",
        urdu: "اے میرے رب! بخش دے اور رحم فرما اور تو سب سے بہتر رحم کرنے والا ہے۔",
        romanUrdu: "Aye mere Rab! Bakhsh de aur reham farma aur tu sab se behtar reham karne wala hai.",
        reference: "Quran 23:118"
      }
    ]
  },
  {
    id: "forgiveness-parents-muslims",
    name: "Forgiveness for Parents and All Muslims",
    duas: [
      {
        arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        english: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
        urdu: "اے ہمارے رب! مجھے اور میرے والدین کو اور سب مومنوں کو بخش دے جس دن حساب قائم ہوگا۔",
        romanUrdu: "Aye hamare Rab! Mujhe aur mere walidain ko aur sab mominon ko bakhsh de jis din hisaab qaim hoga.",
        reference: "Quran 14:41"
      }
    ]
  },
  {
    id: "repentance",
    name: "For Repentance",
    duas: [
      {
        arabic: "رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي",
        english: "My Lord, indeed I have wronged myself, so forgive me.",
        urdu: "اے میرے رب! میں نے اپنے آپ پر ظلم کیا ہے پس مجھے بخش دے۔",
        romanUrdu: "Aye mere Rab! Mein ne apne aap par zulm kiya hai pas mujhe bakhsh de.",
        reference: "Quran 28:16"
      }
    ]
  },
  // ===== PROTECTION =====
  {
    id: "protection-help",
    name: "For Protection and Help from Allah",
    duas: [
      {
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        english: "Allah is sufficient for us, and He is the best disposer of affairs.",
        urdu: "اللہ ہمارے لیے کافی ہے اور وہ بہترین کارساز ہے۔",
        romanUrdu: "Allah hamare liye kaafi hai aur woh behtareen kaarsaaz hai.",
        reference: "Quran 3:173"
      }
    ]
  },
  {
    id: "protection-satan",
    name: "For Protection from Satan/Shaytan",
    duas: [
      {
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        english: "I seek refuge in Allah from Satan, the accursed.",
        urdu: "میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔",
        romanUrdu: "Mein Allah ki panah maangta hoon Shaitaan mardood se.",
        reference: "Quran 16:98"
      },
      {
        arabic: "رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَنْ يَحْضُرُونِ",
        english: "My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You, my Lord, lest they be present with me.",
        urdu: "اے میرے رب! میں شیطانوں کے وسوسوں سے تیری پناہ مانگتا ہوں اور اے میرے رب! میں تیری پناہ مانگتا ہوں کہ وہ میرے پاس آئیں۔",
        romanUrdu: "Aye mere Rab! Mein shaitanon ke waswason se teri panah maangta hoon aur aye mere Rab! Mein teri panah maangta hoon ke woh mere paas aayen.",
        reference: "Quran 23:97-98"
      }
    ]
  },
  {
    id: "protection-oppressors",
    name: "For Protection from Oppressors",
    duas: [
      {
        arabic: "رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ وَنَجِّنَا بِرَحْمَتِكَ مِنَ الْقَوْمِ الْكَافِرِينَ",
        english: "Our Lord, make us not a trial for the wrongdoing people and save us by Your mercy from the disbelieving people.",
        urdu: "اے ہمارے رب! ہمیں ظالم قوم کے لیے آزمائش نہ بنا اور اپنی رحمت سے ہمیں کافر قوم سے نجات دے۔",
        romanUrdu: "Aye hamare Rab! Hamein zaalim qaum ke liye aazmaish na bana aur apni rehmat se hamein kaafir qaum se nijaat de.",
        reference: "Quran 10:85-86"
      }
    ]
  },
  {
    id: "protection-wrongdoers",
    name: "For Protection from the Wrongdoers",
    duas: [
      {
        arabic: "رَبِّ نَجِّنِي مِنَ الْقَوْمِ الظَّالِمِينَ",
        english: "My Lord, save me from the wrongdoing people.",
        urdu: "اے میرے رب! مجھے ظالم لوگوں سے بچا لے۔",
        romanUrdu: "Aye mere Rab! Mujhe zaalim logon se bacha le.",
        reference: "Quran 28:21"
      }
    ]
  },
  {
    id: "protection-ignorance",
    name: "For Protection from Ignorance",
    duas: [
      {
        arabic: "رَبِّ أَعُوذُ بِكَ أَنْ أَسْأَلَكَ مَا لَيْسَ لِي بِهِ عِلْمٌ",
        english: "My Lord, I seek refuge in You from asking You that of which I have no knowledge.",
        urdu: "اے میرے رب! میں تیری پناہ مانگتا ہوں کہ تجھ سے وہ مانگوں جس کا مجھے علم نہیں۔",
        romanUrdu: "Aye mere Rab! Mein teri panah maangta hoon ke tujh se woh maangoon jis ka mujhe ilm nahi.",
        reference: "Quran 11:47"
      }
    ]
  },
  {
    id: "fear-shirk",
    name: "For Fear of Committing Shirk",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ",
        english: "O Allah, I seek refuge in You from knowingly associating partners with You and I seek Your forgiveness for what I do not know.",
        urdu: "اے اللہ! میں تیری پناہ مانگتا ہوں کہ جانتے ہوئے تیرے ساتھ شرک کروں اور جو میں نہیں جانتا اس کے لیے تجھ سے بخشش مانگتا ہوں۔",
        romanUrdu: "Aye Allah! Mein teri panah maangta hoon ke jaante hue tere saath shirk karoon aur jo mein nahi jaanta us ke liye tujh se bakhshish maangta hoon.",
        reference: "Ahmad"
      }
    ]
  },
  {
    id: "protection-foolishness",
    name: "Protection from Foolishness",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَالْهَرَمِ وَعَذَابِ الْقَبْرِ",
        english: "O Allah, I seek refuge in You from incapacity, laziness, cowardice, miserliness, old age, and the punishment of the grave.",
        urdu: "اے اللہ! میں تیری پناہ مانگتا ہوں عاجزی سے، سستی سے، بزدلی سے، بخل سے، بڑھاپے سے اور قبر کے عذاب سے۔",
        romanUrdu: "Aye Allah! Mein teri panah maangta hoon aajzi se, susti se, buzdili se, bukhl se, burhape se aur qabar ke azaab se.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  // ===== DAILY LIFE =====
  {
    id: "before-starting-anything",
    name: "Before Starting Anything",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
        english: "In the name of Allah, the Most Gracious, the Most Merciful.",
        urdu: "اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
        romanUrdu: "Allah ke naam se jo bara mehrban nihayat reham wala hai.",
        reference: "Quran 1:1"
      }
    ]
  },
  {
    id: "looking-mirror",
    name: "When Looking into the Mirror",
    duas: [
      {
        arabic: "اللَّهُمَّ أَنْتَ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي",
        english: "O Allah, just as You have made my external features beautiful, make my character beautiful as well.",
        urdu: "اے اللہ! جیسے تو نے میری صورت اچھی بنائی ہے ویسے ہی میرے اخلاق بھی اچھے بنا دے۔",
        romanUrdu: "Aye Allah! Jaise tu ne meri surat achhi banai hai waise hi mere akhlaq bhi achhe bana de.",
        reference: "Ahmad"
      }
    ]
  },
  {
    id: "wearing-new-clothes",
    name: "When Wearing New Clothes",
    duas: [
      {
        arabic: "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        english: "O Allah, for You is all praise. You have clothed me with it. I ask You for its goodness and the goodness for which it was made. And I seek refuge in You from its evil and the evil for which it was made.",
        urdu: "اے اللہ! تیرے لیے تمام تعریف ہے تو نے مجھے یہ پہنایا۔ میں تجھ سے اس کی بھلائی اور اس بھلائی کا سوال کرتا ہوں جس کے لیے یہ بنایا گیا اور اس کے شر سے اور اس شر سے تیری پناہ مانگتا ہوں جس کے لیے یہ بنایا گیا۔",
        romanUrdu: "Aye Allah! Tere liye tamam tareef hai tu ne mujhe yeh pehnaya. Mein tujh se is ki bhalai aur us bhalai ka sawaal karta hoon jis ke liye yeh banaya gaya aur is ke shar se aur us shar se teri panah maangta hoon jis ke liye yeh banaya gaya.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "wearing-garment",
    name: "When Wearing a Garment",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        english: "All praise is for Allah who has clothed me with this garment and provided it for me with no power nor might from myself.",
        urdu: "تمام تعریف اللہ کے لیے ہے جس نے مجھے یہ لباس پہنایا اور مجھے یہ عطا کیا بغیر میری کسی طاقت اور قوت کے۔",
        romanUrdu: "Tamam tareef Allah ke liye hai jis ne mujhe yeh libaas pehnaya aur mujhe yeh ata kiya baghair meri kisi taaqat aur quwwat ke.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "entering-market",
    name: "When Entering Market",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        english: "There is no deity except Allah alone, without partner. His is the dominion and His is the praise. He gives life and causes death, and He is living and does not die. In His hand is all good and He is over all things competent.",
        urdu: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تعریف اسی کی ہے، وہ زندہ کرتا ہے اور مارتا ہے اور وہ زندہ ہے کبھی نہیں مرے گا، اس کے ہاتھ میں تمام بھلائی ہے اور وہ ہر چیز پر قادر ہے۔",
        romanUrdu: "Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, baadshahi usi ki hai aur tareef usi ki hai, woh zinda karta hai aur maarta hai aur woh zinda hai kabhi nahi marega, us ke haath mein tamam bhalai hai aur woh har cheez par qaadir hai.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "going-to-mosque",
    name: "When Going to Mosque",
    duas: [
      {
        arabic: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي لِسَانِي نُورًا وَاجْعَلْ فِي سَمْعِي نُورًا وَاجْعَلْ فِي بَصَرِي نُورًا",
        english: "O Allah, place light in my heart, light on my tongue, light in my hearing, and light in my sight.",
        urdu: "اے اللہ! میرے دل میں نور رکھ دے، میری زبان میں نور رکھ دے، میرے کانوں میں نور رکھ دے اور میری آنکھوں میں نور رکھ دے۔",
        romanUrdu: "Aye Allah! Mere dil mein noor rakh de, meri zuban mein noor rakh de, mere kaanon mein noor rakh de aur meri aankhon mein noor rakh de.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  // ===== EMOTIONS & SITUATIONS =====
  {
    id: "worry-sorrow",
    name: "At Times of Worry and Sorrow",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        english: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
        urdu: "اے اللہ! میں تیری پناہ مانگتا ہوں فکر اور غم سے، عاجزی اور سستی سے، بخل اور بزدلی سے، قرض کے بوجھ اور لوگوں کے غلبے سے۔",
        romanUrdu: "Aye Allah! Mein teri panah maangta hoon fikr aur gham se, aajzi aur susti se, bukhl aur buzdili se, qarz ke bojh aur logon ke ghalbe se.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "in-distress",
    name: "When in Distress",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
        urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔",
        romanUrdu: "Tere siwa koi mabood nahi, tu paak hai, be-shak mein zaalimon mein se tha.",
        reference: "Quran 21:87"
      },
      {
        arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
        english: "Indeed we belong to Allah and to Him we shall return. O Allah, reward me in my calamity and replace it for me with something better.",
        urdu: "ہم اللہ کے لیے ہیں اور اسی کی طرف لوٹنے والے ہیں۔ اے اللہ! مجھے میری مصیبت میں اجر دے اور اس سے بہتر بدلہ دے۔",
        romanUrdu: "Hum Allah ke liye hain aur usi ki taraf lotne wale hain. Aye Allah! Mujhe meri musibat mein ajr de aur is se behtar badla de.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "feeling-frightened",
    name: "When Feeling Frightened",
    duas: [
      {
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        english: "I seek refuge in the complete words of Allah from the evil of what He has created.",
        urdu: "میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں اس کی مخلوق کے شر سے۔",
        romanUrdu: "Mein Allah ke mukammal kalimaat ki panah maangta hoon us ki makhlooq ke shar se.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "controlling-anger",
    name: "For Controlling Your Anger",
    duas: [
      {
        arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        english: "I seek refuge in Allah from Satan, the accursed.",
        urdu: "میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے۔",
        romanUrdu: "Mein Allah ki panah maangta hoon Shaitaan mardood se.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "curbing-fear",
    name: "For Curbing Fear",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
        english: "O Allah, we put You in front of them and we seek refuge in You from their evil.",
        urdu: "اے اللہ! ہم تجھے ان کے سامنے رکھتے ہیں اور ان کے شر سے تیری پناہ مانگتے ہیں۔",
        romanUrdu: "Aye Allah! Hum tujhe un ke saamne rakhte hain aur un ke shar se teri panah maangte hain.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "hard-times",
    name: "If You Fall on Hard Times",
    duas: [
      {
        arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
        english: "O Allah, there is no ease except what You make easy. And You make sadness easy when You will.",
        urdu: "اے اللہ! آسان صرف وہی ہے جسے تو آسان بنا دے اور تو غم کو بھی آسان بنا دیتا ہے جب چاہے۔",
        romanUrdu: "Aye Allah! Aasaan sirf wohi hai jise tu aasaan bana de aur tu gham ko bhi aasaan bana deta hai jab chahe.",
        reference: "Ibn Hibban"
      }
    ]
  },
  {
    id: "stricken-tragedy",
    name: "When Stricken by Tragedy",
    duas: [
      {
        arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        english: "Indeed we belong to Allah and indeed to Him we will return.",
        urdu: "بے شک ہم اللہ کے لیے ہیں اور بے شک ہم اسی کی طرف لوٹنے والے ہیں۔",
        romanUrdu: "Be-shak hum Allah ke liye hain aur be-shak hum usi ki taraf lotne wale hain.",
        reference: "Quran 2:156"
      }
    ]
  },
  {
    id: "loss-occurs",
    name: "When a Loss Occurs",
    duas: [
      {
        arabic: "قَدَّرَ اللَّهُ وَمَا شَاءَ فَعَلَ",
        english: "Allah has decreed and whatever He wills, He does.",
        urdu: "اللہ نے فیصلہ فرمایا اور جو چاہا وہ کیا۔",
        romanUrdu: "Allah ne faisla farmaya aur jo chaaha woh kiya.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "fail-lose",
    name: "When You Fail or Lose at Something",
    duas: [
      {
        arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        english: "There is no power and no strength except with Allah.",
        urdu: "اللہ کے بغیر کوئی طاقت اور قوت نہیں۔",
        romanUrdu: "Allah ke baghair koi taaqat aur quwwat nahi.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  // ===== GOOD NEWS / BAD NEWS =====
  {
    id: "hearing-good-news",
    name: "On Hearing Good News",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
        english: "All praise is due to Allah by Whose grace good deeds are completed.",
        urdu: "تمام تعریف اللہ کے لیے ہے جس کی نعمت سے نیکیاں مکمل ہوتی ہیں۔",
        romanUrdu: "Tamam tareef Allah ke liye hai jis ki nemat se nekiyan mukammal hoti hain.",
        reference: "Ibn Majah"
      }
    ]
  },
  {
    id: "hearing-bad-news",
    name: "On Hearing Bad News",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ",
        english: "All praise is due to Allah in all circumstances.",
        urdu: "ہر حال میں اللہ کی تعریف ہے۔",
        romanUrdu: "Har haal mein Allah ki tareef hai.",
        reference: "Ibn Majah"
      }
    ]
  },
  {
    id: "times-happiness",
    name: "In Times of Happiness",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        english: "All praise is for Allah.",
        urdu: "تمام تعریفیں اللہ کے لیے ہیں۔",
        romanUrdu: "Tamam tareefein Allah ke liye hain.",
        reference: "Quran"
      }
    ]
  },
  // ===== SOCIAL / GREETING =====
  {
    id: "greeting-people",
    name: "For Greeting People",
    duas: [
      {
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
        english: "Peace be upon you and the mercy of Allah and His blessings.",
        urdu: "تم پر سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں۔",
        romanUrdu: "Tum par salaamti ho aur Allah ki rehmat aur us ki barkaten.",
        reference: "Quran 6:54"
      }
    ]
  },
  {
    id: "responding-salam",
    name: "When Responding to Salam",
    duas: [
      {
        arabic: "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
        english: "And upon you be peace and the mercy of Allah and His blessings.",
        urdu: "اور تم پر بھی سلامتی ہو اور اللہ کی رحمت اور اس کی برکتیں۔",
        romanUrdu: "Aur tum par bhi salaamti ho aur Allah ki rehmat aur us ki barkaten.",
        reference: "Quran 4:86"
      }
    ]
  },
  {
    id: "sneezing",
    name: "Upon Sneezing",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ",
        english: "All praise is for Allah.",
        urdu: "تمام تعریفیں اللہ کے لیے ہیں۔",
        romanUrdu: "Tamam tareefein Allah ke liye hain.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "sneezer-reply",
    name: "Sneezer's Reply Back",
    duas: [
      {
        arabic: "يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
        english: "May Allah guide you and rectify your condition.",
        urdu: "اللہ تمہیں ہدایت دے اور تمہاری حالت درست کرے۔",
        romanUrdu: "Allah tumhein hidayat de aur tumhari haalat durust kare.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "seeing-someone-sneeze",
    name: "When One Sees Someone Sneezing",
    duas: [
      {
        arabic: "يَرْحَمُكَ اللَّهُ",
        english: "May Allah have mercy on you.",
        urdu: "اللہ تم پر رحم کرے۔",
        romanUrdu: "Allah tum par reham kare.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "someone-insults",
    name: "When Someone Insults You",
    duas: [
      {
        arabic: "إِنِّي صَائِمٌ إِنِّي صَائِمٌ",
        english: "I am fasting, I am fasting. (Even if not fasting, to control oneself)",
        urdu: "میں روزے سے ہوں، میں روزے سے ہوں۔ (اپنے آپ کو قابو کرنے کے لیے)",
        romanUrdu: "Mein roze se hoon, mein roze se hoon. (Apne aap ko qaabu karne ke liye)",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "someone-praises",
    name: "When Someone Praises You",
    duas: [
      {
        arabic: "اللَّهُمَّ لَا تُؤَاخِذْنِي بِمَا يَقُولُونَ وَاغْفِرْ لِي مَا لَا يَعْلَمُونَ وَاجْعَلْنِي خَيْرًا مِمَّا يَظُنُّونَ",
        english: "O Allah, do not hold me accountable for what they say, forgive me for what they do not know, and make me better than what they think.",
        urdu: "اے اللہ! مجھ سے اس بات پر مؤاخذہ نہ فرما جو یہ کہتے ہیں، مجھے بخش دے جو یہ نہیں جانتے اور مجھے ان کے گمان سے بہتر بنا دے۔",
        romanUrdu: "Aye Allah! Mujh se is baat par muakhza na farma jo yeh kehte hain, mujhe bakhsh de jo yeh nahi jaante aur mujhe un ke gumaan se behtar bana de.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "offering-condolence",
    name: "When Offering Condolence",
    duas: [
      {
        arabic: "إِنَّ لِلَّهِ مَا أَخَذَ وَلَهُ مَا أَعْطَى وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى فَلْتَصْبِرْ وَلْتَحْتَسِبْ",
        english: "To Allah belongs what He takes and to Him belongs what He gives. Everything with Him has an appointed time. Be patient and seek reward.",
        urdu: "اللہ ہی کا ہے جو اس نے لیا اور اسی کا ہے جو دیا، ہر چیز کا اس کے پاس ایک مقرر وقت ہے، پس صبر کر اور ثواب کی امید رکھ۔",
        romanUrdu: "Allah hi ka hai jo us ne liya aur usi ka hai jo diya, har cheez ka us ke paas ek muqarrar waqt hai, pas sabr kar aur sawaab ki umeed rakh.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "thanking-someone",
    name: "For Thanking Someone",
    duas: [
      {
        arabic: "جَزَاكَ اللَّهُ خَيْرًا",
        english: "May Allah reward you with goodness.",
        urdu: "اللہ تمہیں اچھا بدلہ دے۔",
        romanUrdu: "Allah tumhein achha badla de.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "someone-lends-money",
    name: "For Someone Who Lends You Money",
    duas: [
      {
        arabic: "بَارَكَ اللَّهُ لَكَ فِي أَهْلِكَ وَمَالِكَ",
        english: "May Allah bless you in your family and wealth.",
        urdu: "اللہ تمہارے گھر والوں اور مال میں برکت دے۔",
        romanUrdu: "Allah tumhare ghar walon aur maal mein barkat de.",
        reference: "Nasa'i"
      }
    ]
  },
  // ===== FAMILY & CHILDREN =====
  {
    id: "for-parents",
    name: "For Parents",
    duas: [
      {
        arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        english: "My Lord, have mercy upon them as they brought me up when I was small.",
        urdu: "اے میرے رب! ان دونوں پر رحم فرما جیسا کہ انہوں نے بچپن میں مجھے پالا۔",
        romanUrdu: "Aye mere Rab! Un donon par reham farma jaisa ke unhon ne bachpan mein mujhe paala.",
        reference: "Quran 17:24"
      }
    ]
  },
  {
    id: "asking-child",
    name: "Asking Allah to Grant You a Child",
    duas: [
      {
        arabic: "رَبِّ هَبْ لِي مِنْ لَدُنْكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ",
        english: "My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.",
        urdu: "اے میرے رب! مجھے اپنے پاس سے پاکیزہ اولاد عطا فرما۔ بے شک تو دعا سننے والا ہے۔",
        romanUrdu: "Aye mere Rab! Mujhe apne paas se paakiza aulaad ata farma. Be-shak tu dua sunne wala hai.",
        reference: "Quran 3:38"
      }
    ]
  },
  {
    id: "child-protection",
    name: "For Your Child's Protection",
    duas: [
      {
        arabic: "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
        english: "I seek protection for you in the complete words of Allah from every devil and every poisonous creature and from every evil eye.",
        urdu: "میں تمہارے لیے اللہ کے مکمل کلمات کی پناہ مانگتا ہوں ہر شیطان اور ہر زہریلے جانور سے اور ہر بری نظر سے۔",
        romanUrdu: "Mein tumhare liye Allah ke mukammal kalimaat ki panah maangta hoon har shaitaan aur har zehreele jaanwar se aur har buri nazar se.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "blissful-family",
    name: "For a Blissful Family",
    duas: [
      {
        arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        english: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
        urdu: "اے ہمارے رب! ہمیں ہماری بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما اور ہمیں پرہیزگاروں کا امام بنا دے۔",
        romanUrdu: "Aye hamare Rab! Hamein hamari biwiyon aur aulaad se aankhon ki thandak ata farma aur hamein parhezgaron ka imam bana de.",
        reference: "Quran 25:74"
      }
    ]
  },
  {
    id: "family-safe-transgressors",
    name: "To Keep Family Safe from Transgressors",
    duas: [
      {
        arabic: "رَبِّ نَجِّنِي وَأَهْلِي مِمَّا يَعْمَلُونَ",
        english: "My Lord, save me and my family from what they do.",
        urdu: "اے میرے رب! مجھے اور میرے گھر والوں کو ان کے کاموں سے بچا لے۔",
        romanUrdu: "Aye mere Rab! Mujhe aur mere ghar walon ko un ke kaamon se bacha le.",
        reference: "Quran 26:169"
      }
    ]
  },
  {
    id: "forgiveness-siblings",
    name: "Forgiveness for Your Siblings",
    duas: [
      {
        arabic: "رَبِّ اغْفِرْ لِي وَلِأَخِي وَأَدْخِلْنَا فِي رَحْمَتِكَ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
        english: "My Lord, forgive me and my brother and admit us into Your mercy, for You are the most merciful of the merciful.",
        urdu: "اے میرے رب! مجھے اور میرے بھائی کو بخش دے اور ہمیں اپنی رحمت میں داخل کر لے اور تو سب سے زیادہ رحم کرنے والا ہے۔",
        romanUrdu: "Aye mere Rab! Mujhe aur mere bhai ko bakhsh de aur hamein apni rehmat mein daakhil kar le aur tu sab se zyada reham karne wala hai.",
        reference: "Quran 7:151"
      }
    ]
  },
  // ===== SEEKING GUIDANCE & HELP =====
  {
    id: "istikhara",
    name: "For Istikhara",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ وَتَعْلَمُ وَلَا أَعْلَمُ وَأَنْتَ عَلَّامُ الْغُيُوبِ",
        english: "O Allah, I seek Your guidance by virtue of Your knowledge and I seek ability by virtue of Your power and I ask You of Your great bounty. You have power, I have none. You know, I know not. You are the Knower of hidden things.",
        urdu: "اے اللہ! میں تیرے علم کے ذریعے تجھ سے خیر مانگتا ہوں اور تیری قدرت کے ذریعے تجھ سے طاقت مانگتا ہوں اور تیرے عظیم فضل کا سوال کرتا ہوں۔ تو قادر ہے اور میں قادر نہیں، تو جانتا ہے اور میں نہیں جانتا اور تو غیب کا جاننے والا ہے۔",
        romanUrdu: "Aye Allah! Mein tere ilm ke zariye tujh se khair maangta hoon aur teri qudrat ke zariye tujh se taaqat maangta hoon aur tere azeem fazal ka sawaal karta hoon. Tu qaadir hai aur mein qaadir nahi, tu jaanta hai aur mein nahi jaanta aur tu ghaib ka jaanne wala hai.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "seeking-guidance",
    name: "Seek Allah's Guidance",
    duas: [
      {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        english: "Guide us to the straight path.",
        urdu: "ہمیں سیدھا راستہ دکھا۔",
        romanUrdu: "Hamein seedha raasta dikha.",
        reference: "Quran 1:6"
      }
    ]
  },
  {
    id: "seeking-help",
    name: "For Seeking Allah's Help",
    duas: [
      {
        arabic: "رَبِّ انْصُرْنِي عَلَى الْقَوْمِ الْمُفْسِدِينَ",
        english: "My Lord, support me against the corrupting people.",
        urdu: "اے میرے رب! فساد کرنے والی قوم کے خلاف میری مدد فرما۔",
        romanUrdu: "Aye mere Rab! Fasaad karne wali qaum ke khilaaf meri madad farma.",
        reference: "Quran 29:30"
      }
    ]
  },
  {
    id: "seeking-satisfaction",
    name: "Seek Allah's Satisfaction",
    duas: [
      {
        arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ",
        english: "My Lord, enable me to be grateful for Your favour which You have bestowed upon me.",
        urdu: "اے میرے رب! مجھے توفیق دے کہ میں تیری اس نعمت کا شکر ادا کروں جو تو نے مجھے عطا فرمائی۔",
        romanUrdu: "Aye mere Rab! Mujhe taufeeq de ke mein teri us nemat ka shukar ada karoon jo tu ne mujhe ata farmai.",
        reference: "Quran 27:19"
      }
    ]
  },
  {
    id: "leaving-hands-allah",
    name: "For Leaving Everything in Allah's Hands",
    duas: [
      {
        arabic: "وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ",
        english: "And I entrust my affair to Allah. Indeed, Allah is Seeing of His servants.",
        urdu: "اور میں اپنا معاملہ اللہ کے سپرد کرتا ہوں۔ بے شک اللہ بندوں کو دیکھنے والا ہے۔",
        romanUrdu: "Aur mein apna maamla Allah ke supurd karta hoon. Be-shak Allah bandon ko dekhne wala hai.",
        reference: "Quran 40:44"
      }
    ]
  },
  {
    id: "trust-allah",
    name: "To Trust Upon Allah",
    duas: [
      {
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        english: "Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
        urdu: "اللہ مجھے کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر میں نے بھروسہ کیا اور وہ عرش عظیم کا رب ہے۔",
        romanUrdu: "Allah mujhe kaafi hai, us ke siwa koi mabood nahi, usi par mein ne bharosa kiya aur woh arsh azeem ka Rab hai.",
        reference: "Quran 9:129"
      }
    ]
  },
  // ===== VIRTUES =====
  {
    id: "patience",
    name: "For Patience",
    duas: [
      {
        arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        english: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
        urdu: "اے ہمارے رب! ہم پر صبر نازل فرما، ہمارے قدم جما دے اور ہمیں کافر قوم پر غلبہ عطا فرما۔",
        romanUrdu: "Aye hamare Rab! Hum par sabr naazil farma, hamare qadam jama de aur hamein kaafir qaum par ghalba ata farma.",
        reference: "Quran 2:250"
      }
    ]
  },
  {
    id: "praising-allah",
    name: "For Praising Allah",
    duas: [
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
        english: "Glory be to Allah and His is the praise. Glory be to Allah, the Greatest.",
        urdu: "اللہ پاک ہے اور اس کی تعریف ہے۔ اللہ پاک ہے سب سے عظیم۔",
        romanUrdu: "Allah paak hai aur us ki tareef hai. Allah paak hai sab se azeem.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "grateful-allah",
    name: "For Being Grateful to Allah",
    duas: [
      {
        arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
        english: "My Lord, enable me to be grateful for Your favour bestowed upon me and upon my parents and to do righteousness of which You approve. And admit me by Your mercy into Your righteous servants.",
        urdu: "اے میرے رب! مجھے توفیق دے کہ تیری اس نعمت کا شکر ادا کروں جو تو نے مجھ پر اور میرے والدین پر کی ہے اور یہ کہ نیک عمل کروں جو تجھے پسند ہوں اور مجھے اپنی رحمت سے اپنے نیک بندوں میں داخل فرما۔",
        romanUrdu: "Aye mere Rab! Mujhe taufeeq de ke teri us nemat ka shukar ada karoon jo tu ne mujh par aur mere walidain par ki hai aur yeh ke nek amal karoon jo tujhe pasand hon aur mujhe apni rehmat se apne nek bandon mein daakhil farma.",
        reference: "Quran 27:19"
      }
    ]
  },
  {
    id: "thanking-allah",
    name: "For Thanking Allah (SWT)",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        english: "All praise is due to Allah, Lord of the worlds.",
        urdu: "تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔",
        romanUrdu: "Tamam tareefein Allah ke liye hain jo tamam jahanon ka Rab hai.",
        reference: "Quran 1:2"
      }
    ]
  },
  {
    id: "increase-knowledge",
    name: "Increase in Knowledge",
    duas: [
      {
        arabic: "رَبِّ زِدْنِي عِلْمًا",
        english: "My Lord, increase me in knowledge.",
        urdu: "اے میرے رب! میرا علم بڑھا دے۔",
        romanUrdu: "Aye mere Rab! Mera ilm barha de.",
        reference: "Quran 20:114"
      }
    ]
  },
  {
    id: "confidence-eloquence",
    name: "Grant Me Confidence and Eloquence",
    duas: [
      {
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي يَفْقَهُوا قَوْلِي",
        english: "My Lord, expand for me my chest, ease for me my task, and untie the knot from my tongue that they may understand my speech.",
        urdu: "اے میرے رب! میرا سینہ کھول دے، میرا کام آسان فرما دے اور میری زبان کی گرہ کھول دے تاکہ لوگ میری بات سمجھ سکیں۔",
        romanUrdu: "Aye mere Rab! Mera seena khol de, mera kaam aasaan farma de aur meri zuban ki girah khol de taake log meri baat samajh sakein.",
        reference: "Quran 20:25-28"
      }
    ]
  },
  {
    id: "strengthen-imaan",
    name: "Strengthen Your Imaan",
    duas: [
      {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
        english: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
        urdu: "اے ہمارے رب! ہمارے دلوں کو ٹیڑھا نہ کر اس کے بعد کہ تو نے ہمیں ہدایت دی اور ہمیں اپنے پاس سے رحمت عطا فرما۔ بے شک تو بہت عطا کرنے والا ہے۔",
        romanUrdu: "Aye hamare Rab! Hamare dilon ko terha na kar is ke baad ke tu ne hamein hidayat di aur hamein apne paas se rehmat ata farma. Be-shak tu bohat ata karne wala hai.",
        reference: "Quran 3:8"
      }
    ]
  },
  {
    id: "overcoming-weaknesses",
    name: "For Overcoming Your Weaknesses",
    duas: [
      {
        arabic: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        english: "Our Lord, burden us not with that which we have no ability to bear. Pardon us, forgive us, and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
        urdu: "اے ہمارے رب! ہم پر وہ بوجھ نہ ڈال جو اٹھانے کی ہم میں طاقت نہ ہو۔ ہمیں معاف کر دے، ہمیں بخش دے اور ہم پر رحم فرما۔ تو ہمارا مولا ہے پس کافروں کے خلاف ہماری مدد فرما۔",
        romanUrdu: "Aye hamare Rab! Hum par woh bojh na daal jo uthaane ki hum mein taaqat na ho. Hamein maaf kar de, hamein bakhsh de aur hum par reham farma. Tu hamara maula hai pas kafiron ke khilaaf hamari madad farma.",
        reference: "Quran 2:286"
      }
    ]
  },
  {
    id: "pious-muslim",
    name: "To Be a Pious Muslim",
    duas: [
      {
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        english: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.",
        urdu: "اے میرے رب! مجھے نماز قائم کرنے والا بنا اور میری اولاد کو بھی۔ اے ہمارے رب! میری دعا قبول فرما۔",
        romanUrdu: "Aye mere Rab! Mujhe namaaz qaim karne wala bana aur meri aulaad ko bhi. Aye hamare Rab! Meri dua qabool farma.",
        reference: "Quran 14:40"
      }
    ]
  },
  {
    id: "practising-muslims",
    name: "To Make Us Practising Muslims",
    duas: [
      {
        arabic: "رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِنْ ذُرِّيَّتِنَا أُمَّةً مُسْلِمَةً لَكَ",
        english: "Our Lord, and make us Muslims in submission to You and from our descendants a Muslim nation in submission to You.",
        urdu: "اے ہمارے رب! ہم دونوں کو اپنا فرمانبردار بنا اور ہماری نسل سے ایک امت بنا جو تیری فرمانبردار ہو۔",
        romanUrdu: "Aye hamare Rab! Hum donon ko apna farmabardaar bana aur hamari nasl se ek ummat bana jo teri farmabardaar ho.",
        reference: "Quran 2:128"
      }
    ]
  },
  {
    id: "offer-salah",
    name: "Offer Salah Regularly",
    duas: [
      {
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        english: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.",
        urdu: "اے میرے رب! مجھے نمازی بنا دے اور میری اولاد کو بھی۔ اے ہمارے رب! میری دعا قبول فرما لے۔",
        romanUrdu: "Aye mere Rab! Mujhe namazi bana de aur meri aulaad ko bhi. Aye hamare Rab! Meri dua qabool farma le.",
        reference: "Quran 14:40"
      }
    ]
  },
  {
    id: "righteous-company",
    name: "For Righteous Company",
    duas: [
      {
        arabic: "رَبِّ أَلْحِقْنِي بِالصَّالِحِينَ",
        english: "My Lord, join me with the righteous.",
        urdu: "اے میرے رب! مجھے نیکوں کے ساتھ ملا دے۔",
        romanUrdu: "Aye mere Rab! Mujhe nekon ke saath mila de.",
        reference: "Quran 26:83"
      }
    ]
  },
  // ===== SUSTENANCE & SUCCESS =====
  {
    id: "rizq",
    name: "For Rizq (Sustenance)",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
        english: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
        urdu: "اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق اور مقبول عمل مانگتا ہوں۔",
        romanUrdu: "Aye Allah! Mein tujh se nafa bakhsh ilm, paakiza rizq aur maqbool amal maangta hoon.",
        reference: "Ibn Majah"
      }
    ]
  },
  {
    id: "success",
    name: "For Success",
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        romanUrdu: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhalai de aur hamein aag ke azaab se bacha.",
        reference: "Quran 2:201"
      }
    ]
  },
  {
    id: "accommodation",
    name: "For Accommodation",
    duas: [
      {
        arabic: "رَبِّ أَنْزِلْنِي مُنْزَلًا مُبَارَكًا وَأَنْتَ خَيْرُ الْمُنْزِلِينَ",
        english: "My Lord, let me land at a blessed landing place, and You are the best to accommodate.",
        urdu: "اے میرے رب! مجھے بابرکت جگہ اتار اور تو بہترین جگہ دینے والا ہے۔",
        romanUrdu: "Aye mere Rab! Mujhe ba-barkat jagah utaar aur tu behtareen jagah dene wala hai.",
        reference: "Quran 23:29"
      }
    ]
  },
  {
    id: "settle-debt",
    name: "Settle a Debt",
    duas: [
      {
        arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        english: "O Allah, suffice me with what is lawful against what is unlawful and make me independent of all besides You.",
        urdu: "اے اللہ! اپنے حلال سے مجھے اپنے حرام سے بچا دے اور اپنے فضل سے مجھے اپنے سوا سب سے بے نیاز کر دے۔",
        romanUrdu: "Aye Allah! Apne halal se mujhe apne haraam se bacha de aur apne fazal se mujhe apne siwa sab se be-niyaz kar de.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "healthy-life",
    name: "For a Healthy Life",
    duas: [
      {
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لَا إِلَهَ إِلَّا أَنْتَ",
        english: "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. There is no deity except You.",
        urdu: "اے اللہ! میرے جسم کو عافیت دے۔ اے اللہ! میرے کانوں کو عافیت دے۔ اے اللہ! میری آنکھوں کو عافیت دے۔ تیرے سوا کوئی معبود نہیں۔",
        romanUrdu: "Aye Allah! Mere jism ko aafiyat de. Aye Allah! Mere kaanon ko aafiyat de. Aye Allah! Meri aankhon ko aafiyat de. Tere siwa koi mabood nahi.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "justice",
    name: "For Justice",
    duas: [
      {
        arabic: "رَبِّ احْكُمْ بِالْحَقِّ",
        english: "My Lord, judge between us in truth.",
        urdu: "اے میرے رب! حق کے ساتھ فیصلہ فرما۔",
        romanUrdu: "Aye mere Rab! Haq ke saath faisla farma.",
        reference: "Quran 21:112"
      }
    ]
  },
  {
    id: "jannah",
    name: "For Jannah",
    duas: [
      {
        arabic: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! بے شک ہم ایمان لائے پس ہمارے گناہ بخش دے اور ہمیں آگ کے عذاب سے بچا لے۔",
        romanUrdu: "Aye hamare Rab! Be-shak hum imaan laye pas hamare gunaah bakhsh de aur hamein aag ke azaab se bacha le.",
        reference: "Quran 3:16"
      }
    ]
  },
  {
    id: "world-aakhira",
    name: "For This World and the Aakhira",
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        romanUrdu: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhalai de aur hamein aag ke azaab se bacha.",
        reference: "Quran 2:201"
      }
    ]
  },
  {
    id: "forgiveness-protection-hell",
    name: "Seek Forgiveness and Protection from Hell",
    duas: [
      {
        arabic: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ",
        english: "Our Lord, indeed we have heard a caller calling to faith, saying 'Believe in your Lord,' and we have believed. Our Lord, forgive us our sins and remove from us our misdeeds and cause us to die with the righteous.",
        urdu: "اے ہمارے رب! ہم نے ایک پکارنے والے کو سنا جو ایمان کی طرف بلاتا تھا کہ اپنے رب پر ایمان لاؤ تو ہم ایمان لے آئے۔ اے ہمارے رب! ہمارے گناہ بخش دے اور ہماری برائیاں دور کر دے اور ہمیں نیکوں کے ساتھ موت دے۔",
        romanUrdu: "Aye hamare Rab! Hum ne ek pukaarne wale ko suna jo imaan ki taraf bulaata tha ke apne Rab par imaan lao to hum imaan le aaye. Aye hamare Rab! Hamare gunaah bakhsh de aur hamari buraaiyan door kar de aur hamein nekon ke saath maut de.",
        reference: "Quran 3:193"
      }
    ]
  },
  // ===== TRAVEL =====
  {
    id: "travel",
    name: "For Travel",
    duas: [
      {
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        english: "Glory to Him who has subjected this to us, and we could never have it by our efforts. And to our Lord is our return.",
        urdu: "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کر دیا اور ہم اسے قابو میں نہیں لا سکتے تھے اور بے شک ہمیں اپنے رب کی طرف لوٹنا ہے۔",
        romanUrdu: "Paak hai woh zaat jis ne ise hamare liye musakhkhar kar diya aur hum ise qaabu mein nahi la sakte the aur be-shak hamein apne Rab ki taraf lotna hai.",
        reference: "Quran 43:13-14"
      }
    ]
  },
  {
    id: "returning-travel",
    name: "When Returning from Travel",
    duas: [
      {
        arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
        english: "We return, repenting, worshipping, and praising our Lord.",
        urdu: "ہم واپس آنے والے ہیں، توبہ کرنے والے، عبادت کرنے والے، اپنے رب کی تعریف کرنے والے۔",
        romanUrdu: "Hum waapas aane wale hain, taubah karne wale, ibaadat karne wale, apne Rab ki tareef karne wale.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "returning-long-journey",
    name: "When Returning from a Long Journey",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ آيِبُونَ تَائِبُونَ عَابِدُونَ سَاجِدُونَ لِرَبِّنَا حَامِدُونَ",
        english: "None has the right to be worshipped but Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent. We return, repenting, worshipping, prostrating, and praising our Lord.",
        urdu: "اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں بادشاہی اسی کی ہے اور تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔ واپس آنے والے، توبہ کرنے والے، عبادت کرنے والے، سجدہ کرنے والے، اپنے رب کی تعریف کرنے والے۔",
        romanUrdu: "Allah ke siwa koi mabood nahi woh akela hai us ka koi shareek nahi baadshahi usi ki hai aur tareef usi ki hai aur woh har cheez par qaadir hai. Waapas aane wale, taubah karne wale, ibaadat karne wale, sajda karne wale, apne Rab ki tareef karne wale.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  // ===== WEATHER =====
  {
    id: "after-rainfall",
    name: "After Rainfall",
    duas: [
      {
        arabic: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
        english: "We have been given rain by the grace and mercy of Allah.",
        urdu: "اللہ کے فضل اور رحمت سے ہم پر بارش ہوئی۔",
        romanUrdu: "Allah ke fazal aur rehmat se hum par baarish hui.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "for-rain",
    name: "For Rain",
    duas: [
      {
        arabic: "اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا نَافِعًا غَيْرَ ضَارٍّ عَاجِلًا غَيْرَ آجِلٍ",
        english: "O Allah, provide us with rain that is abundant, refreshing, beneficial, not harmful, soon and not delayed.",
        urdu: "اے اللہ! ہمیں بارش دے جو مددگار ہو، خوشگوار ہو، فائدہ مند ہو، نقصان دہ نہ ہو، جلد آئے اور دیر نہ لگے۔",
        romanUrdu: "Aye Allah! Hamein baarish de jo madadgaar ho, khushgawaar ho, faida mand ho, nuqsaan deh na ho, jald aaye aur der na lage.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "during-windstorm",
    name: "During a Windstorm",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَأَعُوذُ بِكَ مِنْ شَرِّهَا",
        english: "O Allah, I ask You for its goodness and seek refuge in You from its evil.",
        urdu: "اے اللہ! میں تجھ سے اس کی بھلائی مانگتا ہوں اور اس کے شر سے تیری پناہ چاہتا ہوں۔",
        romanUrdu: "Aye Allah! Mein tujh se is ki bhalai maangta hoon aur is ke shar se teri panah chaahta hoon.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "hearing-thunder",
    name: "Upon Hearing Thunder",
    duas: [
      {
        arabic: "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",
        english: "Glory be to Him Whom thunder glorifies with His praise and the angels glorify Him in awe of Him.",
        urdu: "پاک ہے وہ ذات جس کی تسبیح بادل گرج کر اس کی حمد کے ساتھ بیان کرتے ہیں اور فرشتے اس کے خوف سے تسبیح کرتے ہیں۔",
        romanUrdu: "Paak hai woh zaat jis ki tasbeeh baadal garaj kar us ki hamd ke saath bayaan karte hain aur farishte us ke khauf se tasbeeh karte hain.",
        reference: "Al-Muwatta"
      }
    ]
  },
  {
    id: "crescent-moon",
    name: "Upon Sighting of the Crescent Moon",
    duas: [
      {
        arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ",
        english: "O Allah, let this moon appear on us with security, faith, safety, and Islam. My Lord and your Lord is Allah.",
        urdu: "اے اللہ! اس چاند کو ہم پر امن، ایمان، سلامتی اور اسلام کے ساتھ طلوع فرما۔ میرا اور تیرا رب اللہ ہے۔",
        romanUrdu: "Aye Allah! Is chaand ko hum par amn, imaan, salaamti aur Islam ke saath tulu farma. Mera aur tera Rab Allah hai.",
        reference: "Tirmidhi"
      }
    ]
  },
  // ===== SICKNESS & DEATH =====
  {
    id: "alleviate-pain",
    name: "To Alleviate Pain",
    duas: [
      {
        arabic: "أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا",
        english: "Remove the harm, O Lord of mankind. Cure, for You are the Healer. There is no cure except Your cure – a cure that leaves no illness.",
        urdu: "تکلیف دور کر اے لوگوں کے رب! شفا دے، تو ہی شفا دینے والا ہے۔ تیری شفا کے سوا کوئی شفا نہیں – ایسی شفا جو بیماری نہ چھوڑے۔",
        romanUrdu: "Takleef door kar aye logon ke Rab! Shifa de, tu hi shifa dene wala hai. Teri shifa ke siwa koi shifa nahi – aisi shifa jo bimaari na chhodey.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "visiting-sick",
    name: "When Visiting the Sick",
    duas: [
      {
        arabic: "لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ",
        english: "No worry, it is a purification, if Allah wills.",
        urdu: "کوئی فکر نہیں، یہ پاکیزگی ہے ان شاء اللہ۔",
        romanUrdu: "Koi fikr nahi, yeh paakizgi hai InshaAllah.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "seeing-someone-trial",
    name: "Upon Seeing Someone Going Through a Trial",
    duas: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا",
        english: "All praise is for Allah Who saved me from that which He tested you with and who greatly favoured me over much of His creation.",
        urdu: "تمام تعریف اللہ کے لیے ہے جس نے مجھے اس سے بچایا جس میں تجھے مبتلا کیا اور مجھے اپنی بہت سی مخلوق پر فضیلت دی۔",
        romanUrdu: "Tamam tareef Allah ke liye hai jis ne mujhe us se bachaya jis mein tujhe mubtala kiya aur mujhe apni bohat si makhlooq par fazeelat di.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "last-moments-life",
    name: "In the Last Moments of One's Life",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
        english: "There is no deity except Allah.",
        urdu: "اللہ کے سوا کوئی معبود نہیں۔",
        romanUrdu: "Allah ke siwa koi mabood nahi.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "nearing-death",
    name: "When You Are Nearing Your Death",
    duas: [
      {
        arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَأَلْحِقْنِي بِالرَّفِيقِ الْأَعْلَى",
        english: "O Allah, forgive me, have mercy upon me, and join me with the highest companion.",
        urdu: "اے اللہ! مجھے بخش دے، مجھ پر رحم فرما اور مجھے بلند ترین رفیق سے ملا دے۔",
        romanUrdu: "Aye Allah! Mujhe bakhsh de, mujh par reham farma aur mujhe buland tareen rafeeq se mila de.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "for-deceased",
    name: "For the Deceased",
    duas: [
      {
        arabic: "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ",
        english: "O Allah, forgive him, have mercy on him, give him health and pardon him.",
        urdu: "اے اللہ! اسے بخش دے، اس پر رحم فرما، اسے عافیت دے اور اسے معاف کر دے۔",
        romanUrdu: "Aye Allah! Ise bakhsh de, is par reham farma, ise aafiyat de aur ise maaf kar de.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "funeral-prayer",
    name: "For the Deceased at the Funeral Prayer",
    duas: [
      {
        arabic: "اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا وَشَاهِدِنَا وَغَائِبِنَا وَصَغِيرِنَا وَكَبِيرِنَا وَذَكَرِنَا وَأُنْثَانَا",
        english: "O Allah, forgive our living and our dead, our present and our absent, our young and our old, our males and our females.",
        urdu: "اے اللہ! ہمارے زندوں اور مردوں کو بخش دے، ہمارے حاضر اور غائب کو، ہمارے چھوٹے اور بڑے کو، ہمارے مردوں اور عورتوں کو بخش دے۔",
        romanUrdu: "Aye Allah! Hamare zindon aur murdon ko bakhsh de, hamare haazir aur ghaaib ko, hamare chhote aur bare ko, hamare mardon aur aurton ko bakhsh de.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "placing-deceased-grave",
    name: "When Placing the Deceased in the Grave",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ وَعَلَى سُنَّةِ رَسُولِ اللَّهِ",
        english: "In the name of Allah and upon the Sunnah of the Messenger of Allah.",
        urdu: "اللہ کے نام سے اور رسول اللہ کی سنت پر۔",
        romanUrdu: "Allah ke naam se aur Rasool Allah ki sunnat par.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "visiting-graves",
    name: "When Visiting the Graves",
    duas: [
      {
        arabic: "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَاحِقُونَ أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ",
        english: "Peace be upon you, people of this abode, from among the believers and Muslims. Indeed, if Allah wills, we shall join you. I ask Allah for well-being for us and for you.",
        urdu: "تم پر سلام ہو اے اس جگہ کے رہنے والے مومنوں اور مسلمانوں! بے شک اگر اللہ نے چاہا تو ہم بھی تمہارے پاس آنے والے ہیں۔ میں اللہ سے ہمارے اور تمہارے لیے عافیت مانگتا ہوں۔",
        romanUrdu: "Tum par salaam ho aye is jagah ke rehne wale mominon aur Musalmano! Be-shak agar Allah ne chaaha to hum bhi tumhare paas aane wale hain. Mein Allah se hamare aur tumhare liye aafiyat maangta hoon.",
        reference: "Sahih Muslim"
      }
    ]
  },
  // ===== HEARING ADHAN =====
  {
    id: "hearing-adhan",
    name: "On Hearing Athan",
    duas: [
      {
        arabic: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
        english: "O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favour, and raise him to the honoured station You have promised him.",
        urdu: "اے اللہ! اس مکمل دعوت اور قائم ہونے والی نماز کے رب! محمد کو وسیلہ اور فضیلت عطا فرما اور انہیں اس مقام محمود پر فائز فرما جس کا تو نے ان سے وعدہ کیا ہے۔",
        romanUrdu: "Aye Allah! Is mukammal dawat aur qaim hone wali namaaz ke Rab! Muhammad ko waseela aur fazeelat ata farma aur inhein us maqaam mahmood par faaiz farma jis ka tu ne un se wada kiya hai.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  // ===== MORNING & EVENING =====
  {
    id: "morning-remembrance",
    name: "Morning Remembrance",
    duas: [
      {
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        english: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah alone, without partner. His is the dominion, His is the praise, and He is over all things competent.",
        urdu: "ہم نے صبح کی اور سارا ملک اللہ کا ہو گیا اور تمام تعریف اللہ کے لیے ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے، تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔",
        romanUrdu: "Hum ne subah ki aur saara mulk Allah ka ho gaya aur tamam tareef Allah ke liye hai. Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, baadshahi usi ki hai, tareef usi ki hai aur woh har cheez par qaadir hai.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "evening-remembrance",
    name: "Evening Remembrance",
    duas: [
      {
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        english: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah alone, without partner. His is the dominion, His is the praise, and He is over all things competent.",
        urdu: "ہم نے شام کی اور سارا ملک اللہ کا ہو گیا اور تمام تعریف اللہ کے لیے ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے، تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔",
        romanUrdu: "Hum ne shaam ki aur saara mulk Allah ka ho gaya aur tamam tareef Allah ke liye hai. Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, baadshahi usi ki hai, tareef usi ki hai aur woh har cheez par qaadir hai.",
        reference: "Sahih Muslim"
      }
    ]
  },
  // ===== EVERYDAY =====
  {
    id: "everyday-duas",
    name: "Everyday Duas",
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        romanUrdu: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhalai de aur hamein aag ke azaab se bacha.",
        reference: "Quran 2:201"
      },
      {
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        english: "In the name of Allah with Whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
        urdu: "اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں دے سکتی اور وہ سب کچھ سننے والا جاننے والا ہے۔",
        romanUrdu: "Allah ke naam se jis ke naam ke saath zameen o aasmaan mein koi cheez nuqsaan nahi de sakti aur woh sab kuch sunne wala jaanne wala hai.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  // ===== HAJJ =====
  {
    id: "talbiyah",
    name: "Talbiyah",
    duas: [
      {
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لَا شَرِيكَ لَكَ",
        english: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise and blessings are Yours, and all sovereignty. You have no partner.",
        urdu: "حاضر ہوں اے اللہ حاضر ہوں۔ حاضر ہوں تیرا کوئی شریک نہیں حاضر ہوں۔ بے شک تمام تعریف اور نعمت تیری ہے اور بادشاہی۔ تیرا کوئی شریک نہیں۔",
        romanUrdu: "Haazir hoon aye Allah haazir hoon. Haazir hoon tera koi shareek nahi haazir hoon. Be-shak tamam tareef aur nemat teri hai aur baadshahi. Tera koi shareek nahi.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  {
    id: "at-arafat",
    name: "At Arafat",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        english: "There is no deity except Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent.",
        urdu: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہی اسی کی ہے اور تعریف اسی کی ہے اور وہ ہر چیز پر قادر ہے۔",
        romanUrdu: "Allah ke siwa koi mabood nahi, woh akela hai, us ka koi shareek nahi, baadshahi usi ki hai aur tareef usi ki hai aur woh har cheez par qaadir hai.",
        reference: "Tirmidhi"
      }
    ]
  },
  {
    id: "mashar-al-haram",
    name: "For Reciting at Al-Mash'ar Al-Haraam",
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        romanUrdu: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhalai de aur hamein aag ke azaab se bacha.",
        reference: "Quran 2:201"
      }
    ]
  },
  {
    id: "takbeer-black-stone",
    name: "Takbeer When Passing the Black Stone",
    duas: [
      {
        arabic: "اللَّهُ أَكْبَرُ",
        english: "Allah is the Greatest.",
        urdu: "اللہ سب سے بڑا ہے۔",
        romanUrdu: "Allah sab se bara hai.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  {
    id: "yemeni-corner",
    name: "Upon Reaching the Yemeni Corner During Tawaf",
    duas: [
      {
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        english: "Our Lord, give us in this world that which is good and in the Hereafter that which is good and protect us from the punishment of the Fire.",
        urdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
        romanUrdu: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhalai de aur hamein aag ke azaab se bacha.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "safa-marwah",
    name: "When at Mount Safa and Mount Marwah",
    duas: [
      {
        arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ",
        english: "Indeed, Safa and Marwah are among the symbols of Allah.",
        urdu: "بے شک صفا اور مروہ اللہ کی نشانیوں میں سے ہیں۔",
        romanUrdu: "Be-shak Safa aur Marwah Allah ki nishaaniyon mein se hain.",
        reference: "Quran 2:158"
      }
    ]
  },
  {
    id: "throwing-stones-jamarat",
    name: "When Throwing Stones at Jamaraat",
    duas: [
      {
        arabic: "اللَّهُ أَكْبَرُ",
        english: "Allah is the Greatest.",
        urdu: "اللہ سب سے بڑا ہے۔",
        romanUrdu: "Allah sab se bara hai.",
        reference: "Sahih Muslim"
      }
    ]
  },
  {
    id: "sacrificing-animal",
    name: "When Sacrificing an Animal",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ اللَّهُمَّ مِنْكَ وَلَكَ",
        english: "In the name of Allah, and Allah is the Greatest. O Allah, this is from You and for You.",
        urdu: "اللہ کے نام سے اور اللہ سب سے بڑا ہے۔ اے اللہ! یہ تیری طرف سے ہے اور تیرے لیے ہے۔",
        romanUrdu: "Allah ke naam se aur Allah sab se bara hai. Aye Allah! Yeh teri taraf se hai aur tere liye hai.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "during-hajj",
    name: "During Hajj",
    duas: [
      {
        arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
        english: "Here I am, O Allah, here I am.",
        urdu: "حاضر ہوں اے اللہ حاضر ہوں۔",
        romanUrdu: "Haazir hoon aye Allah haazir hoon.",
        reference: "Sahih Bukhari"
      }
    ]
  },
  // ===== GATHERING =====
  {
    id: "end-gathering",
    name: "At the End of a Gathering/Majlis",
    duas: [
      {
        arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
        english: "How perfect You are O Allah, and I praise You. I bear witness that none has the right to be worshipped except You. I seek Your forgiveness and turn to You in repentance.",
        urdu: "اے اللہ! تو پاک ہے اور تیری تعریف ہے۔ میں گواہی دیتا ہوں کہ تیرے سوا کوئی معبود نہیں۔ میں تجھ سے بخشش مانگتا ہوں اور تیری طرف توبہ کرتا ہوں۔",
        romanUrdu: "Aye Allah! Tu paak hai aur teri tareef hai. Mein gawahi deta hoon ke tere siwa koi mabood nahi. Mein tujh se bakhshish maangta hoon aur teri taraf taubah karta hoon.",
        reference: "Abu Dawud, Tirmidhi"
      }
    ]
  },
  {
    id: "pledge-allah",
    name: "Pledge to Allah",
    duas: [
      {
        arabic: "سَمِعْنَا وَأَطَعْنَا غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ",
        english: "We hear and we obey. Grant us Your forgiveness, our Lord. To You is the final destination.",
        urdu: "ہم نے سنا اور اطاعت کی۔ اے ہمارے رب! تیری بخشش چاہتے ہیں اور تیری ہی طرف لوٹنا ہے۔",
        romanUrdu: "Hum ne suna aur itaa'at ki. Aye hamare Rab! Teri bakhshish chaahte hain aur teri hi taraf lotna hai.",
        reference: "Quran 2:285"
      }
    ]
  },
  {
    id: "in-need",
    name: "When You Are in Need",
    duas: [
      {
        arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
        urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔",
        romanUrdu: "Tere siwa koi mabood nahi, tu paak hai, be-shak mein zaalimon mein se tha.",
        reference: "Quran 21:87"
      }
    ]
  },
  {
    id: "having-relation-wife",
    name: "Having Relation With Wife",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا",
        english: "In the name of Allah. O Allah, keep Satan away from us and keep Satan away from what You bless us with.",
        urdu: "اللہ کے نام سے۔ اے اللہ! ہمیں شیطان سے دور رکھ اور شیطان کو اس سے دور رکھ جو تو ہمیں عطا فرمائے۔",
        romanUrdu: "Allah ke naam se. Aye Allah! Hamein Shaitaan se door rakh aur Shaitaan ko us se door rakh jo tu hamein ata farmaye.",
        reference: "Sahih Bukhari, Muslim"
      }
    ]
  },
  // ===== MANZIL =====
  {
    id: "manzil",
    name: "Manzil",
    duas: [
      {
        arabic: "المنزل هو مجموعة من الآيات القرآنية للحماية - الفاتحة، البقرة ١-٥، البقرة ١٦٣-١٦٤، البقرة ٢٥٥-٢٥٧، البقرة ٢٨٤-٢٨٦، آل عمران ١٨-١٩، الأعراف ٥٤-٥٦، بني إسرائيل ١١٠-١١١، المؤمنون ١١٥-١١٨، الصافات ١-١١، الرحمن ٣٣-٤٠، الحشر ٢١-٢٤، الجن ١-٤، الكافرون، الإخلاص، الفلق، الناس",
        english: "Manzil is a collection of Quranic verses recited for protection. It includes: Al-Fatiha, Al-Baqarah 1-5, 163-164, 255-257, 284-286, Al-Imran 18-19, Al-A'raf 54-56, Al-Isra 110-111, Al-Mu'minun 115-118, As-Saffat 1-11, Ar-Rahman 33-40, Al-Hashr 21-24, Al-Jinn 1-4, Al-Kafirun, Al-Ikhlas, Al-Falaq, An-Nas.",
        urdu: "منزل قرآنی آیات کا مجموعہ ہے جو حفاظت کے لیے پڑھی جاتی ہیں۔ اس میں شامل ہیں: الفاتحہ، البقرہ ۱-۵، ۱۶۳-۱۶۴، ۲۵۵-۲۵۷، ۲۸۴-۲۸۶، آل عمران ۱۸-۱۹، الاعراف ۵۴-۵۶، بنی اسرائیل ۱۱۰-۱۱۱، المؤمنون ۱۱۵-۱۱۸، الصافات ۱-۱۱، الرحمن ۳۳-۴۰، الحشر ۲۱-۲۴، الجن ۱-۴، الکافرون، الاخلاص، الفلق، الناس۔",
        romanUrdu: "Manzil Qurani ayaat ka majmua hai jo hifazat ke liye padhi jaati hain. Is mein shaamil hain: Al-Fatiha, Al-Baqarah 1-5, 163-164, 255-257, 284-286, Aal-Imran 18-19, Al-A'raf 54-56, Bani Isra'il 110-111, Al-Mu'minun 115-118, As-Saffat 1-11, Ar-Rahman 33-40, Al-Hashr 21-24, Al-Jinn 1-4, Al-Kafirun, Al-Ikhlas, Al-Falaq, An-Nas.",
        reference: "Compiled by Maulana Muhammad Zakariyya"
      }
    ]
  },
  // ===== RAMADAN =====
  {
    id: "ramadan-duas",
    name: "Ramadan Duas",
    duas: [
      {
        arabic: "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ",
        english: "O Allah, let this moon appear on us with security, faith, safety, and Islam. My Lord and your Lord is Allah.",
        urdu: "اے اللہ! اس چاند کو ہم پر امن، ایمان، سلامتی اور اسلام کے ساتھ طلوع فرما۔ میرا اور تیرا رب اللہ ہے۔",
        romanUrdu: "Aye Allah! Is chaand ko hum par amn, imaan, salaamti aur Islam ke saath tulu farma. Mera aur tera Rab Allah hai.",
        reference: "Tirmidhi — Moon Sighting Dua"
      },
      {
        arabic: "وَبِصَوْمِ غَدٍ نَوَيْتُ مِنْ شَهْرِ رَمَضَانَ",
        english: "I intend to keep the fast for tomorrow in the month of Ramadan.",
        urdu: "میں نے ماہ رمضان کے کل کے روزے کی نیت کی۔",
        romanUrdu: "Mein ne maah Ramadan ke kal ke roze ki niyyat ki.",
        reference: "Abu Dawud — Sehri Dua"
      },
      {
        arabic: "اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
        english: "O Allah, I fasted for You, I believed in You, I put my trust in You, and I break my fast with Your sustenance.",
        urdu: "اے اللہ! میں نے تیرے لیے روزہ رکھا اور تجھ پر ایمان لایا اور تجھ پر بھروسہ کیا اور تیرے رزق سے افطار کیا۔",
        romanUrdu: "Aye Allah! Mein ne tere liye roza rakha aur tujh par imaan laaya aur tujh par bharosa kiya aur tere rizq se iftaar kiya.",
        reference: "Abu Dawud — Iftar Dua"
      },
      {
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        english: "The thirst has gone, the veins have been moistened, and the reward is confirmed, if Allah wills.",
        urdu: "پیاس بجھ گئی اور رگیں تر ہو گئیں اور اجر ثابت ہو گیا ان شاء اللہ۔",
        romanUrdu: "Pyaas bujh gayi aur ragen tar ho gayin aur ajr saabit ho gaya InshaAllah.",
        reference: "Abu Dawud — Iftar Dua"
      },
      {
        arabic: "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ",
        english: "May the fasting people break their fast in your home. May the pious eat your food and may the angels send blessings upon you.",
        urdu: "روزہ دار تمہارے ہاں افطار کریں، نیک لوگ تمہارا کھانا کھائیں اور فرشتے تم پر رحمت بھیجیں۔",
        romanUrdu: "Rozadaar tumhare haan iftaar karein, nek log tumhara khana khayein aur farishte tum par rehmat bhejein.",
        reference: "Abu Dawud — For Iftar Provider"
      },
      {
        arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ خَيْرُ الرَّاحِمِينَ",
        english: "My Lord, forgive and have mercy, and You are the best of the merciful.",
        urdu: "اے میرے رب! بخش دے اور رحم فرما اور تو سب سے بہتر رحم کرنے والا ہے۔",
        romanUrdu: "Aye mere Rab! Bakhsh de aur reham farma aur tu sab se behtar reham karne wala hai.",
        reference: "Quran 23:118 — 1st Ashra (Mercy)"
      },
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ",
        english: "I seek forgiveness from Allah, my Lord, from every sin and I turn to Him in repentance.",
        urdu: "میں اللہ سے ہر گناہ کی بخشش مانگتا ہوں اور اس کی طرف توبہ کرتا ہوں۔",
        romanUrdu: "Mein Allah se har gunaah ki bakhshish maangta hoon aur us ki taraf taubah karta hoon.",
        reference: "Hadith — 2nd Ashra (Forgiveness)"
      },
      {
        arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
        english: "O Allah, save me from the Fire.",
        urdu: "اے اللہ! مجھے آگ سے بچا لے۔",
        romanUrdu: "Aye Allah! Mujhe aag se bacha le.",
        reference: "Hadith — 3rd Ashra (Protection from Fire)"
      },
      {
        arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
        english: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
        urdu: "اے اللہ! تو معاف کرنے والا ہے، معافی کو پسند کرتا ہے پس مجھے معاف فرما دے۔",
        romanUrdu: "Aye Allah! Tu maaf karne wala hai, maafi ko pasand karta hai pas mujhe maaf farma de.",
        reference: "Tirmidhi — Laylatul Qadr"
      }
    ]
  },
  // ===== MISC =====
  {
    id: "seek-protection-culprits",
    name: "Seek Protection from Culprits",
    duas: [
      {
        arabic: "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
        english: "O Allah, we put You before them and seek refuge in You from their evil.",
        urdu: "اے اللہ! ہم تجھے ان کے سامنے رکھتے ہیں اور ان کے شر سے تیری پناہ مانگتے ہیں۔",
        romanUrdu: "Aye Allah! Hum tujhe un ke saamne rakhte hain aur un ke shar se teri panah maangte hain.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "asking-forgiveness-house",
    name: "For Asking Forgiveness for Yourself and Anyone Who Enters Your House",
    duas: [
      {
        arabic: "رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَنْ دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
        english: "My Lord, forgive me and my parents and whoever enters my house a believer and the believing men and believing women.",
        urdu: "اے میرے رب! مجھے بخش دے اور میرے والدین کو اور جو بھی میرے گھر میں مومن ہو کر داخل ہو اور تمام مومن مردوں اور مومن عورتوں کو بخش دے۔",
        romanUrdu: "Aye mere Rab! Mujhe bakhsh de aur mere walidain ko aur jo bhi mere ghar mein momin ho kar daakhil ho aur tamam momin mardon aur momin aurton ko bakhsh de.",
        reference: "Quran 71:28"
      }
    ]
  }
];
