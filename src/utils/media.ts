export function getRandomFileName(ext: string = 'png') {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'ai-art-';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${result}.${ext}`;
}

export function getAspectRatioClass(aspectRatio: string) {
  switch (aspectRatio) {
    case '1:1':
      return 'aspect-square';
    case '9:16':
      return 'aspect-[9/16]';
    case '16:9':
      return 'aspect-video';
    case '3:4':
      return 'aspect-[3/4]';
    default:
      return 'aspect-[4/3]';
  }
}
