import { mountedComponent } from "test-utils";

import Exporter from "./exporter";

describe("<Exporter />", () => {
  describe("when includesGraph is true", () => {
    beforeEach(() => {
      const props = { includesGraph: true };

      mountedComponent(<Exporter {...props} />);
    });

    it("should render 2 <ActionButton /> component", () => {
      expect(document.querySelector("#graph-exporter-button")).toBeInTheDocument();
      expect(document.querySelector("#report-data-button")).toBeInTheDocument();
    });
  });

  describe("when includesGraph is false", () => {
    beforeEach(() => {
      const props = { includesGraph: false };

      mountedComponent(<Exporter {...props} />);
    });

    it("should render 1 <ActionButton /> component", () => {
      expect(document.querySelector("#report-data-button")).toBeInTheDocument();
    });
  });
});
