import { mountedComponent, screen } from "../../test-utils";

import LoadingIndicator from "./component";

const props = {
  overlay: true,
  hasData: true,
  type: "cases",
  children: <h1>This is a test</h1>,
  loading: false,
  errors: false
};

describe("<LoadingIndicator />", () => {
  it("should render LoadingIndicator", () => {
    mountedComponent(<LoadingIndicator {...props} />);
    expect(screen.getByText(/This is a test/i)).toBeInTheDocument();
  });

  it("should no render CircularProgress when has data", () => {
    mountedComponent(<LoadingIndicator {...props} />);
    expect(screen.queryByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeNull();
  });

  it("should render Children when has data", () => {
    mountedComponent(<LoadingIndicator {...props} />);
    expect(screen.getByText(/This is a test/i)).toBeInTheDocument();
  });

  describe("When data still loading", () => {
    const propsDataLoading = {
      ...props,
      hasData: false,
      loading: true
    };

    it("renders CircularProgress", () => {
      mountedComponent(<LoadingIndicator {...propsDataLoading} />);
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    });

    it("doesn't render children", () => {
      mountedComponent(<LoadingIndicator {...propsDataLoading} />);
      expect(screen.queryByText(/This is a test/i)).toBeNull();
    });
  });

  describe("When doesn't has data", () => {
    const propsDataLoading = {
      ...props,
      hasData: false,
      loading: false
    };

    it("renders CircularProgress", () => {
      mountedComponent(<LoadingIndicator {...propsDataLoading} />);
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    });

    it("doesn't render children", () => {
      mountedComponent(<LoadingIndicator {...propsDataLoading} />);
      expect(screen.queryByText(/This is a test/i)).toBeNull();
    });

    it("render a message no data found", () => {
      mountedComponent(<LoadingIndicator {...propsDataLoading} />);
      expect(screen.getByText(/errors.not_found/i)).toBeInTheDocument();
    });
  });
});
