import { ArtistImage, ImageSize } from "../types/common.types";

export const findImageSrc = (images: ArtistImage[] | undefined, desiredSize: ImageSize): string | null => {
  if (images && Array.isArray(images) && images.length > 0) {
    // Find the first image with the desired size or use the first image if size is not specified
    const foundImage = images.find(image => image.size === desiredSize) || images[0];

    return foundImage ? foundImage['#text'] : null;
  }
  return null;
}