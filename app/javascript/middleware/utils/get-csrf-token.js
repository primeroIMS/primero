function getCSRFToken() {
  return document.cookie.split("=")?.[1];
}

export default getCSRFToken;
