module Approvable
  extend ActiveSupport::Concern

  included do
    property :approval_status_bia, String
    property :approval_status_case_plan, String
    property :approval_status_closure, String
    property :bia_approved_date, DateTime
    property :closure_approved_date, DateTime

    #TODO: having this causes validations to fail whith no method error:  valid? for Hash
    #TODO: To really fix this, need new Approval class and change this to be an array of Approvals
    # property :approval_subforms, [], default: []
  end
end