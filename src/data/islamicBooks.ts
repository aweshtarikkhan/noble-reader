// Islamic Books - Free text content and PDF sources

export interface IslamicBook {
  id: string;
  title: string;
  titleUr: string;
  author: string;
  authorUr: string;
  icon: string;
  type: "text" | "pdf";
  pdfUrl?: string;
  chapters?: BookChapter[];
  description: string;
  descriptionUr: string;
  sizeWarning?: string;
  sizeWarningUr?: string;
}

export interface BookChapter {
  title: string;
  titleUr: string;
  content: string;
  contentUr: string;
}

export const ISLAMIC_BOOKS: IslamicBook[] = [
  {
    id: "hisnul-muslim",
    title: "Hisnul Muslim (Fortress of the Muslim)",
    titleUr: "حصن المسلم",
    author: "Sa'id bin Ali bin Wahf Al-Qahtani",
    authorUr: "سعید بن علی بن وہف القحطانی",
    icon: "🛡️",
    type: "text",
    description: "Essential daily duas and supplications from the Quran and Sunnah",
    descriptionUr: "قرآن و سنت سے روزمرہ کی ضروری دعائیں اور اذکار",
    chapters: [
      {
        title: "Upon Waking Up",
        titleUr: "نیند سے بیدار ہونے کی دعا",
        content: "الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ\n\nAlhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushoor\n\nAll praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.\n\n(Sahih al-Bukhari 6312)",
        contentUr: "الحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ\n\nتمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف اٹھنا ہے۔\n\n(صحیح بخاری 6312)"
      },
      {
        title: "Before Sleeping",
        titleUr: "سونے سے پہلے کی دعا",
        content: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا\n\nBismika Allahumma amootu wa ahya\n\nIn Your name O Allah, I die and I live.\n\n(Sahih al-Bukhari 6314)\n\nAlso recite: Ayatul Kursi (2:255), Surah Al-Ikhlas, Surah Al-Falaq, Surah An-Nas (3 times each).",
        contentUr: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا\n\nاے اللہ تیرے نام سے مرتا ہوں اور جیتا ہوں۔\n\n(صحیح بخاری 6314)\n\nنیز پڑھیں: آیۃ الکرسی (2:255)، سورۃ الاخلاص، سورۃ الفلق، سورۃ الناس (ہر ایک 3 بار)۔"
      },
      {
        title: "Entering the Mosque",
        titleUr: "مسجد میں داخل ہونے کی دعا",
        content: "أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَىٰ رَسُولِ اللَّهِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ\n\nA'udhu billahil-'Adheem, wa bi-Wajhihil-Kareem, wa Sultanihil-qadeem, minash-Shaytanir-rajeem. Bismillah, wassalatu wassalamu 'ala Rasulillah. Allahummaftah li abwaba rahmatik.\n\nI seek refuge in Allah the Almighty, and in His Noble Face, and in His ancient authority, from Satan the outcast. In the name of Allah, and peace and blessings upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.\n\n(Abu Dawud, Ibn Majah)",
        contentUr: "أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nمیں اللہ عظیم کی، اس کے کریم چہرے کی، اور اس کی قدیم سلطنت کی پناہ مانگتا ہوں شیطان مردود سے۔ اللہ کے نام سے، اور درود و سلام ہو رسول اللہ پر۔ اے اللہ میرے لیے اپنی رحمت کے دروازے کھول دے۔\n\n(ابو داؤد، ابن ماجہ)"
      },
      {
        title: "After Eating",
        titleUr: "کھانے کے بعد کی دعا",
        content: "الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ\n\nAlhamdu lillahil-ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minni wa la quwwah\n\nAll praise is for Allah who fed me this and provided it for me without any might or power from myself.\n\n(Abu Dawud 4023, Tirmidhi 3458)",
        contentUr: "الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ\n\nتمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور بغیر میری طاقت اور قوت کے مجھے رزق دیا۔\n\n(ابو داؤد 4023، ترمذی 3458)"
      },
      {
        title: "When Leaving Home",
        titleUr: "گھر سے نکلنے کی دعا",
        content: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\nBismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah\n\nIn the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.\n\n(Abu Dawud 5095)",
        contentUr: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ\n\nاللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور کوئی طاقت اور قوت نہیں سوائے اللہ کے۔\n\n(ابو داؤد 5095)"
      },
      {
        title: "Dua for Traveling",
        titleUr: "سفر کی دعا",
        content: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ\n\nSubhanal-ladhi sakh-khara lana hadha wa ma kunna lahu muqrineen. Wa inna ila Rabbina lamunqaliboon.\n\nGlory unto Him who has subjected this to us, and we could never have it (by our efforts). And verily, to Our Lord we indeed are to return.\n\n(Muslim 1342)",
        contentUr: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ\n\nپاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا حالانکہ ہم اسے قابو میں نہیں لا سکتے تھے۔ اور بے شک ہم اپنے رب کی طرف لوٹنے والے ہیں۔\n\n(مسلم 1342)"
      },
      {
        title: "Dua in Times of Distress",
        titleUr: "پریشانی کے وقت کی دعا",
        content: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ. لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ. لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ\n\nLa ilaha illallahul-'Adheemul-Haleem. La ilaha illallahu Rabbul-'Arshil-'Adheem. La ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Kareem.\n\nNone has the right to be worshipped except Allah, the Mighty, the Forbearing. None has the right to be worshipped except Allah, Lord of the magnificent throne. None has the right to be worshipped except Allah, Lord of the heavens, Lord of the earth, and Lord of the noble throne.\n\n(Sahih al-Bukhari 6345)",
        contentUr: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ\n\nاللہ کے سوا کوئی معبود نہیں جو عظیم اور بردبار ہے۔ اللہ کے سوا کوئی معبود نہیں جو عرش عظیم کا رب ہے۔ اللہ کے سوا کوئی معبود نہیں جو آسمانوں کا رب، زمین کا رب اور عرش کریم کا رب ہے۔\n\n(صحیح بخاری 6345)"
      },
      {
        title: "Morning & Evening Adhkar",
        titleUr: "صبح و شام کے اذکار",
        content: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ\n\nAsbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadeer.\n\nWe have reached the morning and the whole kingdom belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.\n\n(Muslim)",
        contentUr: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ\n\nہم نے صبح کی اور ساری بادشاہت اللہ کی ہے۔ تمام تعریف اللہ کے لیے ہے۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔ اسی کی بادشاہت ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔\n\n(مسلم)"
      }
    ]
  },
  {
    id: "riyad-salihin",
    title: "Riyad as-Salihin",
    titleUr: "ریاض الصالحین",
    author: "Imam An-Nawawi",
    authorUr: "امام نووی",
    icon: "📗",
    type: "pdf",
    pdfUrl: "https://archive.org/download/RiyadUsSaliheen_201802/Riyad%20us%20Saliheen.pdf",
    description: "A compilation of hadith covering virtues and manners of Muslims",
    descriptionUr: "مسلمانوں کے فضائل اور آداب پر احادیث کا مجموعہ"
  },
  {
    id: "tafsir-ibn-kathir",
    title: "Tafsir Ibn Kathir (All 10 Volumes)",
    titleUr: "تفسیر ابن کثیر (تمام 10 جلدیں)",
    author: "Ibn Kathir",
    authorUr: "ابن کثیر",
    icon: "📖",
    type: "pdf",
    pdfUrl: "https://archive.org/download/TafsirIbnKathir_795/TafsirIbnKathirAll10Volumes.pdf",
    description: "Complete Tafsir Ibn Kathir - All 10 volumes compiled. Abridged English translation with Arabic verses.",
    descriptionUr: "مکمل تفسیر ابن کثیر - تمام 10 جلدیں۔ عربی آیات کے ساتھ مختصر انگریزی ترجمہ۔",
    sizeWarning: "⚠️ This is a large file (~33 MB). Downloading will consume significant data and storage on your device.",
    sizeWarningUr: "⚠️ یہ ایک بڑی فائل ہے (~33 MB)۔ ڈاؤن لوڈ کرنے سے آپ کے ڈیوائس پر کافی ڈیٹا اور اسٹوریج خرچ ہوگا۔"
  },
  {
    id: "stories-prophets",
    title: "Stories of the Prophets",
    titleUr: "قصص الانبیاء",
    author: "Ibn Kathir",
    authorUr: "ابن کثیر",
    icon: "📕",
    type: "pdf",
    pdfUrl: "https://archive.org/download/StoriesOfTheProphets_201601/Stories%20of%20the%20Prophets.pdf",
    description: "Detailed accounts of the prophets mentioned in the Quran",
    descriptionUr: "قرآن میں مذکور انبیاء کے تفصیلی واقعات"
  },
  {
    id: "fiqh-sunnah",
    title: "Fiqh us-Sunnah",
    titleUr: "فقہ السنہ",
    author: "As-Sayyid Sabiq",
    authorUr: "السید سابق",
    icon: "📚",
    type: "pdf",
    pdfUrl: "https://archive.org/download/FiqhUsSunnahSayyidSabiq/Fiqh%20us-Sunnah%20-%20Sayyid%20Sabiq.pdf",
    description: "Practical guide to Islamic jurisprudence based on the Sunnah",
    descriptionUr: "سنت کی بنیاد پر اسلامی فقہ کا عملی رہنما"
  }
];
