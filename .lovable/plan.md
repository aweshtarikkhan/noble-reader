
Goal: APK me PDF history files hamesha app ke andar khulni chahiye (browser nahi), aur Share button reliably file share kare.

1) Root cause confirm + direction
- Do I know what the issue is? Yes.
- Current viewer `<object type="application/pdf">` Android WebView me reliable nahi hai, isliye blank/external Chrome behavior aa raha hai.
- `navigator.share` Web API APK WebView me file attachment ke liye unreliable hai.
- `Directory.ExternalStorage` Android 11+ me restricted hai; isi wajah se history entries kabhi inaccessible ho rahi hain.

2) Storage flow ko reliable banana (ZakatCalculator)
- `DownloadHistoryItem` me native-safe fields add karna: `appPath` (internal app file path), optional `publicPath/uri`.
- PDF generate hote hi **pehle** `Directory.Data` me save karna (always accessible, permission-independent).
- Public copy (Documents/Download) optional banana; fail ho to bhi history + in-app open ka flow break na ho.
- `clear/remove` me localforage ke sath internal files bhi delete karna.
- Old history migration: agar item me `appPath` nahi hai to localforage/legacy uri se recover karke new internal file create karna.

3) True in-app PDF viewer (browser-free)
- Existing `<object>` viewer remove.
- PDF.js based viewer add (via `react-pdf` + `pdfjs-dist`) inside existing Dialog.
- Base64 -> Uint8Array feed karke pages canvas me render karna.
- Basic controls: previous/next page + zoom +/- so mobile me readable rahe.
- Open action me sirf in-app viewer trigger hoga, no `window.open`.

4) Share button fix (native + web)
- Native (APK): `@capacitor/share` use karna (not `navigator.share`), file ko `Directory.Cache` me write karke `files: [fileUri]` ke through share sheet open karna.
- Web: current Web Share + download fallback maintain karna.
- Cancelled share vs actual error ke liye clear toast handling.

5) Validation checklist
- Android APK:
  - new PDF download -> history -> view (must open inside app)
  - app restart ke baad same file view
  - Unknown-01 style auto-name + open
  - Share to WhatsApp/Drive/Gmail from history
- Permission denied case: app-internal open/share still work kare; sirf public export optional warning de.
- Legacy history entry recovery verify.

Technical notes
- Files: mainly `src/pages/ZakatCalculator.tsx`, plus ek reusable in-app PDF viewer component (e.g. `src/components/InAppPdfViewer.tsx`).
- Native capability change ke baad user side: latest code pull karke `npx cap sync` required hoga before APK retest.
