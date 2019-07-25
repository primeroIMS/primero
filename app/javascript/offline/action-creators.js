import { openDB } from "idb";
import uuidv4 from "uuid/v4";

import * as Actions from "./actions";
import * as Selectors from "./selectors";

const pbkdf2 = async (salt, user_name, password) => {
  const value = { user_name, password };
  const string = JSON.stringify(value);
  const textEncoder = new TextEncoder();
  const keyData = textEncoder.encode(string);
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "PBKDF2" },
    false,
    [ "deriveKey", "deriveBits" ]
  );
  const typedArray = new Uint8Array(16);
  if (!salt) {
    salt = window.crypto.getRandomValues(typedArray);
  }
  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-512", salt, iterations: 10000 },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    [ "encrypt", "decrypt" ]
  );
  const result = { salt, key };
  return result;
};

export const calculateOfflineEncryption = (salt, user_name, password) => async dispatch => {
  const { salt, key } = await pbkdf2(salt, user_name, password);
  dispatch(setOfflineEncryption(salt, key));
};

export const setOfflineEncryption = (salt, key) => ({ type: Actions.SET_OFFLINE_ENCRYPTION, payload: { salt, key } });

export const setOfflineEncryptionKey = key => ({ type: Actions.SET_OFFLINE_ENCRYPTION_KEY, payload: { key } });

const openCases = path => (
  openDB("primero", 1, {
    upgrade(db) {
      db.createObjectStore(path, { keyPath: "id" });
    }
  })
);

export const offlineSaveRecord = api => async (dispatch, getState) => {
  const { path, body } = api;
  const { data } = body;
  if (!data.id) {
    data.id = uuidv4();
  }
  if (!data.case_id) {
    data.case_id = uuidv4();
  }
  if (!data.case_id_display) {
    data.case_id_display = data.case_id.substring(data.case_id.length-7);
  }
  const db = await openCases(path);
  const typedArray = new Uint8Array(12);
  const iv = window.crypto.getRandomValues(typedArray);
  const state = getState();
  const key = Selectors.selectOfflineEncryptionKey(state);
  const string = JSON.stringify(data);
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(string);
  const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const value = { id: data.id, iv, encrypted };
  await db.add(path, value);
}

export const offlineRecords = api => async (dispatch, getState) => {
  const { path } = api;
  const db = await openCases(path);
  const all = await db.getAll(path);
  const state = getState();
  const key = Selectors.selectOfflineEncryptionKey(state);
  const records = [];
  const textDecoder = new TextDecoder();
  for (const encrypted of all) {
    const encoded = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: encrypted.iv }, key, encrypted.encrypted);
    const string = textDecoder.decode(encoded);
    console.log("string=", string);
  }
};
