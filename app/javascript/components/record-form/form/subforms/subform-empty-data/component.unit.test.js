import { Box, Fab } from "@material-ui/core";
import isEmpty from "lodash/isEmpty";

import { setupMountedComponent, spy } from "../../../../../test";

import SubformEmptyData from "./component";

describe("<SubformEmptyData />", () => {
  let component;

  const translations = {
    "forms.subform_not_found": "No %{subform_name} found.",
    "forms.subform_need_to_be_added": "They need to be added"
  };

  const translateOptions = (value, options) => {
    if (isEmpty(options)) {
      return translations[value];
    }

    let currValue = translations[value];

    Object.entries(options).forEach(option => {
      const [optionKey, optionValue] = option;

      currValue = currValue.replace(optionKey, optionValue);
    });

    return currValue.replace(/[^\w\s.]/gi, "");
  };

  const props = {
    handleClick: spy(),
    i18n: { t: (value, options) => translateOptions(value, options) },
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
    expect(component.find("strong").at(0).text()).to.be.equals(
      "No Test form found."
    );
  });

  it("should render the Fab component", () => {
    expect(component.find(Fab)).to.have.lengthOf(1);
  });

  it("should call onClick event passed as a prop", () => {
    const button = component.find("button");

    expect(button).to.have.lengthOf(1);
    button.simulate("click");
    expect(props.handleClick).to.have.been.called;
  });
});
