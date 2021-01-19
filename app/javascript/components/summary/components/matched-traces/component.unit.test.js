import { setupMountedComponent } from "../../../../test";

import { MatchedTracePanel } from "./components";
import MatchedTraces from "./component";

describe("<MatchedTraces />", () => {
  describe("when data is empty", () => {
    let component;
    const props = { data: [] };

    beforeEach(() => {
      ({ component } = setupMountedComponent(MatchedTraces, props, {}));
    });

    it("should render a <p> tag", () => {
      expect(component.find("p")).to.have.lengthOf(1);
      expect(component.find("p").text()).to.be.equals("tracing_request.messages.nothing_found");
    });
  });

  describe("when data is not empty", () => {
    let component;
    const props = { data: [{ id: "1234567" }] };

    beforeEach(() => {
      ({ component } = setupMountedComponent(MatchedTraces, props, {}));
    });

    it("should render 1 <MatchedTracePanel /> component", () => {
      expect(component.find(MatchedTracePanel)).to.have.lengthOf(1);
    });
  });
});
