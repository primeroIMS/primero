// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { TEXT_FIELD, SELECT_FIELD } from "../../../../../form";
import { mountedFormComponent, screen } from "../../../../../../test-utils";

import FieldListItem from "./component";

describe("<FieldListItem />", () => {
  describe("when the field is editable", () => {
    beforeEach(() => {
      // eslint-disable-next-line react/display-name, react/prop-types
      const Component = ({ formMethods }) => (
        <DragDropContext>
          <Droppable droppableId="droppable" type="field">
            {() => (
              <FieldListItem
                field={fromJS({
                  name: "field_1",
                  editable: true,
                  display_name: { en: "Field 1" },
                  type: TEXT_FIELD
                })}
                getValues={() => ({ field_1: true })}
                index={0}
                formMethods={formMethods}
              />
            )}
          </Droppable>
        </DragDropContext>
      );

      mountedFormComponent(<Component />);
    });

    it("should render the field without a key icon", () => {
      expect(screen.queryByTestId("locked")).not.toBeInTheDocument();
    });

    it("should render a enabled show? checkbox ", () => {
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("should render name", () => {
      expect(screen.getByText("Field 1")).toBeInTheDocument();
    });

    it("should render type", () => {
      expect(screen.getByText("fields.text_field")).toBeInTheDocument();
    });
  });

  describe("when the field is not editable", () => {
    beforeEach(() => {
      // eslint-disable-next-line react/display-name, react/no-multi-comp, react/prop-types
      const Component = ({ formMethods }) => (
        <DragDropContext>
          <Droppable droppableId="droppable" type="field">
            {() => (
              <FieldListItem
                field={fromJS({
                  name: "field_1",
                  editable: false,
                  display_name: { en: "Field 1" },
                  multi_select: true,
                  type: SELECT_FIELD
                })}
                getValues={() => ({ field_1: true })}
                index={0}
                formMethods={formMethods}
              />
            )}
          </Droppable>
        </DragDropContext>
      );

      mountedFormComponent(<Component />);
    });

    it("should render the field with an key icon", () => {
      expect(screen.getByTestId("locked")).toBeInTheDocument();
    });

    it("should render a disabled show? checkbox", () => {
      expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("should render type", () => {
      expect(screen.getByText("fields.multi_select_box")).toBeInTheDocument();
    });
  });
});
