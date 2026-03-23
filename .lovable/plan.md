

## Zakat Calculator - "Other Assets" Section + Quranic/Hadith References

### What will be added

**1. Collapsible "Other Zakat Assets" Section** (hidden by default, toggle to expand)
When enabled, shows fields for:

- **Agricultural Zakat (Kheti/Fasal)**
  - Crop value field (₹)
  - Irrigation type selector:
    - Rain-fed / Natural water (Barani) → Zakat = 10% (Ushr)
    - Irrigated / Artificial water (Sinchi) → Zakat = 5% (Nisf Ushr)
  - Auto-calculated zakat shown below

- **Livestock Zakat (Maweshi)**
  - Goats/Sheep (Bakri/Bhed) — count field with nisab rules displayed:
    - 40-120 → 1 goat; 121-200 → 2 goats; 201-399 → 3 goats
  - Cows/Buffalo (Gaay/Bhains) — count field:
    - 30-39 → 1 calf (1 yr); 40-59 → 1 cow (2 yr); 60+ → 2 calves
  - Camels (Oont) — count field:
    - 5-9 → 1 sheep; 10-14 → 2 sheep; 25-35 → 1 camel (1yr)
  - Each shows the applicable zakat in text below the count

- **Business Inventory / Trade Goods** — value field (₹), 2.5% zakat
- **Rental Income** — value field (₹), 2.5% zakat

All these amounts will be included in the total zakat calculation and PDF report.

**2. Quran & Hadith References Section** (always visible at bottom)
A styled reference card listing the Islamic proofs for each zakat category:
- Gold/Silver zakat → Surah At-Tawbah 9:34
- Cash/Wealth zakat → Surah Al-Baqarah 2:267
- Agricultural zakat (Ushr) → Surah Al-An'am 6:141, Sahih Bukhari 1483
- Livestock zakat → Sahih Bukhari 1454, Abu Dawud 1572
- General zakat obligation → Surah Al-Baqarah 2:43, Surah At-Tawbah 9:103
- Trade goods → Abu Dawud 1562

Each reference with the actual text snippet in English + Arabic context.

### Technical approach

**Files to modify:**
- `src/pages/ZakatCalculator.tsx` — Add state for other zakat fields, toggle switch, calculation logic, PDF generation update, references section
- `src/lib/i18n.tsx` — Add ~30 translation keys for new labels (en/ur/hi)

**State additions:**
- `showOtherZakat: boolean` (toggle)
- `cropValue: string`, `irrigationType: "rainfed" | "irrigated"`
- `goatCount: string`, `cowCount: string`, `camelCount: string`
- `businessInventory: string`, `rentalIncome: string`

**Calculation updates:**
- Agricultural zakat: `cropValue * (irrigationType === "rainfed" ? 0.10 : 0.05)`
- Livestock: Display text-based nisab rules (not added to ₹ total since zakat is in animals)
- Business/Rental: Added to totalAssets at 2.5%

**UI:** Switch toggle labeled "Other Zakat Assets" using existing Switch component. Collapsible card below cash section. References card at the very bottom with an accordion or static list.

