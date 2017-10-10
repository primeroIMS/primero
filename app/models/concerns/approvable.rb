module Approvable
  extend ActiveSupport::Concern

  included do
    property :approval_status_bia, String
    property :approval_status_case_plan, String
    property :approval_status_closure, String
    property :bia_approved_date, DateTime
    property :closure_approved_date, DateTime
    property :approval_subforms, [], default: []
  end
end