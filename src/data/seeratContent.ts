// Seerat un Nabi ﷺ - Detailed chapters with Hadith references

export interface SeeratChapter {
  id: string;
  title: string;
  titleUr: string;
  icon: string;
  sections: SeeratSection[];
}

export interface SeeratSection {
  heading: string;
  headingUr: string;
  content: string;
  contentUr: string;
  hadithRef?: string;
  hadithRefUr?: string;
  source?: string;
}

export const SEERAT_CHAPTERS: SeeratChapter[] = [
  {
    id: "birth",
    title: "Birth & Early Life",
    titleUr: "ولادت اور ابتدائی زندگی",
    icon: "🌙",
    sections: [
      {
        heading: "The Year of the Elephant",
        headingUr: "عام الفیل",
        content: "Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (approximately 570 CE). This was the same year when Abraha, the Abyssinian ruler of Yemen, attempted to destroy the Ka'bah with an army of elephants. Allah protected His Sacred House by sending flocks of birds (Ababil) that pelted the army with stones of baked clay, as mentioned in Surah Al-Fil (105).",
        contentUr: "نبی کریم ﷺ مکہ مکرمہ میں عام الفیل (تقریباً 570 عیسوی) میں پیدا ہوئے۔ یہ وہی سال تھا جب ابرہہ نے ہاتھیوں کی فوج لے کر کعبہ کو ڈھانے کی کوشش کی۔ اللہ تعالیٰ نے ابابیلوں کو بھیج کر اپنے مقدس گھر کی حفاظت فرمائی جیسا کہ سورۃ الفیل میں بیان ہے۔",
        hadithRef: "The Prophet ﷺ said: 'I am the supplication of my father Ibrahim, the glad tidings of Isa, and my mother saw a light when she bore me that illuminated the palaces of Syria.' (Musnad Ahmad)",
        hadithRefUr: "نبی کریم ﷺ نے فرمایا: 'میں اپنے باپ ابراہیم کی دعا ہوں، عیسیٰ کی بشارت ہوں، اور میری والدہ نے میری ولادت کے وقت ایک نور دیکھا جس نے شام کے محلات کو روشن کر دیا۔' (مسند احمد)",
        source: "Musnad Ahmad 17163"
      },
      {
        heading: "Lineage & Family",
        headingUr: "نسب اور خاندان",
        content: "His full name was Muhammad ibn Abdullah ibn Abdul Muttalib ibn Hashim. He belonged to the noble tribe of Quraysh, the most honored tribe among the Arabs. His father Abdullah passed away before his birth, and his mother Aminah bint Wahb passed away when he was six years old. He was then cared for by his grandfather Abdul Muttalib, and after his death, by his uncle Abu Talib.",
        contentUr: "آپ ﷺ کا پورا نام محمد بن عبداللہ بن عبدالمطلب بن ہاشم ہے۔ آپ قریش کے معزز قبیلے سے تعلق رکھتے تھے۔ آپ کے والد عبداللہ آپ کی ولادت سے پہلے وفات پا گئے اور والدہ آمنہ بنت وہب نے آپ کی چھ سال کی عمر میں وفات پائی۔ پھر دادا عبدالمطلب نے پرورش کی اور ان کے بعد چچا ابوطالب نے۔",
        hadithRef: "The Prophet ﷺ said: 'Allah chose Kinanah from the children of Isma'il, and chose Quraysh from Kinanah, and chose Banu Hashim from Quraysh, and chose me from Banu Hashim.' (Sahih Muslim 2276)",
        hadithRefUr: "نبی کریم ﷺ نے فرمایا: 'اللہ نے بنی اسماعیل سے کنانہ کو چنا، کنانہ سے قریش کو، قریش سے بنی ہاشم کو، اور بنی ہاشم سے مجھے چنا۔' (صحیح مسلم 2276)",
        source: "Sahih Muslim 2276"
      },
      {
        heading: "Foster Care with Halimah",
        headingUr: "حلیمہ سعدیہ کی گود میں",
        content: "As was the custom among the noble families of Quraysh, the infant Muhammad ﷺ was sent to the desert to be nursed and raised by Halimah bint Abi Dhuayb of the Banu Sa'd tribe. During his time with Halimah, miraculous blessings were witnessed — her previously barren land became fertile, and her weak camel produced abundant milk. The famous incident of the splitting of the chest (Shaq-e-Sadr) also occurred during this period.",
        contentUr: "قریش کے معزز خاندانوں کے رواج کے مطابق، شیر خوار محمد ﷺ کو صحرا میں حلیمہ بنت ابی ذؤیب کے پاس بھیجا گیا جو بنو سعد قبیلے سے تھیں۔ حلیمہ کے پاس قیام کے دوران بے شمار برکات دیکھی گئیں۔ شق صدر کا مشہور واقعہ بھی اسی دور میں پیش آیا۔",
        hadithRef: "Anas ibn Malik reported: The Angel Jibreel came to the Prophet ﷺ while he was playing with other boys. He took hold of him, laid him down, split open his chest, took out the heart, extracted a blood-clot from it and said: 'This was Satan's portion of you.' Then he washed it in a gold basin with Zamzam water, restored the heart, and stitched him up. (Sahih Muslim 162)",
        hadithRefUr: "انس بن مالک رضی اللہ عنہ سے روایت ہے: جبرئیل علیہ السلام نبی ﷺ کے پاس آئے جب آپ بچوں کے ساتھ کھیل رہے تھے۔ انہوں نے آپ کا سینہ چیرا، دل نکالا، اس سے خون کا لوتھڑا نکالا اور فرمایا: 'یہ شیطان کا حصہ تھا۔' پھر زمزم سے دھویا اور واپس رکھ دیا۔ (صحیح مسلم 162)",
        source: "Sahih Muslim 162"
      }
    ]
  },
  {
    id: "prophethood",
    title: "Prophethood & Revelation",
    titleUr: "نبوت اور وحی",
    icon: "📜",
    sections: [
      {
        heading: "Life Before Prophethood",
        headingUr: "نبوت سے پہلے کی زندگی",
        content: "Before prophethood, Muhammad ﷺ was known as 'Al-Amin' (The Trustworthy) and 'As-Sadiq' (The Truthful) among the people of Makkah. He worked as a shepherd in his youth and later became a successful merchant. At the age of 25, he married Khadijah bint Khuwaylid, a noble and wealthy businesswoman who was 40 years old. She was his first wife and greatest supporter.",
        contentUr: "نبوت سے پہلے، محمد ﷺ مکہ کے لوگوں میں 'الامین' اور 'الصادق' کے لقب سے مشہور تھے۔ آپ نے جوانی میں بکریاں چرائیں اور بعد میں کامیاب تاجر بنے۔ 25 سال کی عمر میں آپ نے خدیجہ بنت خویلد سے شادی کی جو 40 سال کی معزز اور دولتمند تاجر خاتون تھیں۔",
        hadithRef: "The Prophet ﷺ said: 'Every Prophet was a shepherd.' The Companions asked: 'Even you, O Messenger of Allah?' He said: 'Yes, I used to tend sheep for the people of Makkah for a few Qirats.' (Sahih al-Bukhari 2262)",
        hadithRefUr: "نبی کریم ﷺ نے فرمایا: 'ہر نبی نے بکریاں چرائی ہیں۔' صحابہ نے پوچھا: 'آپ نے بھی؟' فرمایا: 'ہاں، میں اہل مکہ کی بکریاں چند قیراطوں پر چرایا کرتا تھا۔' (صحیح بخاری 2262)",
        source: "Sahih al-Bukhari 2262"
      },
      {
        heading: "The First Revelation",
        headingUr: "پہلی وحی",
        content: "At the age of 40, while in solitary meditation in the Cave of Hira on Jabal al-Noor (Mountain of Light), the Angel Jibreel appeared to Muhammad ﷺ and commanded him to 'Read!' (Iqra). This was the beginning of the revelation of the Quran. The first five verses of Surah Al-Alaq (96:1-5) were revealed: 'Read in the name of your Lord who created, created man from a clinging substance. Read, and your Lord is the most Generous, Who taught by the pen, taught man that which he knew not.'",
        contentUr: "40 سال کی عمر میں، غار حرا میں عبادت کے دوران، فرشتہ جبرئیل علیہ السلام ظاہر ہوئے اور آپ ﷺ کو حکم دیا 'اقرأ' (پڑھو)۔ یہ قرآن کی وحی کا آغاز تھا۔ سورۃ العلق کی پہلی پانچ آیات نازل ہوئیں: 'پڑھو اپنے رب کے نام سے جس نے پیدا کیا، انسان کو جمے ہوئے خون سے بنایا۔ پڑھو اور تمہارا رب بڑا کریم ہے، جس نے قلم سے سکھایا، انسان کو وہ سکھایا جو وہ نہیں جانتا تھا۔'",
        hadithRef: "Aisha reported: The commencement of the Divine Inspiration to the Messenger of Allah ﷺ was in the form of good righteous (true) dreams. He never had a dream but that it came true like bright daylight. Then the love of seclusion was bestowed upon him. He used to go to the Cave of Hira and worship there. (Sahih al-Bukhari 3)",
        hadithRefUr: "عائشہ رضی اللہ عنہا سے روایت ہے: رسول اللہ ﷺ پر وحی کی ابتدا سچے خوابوں سے ہوئی۔ آپ جو خواب دیکھتے وہ صبح کی روشنی کی طرح سچا ہوتا۔ پھر آپ کو خلوت پسند ہو گئی۔ آپ غار حرا میں جاتے اور عبادت کرتے۔ (صحیح بخاری 3)",
        source: "Sahih al-Bukhari 3"
      },
      {
        heading: "Early Believers",
        headingUr: "ابتدائی مسلمان",
        content: "The first person to accept Islam was Khadijah (may Allah be pleased with her), followed by Ali ibn Abi Talib (who was a young boy at the time), Zaid ibn Harithah (the freed slave of the Prophet), and Abu Bakr as-Siddiq. Abu Bakr then brought several prominent companions to Islam including Uthman ibn Affan, Zubayr ibn al-Awwam, Abdur-Rahman ibn Awf, Sa'd ibn Abi Waqqas, and Talhah ibn Ubaydillah.",
        contentUr: "سب سے پہلے اسلام قبول کرنے والی خدیجہ رضی اللہ عنہا تھیں، پھر علی بن ابی طالب (جو اس وقت بچے تھے)، زید بن حارثہ (آپ کے آزاد کردہ غلام)، اور ابوبکر صدیق۔ ابوبکر نے پھر کئی ممتاز صحابہ کو اسلام کی دعوت دی جن میں عثمان بن عفان، زبیر بن العوام، عبدالرحمٰن بن عوف، سعد بن ابی وقاص، اور طلحہ بن عبیداللہ شامل تھے۔",
        hadithRef: "Abu Bakr brought Uthman, Zubayr, Abdur-Rahman, Sa'd and Talhah to the Prophet ﷺ, and they all accepted Islam and testified. These were the Sabiqun al-Awwalun (the First Forerunners). (Ibn Ishaq's Sirah)",
        hadithRefUr: "ابوبکر رضی اللہ عنہ نے عثمان، زبیر، عبدالرحمٰن، سعد اور طلحہ کو نبی ﷺ کے پاس لائے اور سب نے اسلام قبول کیا۔ یہ سابقون الاولون تھے۔ (سیرت ابن اسحاق)",
        source: "Ibn Ishaq's Sirah"
      }
    ]
  },
  {
    id: "persecution",
    title: "Persecution in Makkah",
    titleUr: "مکہ میں ایذا رسانی",
    icon: "⚔️",
    sections: [
      {
        heading: "Quraysh Opposition",
        headingUr: "قریش کی مخالفت",
        content: "As the message of Islam spread, the leaders of Quraysh became increasingly hostile. Abu Lahab and his wife Umm Jamil were among the fiercest opponents. Abu Jahl would physically harm Muslims and organize boycotts. The early Muslims faced severe persecution — Bilal ibn Rabah was tortured by being placed on hot sand with heavy rocks on his chest, yet he continued to say 'Ahad, Ahad' (One, One), declaring the oneness of Allah.",
        contentUr: "جیسے جیسے اسلام کا پیغام پھیلا، قریش کے سرداروں کی دشمنی بڑھتی گئی۔ ابو لہب اور اس کی بیوی ام جمیل سخت ترین مخالفین میں سے تھے۔ ابوجہل مسلمانوں کو جسمانی تکلیف دیتا اور بائیکاٹ کرواتا۔ بلال بن رباح کو گرم ریت پر لٹا کر سینے پر بھاری پتھر رکھے جاتے، لیکن وہ 'احد، احد' کہتے رہے۔",
        hadithRef: "Khabbab ibn al-Aratt said: 'We complained to the Messenger of Allah ﷺ while he was reclining on his cloak in the shade of the Ka'bah. We said: Will you not ask Allah to help us? He said: Among those before you, a man would be seized and a hole would be dug for him in the ground, and he would be sawed in two, yet that would not turn him away from his religion.' (Sahih al-Bukhari 3612)",
        hadithRefUr: "خباب بن ارت نے کہا: 'ہم نے رسول اللہ ﷺ سے شکایت کی جب آپ کعبہ کے سائے میں اپنی چادر پر ٹیک لگائے بیٹھے تھے۔ ہم نے کہا: کیا آپ اللہ سے مدد نہیں مانگیں گے؟ فرمایا: تم سے پہلے لوگوں کو پکڑا جاتا، زمین میں گڑھا کھود کر آرے سے چیرا جاتا، لیکن وہ دین سے نہ پھرتے۔' (صحیح بخاری 3612)",
        source: "Sahih al-Bukhari 3612"
      },
      {
        heading: "Migration to Abyssinia",
        headingUr: "حبشہ کی طرف ہجرت",
        content: "Due to severe persecution, the Prophet ﷺ advised a group of Muslims to migrate to Abyssinia (modern-day Ethiopia), ruled by the just Christian king Najashi (Negus). This was the first migration in Islam. Ja'far ibn Abi Talib represented the Muslims before the king and recited verses from Surah Maryam, which moved the king to tears. He granted them protection and refused to hand them over to the Quraysh delegation.",
        contentUr: "شدید ظلم و ستم کی وجہ سے، نبی ﷺ نے مسلمانوں کے ایک گروہ کو حبشہ (موجودہ ایتھوپیا) ہجرت کرنے کا مشورہ دیا، جہاں عادل عیسائی بادشاہ نجاشی حکمران تھا۔ یہ اسلام کی پہلی ہجرت تھی۔ جعفر بن ابی طالب نے بادشاہ کے سامنے سورۃ مریم کی تلاوت کی جس سے بادشاہ رو پڑا۔ اس نے مسلمانوں کو پناہ دی۔",
        hadithRef: "Umm Salamah narrated the story of their migration and how Ja'far recited Surah Maryam before the Negus. The king said: 'This and what Musa brought come from the same source.' He refused to hand the Muslims over. (Musnad Ahmad)",
        hadithRefUr: "ام سلمہ نے ہجرت حبشہ کا قصہ بیان کیا اور بتایا کہ جعفر نے نجاشی کے سامنے سورۃ مریم پڑھی۔ بادشاہ نے کہا: 'یہ اور جو موسیٰ لائے ایک ہی چشمے سے ہیں۔' اس نے مسلمانوں کو واپس کرنے سے انکار کر دیا۔ (مسند احمد)",
        source: "Musnad Ahmad"
      },
      {
        heading: "The Boycott of Banu Hashim",
        headingUr: "بنو ہاشم کا بائیکاٹ",
        content: "The Quraysh imposed a complete social and economic boycott on Banu Hashim and Banu Abdul Muttalib. A written pact was hung in the Ka'bah, declaring that no one would trade with, marry into, or have any dealings with these clans. This boycott lasted approximately three years, during which the Muslims suffered extreme hunger and hardship in the valley of Abu Talib (Shi'b Abi Talib). Eventually, the pact was miraculously found to have been eaten by termites, leaving only the name of Allah.",
        contentUr: "قریش نے بنو ہاشم اور بنو عبدالمطلب پر مکمل سماجی اور اقتصادی بائیکاٹ لگا دیا۔ کعبہ میں ایک تحریر لٹکائی گئی کہ کوئی ان سے تجارت، رشتہ داری یا معاملات نہیں رکھے گا۔ یہ بائیکاٹ تقریباً تین سال جاری رہا۔ مسلمانوں نے شعب ابی طالب میں شدید بھوک اور مشکلات برداشت کیں۔ آخرکار معجزانہ طور پر دیمک نے تحریر کو کھا لیا، صرف اللہ کا نام باقی رہا۔",
        source: "Ibn Hisham's Sirah"
      }
    ]
  },
  {
    id: "hijrah",
    title: "Migration to Madinah",
    titleUr: "مدینہ ہجرت",
    icon: "🕌",
    sections: [
      {
        heading: "The Night Journey (Isra & Mi'raj)",
        headingUr: "اسراء و معراج",
        content: "Before the Hijrah, Allah blessed the Prophet ﷺ with the miraculous Night Journey (Isra) from Masjid al-Haram in Makkah to Masjid al-Aqsa in Jerusalem, and then the Ascension (Mi'raj) through the heavens. During this journey, he met previous prophets, witnessed Paradise and Hell, and received the commandment of five daily prayers (originally fifty, reduced to five through the intercession with Allah at the advice of Prophet Musa).",
        contentUr: "ہجرت سے پہلے، اللہ تعالیٰ نے نبی ﷺ کو معجزانہ شب سفر (اسراء) عطا فرمایا مسجد الحرام سے مسجد اقصیٰ تک، اور پھر معراج آسمانوں کے ذریعے۔ اس سفر میں آپ نے پچھلے انبیاء سے ملاقات کی، جنت و جہنم کا مشاہدہ کیا، اور پانچ نمازوں کا حکم ملا (اصل میں پچاس تھیں جو موسیٰ علیہ السلام کے مشورے سے کم ہو کر پانچ ہوئیں)۔",
        hadithRef: "Anas ibn Malik reported: The Prophet ﷺ said: 'I was brought al-Buraq, an animal white and long. I mounted it and it brought me to Bayt al-Maqdis. I tied it to the ring used by the prophets. I entered the mosque and prayed two rak'ahs, then I was taken up to heaven.' (Sahih Muslim 162)",
        hadithRefUr: "انس بن مالک سے روایت ہے: نبی ﷺ نے فرمایا: 'میرے پاس براق لایا گیا، ایک سفید لمبا جانور۔ میں اس پر سوار ہوا اور بیت المقدس پہنچا۔ اسے انبیاء کی انگوٹھی سے باندھا۔ مسجد میں داخل ہو کر دو رکعت نماز پڑھی، پھر مجھے آسمان پر لے جایا گیا۔' (صحیح مسلم 162)",
        source: "Sahih Muslim 162"
      },
      {
        heading: "The Pledge of Aqabah",
        headingUr: "بیعت عقبہ",
        content: "People from Yathrib (later named Madinah) met the Prophet ﷺ during the Hajj season. In the First Pledge of Aqabah, twelve men pledged to worship Allah alone and follow His Messenger. In the Second Pledge, seventy-three men and two women pledged to protect the Prophet ﷺ as they would protect their own families. This paved the way for the great Hijrah to Madinah.",
        contentUr: "یثرب (بعد میں مدینہ) کے لوگ حج کے موسم میں نبی ﷺ سے ملے۔ پہلی بیعت عقبہ میں بارہ مردوں نے اللہ کی عبادت اور رسول کی اطاعت کا عہد کیا۔ دوسری بیعت میں تہتر مردوں اور دو عورتوں نے نبی ﷺ کی حفاظت کا عہد کیا۔ اس نے مدینہ ہجرت کی راہ ہموار کی۔",
        source: "Sahih al-Bukhari, Ibn Ishaq"
      },
      {
        heading: "The Great Hijrah",
        headingUr: "ہجرت مدینہ",
        content: "When the Quraysh plotted to assassinate the Prophet ﷺ, Allah revealed the plan to him. On the night of the migration, Ali ibn Abi Talib slept in the Prophet's bed as a decoy. The Prophet ﷺ and Abu Bakr left Makkah and took shelter in the Cave of Thawr for three days. Despite the Quraysh sending search parties, Allah protected them. A spider spun its web at the cave entrance and a dove nested there, making the pursuers believe no one had entered.",
        contentUr: "جب قریش نے نبی ﷺ کو قتل کرنے کی سازش کی، اللہ نے آپ کو خبر دی۔ ہجرت کی رات علی بن ابی طالب آپ کے بستر پر سوئے۔ نبی ﷺ اور ابوبکر مکہ سے نکلے اور غار ثور میں تین دن پناہ لی۔ قریش کی تلاشی کے باوجود اللہ نے آپ کی حفاظت فرمائی۔ مکڑی نے غار کے دہانے پر جالا بن دیا اور کبوتری نے گھونسلا بنا لیا۔",
        hadithRef: "Abu Bakr said: 'I was with the Prophet ﷺ in the cave. I raised my head and saw the feet of the people. I said: O Messenger of Allah, if any of them were to look down he would see us! He said: O Abu Bakr, what do you think of two people, the third of whom is Allah?' (Sahih al-Bukhari 3653)",
        hadithRefUr: "ابوبکر نے کہا: 'میں غار میں نبی ﷺ کے ساتھ تھا۔ میں نے سر اٹھایا اور لوگوں کے پاؤں دیکھے۔ میں نے کہا: یا رسول اللہ، اگر ان میں سے کوئی نیچے دیکھے تو ہمیں دیکھ لے! آپ نے فرمایا: ابوبکر، ان دو کے بارے میں کیا خیال ہے جن کا تیسرا اللہ ہے؟' (صحیح بخاری 3653)",
        source: "Sahih al-Bukhari 3653"
      },
      {
        heading: "Arrival in Madinah",
        headingUr: "مدینہ میں آمد",
        content: "The Prophet ﷺ arrived in Quba (outskirts of Madinah) and built the first mosque in Islam — Masjid Quba. He then entered Madinah where the people joyfully welcomed him singing 'Tala'al Badru Alayna' (The full moon has risen upon us). His she-camel stopped at a place that became the site of Masjid an-Nabawi (The Prophet's Mosque). He established the bond of brotherhood (Muakhat) between the Muhajirun (emigrants) and Ansar (helpers).",
        contentUr: "نبی ﷺ قبا (مدینہ کے نواح) پہنچے اور اسلام کی پہلی مسجد — مسجد قبا تعمیر کی۔ پھر مدینہ میں داخل ہوئے جہاں لوگوں نے 'طلع البدر علینا' گا کر خوشی سے استقبال کیا۔ آپ کی اونٹنی ایک جگہ رکی جو مسجد نبوی کی جگہ بنی۔ آپ نے مہاجرین اور انصار کے درمیان بھائی چارے (مؤاخات) کا رشتہ قائم کیا۔",
        source: "Sahih al-Bukhari"
      }
    ]
  },
  {
    id: "battles",
    title: "Major Battles",
    titleUr: "اہم غزوات",
    icon: "⚔️",
    sections: [
      {
        heading: "Battle of Badr (2 AH)",
        headingUr: "غزوہ بدر (2 ہجری)",
        content: "The Battle of Badr was the first major military confrontation between the Muslims and the Quraysh. Despite being vastly outnumbered (313 Muslims against approximately 1,000 Quraysh warriors), Allah granted a decisive victory to the believers. The Prophet ﷺ supplicated earnestly, and Allah sent angels to assist the Muslims. This battle established the Muslim community as a formidable force and boosted the morale of the believers.",
        contentUr: "غزوہ بدر مسلمانوں اور قریش کے درمیان پہلی بڑی فوجی جنگ تھی۔ تعداد میں بہت کم ہونے کے باوجود (313 مسلمان بمقابلہ تقریباً 1000 قریش) اللہ نے مسلمانوں کو فیصلہ کن فتح عطا کی۔ نبی ﷺ نے بہت دعا کی اور اللہ نے فرشتے مدد کے لیے بھیجے۔ اس جنگ نے مسلم معاشرے کو ایک طاقت کے طور پر قائم کیا۔",
        hadithRef: "The Prophet ﷺ supplicated on the day of Badr: 'O Allah, if this group is destroyed today, You will not be worshipped on earth.' Then he went out, wearing his armor, reciting: 'Their multitude will be put to flight, and they will show their backs.' (Sahih al-Bukhari 3953)",
        hadithRefUr: "نبی ﷺ نے بدر کے دن دعا کی: 'اے اللہ، اگر آج یہ جماعت ہلاک ہو گئی تو زمین پر تیری عبادت نہیں ہوگی۔' پھر آپ زرہ پہنے باہر آئے اور تلاوت فرمائی: 'ان کی جماعت شکست کھائے گی اور پیٹھ دکھا کر بھاگیں گے۔' (صحیح بخاری 3953)",
        source: "Sahih al-Bukhari 3953"
      },
      {
        heading: "Battle of Uhud (3 AH)",
        headingUr: "غزوہ احد (3 ہجری)",
        content: "The Quraysh, seeking revenge for Badr, attacked with 3,000 warriors. The Muslims initially had the upper hand, but when the archers on Mount Uhud disobeyed the Prophet's ﷺ order and left their positions to collect spoils, the tide turned. Khalid ibn al-Walid (still a non-Muslim at the time) exploited the gap. The Prophet ﷺ was injured, and 70 Muslims were martyred including Hamzah ibn Abdul Muttalib, the Prophet's beloved uncle.",
        contentUr: "قریش نے بدر کا بدلہ لینے کے لیے 3000 جنگجوؤں کے ساتھ حملہ کیا۔ ابتدا میں مسلمان غالب تھے لیکن جب احد پہاڑ پر تعینات تیر اندازوں نے نبی ﷺ کا حکم نہ مانا اور مال غنیمت اکٹھا کرنے اترے تو جنگ کا رخ بدل گیا۔ خالد بن ولید (جو اس وقت تک مسلمان نہیں تھے) نے اس خلا سے فائدہ اٹھایا۔ نبی ﷺ زخمی ہوئے اور 70 مسلمان شہید ہوئے جن میں حمزہ بن عبدالمطلب بھی تھے۔",
        hadithRef: "Anas reported: On the day of Uhud, the Prophet's incisor tooth was broken and his face was wounded. Blood was flowing on his face. He wiped the blood and said: 'How can a people succeed who have wounded their Prophet?' Then Allah revealed: 'Not for you is the decision.' (Sahih al-Bukhari 4073)",
        hadithRefUr: "انس سے روایت ہے: احد کے دن نبی ﷺ کا سامنے کا دانت ٹوٹ گیا اور چہرہ زخمی ہوا۔ خون بہہ رہا تھا۔ آپ نے خون صاف کیا اور فرمایا: 'وہ قوم کیسے کامیاب ہوگی جس نے اپنے نبی کو زخمی کیا؟' پھر اللہ نے نازل فرمایا: 'فیصلہ تمہارے ہاتھ میں نہیں۔' (صحیح بخاری 4073)",
        source: "Sahih al-Bukhari 4073"
      },
      {
        heading: "Battle of the Trench (5 AH)",
        headingUr: "غزوہ خندق (5 ہجری)",
        content: "A coalition of 10,000 warriors from various Arab tribes besieged Madinah. On the suggestion of Salman al-Farisi, the Muslims dug a trench around the vulnerable parts of Madinah — a strategy unknown to the Arabs. The siege lasted about a month. Allah sent a fierce wind that uprooted the enemy's tents and extinguished their fires, causing them to retreat. This battle showed the importance of strategic thinking in Islam.",
        contentUr: "مختلف عرب قبائل کے 10,000 جنگجوؤں نے مدینہ کا محاصرہ کر لیا۔ سلمان فارسی کے مشورے پر مسلمانوں نے مدینہ کے کمزور حصوں کے گرد خندق کھودی — یہ حکمت عملی عربوں کے لیے نئی تھی۔ محاصرہ تقریباً ایک مہینہ جاری رہا۔ اللہ نے تیز ہوا بھیجی جس نے دشمن کے خیمے اکھاڑ دیے اور ان کی آگ بجھا دی، جس سے وہ واپس چلے گئے۔",
        hadithRef: "The Prophet ﷺ said on the day of Al-Khandaq: 'They (the disbelievers) will not invade us, but we shall invade them.' (Sahih al-Bukhari 4109)",
        hadithRefUr: "نبی ﷺ نے خندق کے دن فرمایا: 'اب وہ ہم پر حملہ نہیں کریں گے بلکہ ہم ان پر حملہ کریں گے۔' (صحیح بخاری 4109)",
        source: "Sahih al-Bukhari 4109"
      }
    ]
  },
  {
    id: "conquest",
    title: "Conquest of Makkah",
    titleUr: "فتح مکہ",
    icon: "🏴",
    sections: [
      {
        heading: "Treaty of Hudaybiyyah (6 AH)",
        headingUr: "صلح حدیبیہ (6 ہجری)",
        content: "The Prophet ﷺ set out with 1,400 companions for Umrah but was stopped at Hudaybiyyah. A peace treaty was signed with the Quraysh for 10 years. Although the terms seemed unfavorable to the Muslims, Allah called it 'a manifest victory' (Surah Al-Fath 48:1). The treaty allowed Islam to spread peacefully, and within two years, the number of Muslims doubled.",
        contentUr: "نبی ﷺ 1400 صحابہ کے ساتھ عمرہ کے لیے نکلے لیکن حدیبیہ پر روک لیے گئے۔ قریش سے 10 سال کا معاہدہ صلح ہوا۔ اگرچہ شرائط مسلمانوں کے خلاف لگتی تھیں، اللہ نے اسے 'فتح مبین' قرار دیا (سورۃ الفتح 48:1)۔ اس معاہدے نے اسلام کو پرامن طریقے سے پھیلنے دیا اور دو سال میں مسلمانوں کی تعداد دگنی ہو گئی۔",
        source: "Sahih al-Bukhari"
      },
      {
        heading: "The Conquest of Makkah (8 AH)",
        headingUr: "فتح مکہ (8 ہجری)",
        content: "After the Quraysh violated the Treaty of Hudaybiyyah, the Prophet ﷺ marched towards Makkah with 10,000 Muslims. The city was conquered with virtually no bloodshed — a testament to the mercy of the Prophet ﷺ. He entered the Ka'bah and destroyed 360 idols while reciting: 'Truth has come and falsehood has vanished. Indeed, falsehood is ever bound to vanish' (Quran 17:81). He then granted general amnesty to the people of Makkah.",
        contentUr: "قریش کے معاہدہ حدیبیہ کی خلاف ورزی کے بعد، نبی ﷺ 10,000 مسلمانوں کے ساتھ مکہ کی طرف روانہ ہوئے۔ شہر تقریباً بغیر خون بہائے فتح ہوا — یہ نبی ﷺ کی رحمت کی دلیل تھی۔ آپ نے کعبہ میں داخل ہو کر 360 بتوں کو توڑا اور تلاوت فرمائی: 'حق آ گیا اور باطل مٹ گیا، بے شک باطل مٹنے والا ہے' (قرآن 17:81)۔ پھر مکہ والوں کو عام معافی دی۔",
        hadithRef: "The Prophet ﷺ said to the people of Makkah: 'What do you think I will do with you?' They said: 'Good, for you are a noble brother, son of a noble brother.' He said: 'Go, you are free!' (Sunan al-Bayhaqi)",
        hadithRefUr: "نبی ﷺ نے مکہ والوں سے فرمایا: 'تمہارا کیا خیال ہے میں تمہارے ساتھ کیا کروں گا؟' انہوں نے کہا: 'بھلائی، آپ بھائی ہیں اور بھائی کے بیٹے ہیں۔' آپ نے فرمایا: 'جاؤ، تم سب آزاد ہو!' (سنن البیہقی)",
        source: "Sunan al-Bayhaqi"
      }
    ]
  },
  {
    id: "character",
    title: "Character & Teachings",
    titleUr: "اخلاق اور تعلیمات",
    icon: "💎",
    sections: [
      {
        heading: "Mercy & Compassion",
        headingUr: "رحمت اور شفقت",
        content: "The Prophet ﷺ was sent as a mercy to all of creation (Quran 21:107). His compassion extended to all people, animals, and even plants. He would kiss children, help the poor, visit the sick, and treat his servants with kindness. When the people of Ta'if stoned him until he bled, the Angel of the Mountains offered to crush them between two mountains, but the Prophet ﷺ refused, hoping their descendants would accept Islam.",
        contentUr: "نبی ﷺ تمام مخلوقات کے لیے رحمت بنا کر بھیجے گئے (قرآن 21:107)۔ آپ کی شفقت تمام لوگوں، جانوروں اور پودوں تک تھی۔ آپ بچوں کو پیار کرتے، غریبوں کی مدد کرتے، بیماروں کی عیادت کرتے، اور خادموں سے نرمی سے پیش آتے۔ جب طائف والوں نے آپ کو پتھر مارے، پہاڑوں کے فرشتے نے پیش کش کی کہ انہیں دو پہاڑوں کے درمیان کچل دے، لیکن آپ نے انکار کر دیا۔",
        hadithRef: "Aisha reported: 'The Prophet ﷺ never struck anything with his hand, neither a woman nor a servant. The only exception was when he was fighting in the cause of Allah. He never took revenge for his own sake.' (Sahih Muslim 2328)",
        hadithRefUr: "عائشہ سے روایت ہے: 'نبی ﷺ نے کبھی اپنے ہاتھ سے نہ کسی عورت کو مارا نہ کسی خادم کو۔ سوائے جہاد فی سبیل اللہ کے۔ آپ نے کبھی اپنے لیے بدلہ نہیں لیا۔' (صحیح مسلم 2328)",
        source: "Sahih Muslim 2328"
      },
      {
        heading: "Justice & Equality",
        headingUr: "عدل و مساوات",
        content: "The Prophet ﷺ established a society based on justice and equality. In his farewell sermon, he declared: 'An Arab has no superiority over a non-Arab, nor does a non-Arab have any superiority over an Arab. A white person has no superiority over a black person, nor does a black person have any superiority over a white person — except by piety and good action.' He abolished tribal pride and racism.",
        contentUr: "نبی ﷺ نے عدل اور مساوات پر مبنی معاشرہ قائم کیا۔ خطبہ حجۃ الوداع میں فرمایا: 'کسی عربی کو عجمی پر فضیلت نہیں اور نہ عجمی کو عربی پر۔ کسی گورے کو کالے پر فضیلت نہیں اور نہ کالے کو گورے پر — سوائے تقویٰ اور نیک عمل کے۔' آپ نے قبائلی تعصب اور نسل پرستی کو ختم کیا۔",
        hadithRef: "The Prophet ﷺ said: 'By Allah, if Fatimah the daughter of Muhammad were to steal, I would cut off her hand.' (Sahih al-Bukhari 3475)",
        hadithRefUr: "نبی ﷺ نے فرمایا: 'اللہ کی قسم، اگر فاطمہ بنت محمد بھی چوری کرتی تو میں اس کا ہاتھ کاٹتا۔' (صحیح بخاری 3475)",
        source: "Sahih al-Bukhari 3475"
      },
      {
        heading: "Simple Living",
        headingUr: "سادہ زندگی",
        content: "Despite being the leader of the Muslim state, the Prophet ﷺ lived an extremely simple life. His house was made of clay with a palm-leaf roof. He would mend his own shoes, patch his clothes, and milk his goats. He often went hungry, tying stones to his stomach to suppress hunger pangs. He slept on a rough mat that would leave marks on his body. When offered the treasures of the world, he chose the life of a servant-prophet.",
        contentUr: "مسلم ریاست کے سربراہ ہونے کے باوجود، نبی ﷺ انتہائی سادہ زندگی گزارتے تھے۔ آپ کا گھر مٹی کا تھا جس کی چھت کھجور کے پتوں کی تھی۔ آپ خود جوتے گانٹھتے، کپڑے سیتے اور بکریوں کا دودھ دوہتے۔ اکثر بھوکے رہتے اور پیٹ پر پتھر باندھتے۔ کھردری چٹائی پر سوتے جس کے نشان جسم پر پڑ جاتے۔ جب دنیا کے خزانے پیش کیے گئے تو آپ نے بندہ نبی کی زندگی چنی۔",
        hadithRef: "Umar said: 'I entered upon the Prophet ﷺ and saw him lying on a mat made of palm fibers with nothing between him and the mat. The mat had left marks on his side. I saw a handful of barley and a water skin hanging. My eyes shed tears. He said: Why do you weep, O son of al-Khattab? I said: O Prophet of Allah, how can I not weep? This mat has left marks on your side, while Chosroes and Caesar enjoy luxury. You are the Messenger of Allah!' (Sahih al-Bukhari 4913)",
        hadithRefUr: "عمر نے کہا: 'میں نبی ﷺ کے پاس آیا اور دیکھا آپ کھجور کے ریشوں کی چٹائی پر لیٹے ہوئے ہیں، چٹائی اور جسم کے درمیان کچھ نہیں۔ چٹائی کے نشان پہلو پر پڑے ہوئے تھے۔ تھوڑے سے جو اور ایک مشک پانی لٹکی ہوئی تھی۔ میری آنکھوں سے آنسو بہنے لگے۔ فرمایا: ابن خطاب، کیوں روتے ہو؟ میں نے کہا: یا رسول اللہ، کیسے نہ روؤں؟ قیصر و کسریٰ عیش میں ہیں اور آپ اللہ کے رسول ہو کر یہ حال ہے!' (صحیح بخاری 4913)",
        source: "Sahih al-Bukhari 4913"
      }
    ]
  },
  {
    id: "farewell",
    title: "Farewell & Passing",
    titleUr: "آخری خطبہ اور وصال",
    icon: "🤲",
    sections: [
      {
        heading: "The Farewell Pilgrimage",
        headingUr: "حجۃ الوداع",
        content: "In the 10th year of Hijrah, the Prophet ﷺ performed his only Hajj, known as the Farewell Pilgrimage (Hajjat al-Wada'). Over 100,000 companions accompanied him. He delivered a profound sermon at the plain of Arafat, establishing fundamental principles of human rights, justice, and equality. He asked the people: 'Have I conveyed the message?' They replied: 'Yes!' He said: 'O Allah, be witness!'",
        contentUr: "10 ہجری میں، نبی ﷺ نے اپنا واحد حج ادا کیا جو حجۃ الوداع کے نام سے مشہور ہے۔ ایک لاکھ سے زائد صحابہ آپ کے ساتھ تھے۔ آپ نے میدان عرفات میں ایک عظیم خطبہ دیا جس میں انسانی حقوق، عدل اور مساوات کے بنیادی اصول بیان کیے۔ آپ نے پوچھا: 'کیا میں نے پیغام پہنچا دیا؟' لوگوں نے کہا: 'ہاں!' فرمایا: 'اے اللہ گواہ رہ!'",
        hadithRef: "The Prophet ﷺ said in his farewell sermon: 'O people, indeed your blood, your properties, and your honor are sacred to each other, as sacred as this day of yours in this month of yours in this city of yours. I have left among you that which, if you hold onto it, you will never go astray: the Book of Allah.' (Sahih Muslim 1218)",
        hadithRefUr: "نبی ﷺ نے خطبہ حجۃ الوداع میں فرمایا: 'اے لوگو، تمہارے خون، مال اور عزتیں ایک دوسرے پر حرام ہیں جیسے آج کا دن اس مہینے میں اس شہر میں حرمت والا ہے۔ میں تمہارے درمیان وہ چیز چھوڑے جا رہا ہوں جسے پکڑے رہو گے تو کبھی گمراہ نہ ہوگے: اللہ کی کتاب۔' (صحیح مسلم 1218)",
        source: "Sahih Muslim 1218"
      },
      {
        heading: "The Passing of the Prophet ﷺ",
        headingUr: "نبی ﷺ کا وصال",
        content: "The Prophet ﷺ passed away on 12th Rabi ul-Awwal, 11 AH (8th June 632 CE), in the house of Aisha in Madinah. His last words were: 'With the highest companion (Ar-Rafiq al-A'la).' His passing was the greatest calamity for the Muslim Ummah. Abu Bakr consoled the people saying: 'Whoever worshipped Muhammad, then Muhammad has died. But whoever worshipped Allah, then Allah is Ever-Living and will never die.'",
        contentUr: "نبی ﷺ نے 12 ربیع الاول 11 ہجری (8 جون 632 عیسوی) کو عائشہ کے گھر مدینہ میں وفات پائی۔ آپ کے آخری الفاظ تھے: 'الرفیق الاعلیٰ کے ساتھ۔' آپ کا وصال امت مسلمہ کے لیے سب سے بڑی مصیبت تھی۔ ابوبکر نے لوگوں کو تسلی دیتے ہوئے کہا: 'جو محمد کی عبادت کرتا تھا تو محمد فوت ہو گئے۔ اور جو اللہ کی عبادت کرتا ہے تو اللہ ہمیشہ زندہ ہے، کبھی نہیں مرے گا۔'",
        hadithRef: "Aisha reported: The Messenger of Allah ﷺ died while resting against my chest. I used to recite the Mu'awwidhatayn (Surah Al-Falaq and An-Nas) and blow over him, and wipe his body with his own hand for its blessing. (Sahih al-Bukhari 4440)",
        hadithRefUr: "عائشہ سے روایت ہے: رسول اللہ ﷺ نے میرے سینے سے ٹیک لگائے وفات پائی۔ میں معوذتین (سورۃ الفلق اور الناس) پڑھ کر آپ پر دم کرتی تھی اور آپ کے ہاتھ سے آپ کا جسم مسح کرتی تھی۔ (صحیح بخاری 4440)",
        source: "Sahih al-Bukhari 4440"
      }
    ]
  }
];
