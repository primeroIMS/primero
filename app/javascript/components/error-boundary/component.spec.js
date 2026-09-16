import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import ErrorBoundary from "./component";

function Boom() {
  throw new Error("boom");
}

describe("<ErrorBoundary />", () => {
  const translations = { "errors.error_loading": "Error Loading Record(s)", "errors.try_again": "Try again" };

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(window.I18n, "t").mockImplementation((key, options) => {
      const scope = [key, ...(options?.defaults || []).map(item => item.scope)].find(item => translations[item]);

      return scope ? translations[scope] : `[missing "en.${key}" translation]`;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("falls back to the generic message when the record type has no error_loading translation", () => {
    mountedComponent(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
      fromJS({}),
      {},
      ["/cases"],
      {},
      "/cases"
    );

    expect(screen.getByText("Error Loading Record(s)")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\[missing/);
  });
});
