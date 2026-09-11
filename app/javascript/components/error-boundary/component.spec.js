import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";
import runtimeI18n from "../../../../public/javascripts/i18n";

import ErrorBoundary from "./component";

function Boom() {
  throw new Error("boom");
}

describe("<ErrorBoundary />", () => {
  const testI18n = window.I18n;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    runtimeI18n.locale = "en";
    runtimeI18n.translations = {
      en: { errors: { error_loading: "Error Loading Record(s)", try_again: "Try again" } }
    };
    window.I18n = runtimeI18n;
  });

  afterEach(() => {
    window.I18n = testI18n;
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
