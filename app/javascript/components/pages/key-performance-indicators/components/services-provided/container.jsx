import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { useI18n } from "components/i18n";
import { OptionsBox, DashboardTable } from "components/dashboard";

function ServicesProvided({ fetchServicesProvided, servicesProvided }) {
  let i18n = useI18n();

  useEffect(() => {
    fetchServicesProvided();
  }, []);

  let columns = [{
    name: 'service',
    label: i18n.t('key_performance_indicators.services_provided.service')
  }, {
    name: 'count',
    label: i18n.t('key_performance_indicators.services_provided.count')
  }];
  let rows = servicesProvided.get('data').get('services_provided')
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.services_provided.title')}
    >
      <DashboardTable
        columns={columns}
        data={rows}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    servicesProvided: selectors.servicesProvided(state)
  };
};

const mapDispatchToProps = {
  fetchServicesProvided: actions.fetchServicesProvided
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesProvided);
