import { setupMountedComponent } from "../../../../test";

import StackedPercentageBar from "./component";

describe("<StackedPercentageBar />", () => {
  describe("with a single percentage", () => {
    const { component } = setupMountedComponent(StackedPercentageBar, {
      percentages: [
        {
          percentage: 0.5,
          label: "Tests"
        }
      ]
    });

    it("should display the label", () => {
      expect(component.render().text()).to.contain("Tests");
    });

    it("should display the percentage", () => {
      expect(component.render().text()).to.contain("50%");
    });
  });

  describe("with 2 percentages", () => {
    const percentage0 = { percentage: 0, label: "Shrödinger's Tests" };
    const percentage1 = { percentage: 0.35, label: "Passed" };
    const percentage2 = { percentage: 0.147, label: "Failed" };

    describe("where 1 percentage is 0%", () => {
      const { component } = setupMountedComponent(StackedPercentageBar, {
        percentages: [percentage0, percentage1]
      });

      it("should display percentage bars when the percentage is > 0", () => {
        expect(component.html()).to.contain('style="width: 35%;"');
      });

      it("should not display a percentage bar for percentages <= 0", () => {
        expect(component.html()).not.to.contain('style="width: 0%;"');
      });
    });

    describe("where both percentages are > 0", () => {
      const { component } = setupMountedComponent(StackedPercentageBar, {
        percentages: [percentage1, percentage2]
      });

      it("it shows percentage1", () => {
        expect(component.render().text()).to.contain(percentage1.label);
        expect(component.html()).to.contain('style="width: 35%;"');
      });

      it("should show percentage2", () => {
        expect(component.render().text()).to.contain(percentage2.label);
        expect(component.html()).to.contain('style="width: 14.7%;"');
      });
    });

    it("should error when >2 percentages are passed", () => {
      const render = () => {
        setupMountedComponent(StackedPercentageBar, {
          percentages: [percentage0, percentage1, percentage2]
        });
      };

      expect(render).to.throw();
    });
  });
});
