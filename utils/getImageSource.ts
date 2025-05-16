import { images } from './imageMap';

export const getImageSource = (imageName: string | undefined, number: number) => {
  if (images[number]) {
    return images[number];
  }
  if (imageName) {
    return { uri: `https://daotaolaixebd.com/app/uploads/${imageName}` };
  }
  return images['default'];
};