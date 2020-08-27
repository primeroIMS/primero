import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { fromJS } from "immutable";
import {
  DateRangeSelect,
  CommonDateRanges
} from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";

import { referralsPerService } from "../../selectors";
import { fetchReferralsPerService } from "../../action-creators";

const ReferralsPerService = ({
  fetchReferralsPerService,
  referralsPerService
}) => {
  const i18n = useI18n();

  const commonDateRanges = CommonDateRanges.from(new Date(), i18n.t);

  const dateRanges = [commonDateRanges.CurrentMonth];

  const [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchReferralsPerService(currentDateRange);
  }, [currentDateRange]);

  const columns = [
    {
      name: "service",
      label: "Service"
    },
    {
      name: "referrals",
      label: "Referrals"
    }
  ];

  const rows = referralsPerService
    .get("data")
    .map(row => columns.map(column => row.get(column.name)));

  return (
    <OptionsBox
      title={i18n.t("key_performance_indicators.referrals_per_service.title")}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          disabled
        />
      }
    >
      <DashboardTable columns={columns} data={fromJS(rows)} />
    </OptionsBox>
  );
};

const mapStateToProps = state => {
  return {
    referralsPerService: referralsPerService(state)
  };
};

const mapDispatchToProps = {
  fetchReferralsPerService
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralsPerService);
