import React from "react";
import { Provider } from "react-redux";

import { createSimpleMount } from "../../test";
import store from "../../store";

import I18nProvider from "./provider";

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

    const component = createSimpleMount(
      <Provider store={store()}>
        <I18nProvider>
          <div>wrapped children</div>
        </I18nProvider>
      </Provider>
    );

    console.log(component.find(I18nProvider).first().instance()); // null

    component.find(I18nProvider).first().instance().changeLocale(newLocale);

    const { locale } = window.I18n;
    const { lang } = document.documentElement;

    expect(locale).to.equal(newLocale);
    expect(lang).to.equal(newLocale);
  });
});
