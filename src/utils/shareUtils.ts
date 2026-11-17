import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Universal Mobile-First Share & Download Utilities for WhatsApp, Web & Capacitor Android
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && 'ontouchstart' in window)
  );
}

/**
 * Converts a Blob to pure Base64 string for Capacitor Filesystem
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a Blob to full Data URL string
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extracts pure Base64 synchronously from a dataUrl if available
 */
function extractBase64FromDataUrl(dataUrl?: string): string | null {
  if (!dataUrl || !dataUrl.includes(',')) return null;
  return dataUrl.split(',')[1] || null;
}

/**
 * Converts Data URL string to Blob synchronously
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Standard Universal WhatsApp Share URL
 */
export function getWhatsAppUrl(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Synchronously triggers PNG image download on web browsers using image/png Blob URL.
 * Must be invoked synchronously within a user gesture for mobile Chrome/Safari compatibility.
 */
export function downloadImageBlob(blob: Blob, filename: string): boolean {
  try {
    const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });
    const blobUrl = URL.createObjectURL(pngBlob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.setAttribute('download', filename);
    a.type = 'image/png';
    a.rel = 'noopener noreferrer';
    a.style.position = 'fixed';
    a.style.left = '-9999px';
    a.style.top = '-9999px';
    a.style.opacity = '0';
    a.style.pointerEvents = 'none';
    document.body.appendChild(a);

    a.click();

    setTimeout(() => {
      try {
        if (a.parentNode) {
          a.parentNode.removeChild(a);
        }
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 60000);

    return true;
  } catch (e) {
    console.error('downloadImageBlob error', e);
    return false;
  }
}

/**
 * Ensures Capacitor Filesystem storage permissions on Android 9/10 and older
 */
async function ensureNativeStoragePermission(): Promise<void> {
  try {
    const status = await Filesystem.checkPermissions();
    if (status.publicStorage !== 'granted') {
      await Filesystem.requestPermissions();
    }
  } catch {
    // Scoped storage on Android 11+ does not always require runtime permission for Documents
  }
}

/**
 * Saves/downloads an image file directly to the user's phone Documents/Gallery or Downloads.
 * 1. Native Capacitor (Android APK): requests permission if needed, writes PNG to Documents/ChutkuleVichar/,
 *    and falls back to Cache + native Share Sheet if Documents write is restricted.
 * 2. Web browser: synchronously triggers PNG download via anchor click.
 */
export async function downloadOrSaveImageFile(
  blob: Blob,
  filename: string,
  dataUrlHint?: string
): Promise<{
  success: boolean;
  method: 'native' | 'web';
  dataUrl?: string;
  savedPath?: string;
  savedUri?: string;
}> {
  if (Capacitor.isNativePlatform()) {
    try {
      await ensureNativeStoragePermission();
      const base64Data = extractBase64FromDataUrl(dataUrlHint) || (await blobToBase64(blob));

      // Primary: Write directly into Documents/ChutkuleVichar/<filename>
      try {
        const relativePath = `ChutkuleVichar/${filename}`;
        const saved = await Filesystem.writeFile({
          path: relativePath,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });

        return {
          success: true,
          method: 'native',
          savedPath: `Documents/${relativePath}`,
          savedUri: saved.uri,
          dataUrl: dataUrlHint,
        };
      } catch (docErr) {
        console.warn('Documents write failed, falling back to Cache + Share:', docErr);
        const cached = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Cache,
        });

        await Share.share({
          title: 'फोटो कार्ड सेव करें',
          files: [cached.uri],
          dialogTitle: 'कार्ड गैलरी में सेव करें',
        });

        return {
          success: true,
          method: 'native',
          savedUri: cached.uri,
          dataUrl: dataUrlHint,
        };
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('cancel')) {
        return { success: false, method: 'native', dataUrl: dataUrlHint };
      }
      console.warn('Native save failed completely:', err);
      return { success: false, method: 'native', dataUrl: dataUrlHint };
    }
  }

  // Web browser synchronous download (do NOT await before calling downloadImageBlob)
  const ok = downloadImageBlob(blob, filename);
  return { success: ok, method: 'web', dataUrl: dataUrlHint };
}

/**
 * Opens Android Share Sheet (native APK) or Web Share API (mobile browser) with the actual PNG image file
 * so the user can save to Photos/Gallery or share to any app.
 */
export async function shareImageToGalleryNativeOrWeb(
  blob: Blob,
  filename: string,
  title: string = 'चुटकुले और विचार कार्ड',
  dataUrlHint?: string
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = extractBase64FromDataUrl(dataUrlHint) || (await blobToBase64(blob));
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title,
        files: [savedFile.uri],
        dialogTitle: 'गैलरी में सेव करें या शेयर करें',
      });
      return 'shared';
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('cancel')) {
        return 'cancelled';
      }
    }
  }

  try {
    const file = new File([blob], filename, { type: 'image/png' });
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
      });
      return 'shared';
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return 'cancelled';
    }
  }

  downloadImageBlob(blob, filename);
  return 'downloaded';
}

/**
 * Directly opens WhatsApp App on mobile (or Web on desktop) with formatted text
 */
export function openWhatsAppDirect(text: string): void {
  const targetUrl = getWhatsAppUrl(text);

  try {
    if (window.top && window.top !== window) {
      window.top.location.href = targetUrl;
      return;
    }
  } catch {}

  try {
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    link.style.opacity = '0';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch {}
    }, 1000);
  } catch {
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = targetUrl;
    }
  }
}

/**
 * Shares an image file to WhatsApp / Social Media
 * 1. Native Android APK (Capacitor): writes PNG to Cache & attaches via `files: [uri]`
 * 2. Mobile Chrome / Safari: Web Share API with `files: [File]`
 * 3. Desktop / Web fallback: downloads PNG card synchronously + opens WhatsApp
 */
export async function shareImageToWhatsApp(
  blob: Blob,
  text: string,
  filename: string = 'chutkule-status.png',
  dataUrlHint?: string
): Promise<{ method: 'native' | 'download_and_whatsapp'; success: boolean; dataUrl?: string }> {
  // 1. Native Capacitor Platform (Android APK)
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = extractBase64FromDataUrl(dataUrlHint) || (await blobToBase64(blob));
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'चुटकुले और विचार',
        text: `${text}\n\n📲 ऐप: चुटकुले और विचार`,
        files: [savedFile.uri],
        dialogTitle: 'WhatsApp स्टेटस या चैट में शेयर करें',
      });

      return { method: 'native', success: true, dataUrl: dataUrlHint };
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('cancel')) {
        return { method: 'native', success: false, dataUrl: dataUrlHint };
      }
      console.warn('Native Capacitor share failed, continuing with fallback', err);
    }
  }

  // 2. Web Share API with file support (Mobile Chrome / Safari)
  try {
    const file = new File([blob], filename, { type: 'image/png' });
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'चुटकुले और विचार',
          text: `${text}\n\n📲 ऐप: चुटकुले और विचार`,
        });
        return { method: 'native', success: true, dataUrl: dataUrlHint };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return { method: 'native', success: false, dataUrl: dataUrlHint };
        }
        console.warn('Navigator.share error, falling through to download + WhatsApp redirect', err);
      }
    }
  } catch (err) {
    console.warn('File share check failed', err);
  }

  // 3. Reliable Web Fallback:
  downloadImageBlob(blob, filename);
  openWhatsAppDirect(`${text}\n\n📲 फोटो कार्ड गैलरी में सेव हो गया है!`);

  return { method: 'download_and_whatsapp', success: true, dataUrl: dataUrlHint };
}
