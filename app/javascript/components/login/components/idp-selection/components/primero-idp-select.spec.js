import { mountedComponent, screen } from "../../../../../test-utils";

import PrimeroIdpSelect from "./primero-idp-select";

describe("<PrimeroIdpSelect />", () => {
  const props = {
    identityProviders: [
      new Map([
        ["unique_id", "primeroims"],
        ["name", "Primero"]
      ]),
      new Map([
        ["unique_id", "randomidp"],
        ["name", "RandomIDP"]
      ])
    ],
    css: {}
  };

  mountedComponent(<PrimeroIdpSelect {...props} />);

  it("renders forms components", () => {
    expect(screen.getByText(/select_provider/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "form")).toBeInTheDocument();
    expect(screen.getByText(/go/i)).toBeInTheDocument();
  });
});
