import React from 'react';
import { fromJS } from "immutable";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function ReasonForCaseClosure() {
  let columns = ['Reason for Closure', 'Percentage of Cases'];
  let rows = fromJS([
    ['Survivor received case plan appropriately and wished to close the case', '55%'],
    ['Survivor did not return after 30-90 days', '10%'],
    ['Case was transfered to another organization', '19%'],
    ['The survivor does not wish to continue to receive the service',  '16%'],
    ['Funding constraints', '0%']
  ]);

  return (
    <OptionsBox
      title="Reason for Case Closure"
    >
      <DashboardTable
        columns={columns}
        data={rows}
      />
    </OptionsBox>
  );
}
