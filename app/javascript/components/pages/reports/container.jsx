import React from "react";
import { Map, List, fromJS } from "immutable";
import { Grid, Box, IconButton } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import { OptionsBox, ActionMenu } from "components/dashboard";
import AddIcon from "@material-ui/icons/Add";
import { IndexTable } from "components/index-table";
import { PageContainer } from "components/page-container";
import makeStyles from "@material-ui/styles/makeStyles";
import { useI18n } from "components/i18n";
import * as actions from "./action-creators";
import styles from "./styles.css";

const Reports = () => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const actionMenuItems = fromJS([
    {
      id: "add-new",
      label: "Add New",
      onClick: () => console.log("Do Something")
    },
    {
      id: "arrange-items",
      label: "Arrange Items",
      onClick: () => console.log("Do Something")
    },
    {
      id: "refresh-data",
      label: "Refresh Data",
      onClick: () => console.log("Do Something")
    }
  ]);

  const tableOptions = {
    recordType: "reports",
    columns: List([
      { name: "id", id: "id", label: "ID", options: { display: "false" } },
      {
        name: "name",
        id: "name",
        options: { display: "false" }
      },
      {
        name: "description",
        id: "description",
        options: { display: "false" }
      }
    ]),
    defaultFilters: Map({
      per: 20,
      page: 1
    }),
    onTableChange: actions.fetchReports,
    options: {
      elevation: 0,
      selectableRowsHeader: false,
      customRowRender: data => {
        const [id, name, description] = data;
        return (
          <tr key={id}>
            <td>
              <OptionsBox
                title={name[i18n.locale]}
                to={`reports/${id}`}
                action={<ActionMenu open={false} items={actionMenuItems} />}
              >
                <p className={css.reportDescription}>
                  {description[i18n.locale]}
                </p>
              </OptionsBox>
            </td>
          </tr>
        );
      }
    }
  };

  return (
    <div>
      <PageContainer>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexGrow={1}>
              <h1 className={css.title}>{i18n.t("reports.label")}</h1>
            </Box>
            <Box>
              <IconButton to="/reports" component={Link} className={css.new}>
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <IndexTable {...tableOptions} />
          </Grid>
        </Grid>
      </PageContainer>
    </div>
  );
};

export default withRouter(Reports);
