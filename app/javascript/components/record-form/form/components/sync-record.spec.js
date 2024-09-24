// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import ImportData from "./sync-record";

describe("<ImportData />", () => {
  const props = {
    i18n: { t: value => value, localizeDate: value => value },
    syncedAt: "2021-01-05T20:47:36.477Z",
    syncStatus: "synced",
    isEnabledWebhookSyncFor: true
  };

  beforeEach(() => {
    mountedComponent(<ImportData {...props} />);
  });

  it("renders a <ActionButton />", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
