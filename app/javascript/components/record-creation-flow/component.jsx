// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import isEmpty from "lodash/isEmpty";
import { push } from "connected-react-router";
import { useDispatch, batch } from "react-redux";

import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { useI18n } from "../i18n";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getOptionFromAppModule } from "../application/selectors";
import { SEARCH_OR_CREATE_FILTERS } from "../record-list/constants";
import { applyFilters } from "../index-filters";
import { setRedirectedToCreateNewRecord } from "../record-form/action-creators";
import useSystemStrings, { PAGE } from "../application/use-system-strings";

import { ConsentPrompt, SearchPrompt } from "./components";
import { NAME, DATA_PROTECTION_FIELDS } from "./constants";
import css from "./styles.css";

function Component({ open, onClose, recordType, primeroModule }) {
  const i18n = useI18n();

  const { label } = useSystemStrings(PAGE);
  const dispatch = useDispatch();
  const [openConsentPrompt, setOpenConsentPrompt] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const dataProtectionFields = useMemoizedSelector(state =>
    getOptionFromAppModule(state, primeroModule, DATA_PROTECTION_FIELDS)
  );

  const goToNewCase = () => {
    dispatch(push(`/${recordType}/${primeroModule}/new`));
  };

  const redirectToNewCase = () => {
    batch(() => {
      dispatch(setRedirectedToCreateNewRecord(true));
      dispatch(push(`/${recordType}/${primeroModule}/new`));
    });
  };

  const onSearchCases = data => {
    dispatch(
      applyFilters({
        recordType,
        data: { ...SEARCH_OR_CREATE_FILTERS, ...(!isEmpty(data) && { ...data, id_search: true }) }
      })
    );
  };

  const handleSkipAndCreate = () => {
    if (isEmpty(dataProtectionFields)) {
      goToNewCase();
    } else {
      setSearchValue("");
      setOpenConsentPrompt(true);
    }
  };

  const handleCloseDrawer = () => {
    setOpenConsentPrompt(false);
    onClose();

    if (searchValue) {
      onSearchCases();
      setSearchValue("");
    }
  };

  const renderSkipAndCreate = !openConsentPrompt && (
    <div className={css.skipButtonContainer}>
      <ActionButton
        icon={<AddIcon />}
        text="case.skip_and_create"
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleSkipAndCreate
        }}
      />
    </div>
  );

  return (
    <Drawer anchor="right" open={open} onClose={handleCloseDrawer} classes={{ paper: css.subformDrawer }}>
      <div className={css.container}>
        <div className={css.title}>
          <h2>{label("case.create_new_case")}</h2>
          <ActionButton
            icon={<CloseIcon />}
            text="cancel"
            type={ACTION_BUTTON_TYPES.icon}
            isTransparent
            rest={{
              className: css.button,
              onClick: handleCloseDrawer
            }}
          />
        </div>
        <SearchPrompt
          i18n={i18n}
          onCloseDrawer={handleCloseDrawer}
          recordType={recordType}
          setOpenConsentPrompt={setOpenConsentPrompt}
          setSearchValue={setSearchValue}
          goToNewCase={redirectToNewCase}
          dataProtectionFields={dataProtectionFields}
          onSearchCases={onSearchCases}
          openConsentPrompt={openConsentPrompt}
        />
        {renderSkipAndCreate}
        <ConsentPrompt
          i18n={i18n}
          searchValue={searchValue}
          recordType={recordType}
          primeroModule={primeroModule}
          dataProtectionFields={dataProtectionFields}
          goToNewCase={goToNewCase}
          openConsentPrompt={openConsentPrompt}
        />
      </div>
    </Drawer>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string
};

export default Component;
