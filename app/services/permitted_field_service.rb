# frozen_string_literal: true
# TODO: This class will need some cleanup/refactor
class PermittedFieldService
  attr_accessor :user, :model_class, :action_name

  # Calculated fields needed to perform searches
  PERMITTED_FILTER_FIELD_NAMES = %w[
    associated_user_names
    not_edited_by_owner
    referred_users
    referred_users_present
    transferred_to_users
    has_photo
  ].freeze

  def initialize(user, model_class, action_name = nil)
    self.user = user
    self.model_class = model_class
    self.action_name = action_name
  end

  def permitted_field_names
    return @permitted_field_names if @permitted_field_names.present?

    return permitted_field_names_from_action_name if action_name.present?

    @permitted_field_names = []
    @permitted_field_names += %w[id record_in_scope]
    @permitted_field_names += user.permitted_field_names_from_forms(model_class.parent_form)
    @permitted_field_names << 'or'
    @permitted_field_names << 'not'
    @permitted_field_names << 'cases_by_date'
    @permitted_field_names << 'alert_count'
    @permitted_field_names += PERMITTED_FILTER_FIELD_NAMES
    @permitted_field_names += %w[workflow status case_status_reopened] if model_class == Child
    @permitted_field_names << 'record_state' if user.can?(:enable_disable_record, model_class)
    @permitted_field_names << 'hidden_name' if user.can?(:update, model_class)
    @permitted_field_names << 'flag_count' if user.can?(:flag, model_class)
    @permitted_field_names << 'flagged' if user.can?(:flag, model_class)
    @permitted_field_names += permitted_approval_field_names
    @permitted_field_names += permitted_overdue_task_field_names
    @permitted_field_names
  end

  def permitted_approval_field_names
    approval_field_names = []
    [Approval::BIA, Approval::CASE_PLAN, Approval::CLOSURE].each do |approval_id|
      if user.can?(:"request_approval_#{approval_id}", model_class) ||
         user.can?(:"approve_#{approval_id}", model_class)
        approval_field_names << 'approval_subforms'
        approval_field_names << "#{approval_id}_approved"
        approval_field_names << "approval_status_#{approval_id}"
        approval_field_names << "#{approval_id}_approved_date"
        approval_field_names << "#{approval_id}_approved_comments"
        approval_field_names << "#{approval_id}_approval_type" if approval_id == Approval::CASE_PLAN
      else
        next
      end
    end
    approval_field_names
  end

  def permitted_field_names_from_action_name
    case action_name
    when Permission::ADD_NOTE then %w[notes_section] if user.can?(:add_note, model_class)
    when Permission::INCIDENT_DETAILS_FROM_CASE then %w[incident_details] if user.can?(:incident_details_from_case, model_class)
    when Permission::SERVICES_SECTION_FROM_CASE then %w[services_section] if user.can?(:services_section_from_case, model_class)
    when Permission::CLOSE then %w[status]  if user.can?(:close, model_class)
    when Permission::REOPEN then %w[status workflow case_status_reopened] if user.can?(:reopen, model_class)
    when Permission::ENABLE_DISABLE_RECORD then %w[record_state] if user.can?(:enable_disable_record, model_class)
    else raise Errors::InvalidPrimeroEntityType, 'case.invalid_action_name'
    end
  end

  def permitted_overdue_task_field_names
    overdue_task_fields = []
    overdue_task_fields << 'assessment_due_dates' if user.can?(:cases_by_task_overdue_assessment, Dashboard)
    overdue_task_fields << 'case_plan_due_dates' if user.can?(:cases_by_task_overdue_case_plan, Dashboard)
    overdue_task_fields << 'service_due_dates' if user.can?(:cases_by_task_overdue_services, Dashboard)
    overdue_task_fields << 'followup_due_dates' if user.can?(:cases_by_task_overdue_followups, Dashboard)
    overdue_task_fields
  end
end
