import { fromJS } from "immutable";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { setupMountedComponent, setupMockFormComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import { ActionsMenu } from "../../../form";
import RadioInput from "../../../form/fields/radio-input";
import FormSection from "../../../form/components/form-section";
import { FormSectionRecord } from "../../../form/records";
import { ROUTES } from "../../../../config/constants";

import RolesActions from "./roles-actions";
import RolesForm from "./container";

describe("<RolesForm />", () => {
  let component;

  describe("New", () => {
    beforeEach(() => {
      const initialState = fromJS({
        records: {
          roles: {
            data: [
              {
                id: "1",
                name: {
                  en: "Role 1"
                }
              },
              {
                id: "2",
                name: {
                  en: "Role 2"
                }
              }
            ],
            metadata: { total: 2, per: 20, page: 1 }
          }
        },
        user: {
          permissions: {
            roles: [ACTIONS.MANAGE]
          }
        }
      });

      ({ component } = setupMountedComponent(RolesForm, { mode: "new" }, initialState, [ROUTES.admin_roles]));
    });

    it("renders role form", () => {
      expect(component.find("form")).to.have.lengthOf(1);
    });

    it("renders heading with action buttons", () => {
      expect(component.find("header h1").contains("role.label ")).to.be.true;
      expect(component.find("header button").at(0).contains("buttons.cancel")).to.be.true;
      expect(component.find("header button").at(1).contains("buttons.save")).to.be.true;
    });

    it("will not render actions menu", () => {
      expect(component.find(ActionsMenu)).to.have.lengthOf(0);
    });
  });

  describe("Show", () => {
    beforeEach(() => {
      const state = fromJS({
        records: {
          admin: {
            roles: {
              selectedRole: {
                id: 10,
                name: "Test Role",
                module_unique_ids: ["primeromodule-cp"]
              },
              loading: false,
              errors: false,
              serverErrors: []
            }
          }
        },
        forms: {
          formSections: {
            1: FormSectionRecord({
              id: 1,
              unique_id: "form_1",
              fields: [
                {
                  name: "field_1"
                }
              ],
              visible: true,
              is_nested: false,
              parent_form: "case",
              module_ids: ["primeromodule-cp"]
            }),
            2: FormSectionRecord({
              id: 2,
              unique_id: "core_form_1",
              fields: [],
              visible: true,
              is_nested: false,
              core_form: true,
              parent_form: "case",
              module_ids: ["primeromodule-cp"]
            })
          }
        },
        user: {
          permissions: {
            roles: [ACTIONS.MANAGE]
          }
        },
        application: {
          modules: [
            {
              unique_id: "primeromodule-cp"
            }
          ]
        }
      });

      ({ component } = setupMockFormComponent(RolesForm, {
        props: { mode: "show" },
        state,
        defaultValues: ["/admin/roles/10"]
      }));
    });

    it("renders role form sections", () => {
      expect(component.find(FormSection)).to.have.lengthOf(6);
    });

    it("renders core forms disabled and empty", () => {
      const { commonInputProps, formMethods } = component.find(RadioInput).at(1).props();

      expect(commonInputProps.disabled).to.be.true;
      expect(formMethods.getValues().form_section_read_write.case.core_form_1).to.be.empty;
    });

    it("renders the selected modules", () => {
      const autocomplete = component.find(Autocomplete);

      expect(
        autocomplete
          .map(current => current.props())
          .find(props => props.name === "module_unique_ids" && props.value.includes("primeromodule-cp"))
      ).to.exist;
    });

    it("renders the roles-actions component", () => {
      expect(component.find(RolesActions)).to.have.lengthOf(1);
    });
  });
});
