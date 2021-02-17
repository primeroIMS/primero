import { fromJS } from "immutable";
import { List, ListItemText } from "@material-ui/core";

import IndexTable from "../../../index-table";
import { setupMountedComponent } from "../../../../test";

import MatchesForm from "./component";

describe("<MatchesForm />", () => {
  let component;
  const props = {
    record: fromJS({ id: "12345678", case_id_display: "123abc" }),
    title: "Test Title",
    open: true,
    cancelHandler: () => {},
    css: {},
    i18n: { t: value => value },
    mode: { isNew: false },
    matchedTracesData: fromJS([])
  };
  const formProps = {
    initialValues: {
      name: ""
    }
  };
  const state = fromJS({
    records: {
      cases: {
        potentialMatches: {
          data: [
            {
              likelihood: "likely",
              score: 1,
              case: {
                id: "b216d9a8-5390-4d20-802b-ae415151ddbf",
                case_id_display: "35e4065",
                name: "Enrique Bunbury"
              },
              trace: {
                inquiry_date: "2021-01-13",
                tracing_request_id: "f6c3483e-d6e6-482e-bd7a-9c5808e0798c",
                name: "Gustavo Cerati"
              },
              comparison: {
                case_to_trace: [
                  {
                    field_name: "age",
                    match: "mismatch",
                    case_value: 4,
                    trace_value: 10
                  }
                ]
              }
            }
          ],
          loading: false,
          errors: false
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(MatchesForm, props, state, [], formProps));
  });

  it("should render 1 <List /> components", () => {
    expect(component.find(List)).to.have.lengthOf(1);
  });

  it("should render 2 <ListItemText /> components", () => {
    expect(component.find(ListItemText)).to.have.lengthOf(2);
  });

  it("should render 1 <IndexTable /> components", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });
});
