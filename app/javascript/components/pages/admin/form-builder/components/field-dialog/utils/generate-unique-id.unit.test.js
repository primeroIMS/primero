// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uuid from "../../../../../../../libs/uuid";

import generateUniqueId from "./generate-unique-id";

describe("generateUniqueId", () => {
  it("returns the name of the duplicated data with a generated key of 7 characters", () => {
    jest.spyOn(uuid, "v4").mockReturnValue("b8e93-0cce-415b-ad2b-d06bb454b66f");

    const data = "new field";
    const generatedName = generateUniqueId(data);

    expect(generatedName).toBe("new_field_454b66f");
    expect(generatedName.split("_")[2]).toHaveLength(7);
    jest.resetAllMocks();
  });
});
