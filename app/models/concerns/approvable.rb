module Approvable
  extend ActiveSupport::Concern

  included do
    property :approval_status_bia, String
    property :approval_status_case_plan, String
    property :approval_status_closure, String
    # TODO: these DateTime fields are set to Date fields in searchable_string_fields in searchable based on not having the property date_include_time on the form field.
    property :bia_approved_date, DateTime
    property :closure_approved_date, DateTime
    property :case_plan_approved_date, DateTime

    #TODO: having this causes validations to fail whith no method error:  valid? for Hash
    #TODO: To really fix this, need new Approval class and change this to be an array of Approvals
    #TODO: When you do this, you can remove the FormSection setup in the Request Approval Mailer specs in children_controller_spec
    # property :approval_subforms, [], default: []
  end

  def self.approval_forms
    ['cp_case_plan', 'closure_form', 'cp_bia_form', 'action_plan_form', 'gbv_case_closure_form']
  end
end