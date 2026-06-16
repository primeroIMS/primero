import { getIDPToken } from "../components/login/components/idp-selection/auth-provider";

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
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
}

export default downloadUrl;
