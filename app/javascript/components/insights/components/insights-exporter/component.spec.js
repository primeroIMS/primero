// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen, userEvent } from "test-utils";

import InsightExporter from "./component";

describe("<Insights />/components/<InsightsExporter />", () => {
  let globalStore;
  const props = {
    close: () => {},
    i18n: { t: value => value },
    open: true,
    pending: false,
    moduleID: "",
    setPending: value => value
  };

  beforeEach(() => {
    const { store } = mountedComponent(<InsightExporter {...props} />);

    globalStore = store;
  });

  it("renders <ActionDialog />", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  // need to be complete.
  xit("should send all as a subreport param", async () => {
    const result = {
      subreport: "all",
      export_type: "xlsx",
      id: undefined,
      record_type: "incident"
    };
    const user = userEvent.setup();

    await user.click(screen.getByText("submit"));
    expect(globalStore.getActions()[0].api.params).toEqual(result);
  });
});
