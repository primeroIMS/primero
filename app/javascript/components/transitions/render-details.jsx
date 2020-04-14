import React from "react";

import AssignmentsDetails from "./assignments/AssignmentsDetails";
import ReferralDetails from "./referrals/details";
import TransferDetails from "./transfers/TransferDetails";
import TransferRequestDetails from "./transfer_requests/details";

// eslint-disable-next-line react/display-name
export default (transition, css) => {
  switch (transition.type) {
    case "Assign":
      return <AssignmentsDetails transition={transition} classes={css} />;
    case "Transfer":
      return <TransferDetails transition={transition} classes={css} />;
    case "Referral":
      return <ReferralDetails transition={transition} classes={css} />;
    case "TransferRequest":
      return <TransferRequestDetails transition={transition} classes={css} />;
    default:
      return <h2>Not Found</h2>;
  }
};
