export function addWavHeader(base64Data: string, sampleRate: number = 24000) {
  try {
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);

    view.setUint32(0, 0x52494646, false);
    view.setUint32(4, 36 + len, true);
    view.setUint32(8, 0x57415645, false);
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, len, true);

    for (let i = 0; i < len; i++) {
      view.setUint8(44 + i, bytes[i]);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error adding WAV header:', error);
    return null;
  }
}
