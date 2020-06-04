import { setupMountedComponent } from "../../../../../../test";

import HeadersValues from "./component";

describe("<HeadersValues /> - components/header-values/component", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(HeadersValues, {}));
  });

  it("should render 5 div", () => {
    expect(component.find("div")).to.have.lengthOf(5);
  });

  it("should render english text column", () => {
    expect(component.find("div").at(2).text()).to.be.equal(
      "lookup.english_label"
    );
  });

  it("should render english text column", () => {
    expect(component.find("div").at(3).text()).to.be.equal(
      "lookup.translation_label"
    );
  });

  it("should render english text column", () => {
    expect(component.find("div").at(4).text()).to.be.equal("lookup.remove");
  });
});
