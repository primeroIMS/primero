import { screen, setupMockFieldComponent } from "test-utils";
import { FieldRecord } from "../records";
import { LINK_FIELD } from "../constants";
import LinkField from "./link-field";

describe("<Form /> - fields/<LinkField />", () => {
  it("renders the link", () => {
   setupMockFieldComponent(LinkField, FieldRecord, { type: LINK_FIELD }, {});
    expect(screen.getByText("Test Field 2")).toBeInTheDocument();
  });
});