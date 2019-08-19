import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Box, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useI18n } from "components/i18n";
import TabPanel from "./TabPanel";

const DialogTabs = ({ children, closeDialog, isBulkFlags }) => {
  const [tab, setTab] = useState(0);
  const i18n = useI18n();

  const tabs = [i18n.t("flags.flags_tab"), i18n.t("flags.add_flag_tab")];
  const filteredTabs = isBulkFlags
    ? tabs.filter(t => t !== i18n.t("flags.flags_tab"))
    : tabs;

  const a11yProps = index => {
    return {
      id: `flag-tab-${index}`,
      "aria-controls": `flag-tabpanel-${index}`
    };
  };

  const handleTabChange = (e, value) => {
    setTab(value);
  };

  if (tabs) {
    return (
      <>
        <Box display="flex">
          <Box flexGrow={1}>
            <Tabs onChange={handleTabChange} value={tab}>
              {filteredTabs.map((t, index) => (
                <Tab label={t} {...a11yProps(index)} key={t} />
              ))}
            </Tabs>
          </Box>
          <Box>
            <IconButton onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        {children
          .filter(child => ["false", undefined].includes(child.props.hidetab))
          .map((child, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TabPanel value={tab} index={index} key={`tab-${index}`}>
              {child}
            </TabPanel>
          ))}
      </>
    );
  }

  return null;
};

DialogTabs.propTypes = {
  children: PropTypes.node.isRequired,
  closeDialog: PropTypes.func.isRequired,
  isBulkFlags: PropTypes.bool.isRequired
};

export default DialogTabs;
