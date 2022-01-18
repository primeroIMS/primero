import uuid from "uuid";

import { stub } from "../../../../../../../test";

import generateUniqueId from "./generate-unique-id";

describe("generateUniqueId", () => {
  it("returns the name of the duplicated data with a generated key of 7 characters", () => {
    stub(uuid, "v4").returns("b8e93-0cce-415b-ad2b-d06bb454b66f");

    const data = "new field";
    const generatedName = generateUniqueId(data);

    expect(generatedName).to.equal("new_field_454b66f");
    expect(generatedName.split("_")[2]).to.have.lengthOf(7);
    uuid.v4.restore();
  });
});
