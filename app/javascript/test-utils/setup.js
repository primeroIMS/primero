import "react-16-node-hanging-test-fix"; // TODO: Remove when update to React 18
import "./globals";
import "@testing-library/jest-dom/extend-expect";
import { MessageChannel } from "worker_threads";

import { createMocks } from "react-idle-timer";
import { cleanup } from "@testing-library/react";

global.IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  createMocks();
  global.MessageChannel = MessageChannel;
});

afterEach(cleanup);
