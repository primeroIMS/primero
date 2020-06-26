import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Field, connect, getIn } from "formik";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useApp } from "../../../application";
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
import { getLoading } from "../../../index-table";
import { buildCustomLookupsConfig, handleChangeOnServiceUser } from "../utils";
import { getUserFilters } from "../../../record-actions/transitions/components/utils";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import { REFERRAL_TYPE } from "../../../record-actions/transitions";

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
  const dispatch = useDispatch();
  const { online } = useApp();

  const option = field.option_strings_source || field.option_strings_text;
  const { multi_select: multiSelect } = field;
  const value = getIn(formik.values, name);
  const defaultEmptyValue = multiSelect ? [] : null;

  const selectedValue = field.multi_select
    ? [field.selected_value]
    : field.selected_value;

  const { service, agency, location } = other?.filters?.values || {};

  const { filterState, setFilterState } = other?.filters || {};

  const NAMESPACE = ["transitions", REFERRAL_TYPE];

  const options = useSelector(state => getOption(state, option, i18n.locale));
  const loading = useSelector(state => getLoading(state, NAMESPACE));
  const agenciesLoading = useSelector(state => getOptionsAreLoading(state));

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

  const reloadReferralUsers = () => {
    const filters = getUserFilters({ services: service, agency, location });

    dispatch(
      fetchReferralUsers({
        record_type: "case",
        ...filters
      })
    );
  };

  const customLookups = [
    CUSTOM_STRINGS_SOURCE.agency,
    CUSTOM_STRINGS_SOURCE.location,
    CUSTOM_STRINGS_SOURCE.reportingLocation,
    CUSTOM_STRINGS_SOURCE.user
  ];

  const endpointLookups = [
    CUSTOM_STRINGS_SOURCE.agency,
    CUSTOM_STRINGS_SOURCE.user
  ];

  const disableOfflineEndpointOptions =
    !online && endpointLookups.includes(option);

  const fieldError = getIn(formik.errors, name);
  const fieldTouched = getIn(formik.touched, name);

  const inputHelperText = () => {
    if (fieldError && fieldTouched) {
      return fieldError;
    }

    if (disableOfflineEndpointOptions) {
      return i18n.t("offline");
    }

    return helperText;
  };

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

  const handleChange = (data, form) => {
    form.setFieldValue(
      name,
      multiSelect
        ? data?.map(selected =>
            typeof selected === "object" ? selected?.value : selected
          )
        : data.value || defaultEmptyValue,
      false
    );

    if (customLookups.includes(option)) {
      if (
        [
          SERVICE_SECTION_FIELDS.deliveryLocation,
          SERVICE_SECTION_FIELDS.implementingAgency
        ].find(fieldName => name.endsWith(fieldName))
      ) {
        setFilterState({ filtersChanged: true, userIsSelected: false });
      }

      if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
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
    }

    if (name.endsWith(SERVICE_SECTION_FIELDS.type)) {
      form.setFieldValue(name, data, false);
      setFilterState({ filtersChanged: true, userIsSelected: false });
    }
  };

  const buildOptions = () => {
    const args = customLookups.includes(option)
      ? [
          customLookupsConfig[option]?.options,
          customLookupsConfig[option]?.fieldValue,
          customLookupsConfig[option]?.fieldLabel
        ]
      : [options, "id", "display_text"];

    return valuesToSearchableSelect(...[...args, i18n.locale]);
  };

  const fieldProps = {
    id: name,
    name,
    isDisabled:
      !options || mode.isShow || disabled || disableOfflineEndpointOptions,
    helperText: inputHelperText(),
    isClearable: true,
    options: buildOptions(),
    isLoading: selectIsLoading(name),
    multiple: multiSelect,
    TextFieldProps: {
      label,
      error: fieldError && fieldTouched
    },
    onOpen: () => {
      if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
        reloadReferralUsers();
      }
    },
    defaultValues: value
      ? buildOptions().filter(optionObject =>
          multiSelect
            ? value.includes(String(optionObject.value))
            : String(optionObject.value) === value.toString()
        )
      : defaultEmptyValue
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
      formik.setFieldValue(name, null, false);
    }
  }, [service, agency]);

  useEffect(() => {
    if (
      filterState?.filtersChanged &&
      !filterState?.userIsSelected &&
      name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
    ) {
      formik.setFieldValue(name, null, false);
    }
  }, [location]);

  useEffect(() => {
    if (mode.isNew && selectedValue && (value === null || value.length === 0)) {
      formik.setFieldValue(name, selectedValue, false);
    }

    if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
      reloadReferralUsers();
    }
  }, []);

  if (isEmpty(formik.values)) {
    return null;
  }

  return (
    <Field name={name}>
      {/* eslint-disable-next-line no-unused-vars */}
      {({ f, form }) => (
        <SearchableSelect
          {...fieldProps}
          onChange={data => handleChange(data, form)}
        />
      )}
    </Field>
  );
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
