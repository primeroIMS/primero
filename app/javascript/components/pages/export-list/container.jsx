import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles/";
import DownloadIcon from "@material-ui/icons/GetApp";
import { PageContainer, PageHeading } from "components/page-container";
import { IndexTable } from "components/index-table";
import * as actions from "./action-creators";
import * as selectors from "./selectors";
import styles from "./styles.css";

const ExportList = ({ exportList, getExports, meta }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    getExports();
  }, []);

  const columns = [
    {
      name: "id",
      options: {
        display: false
      }
    },
    {
      name: "file",
      id: true,
      label: i18n.t("bulk_export.file_name"),
      options: {
        customBodyRender: value => {
          return (
            <div className={css.link}>
              <DownloadIcon />
              {value}
            </div>
          );
        }
      }
    },
    {
      name: "type",
      label: i18n.t("bulk_export.record_type")
    },
    {
      name: "started",
      label: i18n.t("bulk_export.started_on")
    }
  ];

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    columns,
    options,
    namespace: "exports",
    path: "/exports",
    data: {
      records: exportList,
      meta
    },
    onTableChange: () => {}
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.bulk_exports")} />
      <IndexTable {...tableOptions} />
    </PageContainer>
  );
};

ExportList.propTypes = {
  exportList: PropTypes.object,
  getExports: PropTypes.func,
  meta: PropTypes.object
};

const mapStateToProps = state => ({
  exportList: selectors.selectExports(state),
  meta: selectors.selectMeta(state)
});

const mapDispatchToProps = {
  getExports: actions.fetchExports
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportList);
