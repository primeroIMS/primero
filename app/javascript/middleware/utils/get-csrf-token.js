function getCSRFToken() {
  return decodeURIComponent(document.cookie.split("=")?.[1]);
}

export default getCSRFToken;
