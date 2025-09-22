/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { translateOptions, fireEvent, mountedComponent, screen } from "../../test-utils";

import useI18n from "./use-i18n";

describe("I18nProvider - changeLocale", () => {
  afterAll(() => {
    window.I18n.locale = "en";
    document.documentElement.lang = "en";
  });

  it("should have defaults for window and document", () => {
    const defaultLocale = "en";

    const { locale } = window.I18n;
    const { lang } = document.documentElement;

    expect(locale).toBe(defaultLocale);
    expect(lang).toBe(defaultLocale);
  });

  it("should handle changeLocale method", () => {
    const newLocale = "fr";

    function TestComponent() {
      const { changeLocale } = useI18n();

      return (
        // eslint-disable-next-line react/button-has-type
        <button
          data-testid="i18n-test-button"
          onClick={() => {
            changeLocale(newLocale);
          }}
        >
          I18n Test Component
        </button>
      );
    }

    mountedComponent(<TestComponent />);

    fireEvent.click(screen.getByTestId("i18n-test-button"));

    const { locale } = window.I18n;
    const { lang } = document.documentElement;

    expect(screen.getByText("I18n Test Component")).toBeInTheDocument();

    expect(locale).toBe(newLocale);
    expect(lang).toBe(newLocale);
  });
});

describe("localizeDate", () => {
  it("should not render invalid dates", () => {
    const TestComponent = () => {
      const { localizeDate } = useI18n();

      return localizeDate("invalidDate");
    };

    mountedComponent(<TestComponent />);
    expect(document.querySelector("div").textContent).toBe("");
  });
});

describe("I18nProvider - t", () => {
  function TestComponent() {
    const i18n = useI18n();

    return <p>{i18n.t("test")}</p>;
  }

  const translations = {
    en: {
      test: "Test."
    },
    es: {
      test: ""
    }
  };

  it("should translate to locale", () => {
    window.I18n.t = (value, options) => translateOptions(value, options, translations);

    const { locale } = window.I18n;

    mountedComponent(<TestComponent />);

    expect(locale).toBe("en");
    expect(screen.getByText("Test.")).toBeInTheDocument();
  });

  it("should translate using defaultLocale if selected locale contains an empty string as translation", () => {
    window.I18n.locale = "es";
    window.I18n.t = (value, options) => translateOptions(value, options, translations);

    const { locale } = window.I18n;

    mountedComponent(<TestComponent />);

    expect(locale).toBe("es");
    expect(screen.getByText("Test.")).toBeInTheDocument();
  });

  afterEach(() => {
    window.I18n.locale = "en";
    window.I18n.t = path => path;
  });
});
