import React, { useState } from "react";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";
import MUIDataTable from "mui-datatables";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { useI18n } from "../../../i18n";
import { ROUTES } from "../../../../config";
import { PageHeading, PageContent } from "../../../page";
import { getLookups } from "../../../record-form";

import { NAME, TABLE_OPTIONS } from "./constants";
import { columns } from "./helpers";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(20);
  const lookups = useSelector(state => getLookups(state, page, per));
  let translatedRecords = [];

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  );

  translatedRecords = lookups?.size
    ? lookups.get("data").map(current => {
        const translatedFields = ["name", "values"].reduce((acc, field) => {
          return acc.merge({
            [field]:
              field === "values"
                ? current
                    .get(field)
                    .map(value =>
                      value.getIn(["display_text", i18n.locale], "")
                    )
                    .join(", ")
                : current.getIn([field, i18n.locale])
          });
        }, fromJS({}));

        return current.merge(translatedFields);
      })
    : fromJS([]);

  const handleTableChange = (action, tableState) => {
    switch (action) {
      case "changePage": {
        setPage(tableState.page + 1);
        break;
      }
      case "changeRowsPerPage": {
        setPage(1);
        setPer(tableState.rowsPerPage);
        break;
      }
      default:
        break;
    }
  };

  const options = {
    ...TABLE_OPTIONS,
    count: lookups.get("count"),
    rowsPerPage: per,
    customToolbar: () => null,
    onCellClick: (_colData, cellMeta) => {
      const { dataIndex } = cellMeta;

      dispatch(
        push(`${"lookups"}/${lookups.get("data").getIn([dataIndex, "id"])}`)
      );
    },
    onTableChange: handleTableChange
  };

  return (
    <>
      <PageHeading title={i18n.t("settings.navigation.lookups")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <MUIDataTable
          columns={columns(i18n)}
          data={translatedRecords?.toJS()}
          options={options}
        />
      </PageContent>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {};

export default Component;
