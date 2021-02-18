# frozen_string_literal: true

# TODO: This class will need some cleanup/refactor
# Calculate the permitted fields for a receord based on the user's role
class PermittedFieldService
  attr_accessor :user, :model_class, :action_name

  PERMITTED_CORE_FIELDS = %w[id record_in_scope or not cases_by_date alert_count].freeze

  # Calculated fields needed to perform searches
  PERMITTED_FILTER_FIELD_NAMES = %w[
    associated_user_names not_edited_by_owner referred_users referred_users_present
    transferred_to_users has_photo survivor_code survivor_code_no case_id_display
    created_at has_incidents short_id record_state
  ].freeze

  PERMITTED_RECORD_INFORMATION_FIELDS = %w[
    assigned_user_names created_by created_by_agency module_id owned_by owned_by_agency_id
    owned_by_text owned_by_agency_office previous_agency previously_owned_by reassigned_tranferred_on reopened_logs
    last_updated_at owned_by_groups previously_owned_by_agency created_organization
  ].freeze

  PERMITTED_FIELDS_FOR_ACTION = {
    Permission::ADD_NOTE => %w[notes_section], Permission::INCIDENT_DETAILS_FROM_CASE => %w[incident_details],
    Permission::SERVICES_SECTION_FROM_CASE => %w[services_section], Permission::CLOSE => %w[status],
    Permission::REOPEN => %w[status workflow case_status_reopened],
    Permission::ENABLE_DISABLE_RECORD => %w[record_state], Permission::INCIDENT_FROM_CASE => %w[incident_case_id]
  }.freeze

  def initialize(user, model_class, action_name = nil)
    self.user = user
    self.model_class = model_class
    self.action_name = action_name
  end

  # This is a long series of permission conditions. Sacrificing Rubocop for readability.
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  def permitted_field_names(writeable = false)
    return @permitted_field_names if @permitted_field_names.present?
    return permitted_field_names_from_action_name if action_name.present?

    @permitted_field_names = PERMITTED_CORE_FIELDS
    @permitted_field_names += user.permitted_field_names_from_forms(model_class.parent_form, false, writeable)
    @permitted_field_names += PERMITTED_FILTER_FIELD_NAMES
    @permitted_field_names += %w[workflow status case_status_reopened] if model_class == Child
    @permitted_field_names << 'hidden_name' if user.can?(:update, model_class)
    @permitted_field_names += %w[flag_count flagged] if user.can?(:flag, model_class)
    if model_class.included_modules.include?(Webhookable) && user.can?(:sync_external, model_class)
      @permitted_field_names += %w[synced_at sync_status]
    end
    if model_class == Incident && user.can?(Permission::INCIDENT_FROM_CASE.to_sym, Child)
      @permitted_field_names << 'incident_case_id'
      @permitted_field_names << 'case_id_display'
    end
    @permitted_field_names << 'incident_details' if user.can?(:view_incident_from_case, model_class)
    @permitted_field_names += permitted_approval_field_names
    @permitted_field_names += permitted_overdue_task_field_names
    @permitted_field_names += PERMITTED_RECORD_INFORMATION_FIELDS if user.can?(:read, model_class)
    @permitted_field_names
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def permitted_approval_field_names
    Approval.types.map do |approval_id|
      next unless approval_access?(user, approval_id)

      approval_fields = %W[approval_subforms #{approval_id}_approved approval_status_#{approval_id}
                           #{approval_id}_approved_date #{approval_id}_approved_comments]
      approval_id == Approval::CASE_PLAN ? approval_fields << "#{approval_id}_approval_type" : approval_fields
    end.compact.flatten
  end

  def approval_access?(user, approval_id)
    user.can?(:"request_approval_#{approval_id}", model_class) ||
      user.can?(:"approve_#{approval_id}", model_class)
  end

  def permitted_field_names_from_action_name
    return [] unless action_name && user.can?(action_name.to_sym, model_class)

    PERMITTED_FIELDS_FOR_ACTION[action_name] || []
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
