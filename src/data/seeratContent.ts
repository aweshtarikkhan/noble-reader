// Seerat un Nabi ﷺ — "Siraj-u-Munira" (Hazrat Muhammad ﷺ: The Last of the Prophets)
// By: Muhammad Ikram-un-Nabi Awan (Maj. Rtd.) & Mrs. Nusrat Tiwana
// Layout & Design: Ms. Mehr Fatima & Mrs. Shehla Zubair Tiwana
// First Edition: Muharram 1346 A.H / November 2014

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

export const SEERAT_BOOK_CREDITS = {
  title: "Siraj-u-Munira — Hazrat Muhammad ﷺ: The Last of the Prophets",
  titleUr: "سراج منیرہ — حضرت محمد ﷺ: خاتم النبیین",
  authors: "Muhammad Ikram-un-Nabi Awan (Maj. Rtd.) & Mrs. Nusrat Tiwana",
  authorsUr: "محمد اکرام النبی اعوان (میجر ریٹائرڈ) اور مسز نصرت تیوانا",
  layout: "Ms. Mehr Fatima & Mrs. Shehla Zubair Tiwana",
  edition: "First Edition: Muharram 1346 A.H / November 2014",
  editionUr: "پہلا ایڈیشن: محرم 1346 ہجری / نومبر 2014",
  reviewer: "Mufti Muhammad Haroon",
  reviewerUr: "مفتی محمد ہارون",
  bibliography: [
    "Seeratun Nabi — Syed Pir Mehr Ali Shah",
    "Hayat us Sahaba — Maulana Muhammad Yousaf Kandhalvi",
    "Ziarat-e-Harman — Qari Muhammad Ishaq",
    "Seeratun Nabi — Allama Shibli Nomani & Syed Sulleman Nadvi",
    "Al Raheek ul Makhtoom — Maulana Safi-u-Rehman Mubarikpuri",
    "Tarjman us Sunnah — Badr-e-Alam Mirathi",
    "Understanding Islam — Akbar S. Ahmad",
    "Spirit of Islam — Syed Ameer Ali",
    "The Future of Mankind Muhammad — Sultan Bashir Mahmood",
    "The Sword of Allah — Lt. General A.J. Akram",
  ],
};

export const SEERAT_CHAPTERS: SeeratChapter[] = [
  {
    id: "ch1-the-wait",
    title: "Chapter 1: The Wait",
    titleUr: "باب 1: انتظار",
    icon: "🌍",
    sections: [
      {
        heading: "Conditions Before His Birth",
        headingUr: "آپ ﷺ کی ولادت سے پہلے کے حالات",
        content: `Man has been created with a purpose. Allah states in Quran: "And I did not create Jinns and humans but to obey Me." (51:56)

Guidance towards understanding and achieving that purpose is one of the basic needs. The Creator, Allah, The Sustainer, The Provider did not overlook that most important of His subjects' need. He promised: "As for those who strive in Us, We surely guide them to Our paths and surely Allah is with the good." (29:69)

The societies — Arabs, Romans, Persians, Africans, Indians and Chinese — were infested with evils. The religious, political and moral conditions of the nations were deplorable. Humanity revolts with the accounts of the crimes of the civilized nations of the time. They recognized no religious or moral restraint.

Ka'bah in Makkah, the beating heart of the Arabian Peninsula, the House of Allah erected by Prophet Ibrahim عليه السلام and his son Prophet Ismail عليه السلام, was filled with deities by ignorant Arabs, their assumed intermediaries and deputies of God.`,
        contentUr: `انسان کو ایک مقصد کے لیے پیدا کیا گیا ہے۔ اللہ تعالیٰ قرآن میں فرماتا ہے: "اور میں نے جنوں اور انسانوں کو صرف اپنی عبادت کے لیے پیدا کیا ہے۔" (51:56)

معاشرے — عرب، رومی، فارسی، افریقی، ہندوستانی اور چینی — برائیوں میں ڈوبے ہوئے تھے۔ قوموں کے مذہبی، سیاسی اور اخلاقی حالات ابتر تھے۔

مکہ میں کعبہ، جزیرہ عرب کا دھڑکتا دل، اللہ کا گھر جو حضرت ابراہیم عليه السلام اور ان کے بیٹے حضرت اسماعیل عليه السلام نے تعمیر کیا تھا، جاہل عربوں نے بتوں سے بھر دیا تھا۔`,
      },
      {
        heading: "The Dark Ages & The Awaited Prophet",
        headingUr: "تاریک دور اور منتظر نبی",
        content: `According to the Scriptures, Jewish and Christian, the final, the Seal of the prophets would come and he would deliver them of their evil strains and bring them the whole truth. The scholars of the Scriptures from his description knew him so well that they would recognize him when they would see him. Quran testifies: "Those whom We have given the Book recognize him just as they recognize their sons." (2:146)

History remembers those times as the 'Dark Ages'. Indeed it is the darkest before daybreak. Humanity was groaning under unspeakable burdens, waiting for salvation. The wait was universal and had become insufferable.

With the daybreak on 12th of Rabi 1, Spring of 570 A.D., Allah, The Merciful sent His beloved, The Pride of prophets, Muhammad ﷺ to change the whole sinister aspect of the world.`,
        contentUr: `یہودی اور عیسائی کتابوں کے مطابق، آخری نبی، خاتم الانبیاء آئیں گے اور وہ انہیں برائیوں سے نجات دلائیں گے اور پوری سچائی لائیں گے۔ قرآن گواہی دیتا ہے: "جن کو ہم نے کتاب دی ہے وہ اسے ایسے پہچانتے ہیں جیسے اپنے بیٹوں کو پہچانتے ہیں۔" (2:146)

تاریخ ان اوقات کو 'تاریک دور' کے نام سے یاد کرتی ہے۔ 12 ربیع الاول 570 عیسوی کی صبح اللہ تعالیٰ نے اپنے محبوب، انبیاء کی شان، محمد ﷺ کو دنیا کی تاریک صورتحال بدلنے کے لیے بھیجا۔`,
        hadithRef: `The Prophet ﷺ said: "I am the supplication of my father Ibrahim, the glad tidings of Isa, and my mother saw a light when she bore me that illuminated the palaces of Syria." (Musnad Ahmad)`,
        hadithRefUr: `نبی کریم ﷺ نے فرمایا: "میں اپنے باپ ابراہیم کی دعا ہوں، عیسیٰ کی بشارت ہوں، اور میری والدہ نے میری ولادت کے وقت ایک نور دیکھا جس نے شام کے محلات کو روشن کر دیا۔" (مسند احمد)`,
        source: "Musnad Ahmad",
      },
    ],
  },
  {
    id: "ch2-the-saviour",
    title: "Chapter 2: The Saviour",
    titleUr: "باب 2: نجات دہندہ",
    icon: "⭐",
    sections: [
      {
        heading: "Divine Indications at Birth",
        headingUr: "ولادت کے وقت الہی نشانیاں",
        content: `Prophets are sent not made. They are sent to warn the people, to connect them with their Lord. So were the indications shown at the time of the birth of His beloved Prophet Muhammad ﷺ.

In Makkah, to the utter astonishment of pagans, the night the Prophet was born, the deities in Ka'bah fell on their faces. Centuries old fire burning for worship in the high temple in Persia died down for no apparent reason. Fourteen of the spires in the Palace of Kisra fell suddenly.

Hazrat Aamna, mother of Prophet ﷺ said, that at the birth of Muhammad a cloud appeared and wrapped her son. She heard a voice: "Take this baby to every corner of the universe, so that everyone comes to know that the last Prophet of Allah has arrived. His name is Ahmad and Muhammad."

A Jewish trader in Makkah came to a gathering of Quraish and asked if a baby was born to anyone. He said: "The Prophet of your people has born tonight." He told of the sign of Prophethood on his back between the shoulders.`,
        contentUr: `انبیاء بھیجے جاتے ہیں، بنائے نہیں جاتے۔ مکہ میں مشرکوں کی حیرت میں، جس رات نبی کریم ﷺ پیدا ہوئے، کعبہ میں بت اپنے منہ کے بل گر گئے۔ فارس کے بلند معبد میں صدیوں سے جلنے والی آگ بغیر کسی ظاہری وجہ کے بجھ گئی۔ کسریٰ کے محل کے چودہ کنگرے اچانک گر گئے۔

حضرت آمنہ، نبی ﷺ کی والدہ نے فرمایا کہ محمد ﷺ کی ولادت کے وقت ایک بادل آیا اور ان کے بیٹے کو لپیٹ لیا۔ انہوں نے ایک آواز سنی: "اس بچے کو دنیا کے ہر کونے میں لے جاؤ تاکہ سب کو معلوم ہو کہ اللہ کے آخری نبی آ گئے ہیں۔"`,
      },
      {
        heading: "Family Tree, Wives & Children",
        headingUr: "شجرہ نسب، ازواج اور اولاد",
        content: `Muhammad ﷺ Bin Abdullah Bin Abdul Muttalib Bin Hashim Bin Abd Manaf Bin Qusayi, who was a descendant of Hazrat Ismail عليه السلام, the son of the Prophet Ibrahim عليه السلام.

Quran acknowledges the special rank of the wives of the Prophet ﷺ: "The Prophet is closer to the Believers than their own selves, and his wives are their mothers." (Al-Ahzab 33:6)

The Prophet married twelve ladies in his lifetime. Sayyidah Khadija remained the only wife till her death. She was the mother of all his children except Sayyidna Ibrahim.

The Prophet was blessed with four daughters — Sayyidah Zainab, Sayyidah Rukiyah, Sayyidah Ume Kalsoom, and Sayyidah Fatima — and three sons: Sayyidna Qasim, Sayyidna Abdullah, and Sayyidna Ibrahim. All sons died in infancy. Among his daughters only Hazrat Fatima witnessed the great events in her father's mission and its success.`,
        contentUr: `محمد ﷺ بن عبداللہ بن عبدالمطلب بن ہاشم بن عبد مناف بن قصی، جو حضرت اسماعیل عليه السلام کی نسل سے تھے۔

قرآن نبی ﷺ کی بیویوں کے خاص مقام کو تسلیم کرتا ہے: "نبی مومنوں سے ان کی جانوں سے زیادہ قریب ہیں اور ان کی بیویاں ان کی مائیں ہیں۔" (الاحزاب 33:6)

نبی ﷺ کو چار بیٹیاں — سیدہ زینب، سیدہ رقیہ، سیدہ ام کلثوم، اور سیدہ فاطمہ — اور تین بیٹے: سیدنا قاسم، سیدنا عبداللہ، اور سیدنا ابراہیم، عطا ہوئے۔ تمام بیٹے بچپن میں وفات پا گئے۔`,
      },
    ],
  },
  {
    id: "ch3-born-orphan",
    title: "Chapter 3: Born Orphan",
    titleUr: "باب 3: یتیم پیدا ہوئے",
    icon: "🌙",
    sections: [
      {
        heading: "The Year of the Elephant",
        headingUr: "عام الفیل",
        content: `The year of the birth of the Holy Prophet Muhammad ﷺ is marked with a strange event — the destruction of the army of Abraha al-Ashram, the Abyssinian viceroy of Yemen. He marched towards Makkah to destroy Ka'bah with a large army riding on elephants. On the approach of the Abyssinians, Quraish took to the neighbouring mountains.

The Chief, Hazrat Abdul Muttalib went to Ka'bah and prayed: "Every man defends his household. You protect Yours as we are unable to fight this army." Then he went to Abraha and asked for his camels. Amused, Abraha said, "I have come to destroy Ka'bah and the Chief of Quraish asks for his camels!" To which the Chief replied, "Ka'bah is the concern of the Lord of Ka'bah. The camels are mine, restore them to me."

The next morning, the sky was overcast by an enormous flight of swallows. The birds pelted the army with stones, which penetrated their armor. The whole episode is mentioned in Surah Al-Fil.

Fifty five days after the destruction of Abraha's army, our beloved Prophet Muhammad ﷺ was born, an orphan. His grandfather, chief of Quraish Hazrat Abdul Muttalib, rejoiced at the birth and named him Muhammad (The Praised).`,
        contentUr: `نبی کریم ﷺ کی ولادت کا سال ایک عجیب واقعے سے نشان زد ہے — ابرہہ الاشرم کی فوج کی تباہی۔ اس نے ہاتھیوں پر سوار بڑی فوج لے کر کعبہ کو ڈھانے مکہ کی طرف مارچ کیا۔

حضرت عبدالمطلب نے کعبہ جا کر دعا کی: "ہر آدمی اپنے گھر کی حفاظت کرتا ہے۔ آپ اپنے گھر کی حفاظت فرمائیں۔"

اگلی صبح آسمان پر پرندوں کا بادل چھا گیا۔ پرندوں نے فوج پر پتھر برسائے۔ ابرہہ کی فوج کی تباہی کے پچپن دن بعد ہمارے پیارے نبی محمد ﷺ یتیم پیدا ہوئے۔ ان کے دادا عبدالمطلب نے ان کا نام محمد (تعریف کیا ہوا) رکھا۔`,
      },
      {
        heading: "Foster Care with Halimah & Childhood",
        headingUr: "حلیمہ سعدیہ کی گود اور بچپن",
        content: `In accordance with the custom of Arab elite, baby Muhammad was handed over to Halimah Saadia of the tribe of Bani Sa'd. The Prophet ﷺ said: "I am the most eloquent of you. I belong to Quraish and my language is that of Banu Sa'd."

Halimah and her husband who had reluctantly taken the orphan child soon realized the blessings. The weak dry she-camel they had ridden to Makkah was striding past everyone in the caravan on the way back home. When they reached home it had rained and the animals returned full each evening.

One day his foster brother Abdullah came running home — two strangers had cut open their Quraishi brother. The tradition says Jibrail عليه السلام opened his chest, took out his heart, washed it, placed it back and with the will of Allah closed it. Scared, Saadia restored the child to his family.

At the age of six his mother took him to Yathrib to visit his father's grave. On the way back she fell ill and died at Abwa. The child was found sitting beside his mother's grave, entreating: "Mother, why don't you come home with me? Don't you know that I have no one but you in this world?"

Throughout his life he recalled her with longing. He used to say, "If my mother was alive and she had called, 'O Muhammad', while I was praying, I would have left my prayer and replied, Yes my mother!"`,
        contentUr: `عربوں کے رواج کے مطابق بچے محمد ﷺ کو قبیلہ بنو سعد کی حلیمہ سعدیہ کے حوالے کیا گیا۔ حلیمہ اور ان کے شوہر نے جلد ہی برکات محسوس کیں۔

ایک دن ان کے رضاعی بھائی عبداللہ دوڑتے ہوئے آئے — دو اجنبیوں نے ان کے قریشی بھائی کا سینہ چیر دیا۔ حدیث میں آتا ہے کہ جبرائیل عليه السلام نے سینہ کھولا، دل نکالا، دھویا اور واپس رکھ دیا۔

چھ سال کی عمر میں والدہ نے یثرب لے جا کر والد کی قبر کی زیارت کروائی۔ واپسی پر وہ بیمار ہوئیں اور ابواء میں وفات پا گئیں۔ بچے کو والدہ کی قبر کے پاس بیٹھا پایا گیا: "ماں، تم گھر کیوں نہیں چلتیں؟ تمہیں معلوم نہیں کہ اس دنیا میں تمہارے سوا میرا کوئی نہیں؟"`,
        hadithRef: `The Prophet ﷺ said: "The memory of her kindness made me cry." And: "If my mother was alive and she had called, 'O Muhammad', while I was praying, I would have left my prayer and replied, Yes my mother!"`,
        hadithRefUr: `نبی کریم ﷺ نے فرمایا: "ان کی مہربانی کی یاد نے مجھے رلا دیا۔" اور: "اگر میری والدہ زندہ ہوتیں اور مجھے نماز میں پکارتیں تو میں نماز چھوڑ کر جواب دیتا۔"`,
      },
    ],
  },
  {
    id: "ch4-blessed-support",
    title: "Chapter 4: The Blessed Support",
    titleUr: "باب 4: مبارک سہارا",
    icon: "💍",
    sections: [
      {
        heading: "Marriage with Hazrat Khadija",
        headingUr: "حضرت خدیجہ سے شادی",
        content: `At twenty five Hazrat Muhammad ﷺ had earned himself the respect of his compatriots, known as Al-Ameen (The Trustworthy) and Sadiq (The Truthful). Graceful, wise, compassionate and humble, he was the pride of his kinsmen.

Sayyida Khadija, a noble Quraishi lady, was known as Tahira (The Pure) even in days of Jahiliyah. Twice widowed with two sons and a daughter, she had inherited a great deal of wealth. With every trade caravan that left Makkah her merchandise was equivalent to that of the rest of the Quraish.

She sent a message to the 'Trustworthy' to take her merchandise to Syria and she would pay him twice the amount she paid others. Her slave Maisra told her about his remarkable character, good judgement, sound decision, his kindly disposition and fairness in all dealings. Impressed, she sent a proposal of marriage.

Hazrat Abu Talib read the Khutbah Nikah and the Mahr was fixed at five hundred golden dirhams. She was the first to believe in him and consoled him in despair. Besides her moral support she placed all her wealth at the Prophet's disposal for his noble cause. She stood faithfully by him and suffered the persecution of Quraish by his side till her death.`,
        contentUr: `پچیس سال کی عمر میں حضرت محمد ﷺ نے اپنے ہم وطنوں میں عزت کما لی تھی۔ آپ الامین اور صادق کے نام سے مشہور تھے۔

سیدہ خدیجہ نے اپنا تجارتی مال لے کر شام جانے کا پیغام بھیجا۔ ان کے غلام میسرہ نے آپ ﷺ کے کردار، اچھے فیصلے، اور انصاف پسندی کی تعریف کی۔ متاثر ہو کر انہوں نے شادی کا پیغام بھیجا۔

وہ سب سے پہلے ایمان لانے والی تھیں اور مایوسی میں آپ ﷺ کو تسلی دیتی تھیں۔ انہوں نے اپنی تمام دولت نبی ﷺ کے نیک مقصد کے لیے پیش کر دی۔`,
      },
      {
        heading: "Hilful Fuzul & Hajr-al-Aswad",
        headingUr: "حلف الفضول اور حجر اسود",
        content: `Before prophethood, the young Muhammad ﷺ participated in the famous pact of Hilful Fuzul — an agreement among the noble youth of Makkah to support the oppressed and stand for justice. The Prophet ﷺ later said about this pact that even if he were called to it in Islam, he would respond.

When the Ka'bah was being rebuilt, a dispute arose among the tribes about who would have the honour of placing the Hajr-al-Aswad (Black Stone) back in its position. The dispute nearly led to bloodshed. They agreed that the first person to enter the Haram the next morning would decide. That person was Muhammad ﷺ. He placed the stone on a cloth and asked each tribe's chief to hold a corner and lift it together. He then placed the stone himself, satisfying all parties with his wisdom.`,
        contentUr: `نبوت سے پہلے نوجوان محمد ﷺ نے مشہور حلف الفضول میں شرکت کی — مکہ کے نوجوانوں کا مظلوموں کی مدد اور انصاف کے لیے معاہدہ۔

جب کعبہ دوبارہ تعمیر ہو رہی تھی تو حجر اسود کو اس کی جگہ رکھنے کے بارے میں قبائل میں جھگڑا ہوا۔ محمد ﷺ نے پتھر کو ایک کپڑے پر رکھا اور ہر قبیلے کے سردار سے کپڑے کا کونا پکڑوا کر اٹھوایا۔ پھر آپ نے خود پتھر رکھ دیا۔`,
      },
    ],
  },
  {
    id: "ch5-jabl-e-noor",
    title: "Chapter 5: Jabl-e-Noor",
    titleUr: "باب 5: جبل نور",
    icon: "📜",
    sections: [
      {
        heading: "The First Divine Revelation",
        headingUr: "پہلی وحی",
        content: `For years after his marriage the Prophet ﷺ would go to a cave in Mt. Hira (hence called Jabl-e-Noor, the Mountain of Light) to pray. High up the panoramic view allowed both the Holy Ka'bah and Arabian Sea.

Solitude had become a passion. He waited, just as the universe thirsted for a drop of Noor. He used to spend Ramadan and more time there, returning home when his dry rations were exhausted.

One night in Ramadan — 'The Night of Power and Excellence' — the first Divine Message was revealed. The Angel Jibrail appeared and said "Read!" Startled, he said: "I cannot read." Then he felt he was being hugged so hard that he felt suffocated. He was released and the request to read was repeated. "I cannot read," said Hazrat Muhammad again. The angel again hugged him and asked to read, to which he asked, "What shall I read?"

The angel then recited: "Read in the Name of your Lord Who created. Created man from a blood clot. Read, your Lord is most Bountiful who taught by the pen, taught man that which he knew not." (Al-Alaq 96:1-5)

Shaken, he came out of the cave. He heard a voice and raising his head he saw Jibrail in the form of a man filling the whole horizon, saying "O Muhammad! You are the Messenger of Allah and I am Jibrail."`,
        contentUr: `شادی کے بعد برسوں تک نبی ﷺ غار حرا میں عبادت کے لیے جاتے رہے۔ رمضان کی ایک رات — شب قدر — پہلا الہی پیغام نازل ہوا۔ فرشتہ جبرائیل ظاہر ہوئے اور کہا "پڑھو!" آپ نے فرمایا: "میں پڑھ نہیں سکتا۔"

فرشتے نے تلاوت کی: "پڑھو اپنے رب کے نام سے جس نے پیدا کیا۔ انسان کو جمے ہوئے خون سے بنایا۔ پڑھو اور تمہارا رب بڑا کریم ہے جس نے قلم سے سکھایا، انسان کو وہ سکھایا جو وہ نہیں جانتا تھا۔" (العلق 96:1-5)`,
      },
      {
        heading: "Khadija's Consolation & Warqa's Testimony",
        headingUr: "خدیجہ کی تسلی اور ورقہ کی گواہی",
        content: `The Prophet ﷺ hastened home to his wife, greatly disturbed and shaken. He said: "O Khadija, cover me with a wrap." After regaining some strength he narrated the event and said, "I am afraid for my life."

She replied, "Never, by Allah. Allah will never disgrace you; for you keep good relations with your kith and kin, help the poor and the destitute, serve your guests generously and assist the weak."

Then Sayyidah Khadija took him to her cousin Warqa bin Naufal, a scholar of Torah and Injil (Bible). When Warqa heard the account he said, "This is the same Namoos al Akbar who had come to Musa (Moses) and Isa (Jesus). I swear by Him in whose hands Warqa's life is, Allah has chosen thee to be the Prophet of these people." Aging and going blind, Warqa said, "I wish I were young and would live up to the time when your people would turn you out."

Surprised, the Prophet ﷺ asked, "Drive me out? Would they do that?" "Yes," he said, "They will call thee a liar, they will persecute thee, they always do that."`,
        contentUr: `نبی ﷺ پریشان ہو کر گھر آئے اور فرمایا: "اے خدیجہ، مجھے چادر اوڑھا دو۔" حضرت خدیجہ نے فرمایا: "ہرگز نہیں، اللہ کی قسم۔ اللہ آپ کو کبھی رسوا نہیں کرے گا۔"

پھر وہ آپ کو اپنے کزن ورقہ بن نوفل کے پاس لے گئیں۔ ورقہ نے کہا: "یہ وہی ناموس اکبر ہے جو موسیٰ اور عیسیٰ پر آیا تھا۔ اللہ نے آپ کو ان لوگوں کا نبی چنا ہے۔"`,
        source: "Sahih al-Bukhari 3",
      },
    ],
  },
  {
    id: "ch6-hardships",
    title: "Chapter 6: The Hardships",
    titleUr: "باب 6: مشکلات",
    icon: "⚔️",
    sections: [
      {
        heading: "The First Believers",
        headingUr: "پہلے ایمان لانے والے",
        content: `The first people who accepted him as the Prophet of Allah were those closest to him: Sayyidah Khadija, his wife being the first among women; Sayyidna Ali among children; Zaid, the freed slave and close confidant; and among men Abu Bakr, his friend and Companion for years.

Hazrat Abu Bakr was a wealthy merchant, a man respected for his clear calm judgment. His unhesitating acceptance of the new faith had a great moral effect. Five notables followed his footsteps, among them Hazrat Usman who afterwards became the third Caliph, Saad bin Abi Waqas, afterwards the conqueror of Persia.

Most of those who came to the Prophet and accepted Islam were knowledgeable and pious men, disturbed by the idolatry of Arabs, looking for the truth. "Allah created Bani Adam, He cast a look at their hearts and chose the best among them to be the Companions of the Prophet."`,
        contentUr: `سب سے پہلے ایمان لانے والے آپ ﷺ کے قریب ترین لوگ تھے: خواتین میں سیدہ خدیجہ، بچوں میں سیدنا علی، آزاد کردہ غلام زید، اور مردوں میں ابوبکر۔

حضرت ابوبکر دولتمند تاجر تھے۔ ان کے فوری ایمان لانے کا بڑا اخلاقی اثر ہوا۔ پانچ معززین نے ان کی پیروی کی جن میں حضرت عثمان اور سعد بن ابی وقاص شامل تھے۔`,
      },
      {
        heading: "Persecution of Muslims",
        headingUr: "مسلمانوں پر ظلم",
        content: `The teachings of Islam attracted the downtrodden, the slaves, the poor and unprotected. Quraish decided that each household would handle their own offspring. Beaten up, bound, starved and emotionally blackmailed, yet none reverted.

Omayya bin Khalaf reduced his slave Bilal to the verge of death, daily inventing a novel way of breaking the will of the black slave. Starved and famished under the weight of heavy rock in the scorching sun, Bilal was offered the alternative — revert or die. He refused. "Ahad, Ahad" (One, One) he whispered.

Hazrat Abu Bakr ransomed him and six other hapless slaves and set them free. Freed, Bilal became the shadow of his beloved Master, the Prophet, and became his Muezzin.

Summayyah and her husband Yasir were tortured and killed before the eyes of their son Ammar bin Yasir. Summayyah was the first woman to die for her faith.

Once Abu Jahl placed the stomach of a slaughtered camel over the Prophet's head while he prostrated in prayer. The pagans stood laughing and jeering while he struggled. A Muslim slipped quietly to bring help. He warned Prophet's daughter who ran to the rescue of her father, knowing it was a matter of life and death.`,
        contentUr: `امیہ بن خلف نے اپنے غلام بلال کو ہر روز نئے طریقے سے عذاب دیا۔ دھوپ میں بھاری پتھر تلے، بلال کو کلمہ چھوڑنے یا مرنے کا اختیار دیا گیا۔ انہوں نے انکار کیا۔ "احد، احد" وہ سرگوشی کرتے رہے۔

حضرت ابوبکر نے انہیں اور چھ دوسرے بے سہارا غلاموں کو آزاد کرایا۔ سمیہ اور ان کے شوہر یاسر کو ان کے بیٹے عمار کی آنکھوں کے سامنے شہید کیا گیا۔ سمیہ پہلی خاتون شہید تھیں۔`,
      },
    ],
  },
  {
    id: "ch7-shib-e-abi-talib",
    title: "Chapter 7: Shi'b-e-Abi Talib",
    titleUr: "باب 7: شعب ابی طالب",
    icon: "🏔️",
    sections: [
      {
        heading: "The Blockade",
        headingUr: "محاصرہ",
        content: `As the sufferings of the Muslims became unbearable, the Prophet ﷺ advised them to take refuge in Abyssinia, where Najashi, a pious king ruled. In 615 A.D., fifteen men left, soon joined by more till they were 83 men and 18 women.

Furious, Quraish sent their deputies with presents for the king to bring them back. After listening to what the Muslims had to say, the king refused to hand them over.

Angered, Quraish connived to crush the Prophet and his protective clan Bani Hashim. They bound themselves with a solemn document hung in Ka'bah, to boycott all transactions with Bani Hashim till they hand over the Prophet to kill. For three years they lived in the narrow mountain pass of Shi'b-e-Abi Talib. Their provisions exhausted, the cries of hungry children could be heard outside. They lived on leaves of Talh, and occasional help smuggled by relatives.

Finally, some chiefs felt guilty. They went to Haram and tore down the document. A wave of foreboding went through the crowd when they saw that except for the name of Allah all the document was eaten by termite.

This was the 10th year of prophethood — the Year of Mourning. Hazrat Abu Talib and Sayyidah Khadija both died within a short interval. The Prophet said, "Khadija's love was given to me by Allah. She hailed my mission when everyone was against it. How can I forget her?"`,
        contentUr: `جب مسلمانوں پر ظلم ناقابل برداشت ہو گئے تو نبی ﷺ نے حبشہ ہجرت کی صلاح دی۔ قریش نے غصے میں آ کر بنو ہاشم کا بائیکاٹ کیا۔ تین سال تک شعب ابی طالب کی تنگ گھاٹی میں رہے۔ بھوکے بچوں کی چیخیں باہر سنائی دیتی تھیں۔

آخرکار کچھ سرداروں نے معاہدہ پھاڑ دیا۔ سب نے دیکھا کہ اللہ کے نام کے سوا سارا معاہدہ دیمک کھا گئی تھی۔

یہ غم کا سال تھا — حضرت ابو طالب اور سیدہ خدیجہ دونوں تھوڑے وقفے سے وفات پا گئے۔`,
      },
    ],
  },
  {
    id: "ch8-miraj",
    title: "Chapter 8: The Miraculous Ascension",
    titleUr: "باب 8: معراج",
    icon: "🌌",
    sections: [
      {
        heading: "The Night Journey (Isra & Mi'raj)",
        headingUr: "شب معراج",
        content: `Allah Almighty invited his beloved Prophet ﷺ to meet Him in heavens at the time when the oppression was at its worst. This indeed was the hour of human triumph. The experience was a great source of comfort and strength. None had ever been there before nor will ever again.

Jibrail came at night while the Prophet was in Ume-Hani's house. He brought Buraq from heaven. Quran mentions in Surah Bani Israil: "Glorified is He Who carried His servant in a part of the night from the Sacred Mosque to the Aqsa Mosque…" (17:1)

This miraculous journey comprised of two stages: from Makkah to Masjid-al-Aqsa (Jerusalem), and then up into the heavens. At Bait-ul-Muqaddas the Prophet ﷺ led the congregational prayers of all the Prophets. He met the blessed prophets stationed on each heaven, such as Sayyidna Musa on the sixth and Sayyidna Ibrahim on the seventh, reclining against the wall of the Bait-e-Ma'mur.

The Prophet reached the plain where he heard the sound of the pen writing destinies. He saw Sidratul-Muntaha, the far tree in Jannah. Here the gift of five prescribed prayers was given — 'The Mi'raj for the Muslims'.

On the way back, the Angel Jibrail said, "Yes, but for Abu Qahafa" — confirming Hazrat Abu Bakr would believe. Hence Hazrat Abu Bakr earned his name Siddique (the testifier of truth).`,
        contentUr: `اللہ تعالیٰ نے اپنے محبوب نبی ﷺ کو آسمانوں پر ملاقات کی دعوت دی جب ظلم عروج پر تھا۔ جبرائیل رات کو آئے اور براق لائے۔

یہ سفر دو مرحلوں پر مشتمل تھا: مکہ سے مسجد اقصیٰ اور پھر آسمانوں تک۔ بیت المقدس میں نبی ﷺ نے تمام انبیاء کی نماز کی امامت کی۔ یہاں پانچ نمازوں کا تحفہ ملا — 'مسلمانوں کا معراج'۔

واپسی پر حضرت ابوبکر نے بغیر کسی ہچکچاہٹ کے تصدیق کی اور صدیق کا لقب پایا۔`,
      },
    ],
  },
  {
    id: "ch9-journey-to-taif",
    title: "Chapter 9: Journey to Taif",
    titleUr: "باب 9: سفر طائف",
    icon: "🚶",
    sections: [
      {
        heading: "Rejection at Taif",
        headingUr: "طائف میں رد",
        content: `With both his uncle Abu Talib and dear wife Khadija gone, the Prophet ﷺ decided to take the message beyond Makkah to Taif, a mountainous town southeast of Makkah. He went on foot with Zaid bin Haritha.

The chiefs of Taif refused to listen and set the rogues and slaves to hurl stones and abuse at the Prophet. Bleeding and exhausted, he took shelter in a garden. The angel of the mountains appeared and offered to crush the people of Taif between two mountains. But the Prophet ﷺ refused, saying: "Perhaps Allah will raise from their descendants people who will worship Allah alone."

On reaching Hira (the cave on the outskirts of Makkah) the Prophet called Abdullah bin Areeqat and sent him to Mut'im bin Adi, asking him for protection to enter Makkah. Mut'im, along with his six well armed sons, took the Prophet to Ka'bah and stood guard while the Prophet performed Tawaf.`,
        contentUr: `چچا ابو طالب اور بیوی خدیجہ دونوں کے انتقال کے بعد نبی ﷺ نے طائف کا سفر کیا۔ طائف کے سرداروں نے سننے سے انکار کر دیا اور بدمعاشوں کو پتھر مارنے پر لگا دیا۔

پہاڑوں کا فرشتہ آیا اور طائف والوں کو دو پہاڑوں کے درمیان کچل دینے کی پیشکش کی۔ لیکن نبی ﷺ نے انکار فرمایا: "شاید اللہ ان کی اولاد سے ایسے لوگ پیدا کرے جو صرف اللہ کی عبادت کریں۔"`,
        hadithRef: `The Prophet ﷺ said to Zaid: "O Zaid, Allah Almighty Himself will ease this difficulty. Verily Allah will make His religion prevail and help His Prophet."`,
        hadithRefUr: `نبی ﷺ نے زید سے فرمایا: "اے زید، اللہ تعالیٰ خود اس مشکل کو آسان کرے گا۔ بے شک اللہ اپنے دین کو غالب کرے گا اور اپنے نبی کی مدد کرے گا۔"`,
      },
    ],
  },
  {
    id: "ch10-hijrah",
    title: "Chapter 10: Hijrah to Madinah",
    titleUr: "باب 10: ہجرت مدینہ",
    icon: "🐪",
    sections: [
      {
        heading: "The Pledges of Aqabah",
        headingUr: "بیعت عقبہ",
        content: `In the 11th year of Prophethood, six men from Yathrib came upon the Prophet at Hajj. Struck with the truth, they became his followers and spread the news in their city. The next year twelve deputies took the first pledge of Aqabah at Mina. Mus'ab bin Umair was sent to teach them Islam.

The following year, 72 people came and took the second pledge: "We will worship none but Allah, observe the principles of Islam, obey the Prophet and defend him as we do our women and children." True to their words these men of honour defended the Prophet with their lives and never asked for any worldly rewards.`,
        contentUr: `نبوت کے گیارہویں سال یثرب کے چھ آدمیوں نے حج کے موقع پر نبی ﷺ سے ملاقات کی۔ اگلے سال بارہ نمائندوں نے منیٰ میں پہلی بیعت عقبہ کی۔ پھر اگلے سال 72 لوگوں نے دوسری بیعت لی۔`,
      },
      {
        heading: "The Migration",
        headingUr: "ہجرت",
        content: `Quraish, fearing the escape of the Prophet, convened a meeting and accepted Abu Jahl's suggestion: chosen men from different tribes should together strike to put an end to the Prophet. At night the assassins were posted outside his house.

The Prophet was foretold the plan by Jibrail. He asked Hazrat Ali to sleep in his bed. He recited Surah Yasin verse 9: "And we have set a bar before them and a bar behind them, and have covered them so that they see not." He stepped out, went past the sentries who couldn't see him.

Together with Hazrat Abu Bakr, they hid in the cave of Mt. Thaur. Hazrat Abu Bakr became worried: "We are but two." The Prophet comforted him: "Nay, we are three. O Abu Bakr what do you say about the two whose constant Companion is Allah?" Quran quoted: "Grieve not, Surely Allah is with us." (Al-Tawba 9:40)

They saw a spider's web intact on the mouth of the cave and a pigeon had built a nest and laid eggs, so the pursuers turned away.

The Prophet ﷺ arrived in Madinah on Friday, 16th of Rabi 1, 2nd of July 622 A.D. The entire city was resonant with Takbeer. Girls of Banu Najjar sang the welcome: "The full moon has risen over us…"`,
        contentUr: `قریش نے رات کو قاتل نبی ﷺ کے گھر کے باہر لگا دیے۔ آپ نے حضرت علی کو اپنے بستر پر سونے کا کہا۔ سورۃ یٰسین کی آیت پڑھ کر نکلے، پہرے دار آپ کو دیکھ نہیں سکے۔

ابوبکر کے ساتھ غار ثور میں چھپے۔ ابوبکر نے کہا: "ہم صرف دو ہیں۔" آپ نے فرمایا: "نہیں، تین ہیں۔ اللہ ہمارے ساتھ ہے۔" مکڑی نے جالا بن لیا اور کبوتر نے انڈے دیے — تعاقب کرنے والے واپس ہو گئے۔

نبی ﷺ مدینہ پہنچے۔ بنو نجار کی لڑکیوں نے استقبالیہ نظم پڑھی: "چودھویں کا چاند ہم پر طلوع ہوا…"`,
      },
    ],
  },
  {
    id: "ch11-battle-of-badr",
    title: "Chapter 11: Battle of Badr",
    titleUr: "باب 11: جنگ بدر",
    icon: "⚔️",
    sections: [
      {
        heading: "The First Great Battle",
        headingUr: "پہلی عظیم جنگ",
        content: `On 17th of Ramadan 2 A.H. (March 624 A.D.), the Battle of Badr, the first major battle of Islam, took place. 313 Muslims with few resources faced over 1000 well-armed Makkan warriors.

The Prophet ﷺ prayed with tears: "O Allah, if these few people perish today then You will not be worshipped till Qiyamah." Sayyidna Abu Bakr comforted him: "Messenger of Allah! Surely, Allah will fulfill His promise." He was peaceful and recited: "Soon shall the multitude be routed and they shall turn their backs." (Al-Qamar 54:45)

The two forces symbolic of Truth and falsehood, light and darkness, faced one another. The Prophet gave blessed tidings of victory and with his stick showed where by the end of the day the dead bodies of the enemy chiefs would be found.

Hazrat Hamza, Hazrat Ali and Hazrat Obaidah defeated Utbah, Waleed and Shaybah in single combat. Two young Ansar brothers, Mu'awwiz and Mu'az, eliminated Abu Jahl, 'the Pharaoh of this Ummah'.

Seventy of the enemy were killed and seventy became prisoners. Only fourteen Muslims were martyred. The Prophet ﷺ gave strict orders to treat the prisoners kindly. Among the poor, the literate were granted freedom for teaching ten Muslim children each to read and write.`,
        contentUr: `17 رمضان 2 ہجری (مارچ 624 عیسوی) کو جنگ بدر ہوئی۔ 313 مسلمانوں نے 1000 سے زیادہ مسلح مکی جنگجوؤں کا سامنا کیا۔

نبی ﷺ نے آنسوؤں سے دعا کی: "اے اللہ، اگر یہ چند لوگ آج ہلاک ہو گئے تو قیامت تک تیری عبادت نہیں ہوگی۔"

حضرت حمزہ، حضرت علی اور حضرت عبیدہ نے عتبہ، ولید اور شیبہ کو مقابلے میں شکست دی۔ دشمن کے ستر مارے گئے اور ستر قیدی بنے۔ صرف چودہ مسلمان شہید ہوئے۔`,
      },
    ],
  },
  {
    id: "ch12-battle-of-uhad",
    title: "Chapter 12: Battle of Uhad",
    titleUr: "باب 12: جنگ احد",
    icon: "🛡️",
    sections: [
      {
        heading: "The Test at Uhad",
        headingUr: "احد کی آزمائش",
        content: `The Makkans marched 3000 men to avenge their defeat at Badr. The Prophet ﷺ marched out with 1000 men, but Abdullah bin Ubayy defected with 300, reducing the Muslim force to 700.

The Prophet ﷺ posted 50 archers under Abdullah bin Jubayr to protect the rear with strict orders not to leave their post whatever happened. The initial attack of the Quraish was bravely repulsed. But when Muslim archers left their post to collect booty, Khalid bin Waleed attacked from the rear.

The Prophet ﷺ with only nine Companions became the chief object of assault. When asked "Who will deal with them?" Talha said "I will!" Talha shielded the Prophet with both his shield and his body, requesting him not to raise his head. He received over eighty wounds.

Wiping the blood from his face the Prophet ﷺ prayed: "O Allah, forgive my people, they do not know." Seventy Muslims were martyred including Hazrat Hamza. Yet the faith of the Companions remained unshaken.

The Prophet ﷺ said about his uncle Hamza: "If ever I have ascendency over the Quraish I will mutilate thirty of their dead." But the verse was revealed: "And if you punish, let your punishment be proportionate… But if you endure patiently, verily it is better for the patient." (16:126) The Prophet ﷺ forgave and forbade mutilation.`,
        contentUr: `مکہ والے بدر کا بدلہ لینے 3000 کی فوج لے کر آئے۔ نبی ﷺ 1000 کے ساتھ نکلے لیکن عبداللہ بن ابی 300 لے کر واپس ہو گیا۔

جب تیراندازوں نے مال غنیمت جمع کرنے کے لیے اپنی جگہ چھوڑی تو خالد بن ولید نے پیچھے سے حملہ کیا۔ نبی ﷺ نے خون صاف کرتے ہوئے دعا کی: "اے اللہ میری قوم کو معاف فرما، وہ نہیں جانتے۔" ستر مسلمان شہید ہوئے جن میں حضرت حمزہ بھی شامل تھے۔`,
      },
    ],
  },
  {
    id: "ch13-battle-of-trench",
    title: "Chapter 13: Battle of the Trench",
    titleUr: "باب 13: جنگ خندق",
    icon: "🏗️",
    sections: [
      {
        heading: "Ghazwa-e-Ahzab (Khandaq)",
        headingUr: "غزوہ احزاب (خندق)",
        content: `Quraish formed a coalition of 10,000 to destroy the Muslims once and for all. The Prophet ﷺ, on the suggestion of Salman Farsi, ordered a trench to be dug around Madinah — a tactic unknown to Arabs.

While digging, the Prophet struck a rock and it broke with sparks. He said: "I have been given the keys of Syria." After the second strike: "I have been given the keys of Persia and I am seeing the white palace of Madain." After the third: "I have been given keys of Yemen." These prophecies were fulfilled within a short time.

The enemy was compelled to lay siege. They were not prepared for the wide trench. Sayyidna Ali, with a few Companions, sealed a breach and put an end to the giant warrior Amr bin Abdwud in single combat.

After twenty-five days, a storm of wind and rain put off the fires of pagans, blew their tents, and their morale. Returning to the city the Prophet said: "Now we will raid them, they will not raid us. Now our army will go to them." (Sahih Bukhari)`,
        contentUr: `قریش نے 10,000 کا اتحاد بنا کر مسلمانوں کو ختم کرنے کا منصوبہ بنایا۔ نبی ﷺ نے سلمان فارسی کے مشورے پر خندق کھدوائی۔

خندق کھودتے ہوئے آپ نے پتھر مارا اور فرمایا: "مجھے شام کی چابیاں دی گئی ہیں۔" پھر: "فارس کی چابیاں۔" پھر: "یمن کی۔" یہ پیشگوئیاں تھوڑے عرصے میں پوری ہوئیں۔

پچیس دن بعد طوفان نے دشمن کا حوصلہ پست کر دیا۔ نبی ﷺ نے فرمایا: "اب ہم ان پر چڑھائی کریں گے، وہ ہم پر نہیں۔" (صحیح بخاری)`,
      },
    ],
  },
  {
    id: "ch14-conquest-of-makkah",
    title: "Chapter 14: Conquest of Makkah",
    titleUr: "باب 14: فتح مکہ",
    icon: "🕋",
    sections: [
      {
        heading: "Treaty of Hudaibiyah",
        headingUr: "صلح حدیبیہ",
        content: `The Prophet ﷺ announced his intention of visiting Ka'bah for Umrah. 700 men, perfectly unarmed, set out. Quraish barred the way. Muslims camped at Hudaibiya. After negotiations the Prophet agreed to terms of truce that all hostilities should cease for ten years and Muslims could come for Umrah the next year.

The truce gradually paved the way for the conquest of Makkah. People came from far and wide in response to the call of the Prophet. Some men of influence among Quraish, like Khalid bin Waleed, accepted Islam. The Prophet gave him the distinctive title of 'Saifullah' — The Sword of Allah.`,
        contentUr: `نبی ﷺ نے 700 بے ہتھیار ساتھیوں کے ساتھ عمرے کا ارادہ کیا۔ قریش نے روکا۔ حدیبیہ میں معاہدہ ہوا جس نے فتح مکہ کی راہ ہموار کی۔ خالد بن ولید جیسے بااثر لوگوں نے اسلام قبول کیا۔ نبی ﷺ نے انہیں سیف اللہ کا لقب دیا۔`,
      },
      {
        heading: "The Victorious Entry",
        headingUr: "فاتحانہ داخلہ",
        content: `When Quraish violated the treaty, the Prophet ﷺ marched 10,000 armed men towards Makkah in complete secrecy on 10th Ramadan 8 A.H. He commanded each man to kindle his own fire at night. At the sight of innumerable fires the Quraish were daunted.

The 360 idols of the nation were struck down. The Prophet ﷺ fell each idol with the edge of his staff, saying: "Truth has come, and falsehood vanishes; indeed falsehood is to vanish." (Quran 17:81)

He delivered his address of victory: "There is no god but Allah, the One. He has no partner. He has fulfilled His promise. All family pride, vengeance, blood money are under my feet. O men of Quraish! Allah has erased pride of jahiliya and pride in ancestors. All people are descendants of Adam and Adam was created from dust."

Then turning towards the tyrants of Quraish: "O descendants of Quraish, what do you think, how am I going to treat you?" They responded: "You are a noble brother, son of noble brothers." The Prophet said: "I shall say to you as Yousuf said to his brothers: There is no blame on you today. Go, you are at liberty."`,
        contentUr: `نبی ﷺ 10 رمضان 8 ہجری کو 10,000 مسلح ساتھیوں کے ساتھ مکہ کی طرف چلے۔ 360 بت توڑے گئے۔ آپ ﷺ نے ہر بت کو اپنی لاٹھی سے گرایا: "حق آ گیا اور باطل مٹ گیا۔"

قریش کے ظالموں سے پوچھا: "تمہارے خیال میں میں تمہارے ساتھ کیا سلوک کروں گا؟" انہوں نے کہا: "آپ شریف بھائی ہیں۔" آپ نے فرمایا: "آج تم پر کوئی الزام نہیں۔ جاؤ تم آزاد ہو۔"`,
      },
    ],
  },
  {
    id: "ch15-other-ghazwat",
    title: "Chapter 15: Other Important Ghazwat",
    titleUr: "باب 15: دیگر اہم غزوات",
    icon: "🗡️",
    sections: [
      {
        heading: "Battle of Hunain & Siege of Taif",
        headingUr: "غزوہ حنین اور محاصرہ طائف",
        content: `After the conquest of Makkah, the Bedouin tribes Hawazin, Thakif and others formed a confederation. The Prophet ﷺ marched out with 12,000 men. Some Companions remarked: "Who can defeat us today?" Allah disapproved. Quran says: "And remember the day of Hunain when you relied on your strength but it was of no avail to you." (Surah Tauba:25)

In the narrow valley of Hunain, a rain of arrows rendered the army helpless. Left alone, the Prophet ﷺ stood his ground and called: "O men of Ansar!" "Here we are!" came the instant response. The tables were turned. After the victory, he generously distributed spoils to new Makkan converts.

The Ansar felt concerned. The Prophet ﷺ addressed them: "O Ansar, why disturb your hearts for worldly things? Does it not please you that others take away camels and goats while you return home with Muhammad in your midst?" They wept and said, "Yes, Prophet of Allah. We are well satisfied with our share."`,
        contentUr: `فتح مکہ کے بعد بدو قبائل نے اتحاد بنایا۔ حنین کی تنگ وادی میں تیروں کی بارش سے فوج بے بس ہوئی۔ اکیلے کھڑے نبی ﷺ نے پکارا: "اے انصار!" فوراً جواب آیا: "ہم حاضر ہیں!" پلٹا پڑا اور فتح ہوئی۔

انصار سے فرمایا: "کیا تمہیں خوشی نہیں کہ لوگ اونٹ اور بکریاں لے جائیں اور تم محمد ﷺ کو ساتھ لے کر گھر جاؤ؟" وہ رو پڑے: "ہاں یا رسول اللہ، ہم خوش ہیں۔"`,
      },
      {
        heading: "Battle of Khaiber",
        headingUr: "غزوہ خیبر",
        content: `The Jewish tribes expelled from Madinah for treachery took refuge at Khaiber and formed another league to uproot the Muslims. The Prophet marched 1600 men on 6th Muharram 7 A.H.

Their forts fell one by one. At the most formidable castle Al-Qamus, the standard was given to Sayyidna Ali ﷺ, who in single combat faced the fiercest warrior Marhab and struck him a deadly blow. After a fierce battle, the fortress fell. The Jews asked forgiveness, which was granted.`,
        contentUr: `مدینہ سے نکالے گئے یہودی قبائل خیبر میں پناہ لے کر مسلمانوں کے خلاف اتحاد بنا رہے تھے۔ قلعے ایک ایک کر کے فتح ہوئے۔ سب سے مضبوط قلعے القاموس پر حضرت علی نے جھنڈا اٹھایا اور مرحب کو شکست دی۔`,
      },
      {
        heading: "Ghazwa-e-Mauta & Tabook",
        headingUr: "غزوہ موتہ اور تبوک",
        content: `In 8 A.H. an expedition of 3000 Muslims was sent to avenge the murder of a Muslim envoy near Syria. It was at Mauta that the Prophet gave the title 'Sword of Allah' to Khalid bin Waleed. Khalid fought the bloodiest battles but was never defeated.

In 9 A.H. the Prophet led 30,000 men towards Tabook against the threat of Roman invasion. He waited for twenty days but the enemy did not show up. Historians say Heraclius feared facing the Prophet in battle.

Tabook was the last military expedition in which the Holy Prophet personally took part. When returning, his habit was to first offer two raka't of prayer in the mosque, then visit his daughter Hazrat Fatima before visiting his wives. Upon seeing his drawn face, Fatima wept. The Prophet ﷺ said: "Do not cry Fatima! Verily that with which Allah has sent your father, not a house will remain on the face of this earth but Allah will enter it."`,
        contentUr: `8 ہجری میں 3000 مسلمانوں کو شام بھیجا گیا۔ موتہ میں خالد بن ولید کو سیف اللہ کا لقب ملا۔

9 ہجری میں نبی ﷺ 30,000 ساتھیوں کے ساتھ تبوک کی طرف چلے۔ یہ آخری غزوہ تھا جس میں نبی ﷺ نے ذاتی طور پر شرکت کی۔ واپسی پر حضرت فاطمہ رو پڑیں۔ آپ نے فرمایا: "فاطمہ رو نہ، جو اللہ نے تمہارے باپ کو دے کر بھیجا ہے، زمین پر کوئی گھر نہیں بچے گا جس میں اللہ اسے داخل نہ کرے۔"`,
      },
    ],
  },
  {
    id: "ch16-last-hajj",
    title: "Chapter 16: The Last Pilgrimage",
    titleUr: "باب 16: حجۃ الوداع",
    icon: "🕌",
    sections: [
      {
        heading: "The Farewell Sermon",
        headingUr: "خطبہ حجۃ الوداع",
        content: `In 10 A.H. the Prophet ﷺ set out for Makkah with an immense multitude. On 9th Zul Hajj, the assembled multitude was 140,000.

Sitting on his camel, the Prophet ﷺ addressed the people:

"O people, listen to me carefully! For I know not whether I shall meet you here the next year. Your lives and property are sacred and inviolable among one another. Just as this day and this month is sacred and you will have to appear before your Lord.

O people! Fear Allah in relation to women. Treat your wives kindly. Your slaves, your slaves! Feed them the same as you eat. Clothe them the same as you wear. I warn you about your neighbours. All Muslims are brothers.

I am leaving in your midst that, which if you hold on to, you will not go astray — the Book of Allah and my Sunnah. Remember after me there will be no Prophet and after you, no Ummah."

He asked: "O people! When you shall be questioned about me what will you reply?" They responded: "We bear witness that you have delivered the message and fulfilled the obligation." Raising his index finger to the sky he said thrice: "O Allah, be my witness!"

Then the verse was revealed: "Today I have perfected your Deen for you and completed my favour upon you and have chosen Islam for you as your religion." (Al-Maidah:3)`,
        contentUr: `10 ہجری میں نبی ﷺ نے حج کیا۔ 9 ذی الحج کو 140,000 لوگوں کا اجتماع تھا۔

آپ نے فرمایا: "اے لوگو! غور سے سنو! مجھے نہیں معلوم کہ اگلے سال تم سے یہاں ملاقات ہو یا نہ ہو۔ تمہاری جانیں اور مال ایک دوسرے پر حرام ہیں۔ عورتوں کے بارے میں اللہ سے ڈرو۔ اپنی بیویوں سے اچھا سلوک کرو۔

میں تم میں وہ چیز چھوڑ رہا ہوں جسے پکڑے رہو گے تو گمراہ نہ ہوگے — اللہ کی کتاب اور میری سنت۔"

پھر آیت نازل ہوئی: "آج میں نے تمہارے دین کو مکمل کر دیا اور اسلام کو تمہارے لیے دین پسند کیا۔" (المائدہ:3)`,
      },
    ],
  },
  {
    id: "ch17-departure",
    title: "Chapter 17: To the Eternal World",
    titleUr: "باب 17: دارالآخرت کی طرف",
    icon: "🕯️",
    sections: [
      {
        heading: "The Last Days",
        headingUr: "آخری ایام",
        content: `Close to his departure, the Prophet ﷺ went late one night to Jannat-al-Baqie and prayed by the tombs of his Companions. His illness started with a headache followed by fever.

He said: "Be witness to my salam for you and for those of my brothers who are absent and for those who will enter your Deen after me. I appoint you as witness to my Salam to them from this day to the day of Judgment."

The last time he appeared in Masjid-e-Nabvi, supported by his cousins Hazrat Ali and Fazl bin Abbas. He smiled, and the Companions thought he would emerge. He indicated with his hand to carry on with the prayer and lowered the curtain. That was the last glimpse of the beloved for many.

Jibrail came and said: "Allah is desirous to meet you." The Prophet inquired, "What will happen to my Ummah after me?" The answer came: "You would be made happy as far as your Ummah is concerned." He replied: "Muhammad will not be happy for as long as a single person from my Ummah is in Hell."

The Angel of Death came and sought permission. The Prophet replied: "Take me to my Supreme Companion." With his last breath he whispered: "O Allah, my Ummah! My Ummah!"

With heavy hearts, amid sobs and silent tears, the Prophet ﷺ was put to rest in the apartment of Sayyidah Ayesha — where now stands his Mausoleum of the Enchanting Green Dome. More than fourteen centuries have passed but time has made no difference to the devotion and love he inspired.`,
        contentUr: `آخری ایام میں آپ ﷺ جنت البقیع گئے اور صحابہ کی قبروں پر دعا کی۔ بخار شروع ہوا۔

آخری بار مسجد نبوی میں آئے، سیدنا علی اور فضل بن عباس کے سہارے۔ مسکرائے — صحابہ سمجھے آپ باہر آئیں گے۔ لیکن ہاتھ سے اشارہ کیا اور پردہ گرا دیا۔

جبرائیل آئے: "اللہ آپ سے ملنا چاہتا ہے۔" آپ نے پوچھا: "میری امت کا کیا ہوگا؟" جواب ملا: "آپ کی امت کے بارے میں آپ کو خوش کیا جائے گا۔" آپ نے فرمایا: "جب تک میری امت کا ایک فرد بھی جہنم میں ہے محمد خوش نہیں ہوگا۔"

ملک الموت آئے اور اجازت مانگی۔ آپ نے فرمایا: "مجھے اپنے اعلیٰ رفیق تک لے چلو۔" آخری سانس میں فرمایا: "اے اللہ میری امت! میری امت!"

سیدہ عائشہ کے حجرے میں آپ کو سپرد خاک کیا گیا — جہاں آج سبز گنبد کا مزار ہے۔`,
      },
    ],
  },
  {
    id: "ch18-miracles",
    title: "Chapter 18: Miracles",
    titleUr: "باب 18: معجزات",
    icon: "✨",
    sections: [
      {
        heading: "The Greatest Miracle — Quran",
        headingUr: "سب سے بڑا معجزہ — قرآن",
        content: `The entire life of the Prophet ﷺ is full of miracles. Quran, the Divine Book, is the grandest miracle given to him. It addresses all aspects of human life — spiritual, physical, economic, political and scientific — and is being constantly proved correct by the latest scientific discoveries. It is free from human intervention, without the change of a single letter, even after more than fourteen centuries.

Allah Himself protects His Divine Word: "Verily We have revealed this Book and We are its Protector." (Surah Al-Hijr:9)`,
        contentUr: `نبی کریم ﷺ کی پوری زندگی معجزات سے بھری ہے۔ قرآن سب سے بڑا معجزہ ہے۔ چودہ صدیوں بعد بھی ایک حرف نہیں بدلا۔ اللہ فرماتا ہے: "بے شک ہم نے یہ کتاب نازل کی ہے اور ہم اس کے محافظ ہیں۔" (الحجر:9)`,
      },
      {
        heading: "Spring of Water & Other Miracles",
        headingUr: "چشمہ آب اور دیگر معجزات",
        content: `During a journey, the Companions informed the Prophet of the shortage of water. He asked for some water in a bowl. A very small quantity was brought. He put his fingers into that bowl and water gushed out in springs from the gaps of his fingers. One by one all the Companions drank to their fill.

During Ghazwa-e-Tabook, crossing the desert in intense heat, water ran out. The Prophet put his hand into a nearly dry spring, and the flow greatly increased. It is reported that 1400 Companions drank from it, filled their canteens, did ablution and gave water to their animals.

At the Battle of Badr, Hazrat Rafia's eye was injured by an arrow. The Prophet ﷺ touched it and prayed — his eye was immediately restored and was fine all his life.

Hazrat Qatada at Uhad took arrows aimed at the Prophet. One struck his eye and burst it. With his streaming eye and the eyeball in his hand, he turned to the Prophet who pressed his eyeball back into the socket and prayed. His eye and sight were restored.`,
        contentUr: `ایک سفر میں پانی ختم ہو گیا۔ آپ ﷺ نے پیالے میں انگلیاں ڈالیں اور انگلیوں کے درمیان سے چشمے پھوٹ پڑے۔ تمام صحابہ نے سیراب ہو کر پیا۔

غزوہ تبوک میں صحرا عبور کرتے ہوئے پانی ختم ہوا۔ آپ نے خشک چشمے میں ہاتھ ڈالا اور پانی بہنے لگا — 1400 صحابہ نے پیا، مشکیزے بھرے، وضو کیا اور جانوروں کو پلایا۔

جنگ بدر میں حضرت رافع کی آنکھ زخمی ہوئی۔ نبی ﷺ نے چھوا اور دعا کی — فوراً ٹھیک ہو گئی۔`,
      },
    ],
  },
  {
    id: "ch19-day-of-promise",
    title: "Chapter 19: The Day of Promise",
    titleUr: "باب 19: عہد کا دن",
    icon: "🌟",
    sections: [
      {
        heading: "The First Creation",
        headingUr: "پہلی تخلیق",
        content: `Prophet Muhammad ﷺ was destined to be the last in the long line of Prophets, finalizing and sealing the institution of Prophethood. But he was the first to be created. A Companion asked the Prophet: "What did Allah create first?" He replied: "The Noor (light) of your Prophet."

That was before the creation of the universe and the souls. Allah says He was a hidden Treasure — the desire to be known arose in Him, so He created.

On the Day of Promise, Allah created and called forth all the souls and asked: "Am I not your Rabb?" (7:172) Amazed and speechless at perceiving the Grandeur of Allah, no one could utter a word. The silence was broken by the voice of Prophet Muhammad ﷺ: "Yes, why not, my Rabb?" The multitude found their voice: "Yes, why not?"

The Prophet ﷺ said: "I am the answer to the prayer of my father Ibrahim." While Ibrahim and Ismail were raising the walls of Ka'bah, Ibrahim supplicated for a Prophet in his generation. "I am the Divine Prophecy of my brother Hazrat Isa who revealed that after me a Prophet is going to come, his name will be Ahmed."`,
        contentUr: `نبی کریم ﷺ خاتم الانبیاء تھے لیکن سب سے پہلے پیدا کیے گئے۔ ایک صحابی نے پوچھا: "اللہ نے سب سے پہلے کیا بنایا؟" فرمایا: "تمہارے نبی کا نور۔"

عہد کے دن اللہ نے تمام روحوں کو پکارا: "کیا میں تمہارا رب نہیں؟" کوئی بول نہ سکا۔ خاموشی نبی ﷺ کی آواز سے ٹوٹی: "ہاں، کیوں نہیں، میرے رب!" سب نے کہا: "ہاں، کیوں نہیں۔"

آپ نے فرمایا: "میں اپنے باپ ابراہیم کی دعا کا جواب ہوں۔" اور "میں اپنے بھائی عیسیٰ کی بشارت ہوں جنہوں نے فرمایا تھا میرے بعد ایک نبی آئے گا جس کا نام احمد ہوگا۔"`,
      },
    ],
  },
  {
    id: "ch20-day-of-judgment",
    title: "Chapter 20: Intercession on Judgment Day",
    titleUr: "باب 20: قیامت کی شفاعت",
    icon: "⚖️",
    sections: [
      {
        heading: "The Prophet's Efforts for His Ummah",
        headingUr: "امت کے لیے نبی ﷺ کی کوششیں",
        content: `On the Day of Judgment, all of mankind will go to each Prophet for intercession. Each will say "Go to someone else." Finally they will come to Muhammad ﷺ who will say: "I am for this task." He will prostrate before Allah and intercede for his Ummah.

The Prophet ﷺ said: "I will be the first to intercede in Paradise. No Prophet's followers were as numerous as mine. There will be a time when I will stand at the Maqam-e-Mahmud (The Praised Station) and intercede, and my intercession will be accepted."

He said: "My intercession is for the people of major sins from my Ummah." And he said: "I have been given the choice between admitting half of my Ummah into Paradise or intercession. I chose intercession, for it is more comprehensive."`,
        contentUr: `قیامت کے دن تمام انسان شفاعت کے لیے ہر نبی کے پاس جائیں گے۔ آخر میں محمد ﷺ کے پاس آئیں گے جو فرمائیں گے: "یہ میرا کام ہے۔"

آپ نے فرمایا: "میری شفاعت میری امت کے بڑے گناہ والوں کے لیے ہے۔" اور فرمایا: "مجھے اختیار دیا گیا — آدھی امت کو جنت میں داخل کروں یا شفاعت۔ میں نے شفاعت کو چنا کیونکہ یہ زیادہ وسیع ہے۔"`,
      },
    ],
  },
  {
    id: "ch21-teachings",
    title: "Chapter 21: Teachings of Islam",
    titleUr: "باب 21: تعلیمات اسلام",
    icon: "📖",
    sections: [
      {
        heading: "Core Teachings",
        headingUr: "بنیادی تعلیمات",
        content: `Islam is the complete code of life given through the Prophet Muhammad ﷺ. It encompasses the rights of Allah and the rights of mankind. Among its core teachings:

• Tawheed — The Oneness of Allah, the fundamental pillar of Islam.
• Salah — Five daily prayers, the Mi'raj (ascension) of the believer.
• Zakah — Purification of wealth through charity.
• Sawm — Fasting in Ramadan for self-discipline and Allah's pleasure.
• Hajj — Pilgrimage to the House of Allah, uniting Muslims from all nations.
• Justice and equality — "All people are descendants of Adam and Adam was created from dust."
• Rights of women — "Fear Allah in relation to women. Treat your wives kindly."
• Rights of neighbours, orphans, slaves, and the elderly.
• Seeking knowledge — "To acquire knowledge is the duty of every Muslim male and female."
• Compassion to all creation, including animals and nature.`,
        contentUr: `اسلام نبی محمد ﷺ کے ذریعے دیا گیا مکمل ضابطہ حیات ہے۔ اس میں اللہ کے حقوق اور بندوں کے حقوق شامل ہیں:

• توحید — اللہ کی وحدانیت
• نماز — پانچ وقت کی نمازیں
• زکوٰۃ — مال کی پاکیزگی
• روزہ — رمضان کے روزے
• حج — بیت اللہ کی زیارت
• انصاف اور مساوات
• عورتوں کے حقوق
• پڑوسیوں، یتیموں اور غلاموں کے حقوق
• علم حاصل کرنا — "علم حاصل کرنا ہر مسلمان مرد اور عورت پر فرض ہے"`,
      },
    ],
  },
  {
    id: "ch22-sayings",
    title: "Chapter 22: Sayings of the Prophet ﷺ",
    titleUr: "باب 22: احادیث نبوی ﷺ",
    icon: "💎",
    sections: [
      {
        heading: "Love, Faith & Character",
        headingUr: "محبت، ایمان اور کردار",
        content: `1. "None of you has complete faith until he loves me more than his parents, children and all mankind."

2. "Convey it to others even if it is my single saying."

3. May Allah keep him radiant who hears my saying, learns it and conveys it as he heard it.

4. "The believer is love incarnate. There is no goodness in the one who does not love people and is not loved."

5. "Allah does not regard your appearances and your possessions, but He regards your hearts and your actions."

6. "The best among people is one who is a source of benefit to people."

7. "There is a remedy for each disease and the remedy of sins is seeking forgiveness."

8. "Indeed truth leads to piety and piety leads to Paradise. And evil leads to fire."

9. "He who does not keep his promise has no religion."

10. "The best person amongst you is he who has learnt the Quran and teaches it."`,
        contentUr: `1. "تم میں سے کسی کا ایمان مکمل نہیں جب تک وہ مجھ سے اپنے والدین، اولاد اور تمام لوگوں سے زیادہ محبت نہ کرے۔"

2. "پہنچاؤ مجھ سے چاہے ایک بات ہی ہو۔"

3. "اللہ اس شخص کو تروتازہ رکھے جو میری بات سنے، یاد کرے اور آگے پہنچائے۔"

4. "مومن محبت کا مجسمہ ہے۔"

5. "اللہ تمہاری شکلوں اور مالوں کو نہیں دیکھتا بلکہ تمہارے دلوں اور اعمال کو دیکھتا ہے۔"

6. "لوگوں میں بہترین وہ ہے جو لوگوں کے لیے فائدہ مند ہو۔"

7. "ہر بیماری کی دوا ہے اور گناہوں کی دوا استغفار ہے۔"`,
      },
      {
        heading: "Parents, Knowledge & Accountability",
        headingUr: "والدین، علم اور جوابدہی",
        content: `11. "Allah's pleasure is in the pleasure of father and Allah's displeasure is in the displeasure of father."

12. "Paradise lies at the feet of mothers."

13. Abdullah bin Umar relates: "The Most Merciful shows mercy to those who are kind. Be compassionate to those on earth and He who is in the Heaven will be kind to you."

14. "To acquire knowledge is the duty of every Muslim male and Muslim female."

15. "Whoever follows the path of knowledge, Allah will open a path of Jannah for him. Scholars are heirs of the Prophets."

16. "On the Day of Judgment man will not move a pace until he is inquired: About his life how did he pass it, about his youth where did he squander it, about his wealth how did he earn and spend it, about his knowledge how did he put it into action."

17. "Every one of you is the caretaker and every one of you is answerable about his subjects."

18. "One who earns his livelihood by hard work is loved by Allah."

19. "Mujahid (warrior in the way of Allah) is he who struggles against his self in the way of Allah, and immigrant is he who gives up all his faults and sins."

20. "A man's faith is not right unless his heart is upright and his heart is not righteous unless his tongue is fair."`,
        contentUr: `11. "اللہ کی رضا باپ کی رضا میں ہے اور اللہ کی ناراضگی باپ کی ناراضگی میں ہے۔"

12. "جنت ماؤں کے قدموں تلے ہے۔"

13. "رحمن ان پر رحم کرتا ہے جو مہربان ہیں۔ زمین والوں پر رحم کرو، آسمان والا تم پر رحم کرے گا۔"

14. "علم حاصل کرنا ہر مسلمان مرد اور عورت پر فرض ہے۔"

15. "جو علم کی راہ چلے، اللہ اس کے لیے جنت کا راستہ آسان کر دے گا۔ علماء انبیاء کے وارث ہیں۔"

16. "قیامت کے دن آدمی ایک قدم نہیں اٹھائے گا جب تک پوچھا نہ جائے: عمر کیسے گزاری، جوانی کہاں صرف کی، مال کہاں سے کمایا اور کہاں خرچ کیا، علم پر کیسے عمل کیا۔"`,
      },
      {
        heading: "The Forty Hadith of Paradise",
        headingUr: "جنت کی چالیس حدیثیں",
        content: `Hazrat Salman narrates that he asked Prophet Muhammad ﷺ about the forty Ahadith which guarantee Paradise. The Prophet ﷺ replied:

1. Believe in Allah — 2. And the Day of Judgment — 3. And the Angels — 4. And the Divine Books — 5. And the Prophets — 6. And life after death — 7. And in Destiny — 8. Bear witness to La ilaha illallah — 9. Offer prayer with proper ablution — 10. Pay Zakat — 11. Keep fast in Ramadan — 12. Perform Hajj if you have the resources — 13. Offer twelve Sunnah daily — 14. Never leave the Witr at night — 15. Never associate partners with Allah — 16. Do not disobey parents — 17. Do not embezzle wealth of an orphan — 18. Do not drink alcohol — 19. Do not commit adultery — 20. Do not swear falsely — 21. Do not bear false witness — 22. Do not act on base desires — 23. Do not backbite — 24. Do not slander — 25. Do not begrudge — 26. Do not get involved in playfulness — 27. Do not join bystanders — 28. Do not make fun of others — 29. Do not mock — 30. Neither backbite among Muslims — 31. Thank Allah for His blessings — 32. Be patient in hardship — 33. Do not become fearless of Allah's retribution — 34. Do not sever ties with relatives — 35. Be kind to them — 36. Do not curse the creation of Allah — 37. Recite "SubhanAllah, Allahu Akbar, La ilaha illallah" — 38. Do not be absent from Friday and Eid prayers — 39. Whatever befalls you was not meant to miss you — 40. Do not give up recitation of Quran.

Hazrat Salman asked: "O Prophet of Allah, what is the reward?" He said: "Allah the Most High will resurrect him with prophets and scholars."`,
        contentUr: `حضرت سلمان نے پوچھا کہ وہ چالیس حدیثیں کون سی ہیں جن کا حافظ جنت میں جائے گا؟ نبی ﷺ نے فرمایا:

1. اللہ پر ایمان لاؤ — 2. قیامت پر — 3. فرشتوں پر — 4. کتابوں پر — 5. نبیوں پر — 6. آخرت پر — 7. تقدیر پر — 8. کلمہ کی گواہی دو — 9. وضو سے نماز پڑھو — 10. زکوٰۃ دو — 11. رمضان کے روزے رکھو — 12. حج کرو — 13. بارہ سنتیں پڑھو — 14. وتر نہ چھوڑو — 15. شرک نہ کرو — 16. والدین کی نافرمانی نہ کرو...

حضرت سلمان نے پوچھا: "ثواب کیا ہے؟" فرمایا: "اللہ اسے انبیاء اور علماء کے ساتھ اٹھائے گا۔"`,
      },
    ],
  },
];
