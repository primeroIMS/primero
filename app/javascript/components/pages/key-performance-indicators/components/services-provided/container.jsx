import * as actions from "../../action-creators";
import * as selectors from "../../selectors";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { fromJS } from "immutable";
import { OptionsBox, DashboardTable } from "components/dashboard";

function ServicesProvided({ fetchServicesProvided, servicesProvided }) {
  useEffect(() => {
    fetchServicesProvided()
  }, [])

  let columns = ['Service'];
  // wrap each service in an array as DashboardTable expects an
  // array of arrays.
  let rows = servicesProvided.get('data').get('services_provided').
    map(s => [s])

  return (
    <OptionsBox
      title="Services Provided"
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
