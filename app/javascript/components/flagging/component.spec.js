

  


import { mountedComponent, screen } from "test-utils";
import { Map } from "immutable";
import Flagging from "./component";
import { FlagDialog } from "./components";
describe("<FlagDialog /> - Component", () => {  
    const props = {
        recordType: "cases", 
        record: "0df32f52-4290-4ce1-b859-74ac14c081bf"
      };  

      beforeEach(() => {
        mountedComponent(<Flagging {...props} />,Map({
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
                  record_id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                  record_type: "cases",
                  date: "2019-09-11",
                  message: "test",
                  flagged_by: "primero"
                }
              ]
            }
          })
        }));
      });

      it.todo("renders Flagging form");
    
      it.todo("renders FlagDialog");
});





