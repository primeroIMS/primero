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
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../i18n";
import {
  getLocations,
  getOption,
  getOptionsAreLoading,
  getReportingLocations
} from "../../selectors";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import { getUsersByTransitionType } from "../../../record-actions/transitions/selectors";
import { valuesToSearchableSelect } from "../../../../libs";
import {
  getEnabledAgencies,
  getReportingLocationConfig
} from "../../../application/selectors";
import SearchableSelect from "../../../searchable-select";
import { SELECT_FIELD_NAME, CUSTOM_STRINGS_SOURCE } from "../constants";
import styles from "../styles.css";
import { getLoading } from "../../../index-table";
import {
  buildCustomLookupsConfig,
  findOptionDisplayText,
  handleChangeOnServiceUser,
  translatedText
} from "../utils";
import { getUserFilters } from "../../../record-actions/transitions/components/utils";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import { REFERRAL_TYPE } from "../../../record-actions/transitions";

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
  index,
  ...other
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const dispatch = useDispatch();

  const option = field.option_strings_source || field.option_strings_text;

  const value = getIn(formik.values, name);

  const selectedValue = field.multi_select
    ? [field.selected_value]
    : field.selected_value;

  const options = useSelector(state => getOption(state, option, i18n.locale));

  const { service, agency, location } = other?.filters?.values || {};

  const { filterState, setFilterState } = other?.filters || {};

  const agencies = useSelector(
    state => getEnabledAgencies(state, service),
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
    state => getUsersByTransitionType(state, REFERRAL_TYPE),
    (users1, users2) => users1.equals(users2)
  );

  const NAMESPACE = ["transitions", REFERRAL_TYPE];

  const loading = useSelector(state => getLoading(state, NAMESPACE));
  const agenciesLoading = useSelector(state => getOptionsAreLoading(state));

  const reloadReferralUsers = () => {
    const filters = getUserFilters({ services: service, agency, location });

    dispatch(
      fetchReferralUsers({
        record_type: "case",
        ...filters
      })
    );
  };

  useEffect(() => {
    if (
      filterState?.filtersChanged &&
      !filterState?.userIsSelected &&
      [
        SERVICE_SECTION_FIELDS.implementingAgencyIndividual,
        SERVICE_SECTION_FIELDS.implementingAgency
      ].find(fieldName => name.endsWith(fieldName))
    ) {
      formik.setFieldValue(name, "", false);
    }
  }, [service, agency]);

  useEffect(() => {
    if (
      filterState?.filtersChanged &&
      !filterState?.userIsSelected &&
      name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
    ) {
      formik.setFieldValue(name, "", false);
    }
  }, [location]);

  const customLookups = [
    CUSTOM_STRINGS_SOURCE.agency,
    CUSTOM_STRINGS_SOURCE.location,
    CUSTOM_STRINGS_SOURCE.reportingLocation,
    CUSTOM_STRINGS_SOURCE.user
  ];

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

      const displayOptions = {
        agencies,
        customLookups,
        options,
        option,
        value,
        i18n
      };

      return field.multi_select
        ? selected
            .map(s => findOptionDisplayText({ ...displayOptions, value: s }))
            .join(", ") || i18n.t("fields.select_multiple")
        : findOptionDisplayText({ ...displayOptions }) ||
            i18n.t("fields.select_single");
    },
    MenuProps,
    multiple: field.multi_select,
    IconComponent: !mode.isShow ? ArrowDropDownIcon : () => null,
    disabled: !options || disabled,
    inputProps: {
      onChange: (event, currentValue) => {
        if (name.endsWith("service_type")) {
          formik.setFieldValue(name, currentValue.props.value, false);
          setFilterState({ filtersChanged: true, userIsSelected: false });
        }
      }
    }
  };

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  useEffect(() => {
    if (mode.isNew && selectedValue && (value === "" || value.length === 0)) {
      formik.setFieldValue(name, selectedValue, false);
    }

    if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
      reloadReferralUsers();
    }
  }, []);

  const customLookupsConfig = buildCustomLookupsConfig({
    locations,
    reportingLocations,
    agencies,
    referralUsers,
    filterState,
    value,
    name
  });

  const selectIsLoading = fieldName => {
    if (
      fieldName.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
    ) {
      return loading;
    }
    if (fieldName.endsWith(SERVICE_SECTION_FIELDS.implementingAgency)) {
      return agenciesLoading;
    }

    return false;
  };

  if (!isEmpty(formik.values)) {
    if (customLookups.includes(option)) {
      const values = valuesToSearchableSelect(
        customLookupsConfig[option].options,
        customLookupsConfig[option].fieldValue,
        customLookupsConfig[option].fieldLabel,
        i18n.locale
      );
      const handleChange = (data, form) => {
        form.setFieldValue(name, data ? data.value : "", false);
        if (
          [
            SERVICE_SECTION_FIELDS.deliveryLocation,
            SERVICE_SECTION_FIELDS.implementingAgency
          ].find(fieldName => name.endsWith(fieldName))
        ) {
          setFilterState({ filtersChanged: true, userIsSelected: false });
        }
        if (
          name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
        ) {
          handleChangeOnServiceUser({
            setFilterState,
            referralUsers,
            data,
            agencies,
            reportingLocations,
            form,
            index
          });
        }
      };

      const searchableSelectProps = {
        id: name,
        name,
        isDisabled: mode.isShow || disabled,
        helperText,
        isClearable: true,
        menuPosition: "absolute",
        TextFieldProps: {
          label,
          margin: "dense",
          fullWidth: true,
          helperText,
          InputLabelProps: {
            htmlFor: name,
            shrink: true
          }
        },
        excludeEmpty: true,
        options: values && values,
        isLoading: selectIsLoading(name),
        onMenuOpen: () => {
          if (
            name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
          ) {
            reloadReferralUsers();
          }
        },
        defaultValues: value
          ? values.filter(v => String(v.value) === value.toString())
          : ""
      };

      return (
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
              <MenuItem
                key={o.id}
                value={o.id}
                alignItems="flex-start"
                className={css.menu}
              >
                {field.multi_select && (
                  <Checkbox checked={value && value.indexOf(o.id) > -1} />
                )}
                <ListItemText
                  primary={translatedText(o.display_text, i18n) || ""}
                />
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
  index: PropTypes.number,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired
};

export default connect(SelectField);
