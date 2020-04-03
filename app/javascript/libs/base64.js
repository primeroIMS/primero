export default file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const results = reader.result;
      const parsedResults = results.match(/(^.*base64,)(.*)/);

      return resolve({
        result: parsedResults?.[2],
        fileType: file.type,
        fileName: file.name,
        content: parsedResults?.[1]
      });
    };
    reader.onerror = error => reject(error);
  });
