import React, { useRef } from "react";
import QRCode from "react-qr-code";
import Button from "./common/Button";

function QRCodeGenerator({ productData, onClose }) {
  const qrRef = useRef();

  const handlePrint = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 100;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(productData.name.substring(0, 30), canvas.width / 2, canvas.height - 40);
      ctx.fillText(`Mã SP: ${productData.id}`, canvas.width / 2, canvas.height - 15);
      
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>In mã vạch QR</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL("image/png")}" onload="window.print();window.close()" />
          </body>
        </html>
      `);
      printWindow.document.close();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!productData) return null;

  const qrValue = JSON.stringify({
    id: productData.id,
    name: productData.name,
    sku: `SKU-${productData.id}`
  });

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white p-6 rounded-3xl shadow-soft-xl border border-border/40 dark:border-white/10" ref={qrRef}>
        <QRCode value={qrValue} size={200} />
      </div>
      <div className="mt-6 text-center">
        <p className="font-black text-text-primary uppercase tracking-tighter">{productData.name}</p>
        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Mã SP: {productData.id}</p>
      </div>
      <div className="mt-8 flex gap-3 w-full justify-center">
        <Button
          onClick={handlePrint}
          variant="primary"
          size="sm"
          className="rounded-xl"
          leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>}
        >
          In nhãn QR
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          size="sm"
          className="rounded-xl"
        >
          Đóng
        </Button>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
