import { mountedComponent, screen } from "test-utils";
import DialogTabs from "../dialog-tabs";
import FlagDialog from "./component";
describe("<FlagDialog />", () => {
  const props = {
    children: [{ props: { hidetab: true } }],
    isBulkFlags: false,
    tab: 0,
    setTab: () => { },
    dialogOpen: true
  };

  it("should render the FlagDialog", () => {
    mountedComponent(<FlagDialog {...props} />);
    expect(screen.getByText("flags.add_flag_tab")).toBeInTheDocument();
  });

  it("should render the DialogTabs", () => {
    mountedComponent(<DialogTabs {...props} />);
    expect(screen.getAllByRole("tab")).toBeTruthy();
  });
});





