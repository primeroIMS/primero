import { stub, createMockStore, spy } from "../../test";
import { generate } from "../../components/notifier";

import handleConfiguration from "./handle-configuration";

describe("middleware/utils/handle-configuration.js", () => {
  const { store } = createMockStore();
  const response = { url: "http://test.com/health/api" };
  const options = { baseUrl: "/api/v2" };
  const rest = {
    fetchSinglePayload: spy(),
    fetchStatus: spy(),
    type: "TEST"
  };
  let dispatch;

  beforeEach(() => {
    stub(generate, "messageKey").returns(4);
    dispatch = spy(store, "dispatch");
  });

  afterEach(() => {
    dispatch.restore();
    generate.messageKey.restore();
    store.clearActions();
  });

  it("should call methods related to 503 response", () => {
    handleConfiguration(503, store, options, response, rest);
    const actions = store.getActions();

    expect(actions[0]).to.deep.equals({
      type: "application/DISABLE_NAVIGATION",
      payload: true
    });

    expect(actions[1]).to.deep.equals({
      type: "notifications/ENQUEUE_SNACKBAR",
      payload: {
        noDismiss: true,
        options: { variant: "info", key: 4 },
        messageKey: "configurations.unavailable_server"
      }
    });
  });

  it("should call methods related to 204 response", () => {
    handleConfiguration(204, store, options, response, rest);

    const actions = store.getActions();

    expect(actions[0]).to.deep.equals({
      type: "notifications/ENQUEUE_SNACKBAR",
      payload: {
        options: { variant: "success", key: 4 },
        messageKey: "configurations.messages.applied"
      }
    });
  });
});
