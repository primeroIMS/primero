import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compact } from "lodash";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle, DialogActions, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import qs from "qs";
import { push } from "connected-react-router";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import { fromJS } from "immutable";

import { enqueueSnackbar } from "../notifier";
import { selectModules } from "../login/components/login-form/selectors";
import { useI18n } from "../i18n";
import { ROUTES } from "../../config";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { useMemoizedSelector } from "../../libs";

import { saveSearch } from "./action-creators";
import { buildFiltersApi, buildFiltersState } from "./utils";

const FormErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("saved_search.no_filters"), { type: "error" }));
  }, [dispatch, i18n]);

  return null;
};

const validationSchema = object().shape({
  name: string().required()
});

const SavedSearchesForm = ({ recordType, open, setOpen, getValues }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const userModules = useMemoizedSelector(state => selectModules(state));

  const closeModal = () => {
    setOpen(false);
    setFormErrors(false);
  };

  const onSubmit = data => {
    const filters = buildFiltersApi(Object.entries(getValues()));

    if (filters.length) {
      const body = {
        data: fromJS({
          name: data.name,
          record_type: recordType,
          module_ids: userModules,
          filters: compact(filters)
        })
      };

      dispatch(saveSearch(body, i18n.t("saved_search.save_success")));
      setFormErrors(false);
      closeModal();

      dispatch(
        push({
          pathname: ROUTES[recordType],
          search: qs.stringify(buildFiltersState(filters))
        })
      );
    } else {
      setFormErrors(true);
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{i18n.t("saved_searches.save_search")}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            error={errors?.name?.message}
            placeholder="Name"
            inputRef={register}
            helperText={errors?.name?.message}
            fullWidth
            autoFocus
            required
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <ActionButton
            icon={<CheckIcon />}
            text={i18n.t("buttons.save")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              type: "submit"
            }}
          />
          <ActionButton
            icon={<CloseIcon />}
            text={i18n.t("buttons.cancel")}
            type={ACTION_BUTTON_TYPES.default}
            isCancel
            rest={{
              onClick: closeModal
            }}
          />
        </DialogActions>
        {formErrors && <FormErrors />}
      </form>
    </Dialog>
  );
};

SavedSearchesForm.displayName = "SavedSearchesForm";

SavedSearchesForm.propTypes = {
  getValues: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default SavedSearchesForm;
