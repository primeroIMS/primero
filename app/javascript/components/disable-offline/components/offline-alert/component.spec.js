import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import OfflineAlert from "./component";
describe("<OfflineAlert /> - Component", () => {   
    const props = {
        text: "offline"
      };          
  
    it("renders Flagging form", () => {
        mountedComponent(<OfflineAlert {...props} />, fromJS({
            connectivity: {
              online:false,
              serverOnline: true
            }
          }));
        expect(screen.queryByText("offline")).toBeInTheDocument();
    });

    it("does not render alert if online", () => {
        mountedComponent(<OfflineAlert {...props} />, fromJS({
            connectivity: {
              online:true,
              serverOnline: true
            }
          }));
        expect(screen.queryByText("offline")).not.toBeInTheDocument();
      });
});





