import { fromJS } from "immutable";
import { Button } from "@material-ui/core";

import { ACTIONS } from "../../../../permissions";
import { mountedComponent, screen } from "../../../../../test-utils";
import { whichFormMode } from "../../../../form";

import ActionButtons from "./action-buttons";

describe("<ActionButtons />", () => {
  const defaultProps = {
    formRef: {},
    setOpenDeleteDialog: () => ({}),
    handleCancel: () => ({})
  };

  describe("when isShow mode", () => {
    describe("when the user has write permissions on roles", () => {
  

      it("should render the edit button only", () => {
        mountedComponent(<ActionButtons {...{ ...defaultProps, formMode: whichFormMode("show") }} />,  fromJS({
            user: {
              permissions: {
                roles: [ACTIONS.WRITE]
              }
            }
          }))
          expect(screen.getByRole('button')).toBeInTheDocument();
          expect(screen.getByText('buttons.edit')).toBeInTheDocument();
      
      });
    });

    describe("when the user doesn't have write permissions on roles", () => {
     
      it("should not render the edit button", () => {
        mountedComponent(<ActionButtons {...{ ...defaultProps, formMode: whichFormMode("show") }} />,  fromJS({}))
          expect(screen.queryAllByRole('button')).toHaveLength(0);
      });
    });
  });

  describe("when isEdit mode", () => {

    it("should render cancel and save buttons only", () => {
        mountedComponent(<ActionButtons {...{ ...defaultProps, formMode: whichFormMode("edit") }} />,  fromJS({}))
        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByText('buttons.cancel')).toBeInTheDocument();
        expect(screen.getByText('buttons.save')).toBeInTheDocument();

     
    });
  });

  describe("when isNew mode", () => {

    it("should render cancel and save buttons", () => {
        mountedComponent(<ActionButtons {...{ ...defaultProps, formMode: whichFormMode("new") }} />,  fromJS({}))
        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByText('buttons.cancel')).toBeInTheDocument();
        expect(screen.getByText('buttons.save')).toBeInTheDocument();
    });
  });
});
