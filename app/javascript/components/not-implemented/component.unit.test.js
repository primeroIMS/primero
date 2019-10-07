import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import NotImplemented from "./component";

describe("<NotImplemented />", () => {
  let component;

  describe("When not passing a custom text", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(NotImplemented, {}));
    });
    it("renders default text", () => {
      expect(component.find("p").text()).to.equals("Not Yet Implemented");
    });
  });

  describe("When passing a custom text", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(NotImplemented, {
        text: "Hello World"
      }));
    });

    it("renders custom text", () => {
      expect(component.find("p").text()).to.equals("Hello World");
    });
  });
});
