// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import chai from "chai";
import sinonChai from "sinon-chai";
import chaiImmutable from "chai-immutable";
import indexedDB from "fake-indexeddb";
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
import IDBRequest from "fake-indexeddb/lib/FDBRequest";
import IDBTransaction from "fake-indexeddb/lib/FDBTransaction";
import IDBDatabase from "fake-indexeddb/lib/FDBDatabase";
import IDBObjectStore from "fake-indexeddb/lib/FDBObjectStore";
import IDBIndex from "fake-indexeddb/lib/FDBIndex";
import IDBCursor from "fake-indexeddb/lib/FDBCursor";
import { l } from "i18n-js";

chai.use(chaiImmutable);
chai.use(sinonChai);

global.expect = chai.expect;

global.window.indexedDB = indexedDB;
global.indexedDB = global.window.indexedDB;

global.window.IDBKeyRange = IDBKeyRange;
global.IDBKeyRange = global.window.IDBKeyRange;

global.window.IDBRequest = IDBRequest;
global.IDBRequest = global.window.IDBRequest;

global.window.IDBTransaction = IDBTransaction;
global.IDBTransaction = global.window.IDBTransaction;

global.window.IDBDatabase = IDBDatabase;
global.IDBDatabase = global.window.IDBDatabase;

global.window.IDBObjectStore = IDBObjectStore;
global.IDBObjectStore = global.window.IDBObjectStore;

global.window.IDBCursor = IDBCursor;
global.IDBCursor = global.window.IDBCursor;

global.window.IDBIndex = IDBIndex;
global.IDBIndex = global.window.IDBIndex;

let storage = {};

global.localStorage = {
  setItem: (key, value) => {
    storage[key] = value || null;
  },
  getItem: key => {
    return key in storage ? storage[key] : null;
  },
  removeItem: key => {
    delete storage[key];
  },
  clear: () => {
    storage = {}
  }
};

global.sessionStorage = global.localStorage
