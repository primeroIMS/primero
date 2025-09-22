// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mapEntriesToRecord } from "../../../libs";
import { FieldRecord } from "../../record-form/records";

import transformFieldTooltips from "./transform-field-tooltips";

describe("<IndexFilters>/utils - transformFieldTooltips", () => {
  it("returns array of object", () => {
    const fields = mapEntriesToRecord(
      {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "First Name",
            es: "Primer Nombre"
          },
          required: true,
          href: null,
          show_on_minify_form: true
        },
        2: {
          name: "document_field",
          type: "document_upload_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Document",
            es: "Documento"
          }
        },
        3: {
          name: "short_id",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Short ID",
            es: "ID Corto"
          },
          required: true,
          module_ids: ["primeromodule-pcm"],
          parent_form: "case"
        },
        4: {
          name: "random_field",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Random Field",
            es: "Field Aleatorio"
          },
          required: true,
          module_ids: ["primeromodule-pcm"],
          parent_form: "incident"
        },
        5: {
          name: "short_id",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Short ID GBV",
            es: "ID Corto GBV"
          },
          required: true,
          module_ids: ["primeromodule-gbv"],
          parent_form: "case"
        },
        6: {
          name: "disabled_field",
          type: "text_field",
          editable: true,
          disabled: true,
          visible: false,
          display_name: {
            en: "Disabled Field",
            es: "Campo deshabilitado"
          },
          required: true,
          module_ids: ["primeromodule-gbv"],
          parent_form: "case"
        },
        7: {
          name: "hidden_field",
          type: "text_field",
          editable: true,
          disabled: false,
          visible: false,
          display_name: {
            en: "Hidden Field",
            es: "Campo oculto"
          },
          required: true,
          module_ids: ["primeromodule-gbv"],
          parent_form: "case"
        }
      },
      FieldRecord
    );

    const expected = [
      {
        en: "First Name",
        es: "Primer Nombre"
      },
      {
        en: "Document",
        es: "Documento"
      },
      {
        en: "Short ID",
        es: "ID Corto"
      },
      {
        en: "Random Field",
        es: "Field Aleatorio"
      }
    ];

    expect(transformFieldTooltips(fields)).toEqual(expected);
  });

  it("when translations are empty returns an array of object", () => {
    const fields = mapEntriesToRecord(
      {
        1: {
          name: "name_first",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "First Name",
            es: "Primer Nombre"
          },
          required: true,
          href: null,
          show_on_minify_form: true
        },
        2: {
          name: "document_field",
          type: "document_upload_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Document",
            ar: ""
          }
        }
      },
      FieldRecord
    );

    const expected = [
      {
        en: "First Name",
        es: "Primer Nombre"
      },
      {
        en: "Document",
        ar: ""
      }
    ];

    expect(transformFieldTooltips(fields)).toEqual(expected);
  });

  it("when fields is empty returns an empty array", () => {
    const fields = [];

    expect(transformFieldTooltips(fields)).toEqual([]);
  });
});
