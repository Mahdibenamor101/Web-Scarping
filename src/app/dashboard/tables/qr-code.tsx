"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QrCode({ url, size = 140 }: { url: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: size, margin: 1 }).catch(() => {});
    }
  }, [url, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
