import React from "react";
import { fromJS } from "immutable";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button } from "@material-ui/core";

import { setupMockFormComponent } from "../../../../../../test";
import SwitchInput from "../../../../../form/fields/switch-input";
import { TEXT_FIELD, SELECT_FIELD } from "../../../../../form";

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
                  field={fromJS({
                    name: "field_1",
                    editable: true,
                    display_name: { en: "Field 1" },
                    type: TEXT_FIELD
                  })}
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
    it("should render name", () => {
      expect(component.find(Button).text()).to.equal("Field 1");
    });

    it("should render type", () => {
      expect(component.find("div").at(4).text()).to.equal(
        `fields.${TEXT_FIELD}`
      );
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
                  field={fromJS({
                    name: "field_1",
                    editable: false,
                    multi_select: true,
                    type: SELECT_FIELD
                  })}
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

    it("should render type", () => {
      expect(component.find("div").at(4).text()).to.equal(
        `fields.multi_select_box`
      );
    });
  });
});
