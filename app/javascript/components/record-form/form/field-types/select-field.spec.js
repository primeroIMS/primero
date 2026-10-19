import { fromJS } from "immutable";

import { fireEvent, mountedComponent, screen, setSelectValue } from "../../../../test-utils";
import { OPTION_TYPES, whichFormMode } from "../../../form";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import transitionActions from "../../../record-actions/transitions/actions";

import SelectField from "./select-field";

describe("<SelectField />", () => {
  describe("when the lookup is custom", () => {
    const props = {
      name: "agency",
      field: {
        option_strings_source: OPTION_TYPES.AGENCY
      },
      label: "Agency",
      mode: whichFormMode("edit"),
      open: true,
      optionsSelector: () => ({
        source: OPTION_TYPES.AGENCY,
        useUniqueId: true
      })
    };

    const initialState = fromJS({
      application: {
        agencies: [
          {
            unique_id: "agency-test-1",
            name: {
              en: "Agency Test 1"
            },
            agency_code: "test1",
            disabled: false,
            services: ["service_test_1"]
          },
          {
            unique_id: "agency-test-2",
            name: {
              en: "Agency Test 2"
            },
            agency_code: "test2",
            disabled: false,
            services: ["service_test_1", "service_test_2"]
          }
        ],
        reportingLocationConfig: {
          field_key: "owned_by_location",
          admin_level: 2,
          admin_level_map: {
            1: ["province"],
            2: ["district"]
          },
          hierarchy_filter: [],
          label_keys: ["district"]
        }
      },
      forms: {
        options: {
          locations: [
            { id: 1, code: "MC", admin_level: 0, disabled: false, name: { en: "MyCountry" } },
            { id: 2, code: "MCMP1", admin_level: 1, disabled: false, name: { en: "MyCountry:MyProvince1" } },
            { id: 3, code: "MCMP2", admin_level: 1, disabled: false, name: { en: "MyCountry:MyProvince2" } },
            {
              id: 4,
              code: "MCMP1MD1",
              admin_level: 2,
              disabled: false,
              name: { en: "MyCountry:MyProvince1:MyDistrict1" }
            },
            {
              id: 5,
              code: "MCMP2MD2",
              admin_level: 2,
              disabled: false,
              name: { en: "MyCountry:MyProvince2:MyDistrict2" }
            }
          ]
        }
      }
    });

    it("render the select fields", () => {
      mountedComponent(
        <SelectField {...props} />,
        initialState,
        [],
        {},
        {
          initialValues: { agency: "agency-test-1" }
        }
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  describe("when is service_type", () => {
    const props = {
      name: SERVICE_SECTION_FIELDS.type,
      field: {
        option_strings_source: "lookup lookup-service-type"
      },
      label: "Type of Service",
      mode: whichFormMode("edit"),
      open: true,
      optionsSelector: () => ({
        source: "lookup lookup-service-type",
        useUniqueId: true
      })
    };

    const initialState = fromJS({
      forms: {
        options: {
          lookups: [
            {
              id: 20,
              unique_id: "lookup-service-type",
              name: {
                en: "Service Type"
              },
              values: [
                {
                  id: "health_medical_service",
                  disabled: false,
                  display_text: {
                    en: "Health/Medical Service"
                  }
                }
              ]
            }
          ]
        }
      }
    });

    it("render the select field with options", () => {
      mountedComponent(
        <SelectField {...props} />,
        initialState,
        [],
        {},
        {
          initialValues: {
            service_type: "health_medical_service"
          }
        }
      );
      fireEvent.click(screen.getByPlaceholderText("fields.select_single"));

      expect(screen.getAllByText("Type of Service")).toHaveLength(2);
    });
  });

  describe("when is service_implementing_agency", () => {
    const paramsService = "health_medical_service";
    const initialStateAgency = fromJS({
      application: {
        agencies: [
          {
            unique_id: "agency-test-1",
            name: {
              en: "Agency Test 1"
            },
            agency_code: "test1",
            disabled: false,
            services: ["service_test_1"]
          },
          {
            unique_id: "agency-test-2",
            name: {
              en: "Agency Test 2"
            },
            agency_code: "test2",
            disabled: false,
            services: ["service_test_1", "service_test_2"]
          }
        ]
      }
    });
    const propsSelectAgency = {
      name: SERVICE_SECTION_FIELDS.implementingAgency,
      field: {
        option_strings_text: "Agency"
      },
      label: "Implementing Agency",
      mode: whichFormMode("edit"),
      open: true,
      filters: { values: { service: "another-service" }, filterState: { filtersChanged: true, userIsSelected: false } },
      formik: {
        values: {
          [SERVICE_SECTION_FIELDS.type]: paramsService,
          [SERVICE_SECTION_FIELDS.implementingAgency]: "agency-test-1"
        }
      },
      recordType: "cases",
      recordModuleID: "record-module-1",
      optionsSelector: () => ({ source: OPTION_TYPES.AGENCY, useUniqueId: true })
    };

    it("should clear out field if filters", async () => {
      mountedComponent(
        <SelectField {...propsSelectAgency} />,
        initialStateAgency,
        [],
        {},
        {
          initialValues: {
            [SERVICE_SECTION_FIELDS.implementingAgency]: "agency-test-1",
            [SERVICE_SECTION_FIELDS.type]: paramsService
          }
        }
      );

      const input = await setSelectValue(screen.getByRole("combobox"));

      expect(input.value).toBe("");
    });
  });

  describe("when is service_implementing_agency_individual", () => {
    const props = {
      name: SERVICE_SECTION_FIELDS.implementingAgencyIndividual,
      field: {
        option_strings_source: "User"
      },
      label: "Service provider name",
      mode: whichFormMode("edit"),
      open: true,
      filters: { values: {}, filterState: { filtersChanged: false, userIsSelected: false } },
      recordType: "cases",
      recordModuleID: "primeromodule-cp",
      optionsSelector: () => ({ source: OPTION_TYPES.REFER_TO_USERS })
    };

    const formProps = {
      initialValues: {
        [SERVICE_SECTION_FIELDS.implementingAgencyIndividual]: "hpierce"
      }
    };

    const stateWithPermissions = permissions => fromJS({ user: { permissions: { cases: permissions } } });

    const referralUsersFetched = store =>
      store.getActions().filter(action => action.type === transitionActions.REFERRAL_USERS_FETCH);

    describe("when the user does not have referral permissions", () => {
      const initialState = stateWithPermissions(["read", "write"]);

      it("should display the selected service provider", () => {
        mountedComponent(<SelectField {...props} />, initialState, [], {}, formProps);

        expect(screen.getByRole("combobox")).toHaveValue("hpierce");
      });

      it("should not fetch the referral users when the select is opened", () => {
        const { store } = mountedComponent(<SelectField {...props} />, initialState, [], {}, formProps);

        fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });

        expect(referralUsersFetched(store)).toHaveLength(0);
      });

      it("should keep displaying the selected service provider when the select is opened", () => {
        mountedComponent(<SelectField {...props} />, initialState, [], {}, formProps);

        fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });

        expect(screen.getByRole("combobox")).toHaveValue("hpierce");
      });
    });

    describe("when the user has referral permissions", () => {
      const initialState = stateWithPermissions(["read", "write", "referral"]);

      it("should fetch the referral users when the select is opened", () => {
        const { store } = mountedComponent(<SelectField {...props} />, initialState, [], {}, formProps);

        fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" });

        expect(referralUsersFetched(store)).toHaveLength(1);
      });
    });
  });

  describe("when the lookup is yes-no-lookup", () => {
    const props = {
      name: "test",
      field: {
        option_strings_source: "lookup lookup-yes-no"
      },
      label: "Test",
      mode: whichFormMode("edit"),
      open: true,
      optionsSelector: () => ({ source: "lookup lookup-yes-no" })
    };

    const initialState = fromJS({
      forms: {
        options: {
          lookups: [
            {
              id: 93,
              unique_id: "lookup-yes-no",
              name: {
                en: "Yes or No"
              },
              values: [
                {
                  id: "true",
                  display_text: {
                    en: "Yes"
                  }
                },
                {
                  id: "false",
                  display_text: {
                    en: "No"
                  }
                }
              ]
            }
          ]
        }
      }
    });

    it("render the select field with the selected option even if the option is boolean", async () => {
      mountedComponent(
        <SelectField {...props} />,
        initialState,
        [],
        {},
        {
          initialValues: { test: false }
        }
      );
      const input = await setSelectValue(screen.getByRole("combobox"));

      expect(input.value).toBe("No");
    });
  });

  describe("when a multi select has different value selected", () => {
    const props = {
      name: "test",
      field: {
        multi_select: true,
        option_strings_text: [
          { id: "option_1", display_text: { en: "Option 1" } },
          { id: "option_2", display_text: { en: "Option 2" } },
          { id: "option_3", display_text: { en: "Option 3" } }
        ]
      },
      label: "Test",
      mode: whichFormMode("show"),
      open: true,
      optionsSelector: () => ({
        options: [
          { id: "option_1", display_text: { en: "Option 1" } },
          { id: "option_2", display_text: { en: "Option 2" } },
          { id: "option_3", display_text: { en: "Option 3" } }
        ]
      })
    };

    it("renders the correct values", () => {
      mountedComponent(
        <SelectField {...props} />,
        fromJS([]),
        [],
        {},
        {
          initialValues: { test: ["option_1", "option_2", "option_3"] }
        }
      );

      expect(screen.getAllByTestId("chip").map(chip => chip.textContent)).toStrictEqual([
        "Option 1",
        "Option 2",
        "Option 3"
      ]);
    });
  });
});
