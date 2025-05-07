// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import ResourcesForm from "./resources";

describe("pages/admin/<RolesForm>/forms - ResourcesForm", () => {
  const i18n = { t: () => "" };

  it("returns the resources form with fields", () => {
    const resourcesForm = ResourcesForm(fromJS({ case: ["read"] }), i18n, {});

    expect(resourcesForm).toHaveLength(1);
  });
});
