// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import "./globals";
import "@testing-library/jest-dom/extend-expect";
import { MessageChannel } from "worker_threads";

import { createMocks } from "react-idle-timer";
import { cleanup } from "@testing-library/react";

import db from "../db";

global.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.warn = () => "";
  createMocks();
  global.MessageChannel = MessageChannel;
});

afterEach(() => {
  db.closeDB();
  cleanup();
});
