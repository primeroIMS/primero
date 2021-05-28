import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Tab, Tabs } from "@material-ui/core";

import TabPanel from "../../../pages/admin/form-builder/components/tab-panel";
import FormSectionField from "../form-section-field";
import watchedFormSectionField from "../watched-form-section-field";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ tabs, formMethods, formMode, handleTabChange }) => {
  const css = useStyles();
  const firstEnabled = tabs.findIndex(el => el.disabled === false);
  const [tab, setTab] = useState(firstEnabled);

  const handleChange = (event, selectedTab) => {
    handleTabChange({ event, selectedTab, formMode, formMethods });
    setTab(selectedTab);
  };

  const renderTab = () => tabs.map(data => <Tab label={data.name} key={`tab-${data.name}`} disabled={data.disabled} />);

  const renderFormSectionField = fieldData =>
    fieldData.fields.map(field => {
      const FieldComponent = field.watchedInputs ? watchedFormSectionField : FormSectionField;

      return <FieldComponent field={field} key={`fsf-${field.name}`} formMethods={formMethods} formMode={formMode} />;
    });

  const renderTabPanel = () =>
    tabs.map((data, index) => {
      return (
        <TabPanel tab={tab} index={index} key={`tab-panel-${data.name}`}>
          <div className={css.tabContent} key={`div-${data.name}`}>
            {renderFormSectionField(data)}
          </div>
        </TabPanel>
      );
    });

  return (
    <>
      <Tabs value={tab} onChange={handleChange} key="form-section-tabs">
        {renderTab()}
      </Tabs>
      {renderTabPanel()}
    </>
  );
};

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired,
  handleTabChange: PropTypes.func,
  tabs: PropTypes.array
};

Component.displayName = NAME;

export default Component;
