import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const UPI_ID = "7049402994-4@ybl";
const DEVELOPER_NAME = "Awesh Tarik Khan";
const PRESET_AMOUNTS = [100, 200, 500, 1000];

const Donate: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const finalAmount = isCustom ? Number(customAmount) : selectedAmount;
  const isValid = finalAmount && finalAmount >= 10;
  const upiPaymentUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(DEVELOPER_NAME)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent("Support Noble Quran Reader")}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPaymentUrl)}`;
  const handleOpenUPI = () => { if (!isValid) return; window.open(upiPaymentUrl, "_blank"); };

  return (
    <div className="px-4 py-6 max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">💝</span>
        <h2 className="text-xl font-semibold text-foreground">{t("donate.supportApp")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("donate.enjoyDesc")}</p>
      </div>
      <div className="rounded-2xl bg-card border border-gold/10 p-4 mb-6 text-center">
        <p className="text-xs text-muted-foreground">{t("donate.developedBy")}</p>
        <p className="text-base font-semibold text-gold mt-0.5">{DEVELOPER_NAME}</p>
      </div>
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3">{t("donate.chooseAmount")}</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {PRESET_AMOUNTS.map((amt) => (
            <button key={amt} onClick={() => { setSelectedAmount(amt); setIsCustom(false); }} className={`py-3 rounded-xl text-sm font-semibold transition-smooth border ${!isCustom && selectedAmount === amt ? "bg-primary text-primary-foreground border-primary shadow-gold" : "bg-card border-gold/10 text-foreground hover:border-gold/30"}`}>₹{amt}</button>
          ))}
        </div>
        <button onClick={() => { setIsCustom(true); setSelectedAmount(null); }} className={`w-full py-3 rounded-xl text-sm font-semibold transition-smooth border ${isCustom ? "bg-primary text-primary-foreground border-primary shadow-gold" : "bg-card border-gold/10 text-foreground hover:border-gold/30"}`}>{t("donate.customAmount")}</button>
        {isCustom && (
          <div className="mt-3 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <input type="number" min={10} value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder="Min ₹10" className="w-full pl-7 pr-3 py-3 rounded-xl bg-card border border-gold/10 text-foreground text-sm focus:outline-none focus:border-gold/40 transition-smooth" />
          </div>
        )}
      </div>
      <div className="rounded-2xl bg-card border border-gold/10 p-5 mb-4 text-center">
        <p className="text-xs text-muted-foreground mb-3">{t("donate.scanQR")}</p>
        <div className="inline-block bg-white rounded-xl p-3"><img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" /></div>
        <div className="mt-3"><p className="text-xs text-muted-foreground">UPI ID</p><p className="text-sm font-medium text-gold mt-0.5 break-all select-all">{UPI_ID}</p></div>
      </div>
      <button onClick={handleOpenUPI} disabled={!isValid} className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-smooth ${isValid ? "gradient-gold text-primary-foreground shadow-gold-lg active:scale-[0.98]" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
        {isValid ? `${t("donate.payViaUPI")} ₹${finalAmount}` : t("donate.selectAmount")}
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-3">{t("donate.upiNote")}</p>
      <div className="text-center mt-8">
        <p className="font-arabic text-xl text-gold">جزاك الله خيراً</p>
        <p className="text-xs text-muted-foreground mt-1">{t("donate.mayAllahReward")}</p>
      </div>
    </div>
  );
};

export default Donate;
