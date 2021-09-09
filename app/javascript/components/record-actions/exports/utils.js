/* eslint-disable camelcase */
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";

import { ACTIONS } from "../../../libs/permissions";
import { displayNameHelper } from "../../../libs";
import { AUDIO_FIELD, DOCUMENT_FIELD, PHOTO_FIELD, SEPERATOR, SUBFORM_SECTION } from "../../record-form/constants";

import { ALL_EXPORT_TYPES, EXPORT_FORMAT, FILTERS_TO_SKIP } from "./constants";

const isSubform = field => field.type === SUBFORM_SECTION;

export const allowedExports = (userPermissions, i18n, isShowPage, recordType) => {
  const exportsTypes = [...ALL_EXPORT_TYPES];
  let allowedExportsOptions = [];

  if (userPermissions.includes(ACTIONS.MANAGE)) {
    allowedExportsOptions = exportsTypes
      .filter(exportType => exportType.recordTypes.includes(recordType))
      .map(exportType => {
        return {
          ...exportType,
          display_name: i18n.t(`exports.${exportType.id}.all`)
        };
      });
  } else {
    allowedExportsOptions = exportsTypes
      .filter(exportType => exportType.recordTypes.includes(recordType))
      .reduce((acc, obj) => {
        if (userPermissions.includes(obj.permission)) {
          return [...acc, { ...obj, display_name: i18n.t(`exports.${obj.id}.all`) }];
        }

        return [...acc, {}];
      }, []);
  }

  const allExports = allowedExportsOptions.filter(item => Object.keys(item).length);

  if (isShowPage) {
    return allExports.filter(item => !item.showOnlyOnList);
  }

  return allExports.filter(item => !item.hideOnShowPage);
};

export const formatFileName = (filename, extension) => {
  if (filename && extension) {
    return `${filename}.${extension}`;
  }

  return "";
};

export const exporterFilters = (
  isShowPage,
  allCurrentRowsSelected,
  shortIds,
  appliedFilters,
  queryParams,
  record,
  allRecordsSelected
) => {
  let filters = {};
  const defaultFilters = {
    status: ["open"],
    record_state: ["true"]
  };

  if (isShowPage) {
    filters = { short_id: [record.get("short_id")] };
  } else {
    const applied = appliedFilters.entrySeq().reduce((acc, curr) => {
      const [key, value] = curr;

      if (!FILTERS_TO_SKIP.includes(key)) {
        return { ...acc, [key]: value };
      }

      return acc;
    }, {});

    if (!allRecordsSelected && (allCurrentRowsSelected || shortIds.length)) {
      filters = { short_id: shortIds };
    } else if (Object.keys(queryParams || {}).length || Object.keys(applied || {}).length) {
      filters = { ...(queryParams || {}), ...(applied || {}) };
    } else {
      filters = defaultFilters;
    }
  }

  const { query, ...restFilters } = filters;

  const returnFilters = Object.keys(restFilters).length ? restFilters : { short_id: shortIds };

  if (!isEmpty(query)) {
    return { filters: returnFilters, query };
  }

  return {
    filters: returnFilters
  };
};

export const buildFields = (data, locale) => {
  const excludeFieldTypes = [AUDIO_FIELD, DOCUMENT_FIELD, PHOTO_FIELD, SEPERATOR];

  return data
    .reduce((acc, form) => {
      const { unique_id, name, fields } = form;

      const filteredFields = fields
        .filter(field => !(isSubform(field) && "subform_section_id" in field && !field.subform_section_id))
        .filter(field => !excludeFieldTypes.includes(field.type) && field.visible && !field.hide_on_view_page)
        .map(field => {
          if (isSubform(field)) {
            const subFormSectionFields = field.subform_section_id.fields
              .filter(subformField => subformField.visible)
              .map(subformField => {
                const subFormSection = field.subform_section_id;

                return {
                  id: `${subFormSection.unique_id}:${subformField.name}`,
                  display_text: subformField.display_name[locale],
                  formSectionId: subFormSection.unique_id,
                  formSectionName: subFormSection.name[locale],
                  type: SUBFORM_SECTION,
                  visible: subFormSection.visible
                };
              });

            return subFormSectionFields;
          }

          return {
            id: `${unique_id}:${field.name}`,
            display_text: displayNameHelper(field.display_name, locale),
            formSectionId: unique_id,
            formSectionName: displayNameHelper(name, locale),
            visible: field.visible
          };
        });

      return [...acc, filteredFields.flat()];
    }, [])
    .flat();
};

export const isCustomExport = type => type === EXPORT_FORMAT.CUSTOM;

export const isPdfExport = type => type === EXPORT_FORMAT.PDF;

export const formatFields = fields => uniq(fields.map(field => field.split(":")[1]));

export const exportFormsOptions = (forms, locale) =>
  forms
    .entrySeq()
    .filter(([, form]) => form.get("visible") && !form.get("is_nested"))
    .reduce(
      (prev, [, current]) => [
        ...prev,
        {
          id: current.get("unique_id"),
          display_text: displayNameHelper(current.get("name"), locale)
        }
      ],
      []
    );

export const buildAgencyLogoPdfOptions = agencyLogosPdf => {
  if (!agencyLogosPdf) return [];

  return agencyLogosPdf.reduce((acc, curr) => [...acc, { id: curr.get("id"), display_name: curr.get("name") }], []);
};
