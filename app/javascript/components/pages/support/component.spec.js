import { fromJS } from "immutable";

import { mountedComponent, screen, userEvent } from "../../../test-utils";

import Support from "./component";
import { waitFor } from "@testing-library/react";

describe("<Support />", () => {

  describe("Default components", () => {

    it("should render PageContainer component", () => {
        mountedComponent(<Support />)
      expect(screen.getByTestId('page-container')).toBeInTheDocument();
    });

    it("should render PageHeading component", () => {
        mountedComponent(<Support />)
      expect(screen.getByTestId('page-heading')).toBeInTheDocument();
    });

    it("should render Navigation component", () => {
        mountedComponent(<Support />)
      expect(screen.getByTestId('list')).toBeInTheDocument();
    });

    it("should render ContactInformation component", () => {
        mountedComponent(<Support />)
      expect(screen.getByTestId('support')).toBeInTheDocument();
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

    it("should render a List component", () => {
        mountedComponent(<Support />, {}, state)
        expect(screen.getByTestId('list')).toBeInTheDocument();
    });

    it("should render 4 ListItem components", () => {
        mountedComponent(<Support />, {}, state)
        expect(screen.getAllByTestId('list-item')).toHaveLength(4);
    });

    it("should render CodeOfConduct component when clicking menu from the Navigation list",  () => {
        mountedComponent(<Support />, {}, state)
        userEvent.click(screen.getAllByTestId('list-item').at(2))
         waitFor(() => {
            expect(screen.getByText('contact.info_label')).toBeInTheDocument();
            expect(screen.getByText('Test code of conduct')).toBeInTheDocument();
        })
    });

    it("should render TermOfUse component when clicking menu from the Navigation list",  () => {
        mountedComponent(<Support />, {}, state)
        userEvent.click(screen.getAllByTestId('list-item').at(1))
         waitFor(() => {
        expect(screen.getByText('navigation.support_menu.terms_of_use')).toBeInTheDocument();
        })
    });
  });
});
