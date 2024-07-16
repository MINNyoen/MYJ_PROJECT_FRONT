import { useState } from "react";
import imageCompression from "browser-image-compression";

const useImageCompress = () => {
  const [isLoading, setIsLoading] = useState(false);

  const compressImage = async (imageFile: File) => {
    if (isLoading) return;

    setIsLoading(true);

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
    };

    try {
      const compressedBlob = await imageCompression(imageFile, options);
      const resizingFile = new File([compressedBlob], imageFile.name, { type: imageFile.type });

      setIsLoading(false);

      return resizingFile;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return { compressImage, isLoading };
};

export default useImageCompress;