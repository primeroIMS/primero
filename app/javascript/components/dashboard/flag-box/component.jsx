// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import generateKey from "../../charts/table-values/utils";

import FlagBoxItem from "./components/flag-box-item";
import { showId } from "./utils";
import css from "./styles.css";

const FlagBox = ({ flags }) => {
  return (
    <div className={css.flagContainer}>
      {flags
        .map(flag => (
          <FlagBoxItem
            key={generateKey()}
            date={flag.get("date")}
            reason={flag.get("message")}
            recordId={flag.get("record_id")}
            title={showId(flag) ? flag.get("short_id") : flag.get("name")}
            user={flag.get("flagged_by")}
          />
        ))
        .slice(0, 10)}
    </div>
  );
};

FlagBox.displayName = "FlagBox";

FlagBox.propTypes = {
  flags: PropTypes.object.isRequired
};

export default FlagBox;
