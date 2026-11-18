import { Capacitor } from '@capacitor/core';
import { Item, CategoryTheme } from '../types';
import {
  shareImageToWhatsApp,
  downloadOrSaveImageFile,
  downloadImageBlob,
  dataUrlToBlob,
} from './shareUtils';

export interface CardImageOptions {
  aspectRatio?: 'square' | 'story'; // square 1080x1080, story 1080x1920
  customWatermark?: string;
  includeWatermark?: boolean; // default true (with watermark)
}

export interface CardRenderResult {
  blob: Blob;
  dataUrl: string;
  filename: string;
  width: number;
  height: number;
}

/**
 * Cross-browser / WebView compatible rounded rectangle path helper
 * (replaces ctx.roundRect which throws on Android WebViews older than Chromium 99)
 */
export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Synchronously renders the card on an HTML5 canvas
 */
export function renderCardCanvas(
  item: Item,
  category: CategoryTheme,
  options: CardImageOptions = {}
): HTMLCanvasElement {
  const {
    aspectRatio = 'story',
    customWatermark = '📲 चुटकुले और विचार ऐप • Daily Status',
    includeWatermark = true,
  } = options;

  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = aspectRatio === 'story' ? 1920 : 1080;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  // 1. Rich category vibrant multi-color gradient
  const [c1, c2, c3] = category.cardGradients || ['#FF512F', '#F09819', '#E11D48'];
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.48, c2);
  grad.addColorStop(1, c3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Radial ambient overlay for luminous shine & depth
  const radial = ctx.createRadialGradient(width * 0.85, height * 0.12, 50, width * 0.85, height * 0.12, 600);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
  radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  const radialBottom = ctx.createRadialGradient(width * 0.15, height * 0.88, 40, width * 0.15, height * 0.88, 550);
  radialBottom.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  radialBottom.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radialBottom;
  ctx.fillRect(0, 0, width, height);

  // 2. Inner card container with frosted translucent glass
  const margin = 70;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.40)';
  ctx.shadowBlur = 40;
  drawRoundRect(ctx, margin, margin, cardW, cardH, 44);
  ctx.fill();
  ctx.restore();

  // Glowing border outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
  ctx.lineWidth = 3;
  drawRoundRect(ctx, margin, margin, cardW, cardH, 44);
  ctx.stroke();

  // 3. Category Header & Icon Badge
  const headerY = margin + 85;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 38px "Outfit", "Hind", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${category.icon}  ${category.hindiName.toUpperCase()}`, width / 2, headerY);

  // Decorative divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.50)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 130, headerY + 28);
  ctx.lineTo(width / 2 + 130, headerY + 28);
  ctx.stroke();

  // 4. Large Artistic Quote Mark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = 'bold 180px "Rozha One", serif';
  ctx.textAlign = 'center';
  ctx.fillText('“', width / 2, headerY + 160);

  // 5. Adaptive font sizing based on length
  const charCount = item.text.length;
  let fontSize = 42;
  if (charCount > 350) fontSize = 28;
  else if (charCount > 240) fontSize = 32;
  else if (charCount > 150) fontSize = 36;
  else if (charCount < 70) fontSize = 46;

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${fontSize}px "Hind", sans-serif`;
  ctx.textAlign = 'center';

  const maxTextWidth = cardW - 130;
  const lineHeight = fontSize * 1.55;

  const paragraphs = item.text.split('\n');
  const lines: string[] = [];

  paragraphs.forEach((p) => {
    const words = p.split(' ');
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }
  });

  // Calculate startY for vertical center
  const totalTextHeight = lines.length * lineHeight;
  let startY = (height - totalTextHeight) / 2 + 30;

  // Render lines with soft shadow for readability over vibrant backgrounds
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.60)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;
  lines.forEach((line) => {
    ctx.fillText(line, width / 2, startY);
    startY += lineHeight;
  });
  ctx.restore();

  // 6. Author or character tag
  if (item.authorOrCharacter) {
    ctx.fillStyle = '#FFE082';
    ctx.font = 'bold 34px "Outfit", "Hind", sans-serif';
    ctx.fillText(`— ${item.authorOrCharacter}`, width / 2, startY + 55);
  }

  // 7. Watermark / App Promotion Branding Box at Bottom (Rendered only if includeWatermark is true)
  if (includeWatermark) {
    const wmBoxY = height - margin - 70;
    const pillW = 680;
    const pillH = 64;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.40)';
    drawRoundRect(ctx, width / 2 - pillW / 2, wmBoxY - pillH / 2, pillW, pillH, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Hind", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(customWatermark, width / 2, wmBoxY + 7);
  }

  return canvas;
}

/**
 * Generates card image data (both DataURL and Blob) synchronously and instantly
 */
export function getCardImageDataSync(
  item: Item,
  category: CategoryTheme,
  options: CardImageOptions = {}
): CardRenderResult {
  const canvas = renderCardCanvas(item, category, options);
  const dataUrl = canvas.toDataURL('image/png');
  const blob = dataUrlToBlob(dataUrl);
  const tag = options.includeWatermark === false ? 'clean' : 'watermark';
  const filename = `chutkule-${category.id}-${tag}-${Date.now()}.png`;

  return {
    blob,
    dataUrl,
    filename,
    width: canvas.width,
    height: canvas.height,
  };
}

/**
 * Generates an ultra-crisp PNG Blob of a joke or quote card
 */
export async function createCardImageBlob(
  item: Item,
  category: CategoryTheme,
  options: CardImageOptions = {}
): Promise<Blob> {
  const result = getCardImageDataSync(item, category, options);
  return result.blob;
}

/**
 * 1-Tap Share Card to WhatsApp / Mobile Share Sheet
 * @param includeWatermark whether to draw watermark (default true)
 */
export async function shareCardDirectly(
  item: Item,
  category: CategoryTheme,
  includeWatermark: boolean = true
): Promise<{
  success: boolean;
  downloadedFallback?: boolean;
  dataUrl: string;
  filename: string;
  blob: Blob;
}> {
  const cardData = getCardImageDataSync(item, category, { aspectRatio: 'story', includeWatermark });
  try {
    const result = await shareImageToWhatsApp(
      cardData.blob,
      item.text,
      cardData.filename,
      cardData.dataUrl
    );
    return {
      success: result.success,
      downloadedFallback: result.method === 'download_only',
      dataUrl: cardData.dataUrl,
      filename: cardData.filename,
      blob: cardData.blob,
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: false, dataUrl: cardData.dataUrl, filename: cardData.filename, blob: cardData.blob };
    }
    console.error('Direct card share failed', err);
    return { success: false, dataUrl: cardData.dataUrl, filename: cardData.filename, blob: cardData.blob };
  }
}

/**
 * 1-Tap Download Card to phone gallery / downloads
 * Synchronous on Web (preserving user gesture!), native Filesystem save on Capacitor Android.
 */
export async function downloadCardDirectly(
  item: Item,
  category: CategoryTheme,
  includeWatermark: boolean = true
): Promise<{
  success: boolean;
  filename: string;
  dataUrl: string;
  blob: Blob;
  savedPath?: string;
  savedUri?: string;
}> {
  const cardData = getCardImageDataSync(item, category, { aspectRatio: 'story', includeWatermark });

  // On Web: trigger synchronous download immediately without yielding to async microtasks
  if (!Capacitor.isNativePlatform()) {
    const ok = downloadImageBlob(cardData.blob, cardData.filename);
    return {
      success: ok,
      filename: cardData.filename,
      dataUrl: cardData.dataUrl,
      blob: cardData.blob,
    };
  }

  // On Native Android APK: write to Documents/ChutkuleVichar/ with permission check
  try {
    const result = await downloadOrSaveImageFile(cardData.blob, cardData.filename, cardData.dataUrl);
    return {
      success: result.success,
      filename: cardData.filename,
      dataUrl: cardData.dataUrl,
      blob: cardData.blob,
      savedPath: result.savedPath,
      savedUri: result.savedUri,
    };
  } catch (err) {
    console.error('Direct card download failed', err);
    return {
      success: false,
      filename: cardData.filename,
      dataUrl: cardData.dataUrl,
      blob: cardData.blob,
    };
  }
}
