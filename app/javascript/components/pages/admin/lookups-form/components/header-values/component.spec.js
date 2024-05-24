import { mountedComponent, screen } from "test-utils";

import HeadersValues from "./component";

describe("<HeadersValues /> - components/header-values/component", () => {
  beforeEach(() => {
    mountedComponent(<HeadersValues />);
  });

  it("should render english text column", () => {
    expect(screen.getByText("lookup.english_label")).toBeInTheDocument();
  });

  it("should render translation column", () => {
    expect(screen.getByText("lookup.translation_label")).toBeInTheDocument();
  });

  it("should render tick/enable column", () => {
    expect(screen.getByText("lookup.enabled_label")).toBeInTheDocument();
  });
});
