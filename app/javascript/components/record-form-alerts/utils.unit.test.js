import { fromJS } from "immutable";

import { ALERTS_FOR } from "../../config";

import * as utils from "./utils";

describe("<RecordFormAlerts/> - utils", () => {
  const i18n = { t: value => value, locale: "en" };

  describe("getMessageData", () => {
    it("should return the correct data for field_change alerts", () => {
      const alert = fromJS({
        alert_for: ALERTS_FOR.field_change,
        date: "2010-01-01"
      });
      const form = fromJS({ name: { en: "Form 1" } });
      const expected = {
        form_section_name: "Form 1",
        alert_time: "01-Jan-2010"
      };

      expect(utils.getMessageData({ alert, form, i18n })).to.deep.equal(
        expected
      );
    });

    it("should return the correct data for approval alerts", () => {
      const alert = fromJS({ alert_for: ALERTS_FOR.approval });
      const form = fromJS({ name: { en: "Form 1" } });
      const expected = { form_section_name: "Form 1" };

      expect(utils.getMessageData({ alert, form, i18n })).to.deep.equal(
        expected
      );
    });
  });
});
