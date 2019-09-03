import React, { useState } from "react";
import { List, Divider, Box, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import FlagIcon from "@material-ui/icons/Flag";
import ListFlagsItem from "./ListFlagsItem";
import Unflag from "./Unflag";
import styles from "./styles.css";

const ListFlags = ({ flags, recordType, records }) => {
  const [deleteFlag, setDeleteFlag] = useState({ deleteMode: false, id: "" });
  const i18n = useI18n();
  const css = makeStyles(styles)();

  const handleDelete = id => {
    setDeleteFlag({ deleteMode: true, id });
  };

  const { deleteMode, id } = deleteFlag;

  const listFlagsItemProps = {
    ...(!deleteMode ? { handleDelete } : {})
  };

  const selectedFlag =
    flags
      .filter(f => f.id === deleteFlag.id)
      .valueSeq()
      .first() || null;

  const unflagProps = {
    flag: selectedFlag,
    setDeleteFlag,
    id,
    recordType,
    records
  };

  return (
    <>
      {flags.size ? (
        <List>
          {deleteMode ? (
            <>
              <Box px={2}>
                <h4>{i18n.t("flags.unflag")}</h4>
              </Box>
              <ListFlagsItem flag={selectedFlag} {...listFlagsItemProps} />
            </>
          ) : (
            <>
              {flags.valueSeq().map((flag, index) => (
                <div key={flag.id}>
                  <ListFlagsItem flag={flag} {...listFlagsItemProps} />
                  {flags.size !== index + 1 && <Divider component="li" />}
                </div>
              ))}
            </>
          )}
        </List>
      ) : (
        <Box className={css.empty}>
          <Box>
            <FlagIcon fontSize="inherit" />
          </Box>
          <h3>{i18n.t("flags.no_flags")}</h3>
        </Box>
      )}
      {deleteMode && <Unflag {...unflagProps} />}
    </>
  );
};

ListFlags.propTypes = {
  flags: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  records: PropTypes.oneOfType([PropTypes.array, PropTypes.string]).isRequired
};

export default ListFlags;
