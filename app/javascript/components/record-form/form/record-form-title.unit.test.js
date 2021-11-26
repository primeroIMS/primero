import { IconButton } from "@material-ui/core";
import MenuOpen from "@material-ui/icons/MenuOpen";

import { setupMountedComponent } from "../../../test";

import RecordFormTitle from "./record-form-title";
import { GuidingQuestions } from "./components";

describe("<RecordFormTitle />", () => {
  const props = {
    displayText: "Test title",
    handleToggleNav: () => {},
    mobileDisplay: true
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordFormTitle, props, {}));
  });

  it("renders a <IconButton />", () => {
    expect(component.find(IconButton)).to.have.lengthOf(1);
  });

  it("renders a <MenuOpen />", () => {
    expect(component.find(MenuOpen)).to.have.lengthOf(1);
  });

  it("renders a valid text passed as a prop", () => {
    expect(component.text()).to.be.equal("Test title");
  });

  context("when subtitle is present", () => {
    it("renders a <subtitle />", () => {
      const { component: currentComponent } = setupMountedComponent(
        RecordFormTitle,
        { ...props, subTitle: "Test subtitle" },
        {}
      );
      const h3Tag = currentComponent.find("h3");

      expect(h3Tag).to.have.lengthOf(1);
      expect(h3Tag.at(0).text()).to.be.equal("Test subtitle");
    });
  });

  context("when subTitleGuidance is present", () => {
    it("renders a <subtitle />", () => {
      const { component: currentComponent } = setupMountedComponent(
        RecordFormTitle,
        { ...props, subTitleGuidance: { en: "This is a Guidance" }, mode: { isEdit: true } },
        {}
      );
      const guidance = currentComponent.find(GuidingQuestions);

      expect(guidance).to.have.lengthOf(1);
      expect(guidance.at(0).text()).to.be.equal("buttons.guidance");
    });
  });
});
