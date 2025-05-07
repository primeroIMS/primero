import { getIDPToken } from "../components/login/components/idp-selection/auth-provider";

function getFileName(filename, url) {
  const isZipped = url.includes(".zip?");

  if (isZipped) {
    return `${filename}.zip`;
  }

  return filename;
}

async function downloadUrl(url, filename) {
  const token = await getIDPToken();

  fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })
    .then(response => response.blob())
    .then(blob => {
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = fileUrl;
      a.download = getFileName(filename, url);
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

export default downloadUrl;
