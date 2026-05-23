import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import { FiFileText, FiChevronDown } from "react-icons/fi";
import Button from "./Button";
import { cn } from "../../utils/cn";

/**
 * Reusable ExportPDF component with UTF-8 (Vietnamese) support using html2pdf.js
 */
const ExportPDF = ({ 
  data, 
  allData = [], 
  fileName = "export", 
  title = "Báo cáo", 
  columns = [] 
}) => {
  const [showOptions, setShowAddOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePDF = async (exportData, suffix = "") => {
    if (!exportData || exportData.length === 0) return;
    setLoading(true);

    // Create a temporary hidden container for the table
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.color = "#1e293b";

    // Build the HTML content
    let htmlContent = `
      <div style="margin-bottom: 20px; border-bottom: 2px solid #38BDF8; padding-bottom: 10px;">
        <h1 style="font-size: 24px; margin: 0; color: #0f172a; text-transform: uppercase;">${title}</h1>
        <p style="font-size: 12px; color: #64748b; margin-top: 5px;">Ngày xuất: ${new Date().toLocaleString("vi-VN")}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <thead>
          <tr style="background-color: #38BDF8; color: white;">
            ${columns.map(col => `<th style="padding: 10px; border: 1px solid #e2e8f0; text-align: left;">${col.header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${exportData.map((item, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              ${columns.map(col => {
                const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                return `<td style="padding: 8px; border: 1px solid #e2e8f0;">${value || ""}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 30px; text-align: right; font-size: 10px; color: #94a3b8;">
        <p>Hệ thống Quản lý kho Smart WMS Pro</p>
      </div>
    `;

    element.innerHTML = htmlContent;

    const opt = {
      margin: [10, 10],
      filename: `${fileName}${suffix}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        onclone: (clonedDoc) => {
          // Fix for "unsupported color function oklch" error in html2canvas
          const styleElements = clonedDoc.getElementsByTagName('style');
          for (let i = 0; i < styleElements.length; i++) {
            const style = styleElements[i];
            if (style.innerHTML.includes('oklch')) {
              style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#334155');
            }
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setLoading(false);
      setShowAddOptions(false);
    }
  };

  return (
    <div className="relative inline-block text-left z-[60]">
      <div className="flex">
        <Button
          variant="secondary"
          size="md"
          onClick={() => generatePDF(data)}
          leftIcon={<FiFileText className="stroke-[3px]" />}
          isLoading={loading}
          className="bg-white dark:bg-dark-card hover:bg-error/5 dark:hover:bg-error/10 hover:text-error hover:border-error/30 rounded-l-xl border-r-0 h-10 px-4 transition-all"
        >
          Xuất PDF
        </Button>
        <button
          onClick={() => setShowAddOptions(!showOptions)}
          disabled={loading}
          className="px-2 border border-border/60 dark:border-dark-border/60 border-l-0 rounded-r-xl hover:bg-bg-subtle dark:hover:bg-white/5 transition-all text-text-tertiary h-10 disabled:opacity-50"
        >
          <FiChevronDown className={cn("transition-transform duration-300", showOptions && "rotate-180")} />
        </button>
      </div>

      {showOptions && (
        <>
          <div 
            className="fixed inset-0 z-[90]" 
            onClick={() => setShowAddOptions(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-dark-card shadow-soft-2xl border border-border/40 dark:border-dark-border/60 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 space-y-1">
              <button
                onClick={() => generatePDF(data, "_trang_hien_tai")}
                className="w-full text-left px-4 py-2.5 text-[10px] font-black text-text-primary uppercase tracking-widest hover:bg-error/5 dark:hover:bg-white/5 hover:text-error rounded-xl transition-all flex items-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-error/40 mr-2.5" />
                Trang hiện tại ({data.length})
              </button>
              {allData && allData.length > 0 && (
                <button
                  onClick={() => generatePDF(allData, "_tat_ca")}
                  className="w-full text-left px-4 py-2.5 text-[10px] font-black text-text-primary uppercase tracking-widest hover:bg-error/5 dark:hover:bg-white/5 hover:text-error rounded-xl transition-all flex items-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-error/60 mr-2.5" />
                  Tất cả các trang ({allData.length})
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportPDF;
