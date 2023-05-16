import { mountedComponent, screen } from "test-utils";
import DialogTabs from "./component";
describe("<DialogTabs /> - Component", () => {
  const props = {
    children: [{ props: { hidetab: true } }],
    isBulkFlags: false,
    tab: 0,
    setTab: () => { }
  };

  beforeEach(() => {
    mountedComponent(<DialogTabs {...props} />);
  });

  it("should render the DialogTabs", () => {
    expect(screen.getByText("flags.add_flag_tab")).toBeInTheDocument();
  });
});





