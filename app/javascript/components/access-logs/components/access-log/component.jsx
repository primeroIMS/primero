// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import Timeline from "@mui/lab/Timeline";

import AccessLogItem from "../access-log-item";
import css from "../../styles.css";

import { NAME } from "./constants";

function Component({ recordAccessLogs }) {
  const renderItems = recordAccessLogs.map(item => <AccessLogItem item={item} key={item.get("id")} />);

  return <Timeline classes={{ root: css.root }}>{renderItems}</Timeline>;
}

Component.displayName = NAME;

Component.propTypes = {
  recordAccessLogs: PropTypes.object
};

export default Component;
