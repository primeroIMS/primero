import React from "react";

import { setupMountedComponent } from "../../test";

import { useI18n } from "./provider";

describe("I18nProvider - changeLocale", () => {
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
