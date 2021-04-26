import { Button, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { setupMountedThemeComponent } from "../../../../test";

import DefaultButton from "./component";

describe("<DefaultButton /> components/action-button/components", () => {
  const props = {
    icon: <></>,
    isTransparent: false,
    isCancel: true,
    pending: false,
    text: "Test",
    rest: {}
  };

  it("renders a <Button /> component", () => {
    const component = setupMountedThemeComponent(DefaultButton, props);

    expect(component.find(Button)).to.have.lengthOf(1);
    expect(component.find(CircularProgress)).to.be.empty;
  });

  it("renders a <Button /> and a <CircularProgress /> component", () => {
    const component = setupMountedThemeComponent(DefaultButton, {
      ...props,
      pending: true
    });

    expect(component.find(Button)).to.have.lengthOf(1);
    expect(component.find(CircularProgress)).to.have.lengthOf(1);
    expect(component.find(Button).props().disabled).to.be.true;
  });

  // TODO: Fix once we figure out why styles are not loaded correctly on tests
  describe.skip("with classes added to <Button /> component", () => {
    it("should contain .defaultActionButton class", () => {
      const component = setupMountedThemeComponent(DefaultButton, {
        ...props,
        icon: <AddIcon />
      });

      expect(component.find(".defaultActionButton")).to.have.lengthOf(1);
    });

    it("should contain .isTransparent class", () => {
      const component = setupMountedThemeComponent(DefaultButton, {
        ...props,
        isTransparent: true
      });

      expect(component.find(".isTransparent")).to.have.lengthOf(1);
    });

    it("should contain .isCancel class", () => {
      const component = setupMountedThemeComponent(DefaultButton, {
        ...props,
        isCancel: true
      });

      expect(component.find(".isCancel")).to.have.lengthOf(1);
    });

    it("should contain .onlyText class", () => {
      const component = setupMountedThemeComponent(DefaultButton, {
        ...props,
        icon: null
      });

      expect(component.find(".onlyText")).to.have.lengthOf(1);
    });
  });
});
