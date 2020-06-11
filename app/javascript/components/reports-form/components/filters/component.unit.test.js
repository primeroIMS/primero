import { fromJS } from "immutable";
import { Typography } from "@material-ui/core";

import { setupMountedComponent, fake } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import FiltersDialog from "../filters-dialog";
import {
  MODULES_FIELD,
  RECORD_TYPE_FIELD,
  DEFAULT_FILTERS
} from "../../constants";
import { NUMERIC_FIELD } from "../../../form";

import ReportFilters from "./component";

describe("<ReportFilters /> - Component", () => {
  let component;

  const initialState = fromJS({
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    }
  });

  const props = {
    indexes: DEFAULT_FILTERS.map((data, index) => ({ index, data })),
    setIndexes: () => {},
    allRecordForms: fromJS([
      {
        id: 1,
        unique_id: "test_form_section",
        name: { en: "Test form section" },
        visible: true,
        module_ids: ["primeromodule-cp"],
        parent_form: "case",
        fields: [
          {
            name: "test_numeric_field",
            display_name: {
              en: "Test numeric field"
            },
            type: NUMERIC_FIELD,
            visible: true,
            option_strings_source: null,
            option_strings_text: null,
            tick_box_label: null
          }
        ],
        subform_section_id: null
      }
    ]),
    parentFormMethods: {
      getValues: fake.returns({
        [MODULES_FIELD]: ["primeromodule-cp"],
        [RECORD_TYPE_FIELD]: "case"
      })
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ReportFilters, props, initialState));
  });

  it("should render <Typography>", () => {
    expect(component.find(Typography)).to.have.lengthOf(1);
  });

  it("should render <FiltersDialog>", () => {
    expect(component.find(FiltersDialog)).to.have.lengthOf(1);
  });
});
