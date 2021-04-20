import { setupMountedComponent, translateOptions } from "../../test";

import useI18n from "./use-i18n";

describe("I18nProvider - changeLocale", () => {
  after(() => {
    window.I18n.locale = "en";
    document.documentElement.lang = "en";
  });

  it("should have defaults for window and document", () => {
    const defaultLocale = "en";

    const { locale } = window.I18n;
    const { lang } = document.documentElement;

    expect(locale).to.equal(defaultLocale);
    expect(lang).to.equal(defaultLocale);
  });

  it("should handle changeLocale method", () => {
    const newLocale = "fr";

    const TestComponent = () => {
      const { changeLocale } = useI18n();

      return (
        // eslint-disable-next-line react/button-has-type
        <button
          test-id="i18n-test-button"
          onClick={() => {
            changeLocale(newLocale);
          }}
        >
          I18n Test Component
        </button>
      );
    };

    const { component } = setupMountedComponent(TestComponent);

    const button = component.find('[test-id="i18n-test-button"]');

    button.simulate("click");

    const { locale } = window.I18n;
    const { lang } = document.documentElement;

    expect(button.text()).to.equal("I18n Test Component");
    expect(locale).to.equal(newLocale);
    expect(lang).to.equal(newLocale);
  });
});

describe("localizeDate", () => {
  it("should not render invalid dates", () => {
    const TestComponent = () => {
      const { localizeDate } = useI18n();

      return localizeDate("invalidDate");
    };
    const { component } = setupMountedComponent(TestComponent);

    expect(component.text()).to.equal("");
  });
});

describe("I18nProvider - t", () => {
  const TestComponent = () => {
    const i18n = useI18n();

    return <p>{i18n.t("test")}</p>;
  };

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
    const { component } = setupMountedComponent(TestComponent);

    expect(locale).to.be.equal("en");
    expect(component.text()).to.be.equal("Test.");
  });

  it("should translate using defaultLocale if selected locale contains an empty string as translation", () => {
    window.I18n.locale = "es";
    window.I18n.t = (value, options) => translateOptions(value, options, translations);

    const { locale } = window.I18n;
    const { component } = setupMountedComponent(TestComponent);

    expect(locale).to.be.equal("es");
    expect(component.text()).to.be.equal("Test.");
  });

  afterEach(() => {
    window.I18n.locale = "en";
    window.I18n.t = path => path;
  });
});
