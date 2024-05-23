function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  const [, value] = cookies.find(cookie => cookie.startsWith("CSRF-TOKEN="))?.split("=");

  return decodeURIComponent(value);
}

export default getCSRFToken;
