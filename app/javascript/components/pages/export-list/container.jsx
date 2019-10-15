import React from "react";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles/";
import DownloadIcon from "@material-ui/icons/GetApp";
import { PageContainer, PageHeading, PageContent } from "components/page";
import { IndexTable } from "components/index-table";
import { useSelector } from "react-redux";
import { Map } from "immutable";
import { fetchExports } from "./action-creators";
import styles from "./styles.css";
import { selectListHeaders } from "./selectors";

const ExportList = () => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const recordType = "bulk_exports";

  const listHeaders = useSelector(state =>
    selectListHeaders(state, recordType)
  );

  const columns = listHeaders.map(c => {
    const options = {
      ...{
        ...(c.name === "file_name"
          ? {
              id: true,
              customBodyRender: value => {
                return (
                  <div className={css.link}>
                    <DownloadIcon />
                    {value}
                  </div>
                );
              }
            }
          : {})
      }
    };

    return {
      name: c.field_name,
      label: c.name,
      options
    };
  });

  const options = {
    selectableRows: "none"
  };

  const tableOptions = {
    recordType,
    columns,
    options,
    defaultFilters: Map({
      per: 20,
      page: 1
    }),
    onTableChange: fetchExports
  };

  return (
    <PageContainer>
      <PageHeading title={i18n.t("navigation.bulk_exports")} />
      <PageContent>
        <IndexTable {...tableOptions} />
      </PageContent>
    </PageContainer>
  );
};

export default ExportList;
