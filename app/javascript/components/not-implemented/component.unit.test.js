import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import NotImplemented from "./component";

describe("<NotImplemented />", () => {
  let component;

  describe("when not passing a custom text", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(NotImplemented, {}));
    });
    it("renders default text", () => {
      expect(component.find("p").text()).to.equals("*** NOT IMPLEMENTED  ***");
    });
  });

  describe("when passing a custom text", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(NotImplemented, {
        text: "HelloWorld"
      }));
    });

    it("renders custom text", () => {
      expect(component.find("p").text()).to.equals(
        "*** NOT IMPLEMENTED HelloWorld ***"
      );
    });
  });
});
