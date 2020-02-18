export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () =>
      resolve({ result: reader.result, fileType: file.type, name: file.name });
    reader.onerror = error => reject(error);
  });
