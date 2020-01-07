import { expect } from "chai";

import * as index from "./index";

describe("<Form /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    ["RecordForm", "RecordFormToolbar", "FormSectionField"].forEach(
      property => {
        expect(indexValues).to.have.property(property);
        delete indexValues[property];
      }
    );
    expect(indexValues).to.be.empty;
  });
});
