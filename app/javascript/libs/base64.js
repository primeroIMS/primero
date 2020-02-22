export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const results = reader.result;

      return resolve({
        result: results.replace(/^.*base64,/, ""),
        fileType: file.type,
        fileName: file.name,
        content: results.replace(/(?<=base64,)(.*)/, "")
      });
    };
    reader.onerror = error => reject(error);
  });
