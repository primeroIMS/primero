// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { ListItemText } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import ViolationItem from "../subform-fields/components/violation-item";

import SubformHeader from "./component";

describe("<RecordForm>/form/subforms/<SubformHeader/>", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-status",
            values: [
              { id: "status_1", display_text: { en: "status 1" } },
              { id: "status_2", display_text: { en: "status 2" } }
            ]
          }
        ]
      }
    }
  });

  it("should render the displayName", () => {
    const props = {
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          unique_id: "services_subform_section",
          fields: [
            FieldRecord({
              name: "relation_name",
              visible: true,
              type: "text_field"
            }),
            FieldRecord({
              name: "relation_child_is_in_contact",
              visible: true,
              type: "text_field"
            })
          ]
        })
      }),
      values: [{ relation_name: "this is a relation" }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0,
      onClick: () => {},
      isViolationSubform: false
    };
    const { component } = setupMountedComponent(SubformHeader, props, fromJS({}));

    expect(component.text()).to.be.equal("Testing");
  });

  it("should render ViolationItem when is a ViolationSubform", () => {
    const props = {
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          unique_id: "services_subform_section",
          fields: [
            FieldRecord({
              name: "relation_name",
              visible: true,
              type: "text_field"
            }),
            FieldRecord({
              name: "relation_child_is_in_contact",
              visible: true,
              type: "text_field"
            }),
            FieldRecord({
              name: "verified",
              visible: true,
              type: "text_field",
              option_strings_source: "lookup lookup-status"
            }),
            FieldRecord({
              name: "violation_tally",
              visible: true,
              type: "tally_field",
              display_name: { en: "violation count" }
            })
          ],
          collapsed_field_names: ["relation_name"]
        })
      }),
      values: [{ unique_id: "ab123cde", relation_name: "this is a relation" }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0,
      onClick: () => {},
      isViolationSubform: true
    };
    const { component } = setupMountedComponent(SubformHeader, props, initialState);

    expect(component.find(ViolationItem)).lengthOf(1);
  });

  it("should render uniqueId when is a ViolationAssociation", () => {
    const props = {
      field: FieldRecord({
        name: "perpetrators",
        subform_section_id: {
          fields: [FieldRecord({ name: "relation_age", type: "text_field" })],
          collapsed_field_names: ["relation_age"]
        }
      }),
      values: [{ unique_id: "ab123cde", relation_name: "this is a relation" }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0,
      onClick: () => {},
      isViolationSubform: false
    };
    const { component } = setupMountedComponent(SubformHeader, props, initialState);

    expect(component.text()).to.be.equal("b123cde");
  });

  it("should render the field display name and the total of the tally field", () => {
    const props = {
      field: FieldRecord({
        name: "questions",
        subform_section_id: {
          fields: [
            FieldRecord({
              name: "places_visited_town",
              type: "tally_field",
              display_name: {
                en: "Places visited in town"
              },
              tally: [
                { id: "grocery_store", display_text: "Grocery Store" },
                { id: "cafe", display_text: "Cafe" }
              ]
            })
          ],
          collapsed_field_names: ["places_visited_town"]
        }
      }),
      values: [{ unique_id: "ab123cde", places_visited_town: { grocery_store: 1, cafe: 1, total: 2 } }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0,
      onClick: () => {},
      isViolationSubform: false
    };
    const { component } = setupMountedComponent(SubformHeader, props, initialState);

    expect(component.text()).to.be.equal("Places visited in town (2)");
  });

  context("When is not violation subform and there is collapsed fields", () => {
    let component;
    const props = {
      field: FieldRecord({
        name: "questions",
        subform_section_id: {
          fields: [
            FieldRecord({
              name: "places_visited_town",
              type: "tally_field",
              display_name: {
                en: "Places visited in town"
              },
              tally: [
                { id: "grocery_store", display_text: "Grocery Store" },
                { id: "cafe", display_text: "Cafe" }
              ]
            })
          ],
          collapsed_field_names: ["places_visited_town"]
        }
      }),
      values: [{ unique_id: "ab123cde", places_visited_town: { grocery_store: 1, cafe: 1, total: 2 } }],
      locale: "en",
      displayName: { en: "Testing" },
      index: 0,
      onClick: () => {},
      isViolationSubform: false
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformHeader, props, initialState));
    });

    it("should render ListItemText ", () => {
      expect(component.find(ListItemText)).lengthOf(1);
    });

    it("should accept valid props", () => {
      const listItemTextProps = { ...component.find(ListItemText).props() };

      ["id", "classes", "secondary", "children"].forEach(property => {
        expect(listItemTextProps).to.have.property(property);
        delete listItemTextProps[property];
      });
      expect(listItemTextProps).to.be.empty;
    });
  });
});
