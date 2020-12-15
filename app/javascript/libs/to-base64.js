import reduce from "image-blob-reduce";

import { MAX_IMAGE_SIZE } from "../config";
import { ATTACHMENT_TYPES } from "../components/record-form/form/field-types/attachments/constants";

const readFileAsync = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

export default async (file, attachment, max = MAX_IMAGE_SIZE) => {
  try {
    const image = [ATTACHMENT_TYPES.audio, ATTACHMENT_TYPES.document].includes(attachment)
      ? file
      : await reduce().toBlob(file, { max });

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
