import { screen, mountedFormComponent } from "test-utils";
import { fromJS } from "immutable";

import SelectFilter from "./component";

describe("<SelectFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: [
      { id: "option-1", display_text: "Option 1" },
      { id: "option-2", display_text: "Option 2" }
    ]
  };

  const props = {
    addFilterToList: () => {},
    filter
  };

  it("renders panel", () => {
    mountedFormComponent(<SelectFilter {...props} />, { includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  it("renders panel", () => {
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
            },
            {
              id: 6,
              code: "MCMP2MD2MC1",
              admin_level: 3,
              disabled: false,
              name: { en: "MyCountry:MyProvince2:MyDistrict2:MyCity1" }
            },
            {
              id: 7,
              code: "MCMP2MD2MC2",
              admin_level: 3,
              disabled: false,
              name: { en: "MyCountry:MyProvince2:MyDistrict2:MyCity2" }
            }
          ]
        }
      }
    });
    const newProps = {
      addFilterToList: () => {},
      filter: {
        field_name: "filter",
        name: "Filter 1",
        option_strings_source: "ReportingLocation"
      },
      mode: {
        secondary: false
      },
      isDateFieldSelectable: true,
      moreSectionFilters: {},
      reset: false,
      setMoreSectionFilters: () => {},
      setReset: () => {}
    };

    mountedFormComponent(<SelectFilter {...newProps} />, { state: initialState, includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });
});
