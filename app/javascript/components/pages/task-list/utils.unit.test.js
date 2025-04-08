// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getTranslatedValue } from "./utils";

describe("<TaskList /> - utils", () => {
  const i18nTranslation = t => t;

  const lookupSample = [
    {
      id: "test",
      display_text: "Test"
    },
    {
      id: "test2",
      display_text: "Test2"
    }
  ];

  it("should return translations for tasks type", () => {
    expect(getTranslatedValue("follow_up", "random", lookupSample, lookupSample, i18nTranslation)).toBe(
      "task.types.follow_up"
    );
  });

  it("should return <IconButton /> Component if ACTION_BUTTON_TYPES is icon", () => {
    expect(getTranslatedValue("service", "test2", lookupSample, lookupSample, i18nTranslation)).toBe(
      "task.types.service"
    );
  });

  it("should return null if any invalid type is passed in", () => {
    expect(getTranslatedValue("case_plan", "", lookupSample, lookupSample, i18nTranslation)).toBe(
      "task.types.case_plan"
    );
  });
});
