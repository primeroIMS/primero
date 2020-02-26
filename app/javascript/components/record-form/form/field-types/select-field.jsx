import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  InputLabel,
  FormControl,
  FormHelperText,
  MenuItem,
  Input,
  ListItemText,
  Checkbox
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Select } from "formik-material-ui";
import { Field, connect, getIn } from "formik";
import omitBy from "lodash/omitBy";
import { useDispatch, useSelector } from "react-redux";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import {
  getLocations,
  getOption,
  getReportingLocations
} from "../../selectors";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import { getUsersByTransitionType } from "../../../record-actions/transitions/selectors";
import { valuesToSearchableSelect } from "../../../../libs";
import {
  selectAgencies,
  getAgenciesWithService,
  getReportingLocationConfig
} from "../../../application/selectors";
import { SearchableSelect } from "../../../searchable-select";
import { CODE_FIELD, NAME_FIELD, UNIQUE_ID_FIELD } from "../../../../config";
import { SELECT_FIELD_NAME } from "../constants";
import styles from "../styles.css";
import { LoadingIndicator } from "../../../loading-indicator";
import { getLoading, getErrors } from "../../../index-table";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const SelectField = ({
  name,
  field,
  label,
  helperText,
  InputLabelProps,
  InputProps,
  mode,
  disabled,
  formik,
  ...other
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);

  const selectedValue = field.selected_value;

  const options = useSelector(state => getOption(state, option, i18n.locale));

  const { service, agency, location } = other?.filters || {};

  const agencies = useSelector(
    state =>
      service ? getAgenciesWithService(state, service) : selectAgencies(state),
    (agencies1, agencies2) => agencies1.equals(agencies2)
  );

  const adminLevel = useSelector(state =>
    getReportingLocationConfig(state).get("admin_level")
  );

  const locations = useSelector(
    state => getLocations(state, i18n),
    (locations1, locations2) => locations1.equals(locations2)
  );

  const reportingLocations = useSelector(
    state => getReportingLocations(state, adminLevel),
    (rptLocations1, rptLocations2) => rptLocations1.equals(rptLocations2)
  );

  const referralUsers = useSelector(
    state => getUsersByTransitionType(state, "referral"),
    (users1, users2) => users1.equals(users2)
  );

  useEffect(() => {
    const filters = Object.entries({
      services: service,
      agency,
      location
    }).reduce((acc, entry) => {
      return entry[1] ? { ...acc, [entry[0]]: entry[1] } : acc;
    }, {});

    if (option === "User") {
      dispatch(
        fetchReferralUsers({
          record_type: "case",
          ...filters
        })
      );
    }
  }, [service, agency, location]);

  const translatedText = displayText => {
    return typeof displayText === "string"
      ? displayText
      : displayText[i18n.locale];
  };

  const specialLookups = ["User", "Location", "Agency", "ReportingLocation"];

  const findOptionDisplayText = v => {
    const foundOptions = find(options, { id: v }) || {};
    let optionValue = [];

    if (Object.keys(foundOptions).length && !specialLookups.includes(option)) {
      optionValue = translatedText(foundOptions.display_text);
    } else if (option === "Agency") {
      optionValue = value
        ? agencies.find(a => a.get("id") === value)?.get("name")
        : value;
    } else {
      optionValue = "";
    }

    return optionValue;
  };

  const fieldProps = {
    component: Select,
    name,
    ...omitBy(other, (v, k) =>
      [
        "InputProps",
        "helperText",
        "InputLabelProps",
        "recordType",
        "recordID"
      ].includes(k)
    ),
    displayEmpty: !mode.isShow,
    input: <Input />,
    native: false,
    renderValue: selected => {
      if (!options) {
        return i18n.t("string_sources_failed");
      }

      return field.multi_select
        ? selected.map(s => findOptionDisplayText(s)).join(", ") ||
            i18n.t("fields.select_multiple")
        : findOptionDisplayText(selected) || i18n.t("fields.select_single");
    },
    MenuProps,
    multiple: field.multi_select,
    IconComponent: !mode.isShow ? ArrowDropDownIcon : () => null,
    disabled: !options || disabled
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  useEffect(() => {
    if (mode.isNew && selectedValue && value === "") {
      formik.setFieldValue(name, selectedValue, false);
    }
  }, []);

  const NAMESPACE = ["transitions", "referral"];

  const loading = useSelector(state => getLoading(state, NAMESPACE));

  const errors = useSelector(state => getErrors(state, NAMESPACE));

  const loadingIndicatorProps = {
    overlay: true,
    type: NAMESPACE[0],
    loading,
    errors,
    hasData: !loading
  };

  const specialLookupsConfig = {
    Location: {
      options: locations,
      fieldValue: CODE_FIELD,
      fieldLabel: NAME_FIELD
    },
    Agency: {
      options: agencies,
      fieldValue: UNIQUE_ID_FIELD,
      fieldLabel: NAME_FIELD
    },
    ReportingLocation: {
      options: reportingLocations,
      fieldValue: CODE_FIELD,
      fieldLabel: NAME_FIELD
    },
    User: {
      options: referralUsers || [],
      fieldValue: "user_name",
      fieldLabel: "user_name"
    }
  };

  if (!isEmpty(formik.values)) {
    if (specialLookups.includes(option)) {
      const values = valuesToSearchableSelect(
        specialLookupsConfig[option].options,
        specialLookupsConfig[option].fieldValue,
        specialLookupsConfig[option].fieldLabel,
        i18n.locale
      );
      const handleChange = (data, form) => {
        form.setFieldValue(name, data ? data.value : "", false);
      };

      const searchableSelectProps = {
        id: name,
        name,
        isDisabled: mode.isShow,
        isClearable: true,
        menuPosition: "absolute",
        TextFieldProps: {
          label,
          margin: "dense",
          fullWidth: true,
          InputLabelProps: {
            htmlFor: name,
            shrink: true
          }
        },
        excludeEmpty: true,
        options: values && values,
        defaultValue:
          value && values.filter(v => String(v.value) === value.toString())
      };

      const renderField = () => (
        <Field name={name}>
          {/* eslint-disable-next-line no-unused-vars */}
          {({ f, form }) => (
            <SearchableSelect
              {...searchableSelectProps}
              onChange={data => handleChange(data, form)}
            />
          )}
        </Field>
      );

      return (
        <>
          {[
            "service_implementing_agency_individual",
            "service_implementing_agency"
          ].find(fieldName => name.endsWith(fieldName)) ? (
            <LoadingIndicator {...loadingIndicatorProps}>
              {renderField()}
            </LoadingIndicator>
          ) : (
            renderField()
          )}
        </>
      );
    }

    return (
      <FormControl
        fullWidth
        className={css.selectField}
        error={fieldError && fieldTouched}
      >
        <InputLabel shrink htmlFor={other.name} {...InputLabelProps}>
          {label}
        </InputLabel>
        <Field {...fieldProps}>
          {options &&
            options.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {field.multi_select && (
                  <Checkbox checked={value && value.indexOf(o.id) > -1} />
                )}
                <ListItemText primary={translatedText(o.display_text) || ""} />
              </MenuItem>
            ))}
        </Field>
        <FormHelperText>
          {fieldError && fieldTouched ? fieldError : helperText}
        </FormHelperText>
      </FormControl>
    );
  }

  return null;
};

SelectField.displayName = SELECT_FIELD_NAME;

SelectField.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired
};

export default connect(SelectField);
