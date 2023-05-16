import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import DisableOffline from "./component";
describe("<DisableOffline /> - Component", () => {
  const props = {
    overrideCondition: true,
    text: "offline",
  };

  it("renders element in offline state if offline", () => {
    mountedComponent(<DisableOffline {...props}>
      <div>element</div>
    </DisableOffline>
      , fromJS({
        connectivity: {
          online: false,
          serverOnline: true
        }
      }));
    expect(screen.getByText('element')).toBeInTheDocument();
  });
});





