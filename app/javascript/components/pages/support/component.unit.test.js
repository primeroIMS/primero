import { List, ListItem } from "@material-ui/core";
import { fromJS } from "immutable";

import PageContainer, { PageHeading } from "../../page";
import { setupMountedComponent } from "../../../test";
import ContactInformation from "../../contact-information";

import { Navigation, CodeOfConduct, TermOfUse } from "./components";
import Support from "./component";

describe("<Support />", () => {
  let component;

  describe("Default components", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(Support));
    });

    it("should render PageContainer component", () => {
      expect(component.find(PageContainer)).to.have.lengthOf(1);
    });

    it("should render PageHeading component", () => {
      expect(component.find(PageHeading)).to.have.lengthOf(1);
    });

    it("should render Navigation component", () => {
      expect(component.find(Navigation)).to.have.lengthOf(1);
    });

    it("should render ContactInformation component", () => {
      expect(component.find(ContactInformation)).to.have.lengthOf(1);
    });
  });

  describe("Navigation", () => {
    const state = fromJS({
      application: {
        codesOfConduct: {
          id: 1,
          title: "Test code of conduct",
          content: "Lorem ipsum",
          created_on: "2021-03-19T15:21:38.950Z",
          created_by: "primero"
        },
        systemOptions: {
          code_of_conduct_enabled: true
        }
      }
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(Support, {}, state));
    });

    it("should render a List component", () => {
      expect(component.find(List)).to.have.lengthOf(1);
    });

    it("should render 4 ListItem components", () => {
      expect(component.find(ListItem)).to.have.lengthOf(3);
    });

    it("should render CodeOfConduct component when clicking menu from the Navigation list", () => {
      const codeOfconductMenu = component.find(ListItem).at(2);

      expect(component.find("h1").at(1).text()).to.be.equal("contact.info_label");
      expect(component.find(ContactInformation)).to.have.lengthOf(1);

      codeOfconductMenu.simulate("click");
      expect(component.find(CodeOfConduct)).to.have.lengthOf(1);
      expect(component.find("h2").text()).to.be.equal("Test code of conduct");
    });

    it("should render TermOfUse component when clicking menu from the Navigation list", () => {
      const codeOfconductMenu = component.find(ListItem).at(1);

      codeOfconductMenu.simulate("click");
      expect(component.find(TermOfUse)).to.have.lengthOf(1);
      expect(component.find("h2").text()).to.be.equal("navigation.support_menu.terms_of_use");
    });
  });
});
