import React from "react";

import AssignmentsSummary from "./assignments/AssignmentsSummary";
import ReferralSummary from "./referrals/summary";
import TransferRequestSummary from "./transfer_requests/summary";
import TransferSummary from "./transfers/TransferSummary";

// eslint-disable-next-line react/display-name
export default (transition, css, recordType, showMode) => {
  switch (transition.type) {
    case "Assign":
      return <AssignmentsSummary transition={transition} classes={css} />;
    case "Transfer":
      return (
        <TransferSummary
          transition={transition}
          classes={css}
          showMode={showMode}
          recordType={recordType}
        />
      );
    case "Referral":
      return (
        <ReferralSummary
          transition={transition}
          classes={css}
          showMode={showMode}
          recordType={recordType}
        />
      );
    case "TransferRequest":
      return <TransferRequestSummary transition={transition} classes={css} />;
    default:
      return <h2>Not Found</h2>;
  }
};
