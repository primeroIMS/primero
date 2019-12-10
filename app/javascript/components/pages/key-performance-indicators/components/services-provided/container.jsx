import React from 'react';
import { fromJS } from "immutable";
import { OptionsBox, DashboardTable } from "components/dashboard";

export default function ServicesProvided() {
  let columns = ['Service'];
  let rows = fromJS([['PSS'], ['Medical'], ['Service Name Three'], ['Service Name Four']]);

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
