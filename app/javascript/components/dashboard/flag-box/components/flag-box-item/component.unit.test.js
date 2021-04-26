import { setupMountedComponent } from "../../../../../test";

import FlagBoxItem from "./component";

describe("<FlagBoxItem />", () => {
  let component;
  const props = {
    date: "2020-12-10",
    reason: "Reason 1",
    recordId: "41a3e69b-991a-406e-b0ee-9123cb60c983",
    title: "User 1",
    user: "primero_test"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(FlagBoxItem, props, {}));
  });

  it("should render a h4 tag", () => {
    expect(component.find("h4").text()).to.be.equal("User 1");
  });

  it("should render a span tag", () => {
    expect(component.find("span").at(0).text()).to.be.equal("2020-12-10");
  });

  it("should render a p tag", () => {
    expect(component.find("p").text()).to.be.equal("Reason 1");
  });

  it("should render a span tag", () => {
    expect(component.find("span").at(1).text()).to.be.equal("primero_test");
  });
});
