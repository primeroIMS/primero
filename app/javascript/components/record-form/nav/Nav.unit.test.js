import { expect } from "chai";
import { fromJS, Map, OrderedMap } from "immutable";
import Divider from "@material-ui/core/Divider";

import { setupMountedComponent } from "../../../test";

import Nav from "./Nav";
import NavGroup from "./NavGroup";
import RecordInformation from "./parts/record-information";

describe("<Nav />", () => {
  let component;

  const record = fromJS({
    case_id: "12345",
    case_id_display: "3c9d076",
    date_of_birth: "2015-01-06",
    id: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
    module_id: "primeromodule-cp",
    name_first: "example",
    name_last: "case",
    owned_by: "primero",
    previously_owned_by: "primero",
    record_state: true,
    registration_date: "2020-01-06",
    sex: "male",
    short_id: "3c9d076",
    status: "open"
  });

  const initialState = Map({
    records: fromJS({
      cases: {
        data: [record]
      }
    }),
    forms: fromJS({
      selectedForm: "record_owner",
      selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c"
    })
  });

  const props = {
    firstTab: {},
    formNav: OrderedMap({}),
    handleToggleNav: () => {},
    mobileDisplay: true,
    selectedForm: "",
    selectedRecord: ""
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Nav, props, initialState));
  });

  it("renders a Nav component />", () => {
    expect(component.find(Nav)).to.have.lengthOf(1);
  });

  it("renders a RecordInformation component />", () => {
    expect(component.find(RecordInformation)).to.have.lengthOf(1);
  });

  it("renders a Divider component />", () => {
    expect(component.find(Divider)).to.have.lengthOf(1);
  });

  it("renders a NavGroup component />", () => {
    expect(component.find(NavGroup)).to.have.lengthOf(1);
  });
});
