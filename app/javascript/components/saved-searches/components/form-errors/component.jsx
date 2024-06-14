import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";

const FormErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("saved_search.no_filters"), { type: "error" }));
  }, [dispatch, i18n]);

  return null;
};

FormErrors.displayName = "FormErrors";

export default FormErrors;
