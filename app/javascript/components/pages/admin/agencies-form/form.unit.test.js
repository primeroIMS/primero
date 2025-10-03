
import { fromJS } from "immutable";

import { TEXT_FIELD, TEXT_AREA, SELECT_FIELD, TICK_FIELD, PHOTO_FIELD, DOCUMENT_FIELD, SEPARATOR } from "../../../form";
import { FILE_FORMAT } from "../../../../config";

import { form, validations } from "./form";
import { TERMS_OF_USE, TERMS_OF_USE_ENABLED } from "./constants";

describe("<AgencyForm /> - agencies-form/form", () => {
  const mockI18n = {
    t: key => key,
    getI18nStringFromObject: obj => (typeof obj === "string" ? obj : obj?.en || "")
  };

  const defaultFormMode = fromJS({
    isShow: false,
    isEdit: false,
    isNew: true
  });

  const TOTAL_FIELDS_ON_FORM = 13;

  describe("form structure", () => {
    it("returns correct number of form sections", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);

      expect(agencyForm.size).toBe(1);
    });

    it("returns correct number of fields", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);

      expect(agencyForm.first().fields).toHaveLength(TOTAL_FIELDS_ON_FORM);
    });

    it("has correct form section unique_id", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);

      expect(agencyForm.first().unique_id).toBe("agencies");
    });
  });

  describe("field configuration", () => {
    let agencyForm;

    beforeEach(() => {
      agencyForm = form(mockI18n, defaultFormMode, false);
    });

    it("configures name field correctly", () => {
      const nameField = agencyForm.first().fields.find(field => field.name === "name.en");

      expect(nameField.display_name).toBe("agency.name");
      expect(nameField.type).toBe(TEXT_FIELD);
      expect(nameField.required).toBe(true);
      expect(nameField.autoFocus).toBe(true);
    });

    it("configures agency code field correctly", () => {
      const codeField = agencyForm.first().fields.find(field => field.name === "agency_code");

      expect(codeField.display_name).toBe("agency.code");
      expect(codeField.type).toBe(TEXT_FIELD);
      expect(codeField.required).toBe(true);
    });

    it("configures description field correctly", () => {
      const descField = agencyForm.first().fields.find(field => field.name === "description.en");

      expect(descField.display_name).toBe("agency.description");
      expect(descField.type).toBe(TEXT_AREA);
    });

    it("configures services field correctly", () => {
      const servicesField = agencyForm.first().fields.find(field => field.name === "services");

      expect(servicesField.display_name).toBe("agency.services");
      expect(servicesField.type).toBe(SELECT_FIELD);
      expect(servicesField.multi_select).toBe(true);
      expect(servicesField.option_strings_source).toBe("lookup-service-type");
    });

    it("configures terms of use enabled field correctly", () => {
      const termsEnabledField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE_ENABLED);

      expect(termsEnabledField.display_name).toBe("agency.terms_of_use_enabled");
      expect(termsEnabledField.type).toBe(TICK_FIELD);
    });

    it("configures terms of use field correctly", () => {
      const termsField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE);

      expect(termsField.display_name).toBe("agency.terms_of_use");
      expect(termsField.type).toBe(DOCUMENT_FIELD);
      expect(termsField.help_text).toBe("agency.terms_of_use_help");
      expect(termsField.fileFormat).toBe(FILE_FORMAT.pdf);
      expect(termsField.renderDownloadButton).toBe(true);
      expect(termsField.downloadButtonLabel).toBe("agency.terms_of_use_download_button");
      expect(termsField.watchedInputs).toEqual([TERMS_OF_USE_ENABLED]);
    });

    it("configures logo separator correctly", () => {
      const separatorField = agencyForm.first().fields.find(field => field.type === SEPARATOR);

      expect(separatorField.display_name).toBe("agency.agency_logos");
      expect(separatorField.type).toBe(SEPARATOR);
    });

    it("configures logo icon field correctly", () => {
      const logoIconField = agencyForm.first().fields.find(field => field.name === "logo_icon");

      expect(logoIconField.display_name).toBe("agency.logo_icon");
      expect(logoIconField.type).toBe(PHOTO_FIELD);
      expect(logoIconField.help_text).toBe("agency.logo_icon_help");
      expect(logoIconField.fileFormat).toBe("image/png");
    });

    it("configures logo full field correctly", () => {
      const logoFullField = agencyForm.first().fields.find(field => field.name === "logo_full");

      expect(logoFullField.display_name).toBe("agency.logo_large");
      expect(logoFullField.type).toBe(PHOTO_FIELD);
      expect(logoFullField.help_text).toBe("agency.logo_large_help");
      expect(logoFullField.fileFormat).toBe("image/png");
    });

    it("configures logo enabled field correctly", () => {
      const logoEnabledField = agencyForm.first().fields.find(field => field.name === "logo_enabled");

      expect(logoEnabledField.display_name).toBe("agency.logo_enabled");
      expect(logoEnabledField.type).toBe(TICK_FIELD);
      expect(logoEnabledField.watchedInputs).toEqual(["logo_icon", "logo_full", "logo_full_url", "logo_icon_url"]);
      expect(logoEnabledField.help_text).toBe("agency.logo_enabled_help");
    });

    it("configures PDF logo option field correctly", () => {
      const pdfLogoField = agencyForm.first().fields.find(field => field.name === "pdf_logo_option");

      expect(pdfLogoField.display_name).toBe("agency.pdf_logo_option");
      expect(pdfLogoField.type).toBe(TICK_FIELD);
      expect(pdfLogoField.watchedInputs).toEqual(["logo_icon", "logo_full", "logo_full_url", "logo_icon_url"]);
      expect(pdfLogoField.help_text).toBe("agency.pdf_logo_option_help");
    });

    it("configures exclude from lookups field correctly", () => {
      const excludeField = agencyForm.first().fields.find(field => field.name === "exclude_agency_from_lookups");

      expect(excludeField.display_name).toBe("agency.exclude_agency_from_lookups");
      expect(excludeField.type).toBe(TICK_FIELD);
      expect(excludeField.help_text).toBe("agency.exclude_agency_from_lookups_help");
    });

    it("configures disabled field correctly", () => {
      const disabledField = agencyForm.first().fields.find(field => field.name === "disabled");

      expect(disabledField.display_name).toBe("agency.disabled");
      expect(disabledField.type).toBe(TICK_FIELD);
    });
  });

  describe("terms of use enforcement", () => {
    it("sets terms of use enabled when enforceTermsOfUse is true", () => {
      const agencyForm = form(mockI18n, defaultFormMode, true);
      const termsEnabledField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE_ENABLED);

      expect(termsEnabledField.selected_value).toBe(true);
      expect(termsEnabledField.disabled).toBe(true);
    });

    it("sets terms of use as required when enforceTermsOfUse is true", () => {
      const agencyForm = form(mockI18n, defaultFormMode, true);
      const termsField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE);

      expect(termsField.required).toBe(true);
    });

    it("does not require terms of use when enforceTermsOfUse is false", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const termsField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE);

      expect(termsField.required).toBe(false);
    });
  });

  describe("watched inputs behavior", () => {
    it("handles terms of use visibility based on terms_of_use_enabled", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const termsField = agencyForm.first().fields.find(field => field.name === TERMS_OF_USE);
      const { handleWatchedInputs } = termsField;

      const resultEnabled = handleWatchedInputs({ terms_of_use_enabled: true });

      expect(resultEnabled.visible).toBe(true);

      const resultDisabled = handleWatchedInputs({ terms_of_use_enabled: false });

      expect(resultDisabled.visible).toBe(false);
    });

    it("handles logo enabled field based on logo uploads", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const logoEnabledField = agencyForm.first().fields.find(field => field.name === "logo_enabled");
      const { handleWatchedInputs } = logoEnabledField;

      const resultBothLogos = handleWatchedInputs({
        logo_full: "base64data",
        logo_icon: "base64data"
      });

      expect(resultBothLogos.disabled).toBe(false);

      const resultBothUrls = handleWatchedInputs({
        logo_full_url: "http://example.com/full.png",
        logo_icon_url: "http://example.com/icon.png"
      });

      expect(resultBothUrls.disabled).toBe(false);

      const resultOneLogo = handleWatchedInputs({
        logo_full: "base64data",
        logo_icon: null
      });

      expect(resultOneLogo.disabled).toBe(true);

      const resultNoLogos = handleWatchedInputs({});

      expect(resultNoLogos.disabled).toBe(true);
    });

    it("handles PDF logo option field based on logo uploads", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const pdfLogoField = agencyForm.first().fields.find(field => field.name === "pdf_logo_option");
      const { handleWatchedInputs } = pdfLogoField;

      const resultBothLogos = handleWatchedInputs({
        logo_full: "base64data",
        logo_icon: "base64data"
      });

      expect(resultBothLogos.disabled).toBe(false);

      const resultNoLogos = handleWatchedInputs({});

      expect(resultNoLogos.disabled).toBe(true);
    });

    it("disables logo fields in show mode", () => {
      const showMode = fromJS({ isShow: true, isEdit: false, isNew: false });
      const agencyForm = form(mockI18n, showMode, false);
      const logoEnabledField = agencyForm.first().fields.find(field => field.name === "logo_enabled");
      const { handleWatchedInputs } = logoEnabledField;

      const result = handleWatchedInputs({
        logo_full: "base64data",
        logo_icon: "base64data"
      });

      expect(result.disabled).toBe(true);
    });
  });

  describe("form validations", () => {
    it("validates required agency code", () => {
      const schema = validations(mockI18n, defaultFormMode, false);
      const testData = { agency_code: "" };

      expect(() => schema.validateSync(testData)).toThrow();
    });

    it("validates required agency name", () => {
      const schema = validations(mockI18n, defaultFormMode, false);
      const testData = { name: {} };

      expect(() => schema.validateSync(testData)).toThrow();
    });

    it("validates terms of use when enforced in new mode", () => {
      const schema = validations(mockI18n, defaultFormMode, true);
      const testData = {
        agency_code: "TEST",
        name: { en: "Test Agency" },
        terms_of_use_base64: ""
      };

      expect(() => schema.validateSync(testData)).toThrow();
    });

    it("does not require terms of use when not enforced", () => {
      const schema = validations(mockI18n, defaultFormMode, false);
      const testData = {
        agency_code: "TEST",
        name: { en: "Test Agency" }
      };

      expect(() => schema.validateSync(testData)).not.toThrow();
    });

    it("does not require terms of use in edit mode even when enforced", () => {
      const editMode = fromJS({ isShow: false, isEdit: true, isNew: false });
      const schema = validations(mockI18n, editMode, true);
      const testData = {
        agency_code: "TEST",
        name: { en: "Test Agency" }
      };

      expect(() => schema.validateSync(testData)).not.toThrow();
    });

    it("accepts valid agency data", () => {
      const schema = validations(mockI18n, defaultFormMode, false);
      const testData = {
        agency_code: "TEST001",
        name: { en: "Test Agency" },
        description: { en: "Test Description" },
        services: ["service1"],
        telephone: "123-456-7890",
        disabled: false,
        logo_enabled: false
      };

      expect(() => schema.validateSync(testData)).not.toThrow();
    });

    it("validates complex agency data with terms of use", () => {
      const schema = validations(mockI18n, defaultFormMode, true);
      const testData = {
        agency_code: "TEST001",
        name: { en: "Test Agency" },
        description: { en: "Test Description" },
        services: ["service1"],
        telephone: "123-456-7890",
        disabled: false,
        logo_enabled: true,
        terms_of_use_base64: "data:application/pdf;base64,test"
      };

      expect(() => schema.validateSync(testData)).not.toThrow();
    });
  });

  describe("field types and constants", () => {
    it("uses correct field types", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const { fields } = agencyForm.first();

      const textFields = fields.filter(field => field.type === TEXT_FIELD);
      const textAreaFields = fields.filter(field => field.type === TEXT_AREA);
      const selectFields = fields.filter(field => field.type === SELECT_FIELD);
      const tickFields = fields.filter(field => field.type === TICK_FIELD);
      const photoFields = fields.filter(field => field.type === PHOTO_FIELD);
      const documentFields = fields.filter(field => field.type === DOCUMENT_FIELD);
      const separatorFields = fields.filter(field => field.type === SEPARATOR);

      expect(textFields).toHaveLength(2);
      expect(textAreaFields).toHaveLength(1);
      expect(selectFields).toHaveLength(1);
      expect(tickFields).toHaveLength(5);
      expect(photoFields).toHaveLength(2);
      expect(documentFields).toHaveLength(1);
      expect(separatorFields).toHaveLength(1);
    });

    it("uses correct constants for field names", () => {
      const agencyForm = form(mockI18n, defaultFormMode, false);
      const { fields } = agencyForm.first();

      const termsOfUseEnabledField = fields.find(field => field.name === TERMS_OF_USE_ENABLED);
      const termsOfUseField = fields.find(field => field.name === TERMS_OF_USE);

      expect(termsOfUseEnabledField).toBeDefined();
      expect(termsOfUseField).toBeDefined();
    });
  });
});
