import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FastField, getIn, connect } from "formik";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useApp } from "../../../application";
import { useI18n } from "../../../i18n";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import SearchableSelect from "../../../searchable-select";
import { SELECT_FIELD_NAME, CUSTOM_STRINGS_SOURCE } from "../constants";
import { getUserFilters } from "../../../record-actions/transitions/components/utils";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import { buildOptions, handleChangeOnServiceUser, shouldFieldUpdate } from "../utils";
import { useMemoizedSelector } from "../../../../libs";
import { getOptionsAreLoading } from "../../selectors";
import { getLoading } from "../../../record-list/selectors";
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
  optionsSelector,
  agencies,
  reportingLocations,
  ...other
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const option = field.option_strings_source || field.option_strings_text;
  const { multi_select: multiSelect } = field;
  const formikValue = getIn(formik.values, name);
  const value = typeof formikValue === "boolean" ? String(formikValue) : formikValue;

  const defaultEmptyValue = multiSelect ? [] : null;

  const selectedValue = field.multi_select ? [field.selected_value] : field.selected_value;

  const { service, agency, location } = other?.filters?.values || {};

  const { filterState, setFilterState } = other?.filters || {};

  const [stickyOption, setStickyOption] = useState(value);
  const options = useMemoizedSelector(optionsSelector);
  const loading = useMemoizedSelector(state => getLoading(state, ["transitions", REFERRAL_TYPE]));
  const agenciesLoading = useMemoizedSelector(state => getOptionsAreLoading(state));

  const filteredOptions = buildOptions(name, option, value, options, stickyOption, filterState);

  const reloadReferralUsers = () => {
    const filters = getUserFilters({ service, agency, location });

    dispatch(
      fetchReferralUsers({
        record_type: "case",
        ...filters
      })
    );
  };

  const endpointLookups = [CUSTOM_STRINGS_SOURCE.agency, CUSTOM_STRINGS_SOURCE.user];

  const disableOfflineEndpointOptions = !online && endpointLookups.includes(option);

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

  const selectIsLoading = fieldName => {
    if (fieldName.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
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
        ? data?.map(selected => (typeof selected === "object" ? selected?.id : selected))
        : data?.id || defaultEmptyValue,
      false
    );

    if (
      [SERVICE_SECTION_FIELDS.deliveryLocation, SERVICE_SECTION_FIELDS.implementingAgency].find(fieldName =>
        name.endsWith(fieldName)
      )
    ) {
      setFilterState({ filtersChanged: true, userIsSelected: false });
    }
    if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
      handleChangeOnServiceUser({
        setFilterState,
        referralUsers: options,
        data,
        agencies,
        reportingLocations,
        form
      });
    }

    if (name.endsWith(SERVICE_SECTION_FIELDS.type)) {
      form.setFieldValue(name, data?.id, false);

      if (setFilterState) {
        setFilterState({ filtersChanged: true, userIsSelected: false });
      }
    }
  };

  const fieldProps = {
    id: name,
    name,
    isDisabled: !filteredOptions || mode.isShow || disabled || disableOfflineEndpointOptions,
    helperText: inputHelperText(),
    isClearable: true,
    isLoading: selectIsLoading(name),
    mode,
    multiple: multiSelect,
    TextFieldProps: {
      label,
      error: fieldError && fieldTouched,
      InputProps
    },
    onOpen: () => {
      if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
        reloadReferralUsers();
      }
    },
    value,
    defaultValues: value
      ? filteredOptions.filter(optionObject =>
          multiSelect ? value.includes(String(optionObject.id)) : String(optionObject.id) === value.toString()
        )
      : defaultEmptyValue,
    InputLabelProps
  };

  useEffect(() => {
    if (
      filterState?.filtersChanged &&
      !filterState?.userIsSelected &&
      [SERVICE_SECTION_FIELDS.implementingAgencyIndividual, SERVICE_SECTION_FIELDS.implementingAgency].find(fieldName =>
        name.endsWith(fieldName)
      )
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
    if (value && (!stickyOption || isEmpty(stickyOption))) {
      setStickyOption(value);
    }
  }, [value]);

  useEffect(() => {
    if (mode.isNew && selectedValue && (isEmpty(value) || value?.size <= 0)) {
      formik.setFieldValue(name, selectedValue, false);
    }
  }, []);

  if (isEmpty(formik.values)) {
    return null;
  }

  return (
    <FastField name={name} shouldUpdate={shouldFieldUpdate} options={filteredOptions}>
      {({ form }) => {
        const onChange = data => handleChange(data, form);

        return (
          <SearchableSelect
            {...fieldProps}
            onChange={onChange}
            optionIdKey="id"
            optionLabelKey="display_text"
            options={filteredOptions}
          />
        );
      }}
    </FastField>
  );
};

SelectField.displayName = SELECT_FIELD_NAME;

SelectField.propTypes = {
  agencies: PropTypes.array,
  disabled: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired,
  optionsSelector: PropTypes.func.isRequired,
  reportingLocations: PropTypes.array
};

export default connect(SelectField);
