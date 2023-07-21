import { mountedComponent, screen } from "../../../../../test-utils";

import PrimeroIdpLink from "./primero-idp-link";

describe("<PrimeroIdpLink />", () => {
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
    css: {},
    dispatch: jest.fn(),
    i18n: {
      t: () => {}
    }
  };

  it("renders forms components", () => {
    mountedComponent(<PrimeroIdpLink {...props} />);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "span")).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "a")).toBeInTheDocument();
  });

  describe("when primeroims is the only one", () => {
    const propsOnlyPrimeroIDP = {
      identityProviders: [
        new Map([
          ["unique_id", "primeroims"],
          ["name", "Primero"]
        ])
      ],
      css: {},
      dispatch: jest.fn(),
      i18n: {
        t: () => {}
      }
    };

    it("renders forms components", () => {
      mountedComponent(<PrimeroIdpLink {...propsOnlyPrimeroIDP} />);
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "span")).toBeInTheDocument();
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "a")).toBeInTheDocument();
    });
  });

  describe("when there is only one IDP but not primeroims", () => {
    const propsOnlyPrimeroIDP = {
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
      css: {},
      dispatch: jest.fn(),
      i18n: {
        t: () => {}
      }
    };

    it("renders forms components", () => {
      mountedComponent(<PrimeroIdpLink {...propsOnlyPrimeroIDP} />);

      expect(screen.queryByText(/log_in_primero_idp/i)).toBeNull();
    });
  });
});
