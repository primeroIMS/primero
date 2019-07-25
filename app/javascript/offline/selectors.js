export const selectOfflineEncryption = state => state.get("offlineEncryption")

export const selectOfflineEncryptionSalt = state => {
  let salt;
  const offlineEncryption = selectOfflineEncryption(state);
  if (offlineEncryption) {
    salt = offlineEncryption.get("salt");
  }
  return salt;
};

export const selectOfflineEncryptionKey = state => {
  let key;
  const offlineEncryption = selectOfflineEncryption(state);
  if (offlineEncryption) {
    key = offlineEncryption.get("key");
  }
  return key;
}
