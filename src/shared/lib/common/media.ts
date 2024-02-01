import { degToRad } from '@/shared/lib/common/math';

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const fileToBlob = (file: File) => {
  return new Blob([file], { type: file.type });
};

export const renderImage = (blobOrUrl: Blob | string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const renderImage = new Image();
    renderImage.src =
      blobOrUrl instanceof Blob ? URL.createObjectURL(blobOrUrl) : blobOrUrl;
    renderImage.onload = () => resolve(renderImage);
    renderImage.onerror = () => reject();
  });

function cropImageFromCanvas(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas;
  let w = canvas.width;
  let h = canvas.height;
  const pix: { x: number[]; y: number[] } = { x: [], y: [] };
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let x: number;
  let y: number;
  let index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b;
  });
  pix.y.sort(function (a, b) {
    return a - b;
  });
  const n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
  return canvas;
}

// TODO: ломает iphone с огромными изображениями
export const rotateImage = (image: HTMLImageElement, angle: number) => {
  const maxSize = Math.max(image.width, image.height);
  const canvas = document.createElement('canvas');
  canvas.width = maxSize;
  canvas.height = maxSize;
  const ctx = canvas.getContext('2d')!;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(degToRad(angle));
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();
  cropImageFromCanvas(ctx);
  return renderImage(canvas.toDataURL('image/png'));
};
