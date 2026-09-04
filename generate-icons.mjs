import fs from 'fs';
import { createCanvas, Image } from 'canvas';

// 生成多种尺寸的 PNG 图标供 iOS / Android 使用
const sizes = [180, 192, 512];

const svgBuffer = fs.readFileSync('icons/icon.svg');
const svgDataUrl = 'data:image/svg+xml;base64,' + svgBuffer.toString('base64');

async function convert() {
  const img = new Image();
  img.onload = () => {
    sizes.forEach(size => {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(`icons/icon-${size}.png`, buffer);
      console.log(`Generated icon-${size}.png`);
    });
  };
  img.src = svgDataUrl;
}
convert().catch(err => console.log(err));
