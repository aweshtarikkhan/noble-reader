export const shareAsImage = async (
  lines: { text: string; font: string; color: string; align?: CanvasTextAlign; dir?: string; maxWidth?: number }[],
  bgColor: string = "#064e3b",
  width: number = 800,
  toast?: (opts: any) => void
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = width;

  // Pre-calculate height
  const padding = 60;
  let totalHeight = padding;
  const lineSpacing = 16;

  // We need to measure wrapped lines
  const wrappedBlocks: { text: string; font: string; color: string; align: CanvasTextAlign; y: number }[][] = [];

  for (const line of lines) {
    ctx.font = line.font;
    const maxW = line.maxWidth || (width - padding * 2);
    const words = line.text.split(" ");
    let current = "";
    const block: { text: string; font: string; color: string; align: CanvasTextAlign; y: number }[] = [];

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxW && current) {
        block.push({ text: current, font: line.font, color: line.color, align: line.align || "center", y: totalHeight });
        totalHeight += parseInt(line.font) * 1.6;
        current = word;
      } else {
        current = test;
      }
    }
    if (current) {
      block.push({ text: current, font: line.font, color: line.color, align: line.align || "center", y: totalHeight });
      totalHeight += parseInt(line.font) * 1.6;
    }
    wrappedBlocks.push(block);
    totalHeight += lineSpacing;
  }

  totalHeight += padding;
  canvas.height = totalHeight;

  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw watermark
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = "bold 120px serif";
  ctx.textAlign = "center";
  ctx.fillText("☪", width / 2, totalHeight / 2 + 40);

  // Draw text
  for (const block of wrappedBlocks) {
    for (const item of block) {
      ctx.font = item.font;
      ctx.fillStyle = item.color;
      ctx.textAlign = item.align;
      const x = item.align === "right" ? width - padding : item.align === "left" ? padding : width / 2;
      ctx.fillText(item.text, x, item.y);
    }
  }

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Noble Quran Reader", width / 2, totalHeight - 20);

  try {
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Failed")), "image/png");
    });
    const file = new File([blob], "share.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "share.png";
      a.click();
      URL.revokeObjectURL(url);
      toast?.({ title: "Downloaded!", description: "Image saved" });
    }
  } catch (e) {
    // Silent fail on user cancel
  }
};
