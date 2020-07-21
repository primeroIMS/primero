import reduce from "image-blob-reduce";

import { MAX_IMAGE_SIZE } from "../config";

const readFileAsync = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

export default async (file, max = MAX_IMAGE_SIZE) => {
  try {
    const image = await reduce().toBlob(file, { max });
    console.log(file)
    const results = await readFileAsync(image);

    const parsedResults = results.match(/(^.*base64,)(.*)/);

    return {
      result: parsedResults?.[2],
      fileType: file.type,
      fileName: file.name,
      content: parsedResults?.[1]
    };
  } catch (error) {
    throw new Error(error);
  }
};
