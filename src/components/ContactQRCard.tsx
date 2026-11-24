import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  UserPlus,
  Download,
  Copy,
  Check,
  MessageCircle,
  Smartphone,
} from 'lucide-react';

type QRMode = 'vcard' | 'whatsapp';

const AL_ISRAJ_VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Travels;Al-Israj International;;;',
  'FN:Al-Israj International Travels Pvt. Ltd.',
  'ORG:Al-Israj International Travels Pvt. Ltd.',
  'TITLE:MORA Approved Hajj Group Organizer (1215/P)',
  'TEL;TYPE=CELL,VOICE,PREF:+923459900084',
  'TEL;TYPE=WORK,VOICE:+923349977182',
  'TEL;TYPE=WORK,VOICE:+923139966007',
  'EMAIL;TYPE=WORK:alisraj1215p@gmail.com',
  'URL;TYPE=WORK:https://al-israjinternationaltravels.tech',
  'URL:https://wa.link/47g4xb',
  'ADR;TYPE=WORK:;;Office 1 & 2, 1st Floor, Haji Tehmas Khan Building, Tehkal Payan, University Road;Peshawar;KPK;;Pakistan',
  'NOTE:Official MORA Approved Private HGO (Enrolment # 1215/P) - Hajj 2027 Desk',
  'END:VCARD',
].join('\r\n');

const AL_ISRAJ_WHATSAPP_URL = 'https://wa.link/47g4xb';

const AL_ISRAJ_CLIPBOARD_TEXT = `Al-Israj International Travels Pvt. Ltd. (MORA Approved HGO # 1215/P)
Website: https://al-israjinternationaltravels.tech
Primary Phone / WhatsApp: +92 345 9900084
Phone 2: +92 334 9977182
Phone 3: +92 313 9966007
WhatsApp Link: https://wa.link/47g4xb
Email: alisraj1215p@gmail.com
Office: Office No. 1 & 2, 1st Floor, Haji Tehmas Khan Building, Opp. Khyber CNG, Tehkal Payan, University Road, Peshawar, KPK`;

export const ContactQRCard: React.FC = () => {
  const [mode, setMode] = useState<QRMode>('vcard');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const activePayload = mode === 'vcard' ? AL_ISRAJ_VCARD : AL_ISRAJ_WHATSAPP_URL;

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(activePayload, {
      width: 440,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#032b19',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) {
          setQrDataUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQrDataUrl('');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activePayload]);

  const handleDownloadVCard = () => {
    const blob = new Blob([AL_ISRAJ_VCARD], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Al-Israj-International-Travels.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadQRImage = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download =
      mode === 'vcard'
        ? 'Al-Israj-Save-Contact-QR.png'
        : 'Al-Israj-WhatsApp-QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(AL_ISRAJ_CLIPBOARD_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback copy for restricted environments
      const textarea = document.createElement('textarea');
      textarea.value = AL_ISRAJ_CLIPBOARD_TEXT;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#032b19] via-[#053922] to-[#021f12] p-6 sm:p-7 border border-[#c9a227]/45 shadow-xl text-white">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#032b19] shadow">
            <QrCode className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-lg text-white leading-snug">
              Scan to Save Contact
            </h3>
            <p className="text-xs text-emerald-100/80 mt-0.5 leading-relaxed">
              Point your phone camera to add Al-Israj directly to your contacts list.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Save Contact (vCard) vs WhatsApp Chat */}
      <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-black/30 p-1 border border-white/10">
        <button
          type="button"
          onClick={() => setMode('vcard')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition-colors ${
            mode === 'vcard'
              ? 'bg-[#c9a227] text-[#032b19] shadow'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Save Contact</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('whatsapp')}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition-colors ${
            mode === 'whatsapp'
              ? 'bg-emerald-500 text-[#022012] shadow'
              : 'text-white/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp QR</span>
        </button>
      </div>

      {/* QR Code Frame & Contact Summary */}
      <div className="mt-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative shrink-0 rounded-2xl bg-white p-3 shadow-lg border-2 border-[#c9a227]/70">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={
                mode === 'vcard'
                  ? 'QR code to save Al-Israj International Travels contact card (vCard)'
                  : 'QR code to open Al-Israj official WhatsApp chat'
              }
              className="w-36 h-36 sm:w-40 sm:h-40 block rounded-lg"
            />
          ) : (
            <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-xs">
              Generating QR...
            </div>
          )}
          <span className="mt-2 block text-center text-[10px] font-bold uppercase tracking-wider text-[#032b19]">
            {mode === 'vcard' ? 'vCard · iOS & Android' : 'wa.link/47g4xb'}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#e6c964]">
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>
              {mode === 'vcard'
                ? 'Includes all 3 hotlines, email & office address'
                : 'Opens instant chat with our Hajj 2027 desk'}
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            {mode === 'vcard'
              ? 'Browsing on your phone right now? Tap "Save Contact (.vcf)" below to add Al-Israj in one tap without scanning.'
              : 'Scan from any mobile device to start a verified WhatsApp conversation with our MORA-licensed counselors.'}
          </p>

          {/* Direct Actions */}
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] px-3.5 py-2 text-xs font-bold shadow transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Save Contact (.vcf)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadQRImage}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 text-xs font-semibold transition"
              title="Download QR code as PNG image"
            >
              <Download className="w-3.5 h-3.5 text-[#e6c964]" />
              <span>QR PNG</span>
            </button>
            <button
              type="button"
              onClick={handleCopyDetails}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-2 text-xs font-semibold transition"
              title="Copy Al-Israj contact details"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-white/80" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactQRCard;
