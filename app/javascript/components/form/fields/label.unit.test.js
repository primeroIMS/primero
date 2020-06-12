import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";

import Label from "./label";

describe("<Label />", () => {
  let component;
  const initialState = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      Label,
      { commonInputProps: { label: "Some text" } },
      initialState
    ));
  });

  it("renders the Label", () => {
    expect(component.find(Label)).to.have.lengthOf(1);
    expect(component.find(Label).text()).to.equal("Some text");
  });
  describe("When recieve metaInputProps", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Label,
        {
          commonInputProps: { label: "Some text" },
          metaInputProps: {
            phraseParts: ["This", "is", "a", "phrase"],
            boldWords: []
          }
        },
        initialState
      ));
    });

    it("renders the Phrase", () => {
      expect(component.find(Label)).to.have.lengthOf(1);
      expect(component.find(Label).text()).to.equal("This is a phrase ");
    });
  });
});
