"use client";

import { useEffect, useRef, useState } from "react";

export function HandwritingPad({
  width = 600,
  height = 400,
  hint,
}: {
  width?: number;
  height?: number;
  hint?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [color, setColor] = useState("#1e293b");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // 设备像素比适配
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    // 背景
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    // 横线格
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [width, height]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (width / rect.width),
      y: (e.clientY - rect.top) * (height / rect.height),
    };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const p = getPos(e);
    lastPoint.current = p;
    setDrawing(true);
    setHasContent(true);
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing || !lastPoint.current) return;
    const p = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPoint.current = p;
  }

  function endDraw() {
    setDrawing(false);
    lastPoint.current = null;
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    setHasContent(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {hint && (
        <div className="text-sm text-gray-600 dark:text-dark-muted">{hint}</div>
      )}
      <div className="border border-gray-300 dark:border-dark-border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          style={{ width, height, maxWidth: "100%" }}
          onPointerDown={startDraw}
          onPointerMove={moveDraw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          className="hw-canvas"
        />
      </div>
      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1">
          颜色
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
          />
        </label>
        <label className="flex items-center gap-1">
          粗细
          <input
            type="range"
            min={1}
            max={6}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          />
        </label>
        <button
          onClick={clear}
          disabled={!hasContent}
          className="btn-secondary text-xs"
        >
          🗑 清除
        </button>
        {hasContent && (
          <span className="text-gray-500 dark:text-dark-muted">
            画好受力图/轨迹图了吗？
          </span>
        )}
      </div>
    </div>
  );
}
