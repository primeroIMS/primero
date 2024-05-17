import { mountedComponent, screen, fireEvent, waitFor, expectNever } from "test-utils";
import { fromJS } from "immutable";

import DisableOffline from "./component";

describe("<DisableOffline /> - Component", () => {
  it("renders element with tooltip if offline", async () => {
    mountedComponent(
      <DisableOffline>
        <div>element</div>
      </DisableOffline>,
      {
        connectivity: {
          online: false,
          serverOnline: true
        }
      }
    );

    fireEvent.mouseEnter(screen.getByText("element"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
  });

  it("renders element with no tooltip if online", async () => {
    mountedComponent(
      <DisableOffline>
        <div>element</div>
      </DisableOffline>,
      fromJS({
        connectivity: {
          online: true,
          serverOnline: true
        }
      })
    );

    fireEvent.mouseEnter(screen.getByText("element"));
    await expectNever(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("renders element and tooltip if overrideCondition", async () => {
    mountedComponent(
      <DisableOffline overrideCondition>
        <div>element</div>
      </DisableOffline>,
      fromJS({
        connectivity: {
          online: false,
          serverOnline: true
        }
      })
    );

    fireEvent.mouseEnter(screen.getByText("element"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
  });
});
