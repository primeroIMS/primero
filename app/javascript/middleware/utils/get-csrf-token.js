function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  const [, value] = cookies.find(cookie => cookie.startsWith("CSRF-TOKEN="))?.split("=") || [];

  if (!value) {
    return null;
  }

  return decodeURIComponent(value);
}

export default getCSRFToken;
