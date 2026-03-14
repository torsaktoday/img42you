import type { SceneMotionExportFormat, SceneMotionPreset } from '../types/app';

const EXPORT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  '1:1': { width: 960, height: 960 },
  '9:16': { width: 720, height: 1280 },
  '16:9': { width: 1280, height: 720 },
  '3:4': { width: 960, height: 1280 },
  '4:3': { width: 1280, height: 960 },
};

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function getLoopProgress(progress: number) {
  return 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load scene image for local motion export.'));
    image.src = src;
  });
}

function getCanvasSize(aspectRatio: string) {
  return EXPORT_DIMENSIONS[aspectRatio] || EXPORT_DIMENSIONS['4:3'];
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  preset: SceneMotionPreset,
  progress: number,
  width: number,
  height: number,
) {
  const loopProgress = easeInOutSine(getLoopProgress(progress));
  const scale = preset.scaleFrom + (preset.scaleTo - preset.scaleFrom) * loopProgress;
  const x = preset.xFrom + (preset.xTo - preset.xFrom) * loopProgress;
  const y = preset.yFrom + (preset.yTo - preset.yFrom) * loopProgress;
  const rotate = (preset.rotateFrom + (preset.rotateTo - preset.rotateFrom) * loopProgress) * (Math.PI / 180);

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const baseScale = Math.max(width / image.width, height / image.height);

  ctx.save();
  ctx.translate(width / 2 + x, height / 2 + y);
  ctx.rotate(rotate);
  ctx.scale(baseScale * scale, baseScale * scale);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();

  const lightX = width * (-0.45 + 1.9 * progress);
  const lightGradient = ctx.createLinearGradient(lightX, 0, lightX + width * 0.32, 0);
  lightGradient.addColorStop(0, 'rgba(255,255,255,0)');
  lightGradient.addColorStop(0.5, `rgba(255,255,255,${preset.overlayStrength})`);
  lightGradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = lightGradient;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.15,
    width * 0.5,
    height * 0.5,
    width * 0.8,
  );
  vignette.addColorStop(0, 'rgba(255,255,255,0.08)');
  vignette.addColorStop(0.55, 'rgba(0,0,0,0.08)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function getMimeCandidates(format: SceneMotionExportFormat) {
  if (format === 'mp4') {
    return ['video/mp4;codecs=h264', 'video/mp4'];
  }

  return ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
}

export function getSceneMotionExportSupport() {
  if (typeof MediaRecorder === 'undefined') {
    return { webm: false, mp4: false };
  }

  return {
    webm: getMimeCandidates('webm').some((mimeType) => MediaRecorder.isTypeSupported(mimeType)),
    mp4: getMimeCandidates('mp4').some((mimeType) => MediaRecorder.isTypeSupported(mimeType)),
  };
}

function getSupportedMimeType(format: SceneMotionExportFormat) {
  const supported = getMimeCandidates(format).find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
  if (!supported) {
    throw new Error(`This browser does not support ${format.toUpperCase()} export for local scene motion.`);
  }
  return supported;
}

export async function exportSceneMotionVideo(params: {
  imageUrl: string;
  preset: SceneMotionPreset;
  aspectRatio: string;
  format: SceneMotionExportFormat;
}) {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    throw new Error('Local scene motion export is only available in supported browsers.');
  }

  const mimeType = getSupportedMimeType(params.format);
  const image = await loadImage(params.imageUrl);
  const { width, height } = getCanvasSize(params.aspectRatio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas rendering is not available in this browser.');
  }

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  const chunks: BlobPart[] = [];

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    recorder.onerror = () => reject(new Error('Failed to record local motion export.'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start();
  const start = performance.now();
  const totalDuration = params.preset.duration * 1000;

  await new Promise<void>((resolve) => {
    const render = (now: number) => {
      const elapsed = Math.min(now - start, totalDuration);
      const progress = totalDuration === 0 ? 1 : elapsed / totalDuration;
      drawFrame(context, image, params.preset, progress, width, height);

      if (elapsed < totalDuration) {
        requestAnimationFrame(render);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(render);
  });

  await new Promise((resolve) => setTimeout(resolve, 120));
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());

  const blob = await recordingPromise;
  return {
    blob,
    url: URL.createObjectURL(blob),
    extension: params.format,
    mimeType,
  };
}
