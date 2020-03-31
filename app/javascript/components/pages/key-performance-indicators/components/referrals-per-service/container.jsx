import React from "react";
import { fromJS } from "immutable";
import { DateRangeSelect, CommonDateRanges } from "components/key-performance-indicators";
import { OptionsBox, DashboardTable } from "components/dashboard";
import { useI18n } from "components/i18n";

function ReferralsPerService({ fetchReferralsPerService, referralsPerService }) {
  let i18n = useI18n();

  let commonDateRanges = CommonDateRanges.from(new Date());

  let dateRanges = [
    commonDateRanges.CurrentMonth
  ];

  let [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

  useEffect(() => {
    fetchReferralsPerService(currentDateRange);
  }, [currentDateRange]);

  let columns = [{
    name: 'service',
    label: 'Service'
  },{
    name: 'referrals',
    label: 'Referrals'
  }];

  let rows = referralsPerService.get("data")
    .map(row => columns.map(column => row.get(column.name)));
  
  return (
    <OptionsBox
      title={i18n.t('key_performance_indicators.referrals_per_service.title')}
      action={
        <DateRangeSelect
          ranges={dateRanges}
          selectedRange={currentDateRange}
          setSelectedRange={setCurrentDateRange}
          disabled
        />
      }
    >
      <DashboardTable
        columns={columns}
        data={fromJS(rows)}
      />
    </OptionsBox>
  );
}

const mapStateToProps = state => {
  return {
    referralsPerService: selectors.referralsPerService(state)
  };
};

const mapDispatchToProps = {
  fetchReferralsPerService: actions.fetchReferralsPerService
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReferralsPerService);
