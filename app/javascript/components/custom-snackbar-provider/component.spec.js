import { mountedComponent, screen } from "test-utils";

import CustomSnackbarProvider from "./component";

describe("<CustomSnackbarProvider /> - Component", () => {
  it("renders <CustomSnackbarProvider/> children", () => {
    const props = {
      children: <div>snackbar child</div>
    };

    mountedComponent(<CustomSnackbarProvider {...props} />);
    expect(screen.getByText("snackbar child")).toBeInTheDocument();
  });
});
