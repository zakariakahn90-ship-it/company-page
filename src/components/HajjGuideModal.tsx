import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  X,
  Download,
  FileText,
  Compass,
  Heart,
  CheckCircle,
  Phone,
  MessageCircle,
  Sparkles,
  Calendar,
  AlertCircle,
  Printer,
  Share2,
} from 'lucide-react';

interface HajjGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HajjGuideModal: React.FC<HajjGuideModalProps> = ({ isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const generatePDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;

      // Primary Colors
      const brandDark = '#032b19'; // Deep Islamic Emerald
      const brandGold = '#9a7913'; // Refined Metallic Gold
      const brandMuted = '#475569'; // Slate 600

      // Helper for Section Titles
      const drawHeaderBanner = (title: string, subtitle: string) => {
        doc.setFillColor(3, 43, 25); // #032b19
        doc.rect(0, 0, pageWidth, 32, 'F');

        doc.setFillColor(201, 162, 39); // #c9a227 gold line
        doc.rect(0, 32, pageWidth, 2, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(255, 255, 255);
        doc.text(title, pageWidth / 2, 14, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(230, 201, 100);
        doc.text(subtitle, pageWidth / 2, 22, { align: 'center' });

        doc.setFontSize(7.5);
        doc.setTextColor(200, 220, 210);
        doc.text(
          'MORA Enrolment #: 1215/P · Peshawar KPK · UAN: +92 345 9900084 · WhatsApp: wa.link/47g4xb',
          pageWidth / 2,
          28,
          { align: 'center' }
        );
      };

      // PAGE 1: HEADER & HAJJ RITES SUMMARY
      drawHeaderBanner(
        'AL-ISRAJ INTERNATIONAL TRAVELS (PVT.) LTD.',
        'HAJJ 2027 (1448 AH) ESSENTIAL PILGRIM GUIDE & RITUAL STEPS'
      );

      let y = 42;

      // Document Subhead
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(3, 43, 25);
      doc.text('1. DAY-BY-DAY SACRED RITES OF HAJJ (8 - 12 DHUL HIJJAH)', margin, y);
      y += 3;
      doc.setDrawColor(201, 162, 39);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 85, y);
      y += 6;

      const hajjSteps = [
        {
          day: '8th Dhul Hijjah (Yawm al-Tarwiyah) - Move to Mina',
          points: [
            '• Enter state of Ihram with sincere Niyyah and continuous Talbiyah.',
            '• Depart in Al-Israj luxury coaches to Makteb-C air-conditioned camps in Mina.',
            '• Perform Zuhr, Asr, Maghrib, Isha, and Fajr of 9th Dhul Hijjah in Mina (shortened, not combined).',
          ],
        },
        {
          day: '9th Dhul Hijjah (Yawm al-Arafat) - The Pillar of Hajj',
          points: [
            '• Move to the blessed Plain of Arafat after sunrise. Listen to Khutbah Nimra.',
            '• Combine Zuhr and Asr prayers at Zuhr time. Spend afternoon in fervent Dua and Istighfar.',
            '• After sunset, depart peacefully for Muzdalifah without praying Maghrib in Arafat.',
            '• At Muzdalifah: Combine Maghrib & Isha. Collect 49-70 clean pebbles. Rest under the open sky.',
          ],
        },
        {
          day: '10th Dhul Hijjah (Yawm an-Nahr) - Eid al-Adha in Mina',
          points: [
            '• Perform Fajr at Mash\'ar al-Haram, depart for Mina before sunrise.',
            '• Ramy: Cast 7 pebbles at Jamarat al-Aqaba (The Big Pillar) reciting Takbeer.',
            '• Qurbani (Hady): Officially executed on your behalf by Al-Israj team.',
            '• Halq / Taqsir: Shave or trim hair to attain First Tahallul (exit basic Ihram restrictions).',
            '• Tawaf al-Ifadah & Sa\'i: Proceed to Makkah to complete the core Hajj Tawaf.',
          ],
        },
        {
          day: '11th & 12th Dhul Hijjah (Ayyam at-Tashriq) - Mina Days',
          points: [
            '• Reside in Mina Makteb-C air-conditioned camps.',
            '• Perform Ramy after Zawal each day: 7 pebbles at each pillar (Sughra, Wusta, Kubra).',
            '• After Ramy on 12th Dhul Hijjah, pilgrims may depart Mina for Makkah before sunset.',
          ],
        },
        {
          day: 'Departure - Tawaf al-Wada (Farewell Tawaf)',
          points: [
            '• Perform the final Farewell Tawaf around the Holy Kaaba before departure from Makkah.',
          ],
        },
      ];

      hajjSteps.forEach((step) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(3, 43, 25);
        doc.text(step.day, margin, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 70, 80);

        step.points.forEach((pt) => {
          const splitPt = doc.splitTextToSize(pt, contentWidth - 4);
          doc.text(splitPt, margin + 2, y);
          y += splitPt.length * 3.8;
        });
        y += 2.5;
      });

      // PAGE 1 FOOTER
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        'Page 1 of 2 · Al-Israj International Travels (Pvt.) Ltd. · Official MORA Enrolment 1215/P',
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );

      // ==========================================
      // PAGE 2: AL-ISRAJ EXCLUSIVE TRAVEL TIPS
      // ==========================================
      doc.addPage();
      drawHeaderBanner(
        'AL-ISRAJ INTERNATIONAL TRAVELS (PVT.) LTD.',
        'OFFICIAL 5-STAR HAJJ TRAVEL TIPS & ESSENTIAL PREPARATION'
      );

      y = 42;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(3, 43, 25);
      doc.text('2. AL-ISRAJ EXCLUSIVE 5-STAR TRAVEL TIPS FOR PILGRIMS', margin, y);
      y += 3;
      doc.setDrawColor(201, 162, 39);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 95, y);
      y += 7;

      const travelTips = [
        {
          title: '• Rotana Jabal Omar Makkah (150m Distance Advantage):',
          desc: 'Effortless pedestrian proximity of just 150 meters into the Holy Haram courtyard. Avoid strenuous midday heat by performing Sunnah prayers in spacious hotel prayer halls.',
        },
        {
          title: '• Hydration & Sun Protection in Makkah & Mina:',
          desc: 'Drink a minimum of 3 to 4 liters of water and Zamzam daily. Always carry a folding light-colored umbrella during outdoor movements in Mina and Arafat. Keep ORS electrolyte sachets handy in your daypack.',
        },
        {
          title: '• Footwear Care & Blister Prevention:',
          desc: 'Wear broken-in, cushioned, supportive sandals compliant with Ihram rules for men. Apply Vaseline or anti-chafing balm to inner thighs and feet before long walks to prevent friction discomfort.',
        },
        {
          title: '• Official Nusuk App & Smart ID Badge:',
          desc: 'Keep your Saudi government Nusuk smart card and Al-Israj wristband on your person at all times. Take a clear photograph of your Pakistani passport, visa sticker, and hotel room key on your mobile phone.',
        },
        {
          title: '• Essential Medication & Personal First-Aid:',
          desc: 'Carry a 30-day supply of your routine prescription medicines in their original packaging, accompanied by a verified doctor prescription. Pack basic lozenges, pain relievers, and bandages.',
        },
        {
          title: '• Al-Israj Group Leaders & Peshawar Helpline:',
          desc: 'Our multilingual religious scholars (Ulema) and experienced tour coordinators are stationed 24/7 at Rotana Jabal Omar Makkah, Central Markazia Madinah, and Mina Makteb-C to assist you with every ritual question.',
        },
      ];

      travelTips.forEach((tip) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(3, 43, 25);
        doc.text(tip.title, margin, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 70, 80);
        const splitDesc = doc.splitTextToSize(tip.desc, contentWidth);
        doc.text(splitDesc, margin, y);
        y += splitDesc.length * 3.8 + 3;
      });

      // Important Registration Box
      y += 2;
      doc.setFillColor(250, 248, 240); // Soft gold tint
      doc.setDrawColor(201, 162, 39);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(154, 121, 19);
      doc.text('OFFICIAL REGISTRATION & CONTACT INFORMATION', margin + 4, y + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(3, 43, 25);
      doc.text(
        '• Registration Status: Only Few Slots Remaining (MORA Private Quota allocation)',
        margin + 4,
        y + 12
      );
      doc.text(
        '• Peshawar Head Office: Office # 1 & 2, 1st Floor, Haji Tehmas Khan Building, University Road, Peshawar.',
        margin + 4,
        y + 17
      );
      doc.text(
        '• Direct Helpline: 0345-9900084 / 091-5840084 · Instant WhatsApp: wa.link/47g4xb',
        margin + 4,
        y + 22
      );
      doc.text(
        '• Packages: 14±1 Days (Pkg 1-131), 18±1 Days (Pkg 2-95), 27±1 Days (Pkg 3-64)',
        margin + 4,
        y + 27
      );

      // PAGE 2 FOOTER
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(
        'Page 2 of 2 · Al-Israj International Travels (Pvt.) Ltd. · www.alisrajtravels.com',
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );

      // Save PDF
      doc.save('Hajj-2027-Essential-Guide-Al-Israj.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-[#fdfcf9] shadow-2xl border-2 border-[#c9a227] overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        {/* Header Bar */}
        <div className="bg-[#032b19] px-6 py-5 text-white flex items-center justify-between border-b-2 border-[#c9a227]">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a227] text-[#032b19] shadow">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h3 id="guide-modal-title" className="font-serif text-lg sm:text-xl font-bold">
                Hajj 2027 Essential Guide &amp; Travel Tips
              </h3>
              <p className="text-xs text-[#e6c964]">
                Official MORA Enrolment 1215/P · Al-Israj International Travels (Pvt.) Ltd.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Urgency Announcement */}
          <div className="rounded-2xl bg-amber-50 border border-amber-300 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-900">
                <strong>Registration Status: Only Few Slots Remaining.</strong> Quota slots for
                Rotana Jabal Omar Makkah (150m) are limited. Download this guide for your family.
              </div>
            </div>
          </div>

          {/* Section 1: Hajj Steps Summary */}
          <div>
            <div className="flex items-center gap-2 text-base font-serif font-bold text-[#032b19] border-b border-[#c9a227]/30 pb-2">
              <Compass className="w-5 h-5 text-[#c9a227]" />
              <h4>Summary of Hajj Rites (8 to 12 Dhul Hijjah)</h4>
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#faf9f5] border border-slate-200 p-3">
                <span className="font-bold text-[#032b19] block mb-1">
                  8 Dhul Hijjah · Mina
                </span>
                <p className="text-slate-600">
                  Enter Ihram with Niyyah. Travel by luxury AC coaches to Makteb-C Mina camps.
                  Pray 5 prayers in Mina.
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f5] border border-slate-200 p-3">
                <span className="font-bold text-[#032b19] block mb-1">
                  9 Dhul Hijjah · Arafat &amp; Muzdalifah
                </span>
                <p className="text-slate-600">
                  The Day of Arafat: Wuqoof and Dua until sunset. Proceed to Muzdalifah for night rest
                  and pebble collection.
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f5] border border-slate-200 p-3">
                <span className="font-bold text-[#032b19] block mb-1">
                  10 Dhul Hijjah · Eid al-Adha
                </span>
                <p className="text-slate-600">
                  Ramy at Jamarat al-Aqaba, Qurbani fulfilled, Halq/Taqsir for Tahallul, and Tawaf
                  al-Ifadah at the Kaaba.
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f5] border border-slate-200 p-3">
                <span className="font-bold text-[#032b19] block mb-1">
                  11 - 12 Dhul Hijjah · Tashriq Days
                </span>
                <p className="text-slate-600">
                  Stay in Mina camps. Daily Ramy at all 3 Jamarat after Zawal. Return to Makkah and
                  perform Tawaf al-Wada.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Al-Israj 5-Star Travel Tips */}
          <div>
            <div className="flex items-center gap-2 text-base font-serif font-bold text-[#032b19] border-b border-[#c9a227]/30 pb-2">
              <Sparkles className="w-5 h-5 text-[#c9a227]" />
              <h4>Al-Israj 5-Star Travel &amp; Health Tips</h4>
            </div>

            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Rotana Jabal Omar Makkah (150m Distance):</strong> Enjoy comfortable pedestrian access
                  to the courtyards of Masjid al-Haram without exhausting steep climbs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hydration &amp; Sun Protection:</strong> Drink 3-4 liters of Zamzam daily.
                  Always carry a folding umbrella during daytime rituals in Mina and Arafat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Nusuk App &amp; Smart Card:</strong> Keep your digital and physical
                  pilgrim ID on your person at all times for verification at security checkpoints.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Multilingual Group Leaders:</strong> Al-Israj scholars in Pashto, Urdu, and
                  English accompany you every step of the journey.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#faf9f5] border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#032b19]">Format:</span> Printable PDF (2 Pages)
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="https://wa.link/47g4xb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 bg-white px-5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition"
            >
              <MessageCircle className="w-4 h-4" /> Ask via WhatsApp
            </a>

            <button
              type="button"
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] px-6 py-2.5 text-xs font-bold shadow-lg transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating PDF...' : 'Download PDF Guide'}
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {downloadSuccess && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-emerald-400 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            PDF Downloaded Successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default HajjGuideModal;
