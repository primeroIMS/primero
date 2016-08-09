module Approvable
  extend ActiveSupport::Concern

  included do
    property :approval_status_bia, String
    property :approval_status_case_plan, String
    property :approval_status_closure, String
  end
end