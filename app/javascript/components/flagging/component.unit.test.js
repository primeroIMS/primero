
import { expect } from "chai";
import { setupMountedComponent } from "../../test";
import { Map } from "immutable";
import Flagging from "./component";
import { FlagDialog, ListFlags } from "./parts";

describe("<Flagging /> - Component", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Flagging,
      { recordType: "cases", record: "0df32f52-4290-4ce1-b859-74ac14c081bf"},
      Map({
        records: Map({
          cases: {
            data: {
              0: {
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                age: 6,
                sex: "male",
                name: "Test case flag",
                owned_by: "primero",
                created_at: "2019-05-27T23:00:43.758Z",
                case_id_display: "040e0b7",
                registration_date: "2019-05-27"
              }
            }
          },
          flags: {
            data: [
              {
                id: 1,
                record_id: '0df32f52-4290-4ce1-b859-74ac14c081bf',
                record_type: 'cases',
                date: '2019-09-11',
                message: 'test',
                flagged_by: 'primero'
              }
            ]
        }
      })
      })
    ).component;
  });

  it("renders Flagging form", () => {
    expect(component.find(Flagging)).to.have.length(1);
  });

  it("renders FlagDialog", () => {
    expect(component.find(FlagDialog)).to.have.length(1);
  });

});
