import { setupMountedComponent } from "../../../../test";

import TablePercentageBar from "./component";

describe("<TablePercentageBar />", () => {
  it("should display the percentage", () => {
    const { component } = setupMountedComponent(TablePercentageBar, {
      percentage: 0.5
    });

    expect(component.render().html()).to.contain("50%");
  });

  describe("when the percentage is small (< 10%)", () => {
    it("should display the percentage outside of the bar", () => {
      const { component } = setupMountedComponent(TablePercentageBar, {
        percentage: 0.01
      });

      const bar = component.find("div > div > div");

      expect(bar.html()).to.contain("1%");
    });
  });
});
