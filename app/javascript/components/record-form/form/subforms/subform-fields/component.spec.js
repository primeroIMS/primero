// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformFields from "./component";

describe("<SubformFields />", () => {
  const props = {
    arrayHelpers: {},
    parentForm: {
      id: 33,
      unique_id: "family_details",
      description: {
        en: "Family Details"
      },
      name: {
        en: "Family Details"
      },
      visible: true,
      is_first_tab: false,
      order: 10,
      order_form_group: 30,
      parent_form: "case",
      editable: true,
      module_ids: ["primeromodule-cp"],
      form_group_id: "identification_registration",
      form_group_name: {
        en: "Identification / Registration"
      }
    },
    field: FieldRecord({
      name: "family_details_section",
      displayName: { en: "Family Details" },
      subform_section_id: FormSectionRecord({
        unique_id: "family_section",
        collapsed_field_names: ["relation_name"],
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
    locale: "en",
    setDialogIsNew: () => {},
    setOpen: () => {},
    i18n: { t: value => value, locale: "en" },
    values: [
      {
        relation_name: "Family1",
        relation_child_is_in_contact: ""
      }
    ],
    mode: {
      isShow: true
    },
    recordType: "cases",
    isReadWriteForm: true
  };

  it("renders the subform fields", () => {
    mountedComponent(<SubformFields {...props} />);

    expect(screen.queryByText("Family1")).toBeTruthy();
  });

  describe("when is not a readWriteForm", () => {
    it("does not render the Delete button", () => {
      mountedComponent(
        <SubformFields
          {...props}
          isViolationSubform
          isViolationAssociation
          mode={{ isEdit: true }}
          values={["something"]}
          isReadWriteForm={false}
        />
      );

      expect(screen.queryAllByRole("button")).toHaveLength(1);
      expect(screen.queryAllByRole("button")[0]).toHaveClass("subformShow");
    });
  });

  describe("when is violation or violation association", () => {
    it("renders the Delete button disabled", () => {
      mountedComponent(
        <SubformFields
          {...props}
          isViolationSubform
          isViolationAssociation
          mode={{ isEdit: true }}
          values={["something"]}
          isReadWriteForm
        />
      );

      expect(screen.queryAllByRole("button")[0]).toHaveAttribute("disabled");
    });
  });

  describe("Family Detail subform", () => {
    describe("when is associated to a family", () => {
      it("renders the Delete button disabled", () => {
        mountedComponent(
          <SubformFields {...props} isFamilyDetail mode={{ isEdit: true }} formik={{ values: { family_id: "001" } }} />
        );

        expect(screen.queryAllByRole("button")).toHaveLength(2);
        expect(screen.queryAllByRole("button")[0]).toHaveAttribute("disabled");
      });
    });

    describe("when is not associated to a family", () => {
      it("renders the Delete button enabled", () => {
        mountedComponent(<SubformFields {...props} isFamilyDetail mode={{ isEdit: true }} formik={{ values: {} }} />);

        expect(screen.queryAllByRole("button")).toHaveLength(2);
        expect(screen.queryAllByRole("button")[0]).not.toHaveAttribute("disabled");
      });
    });
  });

  describe("Family Member subform", () => {
    describe("when is associated to a case", () => {
      it("renders the Delete button disabled", () => {
        mountedComponent(
          <SubformFields {...props} isFamilyMember mode={{ isEdit: true }} values={[{ case_id: "001" }]} />
        );

        expect(screen.queryAllByRole("button")).toHaveLength(2);
        expect(screen.queryAllByRole("button")[0]).toHaveAttribute("disabled");
      });
    });

    describe("when is not associated to a case", () => {
      it("renders the Delete button enabled", () => {
        mountedComponent(<SubformFields {...props} isFamilyMember mode={{ isEdit: true }} />);

        expect(screen.queryAllByRole("button")).toHaveLength(2);
        expect(screen.queryAllByRole("button")[0]).not.toHaveAttribute("disabled");
      });
    });
  });
});
