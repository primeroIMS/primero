import { setupMountedComponent, spy, translateOptions } from "../../../../../test";
import ActionButton from "../../../../action-button";

import SubformEmptyData from "./component";

describe("<SubformEmptyData />", () => {
  let component;

  const translations = {
    en: {
      "forms.subform_not_found": "No %{subform_name} found.",
      "forms.subform_need_to_be_added": "They need to be added"
    }
  };

  const props = {
    handleClick: spy(),
    i18n: { t: (value, options) => translateOptions(value, options, translations) },
    mode: { isEdit: true },
    subformName: "Test form"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformEmptyData, props, {}));
  });

  it("should render one div", () => {
    expect(component.find("div")).to.have.lengthOf(1);
  });

  it("should render the correct subform name", () => {
    expect(component.find("strong").at(0).text()).to.be.equals("No Test form found.");
  });

  it("should render the ActionButton component", () => {
    expect(component.find(ActionButton), "DEPRECATED").to.not.have.lengthOf(1);
  });

  it("should call onClick event passed as a prop", () => {
    const button = component.find("button");

    expect(button, "DEPRECATED").to.not.have.lengthOf(1);
    expect(props.handleClick).to.not.have.been.called;
  });
});
