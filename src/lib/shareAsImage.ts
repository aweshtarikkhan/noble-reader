export const shareAsImage = async (
  lines: { text: string; font: string; color: string; align?: CanvasTextAlign; dir?: string; maxWidth?: number }[],
  bgColor: string = "#064e3b",
  width: number = 800,
  toast?: (opts: any) => void
) => {
  const plainText = `${lines
    .map((l) => l.text)
    .filter((t) => t.trim().length > 0)
    .join("\n\n")}\n\n— Noble Quran Reader`;

  const copyText = async () => {
    try {
      await navigator.clipboard?.writeText(plainText);
      return true;
    } catch {
      return false;
    }
  };

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    canvas.width = width;

    const padding = 60;
    let totalHeight = padding;
    const lineSpacing = 16;

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

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.font = "bold 120px serif";
    ctx.textAlign = "center";
    ctx.fillText("☪", width / 2, totalHeight / 2 + 40);

    for (const block of wrappedBlocks) {
      for (const item of block) {
        ctx.font = item.font;
        ctx.fillStyle = item.color;
        ctx.textAlign = item.align;
        const x = item.align === "right" ? width - padding : item.align === "left" ? padding : width / 2;
        ctx.fillText(item.text, x, item.y);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Noble Quran Reader", width / 2, totalHeight - 20);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to export image"))), "image/png");
    });

    const file = typeof File !== "undefined" ? new File([blob], "share.png", { type: "image/png" }) : null;

    if (navigator.share) {
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text: plainText });
          return;
        } catch (e: any) {
          if (e?.name === "AbortError") return;
        }
      }

      try {
        await navigator.share({ text: plainText });
        return;
      } catch (e: any) {
        if (e?.name === "AbortError") return;
      }
    }

    await copyText();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "share.png";
    a.click();
    URL.revokeObjectURL(url);

    toast?.({
      title: "Share fallback used",
      description: "Image downloaded and text copied for manual sharing",
    });
  } catch {
    const copied = await copyText();
    if (navigator.share) {
      try {
        await navigator.share({ text: plainText });
        return;
      } catch {
        // ignore
      }
    }
    toast?.({
      title: copied ? "Text copied" : "Share not supported",
      description: copied ? "Paste and share it in any app" : "Please try from a supported browser/app",
    });
  }
};
