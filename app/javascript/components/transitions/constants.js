export const REFERRAL_SUMMARY_NAME = "ReferralSummary";
export const REFERRAL_DETAILS_NAME = "ReferralDetails";
export const TRANSFER_REQUEST_SUMMARY_NAME = "TransferRequestSummary";
export const TRANSFER_REQUEST_DETAILS_NAME = "TransferRequestDetails";
export const TRANSITIONS_NAME = "Transitions";
export const TRANSITION_STATUS = Object.freeze({
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
  done: "done",
  inProgress: "in_progress"
});
export const TRANSITIONS_TYPES = Object.freeze({
  transfer: "transfer",
  referral: "referral",
  reassign: "reassign"
});
