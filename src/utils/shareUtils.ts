import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Universal Mobile-First Share Utilities for WhatsApp & Social Media
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
 * Converts Data URL string to Blob synchronously
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
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
 * Downloads an image directly to the user's gallery / downloads
 * Uses Data URL + Blob URL + direct click for maximum browser/webview compatibility
 */
/**
 * Downloads an image directly to the user's gallery / downloads folder.
 * Uses a Blob URL with application/octet-stream so mobile Chrome & Safari force a file download
 * instead of blocking data: URLs.
 */
export function downloadImageBlob(blob: Blob, filename: string): boolean {
  try {
    // 1. Force octet-stream so the browser triggers file save dialog / download manager
    const downloadBlob = new Blob([blob], { type: 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(downloadBlob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.setAttribute('download', filename);
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();

    setTimeout(() => {
      try {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 20000);

    return true;
  } catch (e) {
    console.error('downloadImageBlob error', e);
    return false;
  }
}

/**
 * Saves/downloads an image file directly to the user's phone gallery / downloads
 * 1. Native Capacitor (Android APK): writes file to device & triggers system save
 * 2. Web browser: triggers direct file save
 */
export async function downloadOrSaveImageFile(
  blob: Blob,
  filename: string
): Promise<{ success: boolean; method: 'native' | 'web'; dataUrl?: string }> {
  // 1. If Native Android APK
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = await blobToBase64(blob);
      const saved = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });

      // Also trigger Native Share with Save option for gallery
      await Share.share({
        title: 'फोटो कार्ड सेव करें',
        url: saved.uri,
        dialogTitle: 'कार्ड गैलरी में सेव करें',
      });

      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('cancel')) {
        return { success: true, method: 'native' };
      }
      console.warn('Native filesystem write failed, fallback to web download', err);
    }
  }

  // 2. Web browser direct download
  let dataUrl: string | undefined;
  try {
    dataUrl = await blobToDataUrl(blob);
  } catch {}

  await downloadImageBlob(blob, filename);
  return { success: true, method: 'web', dataUrl };
}

/**
 * Directly opens WhatsApp App on mobile (or Web on desktop) with formatted text
 * Guaranteed to bypass iframe sandboxing and popup blockers
 */
export function openWhatsAppDirect(text: string): void {
  const targetUrl = getWhatsAppUrl(text);

  // 1. Attempt top-level navigation if in an iframe
  try {
    if (window.top && window.top !== window) {
      window.top.location.href = targetUrl;
      return;
    }
  } catch {}

  // 2. Create and trigger explicit anchor element
  try {
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {}
    }, 1000);
  } catch {
    // 3. Direct window open fallback
    try {
      window.open(targetUrl, '_blank');
    } catch {
      window.location.href = targetUrl;
    }
  }
}

/**
 * Shares an image file to WhatsApp / Social Media
 * 1. If Native Android APK (Capacitor): writes to cache & invokes native Android Share Sheet (WhatsApp, Status, etc.)
 * 2. If Web / Browser with Web Share API: shares file directly
 * 3. Fallback: downloads card image to gallery AND opens WhatsApp
 */
export async function shareImageToWhatsApp(
  blob: Blob,
  text: string,
  filename: string = 'chutkule-status.png'
): Promise<{ method: 'native' | 'download_and_whatsapp'; success: boolean; dataUrl?: string }> {
  let dataUrl: string | undefined;
  try {
    dataUrl = await blobToDataUrl(blob);
  } catch {}

  // 1. Native Capacitor Platform (Android APK)
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = await blobToBase64(blob);
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'चुटकुले और विचार',
        text: `${text}\n\n📲 ऐप: चुटकुले और विचार`,
        url: savedFile.uri,
        dialogTitle: 'WhatsApp स्टेटस या चैट में शेयर करें',
      });

      return { method: 'native', success: true, dataUrl };
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.includes('canceled') || err?.message?.includes('cancelled')) {
        return { method: 'native', success: false, dataUrl };
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
        return { method: 'native', success: true, dataUrl };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User dismissed share dialog
          return { method: 'native', success: false, dataUrl };
        }
        console.warn('Navigator.share error, falling through to download + WhatsApp redirect', err);
      }
    }
  } catch (err) {
    console.warn('File share check failed', err);
  }

  // 3. Reliable Web Fallback:
  // First download the card image to user's gallery / downloads folder
  await downloadImageBlob(blob, filename);

  // Then directly launch WhatsApp app
  openWhatsAppDirect(`${text}\n\n📲 फोटो कार्ड गैलरी में सेव हो गया है!`);

  return { method: 'download_and_whatsapp', success: true, dataUrl };
}
