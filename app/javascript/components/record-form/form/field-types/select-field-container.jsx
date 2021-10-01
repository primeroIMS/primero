import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { useApp } from "../../../application";
import { useI18n } from "../../../i18n";
import { fetchReferralUsers } from "../../../record-actions/transitions/action-creators";
import SearchableSelect from "../../../searchable-select";
import { CUSTOM_STRINGS_SOURCE } from "../constants";
import { getUserFilters } from "../../../record-actions/transitions/components/utils";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";
import { buildOptions, getSelectFieldDefaultValue, handleChangeOnServiceUser } from "../utils";
import { useMemoizedSelector } from "../../../../libs";
import { getOptionsAreLoading } from "../../selectors";
import { getLoading } from "../../../record-list/selectors";
import { REFERRAL_TYPE } from "../../../record-actions/transitions";
import { OPTION_TYPES } from "../../../form";
import useOptions from "../../../form/use-options";
import { RECORD_TYPES } from "../../../../config";

const SelectFieldContainer = ({
  field,
  value,
  disabled,
  InputLabelProps,
  InputProps,
  mode,
  name,
  setFieldValue,
  label,
  filters,
  optionsSelector,
  error,
  touched,
  helperText,
  recordType,
  recordModuleID
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();

  const {
    multi_select: multiSelect,
    selected_value: selectedDefaultValue,
    option_strings_source: optionStringsSource,
    option_strings_text: optionStringsText
  } = field;
  const option = optionStringsSource || optionStringsText;
  const fieldValue = typeof value === "boolean" ? String(value) : value;

  const defaultEmptyValue = multiSelect ? [] : null;

  const selectedValue = getSelectFieldDefaultValue(field, selectedDefaultValue);

  const { service, agency, location } = filters?.values || {};

  const { filterState, setFilterState } = filters || {};

  const isImplementingAgencyIndividual = name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual);

  const agencyFilterOptions = agencies => {
    if (service) {
      return agencies.filter(stateAgency => stateAgency?.services?.includes(service));
    }

    return agencies;
  };

  const [stickyOption, setStickyOption] = useState(fieldValue);

  const options = useOptions(
    optionsSelector(
      OPTION_TYPES.AGENCY === optionStringsSource ? { filterOptions: agencyFilterOptions, includeServices: true } : {}
    )
  );

  const loading = useMemoizedSelector(state => getLoading(state, ["transitions", REFERRAL_TYPE]));
  const agenciesLoading = useMemoizedSelector(state => getOptionsAreLoading(state));

  const agencies = useOptions({
    source: OPTION_TYPES.AGENCY,
    useUniqueId: true,
    filterOptions: agencyFilterOptions,
    run: isImplementingAgencyIndividual,
    includeServices: true
  });

  const reportingLocations = useOptions({
    source: OPTION_TYPES.REPORTING_LOCATIONS,
    run: name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
  });

  const filteredOptions = buildOptions(name, option, fieldValue, options, stickyOption, filterState);

  const reloadReferralUsers = () => {
    const userFilters = getUserFilters({ service, agency, location });

    dispatch(
      fetchReferralUsers({
        record_type: RECORD_TYPES[recordType],
        record_module_id: recordModuleID,
        ...userFilters
      })
    );
  };

  const endpointLookups = [CUSTOM_STRINGS_SOURCE.agency, CUSTOM_STRINGS_SOURCE.user];

  const disableOfflineEndpointOptions = !online && endpointLookups.includes(option);

  const inputHelperText = () => {
    if (error && touched) {
      return error;
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

  const handleChange = data => {
    setFieldValue(
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
        setFieldValue
      });
    }

    if (name.endsWith(SERVICE_SECTION_FIELDS.type)) {
      setFieldValue(name, data?.id, false);

      if (setFilterState) {
        setFilterState({ filtersChanged: true, userIsSelected: false });
      }
    }
  };

  const onChange = data => handleChange(data);

  const fieldProps = {
    id: name,
    error,
    name,
    isDisabled: !filteredOptions || mode.isShow || disabled || disableOfflineEndpointOptions,
    helperText: inputHelperText(),
    isClearable: true,
    isLoading: selectIsLoading(name),
    mode,
    multiple: multiSelect,
    TextFieldProps: {
      label,
      error: error && touched,
      InputProps
    },
    onOpen: () => {
      if (name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)) {
        reloadReferralUsers();
      }
    },
    value: fieldValue,
    defaultValues: fieldValue
      ? filteredOptions?.filter(optionObject =>
          multiSelect ? fieldValue.includes(String(optionObject.id)) : String(optionObject.id) === fieldValue.toString()
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
      setFieldValue(name, null, false);
    }
  }, [service, agency]);

  useEffect(() => {
    if (
      filterState?.filtersChanged &&
      !filterState?.userIsSelected &&
      name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
    ) {
      setFieldValue(name, null, false);
    }
  }, [location]);

  useEffect(() => {
    if (fieldValue && (!stickyOption || isEmpty(stickyOption))) {
      setStickyOption(fieldValue);
    }
  }, [fieldValue]);

  useEffect(() => {
    if (mode.isNew && selectedValue && (isEmpty(fieldValue) || fieldValue?.size <= 0)) {
      setFieldValue(name, selectedValue, false);
    }
  }, []);

  return (
    <SearchableSelect
      {...fieldProps}
      onChange={onChange}
      optionIdKey="id"
      optionLabelKey="display_text"
      options={filteredOptions}
    />
  );
};

SelectFieldContainer.displayName = "SelectFieldContainer";

SelectFieldContainer.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  field: PropTypes.object.isRequired,
  filters: PropTypes.object,
  formik: PropTypes.object.isRequired,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  mode: PropTypes.object,
  name: PropTypes.string.isRequired,
  optionsSelector: PropTypes.func.isRequired,
  recordModuleID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.bool,
  value: PropTypes.any
};

export default SelectFieldContainer;
