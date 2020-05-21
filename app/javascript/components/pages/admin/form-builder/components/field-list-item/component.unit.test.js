import React from "react";
import { fromJS } from "immutable";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { setupMockFormComponent } from "../../../../../../test";
import SwitchInput from "../../../../../form/fields/switch-input";

import FieldListItem from "./component";

describe("<FieldListItem />", () => {
  describe("when the field is editable", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMockFormComponent(
        () => (
          <DragDropContext>
            <Droppable droppableId="droppable" type="field">
              {() => (
                <FieldListItem
                  field={fromJS({ name: "field_1", editable: true })}
                  index={0}
                />
              )}
            </Droppable>
          </DragDropContext>
        ),
        {},
        fromJS({})
      ));
    });

    it("should render the field without a key icon", () => {
      expect(component.find(VpnKeyIcon)).to.have.lengthOf(0);
    });

    it("should render a enabled show? checkbox ", () => {
      expect(component.find(SwitchInput).props().commonInputProps.disabled).to
        .be.false;
    });
  });

  describe("when the field is not editable", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMockFormComponent(
        () => (
          <DragDropContext>
            <Droppable droppableId="droppable" type="field">
              {() => (
                <FieldListItem
                  field={fromJS({ name: "field_1", editable: false })}
                  index={0}
                />
              )}
            </Droppable>
          </DragDropContext>
        ),
        {},
        fromJS({})
      ));
    });

    it("should render the field with an key icon", () => {
      expect(component.find(VpnKeyIcon)).to.have.lengthOf(1);
    });

    it("should render a disabled show? checkbox", () => {
      expect(component.find(SwitchInput).props().commonInputProps.disabled).to
        .be.true;
    });
  });
});
