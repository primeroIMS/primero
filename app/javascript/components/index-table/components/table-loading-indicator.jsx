// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { TableBody } from "mui-datatables";
import PropTypes from "prop-types";

import { ConditionalWrapper } from "../../../libs";
import LoadingIndicator from "../../loading-indicator";

function TableLoadingIndicator({ loading, hasData, errors, loadingIndicatorType, ...rest }) {
  return (
    <ConditionalWrapper
      condition={loading && !hasData}
      hasData={hasData}
      overlay
      fromTableList
      error={errors}
      loading={loading}
      type={loadingIndicatorType}
      wrapper={props => {
        return (
          <tr>
            <td colSpan="100%">
              <LoadingIndicator {...props} />
            </td>
          </tr>
        );
      }}
    >
      <TableBody {...rest} />
    </ConditionalWrapper>
  );
}

TableLoadingIndicator.displayName = "TableLoadingIndicator";

TableLoadingIndicator.propTypes = {
  errors: PropTypes.array,
  hasData: PropTypes.bool,
  loading: PropTypes.bool,
  loadingIndicatorType: PropTypes.string
};

export default TableLoadingIndicator;
