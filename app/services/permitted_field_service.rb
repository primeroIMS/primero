# frozen_string_literal: true

# Calculate the permitted fields for a record based on the user's role.
# TODO: Currently allows some permitted fields to be represented as a JSON schema,
#       but this functionality should be extracted.
# rubocop:disable Metrics/ClassLength
class PermittedFieldService
  attr_accessor :user, :model_class, :action_name, :id_search, :permitted_form_field_service

  # Note: Not using Ruby safe regex \A\z because the expression is evaluated with ECMA-262
  UUID_REGEX = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'

  # case_status_reopened, record_state, incident_case_id, owned_by, module_id,
  PERMITTED_CORE_FIELDS_SCHEMA = {
    'id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'status' => { 'type' => 'string' }, 'state' => { 'type' => 'boolean' },
    'case_status_reopened' => { 'type' => %w[boolean null] }, 'record_state' => { 'type' => 'boolean' },
    'incident_case_id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'created_at' => { 'type' => 'date-time' },
    'owned_by' => { 'type' => 'string' },
    'module_id' => { 'type' => 'string', 'enum' => [PrimeroModule::CP, PrimeroModule::GBV, PrimeroModule::MRM] }
  }.freeze

  # Calculated fields needed to perform searches
  PERMITTED_FILTER_FIELD_NAMES = %w[
    or not cases_by_date record_in_scope associated_user_names not_edited_by_owner referred_users referred_users_present
    transferred_to_users has_photo survivor_code survivor_code_no case_id_display
    created_at has_incidents short_id record_state sex age registration_date
    reassigned_transferred_on current_alert_types location_current
  ].freeze

  PERMITTED_RECORD_INFORMATION_FIELDS = %w[
    alert_count assigned_user_names created_by created_by_agency owned_by owned_by_agency_id
    owned_by_text owned_by_agency_office previous_agency previously_owned_by reassigned_tranferred_on reopened_logs
    last_updated_at owned_by_groups previously_owned_by_agency created_organization
    consent_for_services disclosure_other_orgs
  ].freeze

  PERMITTED_FIELDS_FOR_ACTION_SCHEMA = {
    Permission::ADD_NOTE => { 'notes_section' => { 'type' => %w[array null], 'items' => { 'type' => 'object' } } },
    Permission::INCIDENT_DETAILS_FROM_CASE => {
      'incident_details' => { 'type' => %w[array null], 'items' => { 'type' => 'object' } }
    },
    Permission::SERVICES_SECTION_FROM_CASE => {
      'services_section' => { 'type' => %w[array null], 'items' => { 'type' => 'object' } }
    },
    Permission::CLOSE => { 'status' => { 'type' => 'string' } },
    Permission::REOPEN => {
      'status' => { 'type' => 'string' }, 'workflow' => { 'type' => 'string' },
      'case_status_reopened' => { 'type' => 'boolean' }
    },
    Permission::ENABLE_DISABLE_RECORD => { 'record_state' => { 'type' => 'boolean' } },
    Permission::INCIDENT_FROM_CASE => {
      'incident_case_id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX }
    }
  }.freeze

  # TODO: Add more validation. Enums?
  SYNC_FIELDS_SCHEMA = {
    'synced_at' => { 'type' => 'date' }, 'sync_status' => { 'type' => 'string' },
    'mark_synced' => { 'type' => 'boolean' }, 'mark_synced_url' => { 'type' => 'string' },
    'mark_synced_status' => { 'type' => 'string' }
  }.freeze

  ID_SEARCH_FIELDS = %w[age date_of_birth estimated name sex].freeze

  def initialize(user, model_class, action_name = nil, id_search = nil, permitted_form_field_service = nil)
    self.user = user
    self.model_class = model_class
    self.action_name = action_name
    self.id_search = id_search
    self.permitted_form_field_service = permitted_form_field_service || PermittedFormFieldsService.instance
  end

  # This is a long series of permission conditions. Sacrificing Rubocop for readability.
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  def permitted_field_names(writeable = false)
    return @permitted_field_names if @permitted_field_names.present?
    return permitted_field_names_from_action_name if action_name.present?

    @permitted_field_names = PERMITTED_CORE_FIELDS_SCHEMA.keys + PERMITTED_FILTER_FIELD_NAMES
    @permitted_field_names += permitted_form_field_service.permitted_field_names(
      user.role, model_class.parent_form, writeable
    )
    # TODO: Consider moving model specific permitted fields to the model class.
    @permitted_field_names += %w[workflow status case_status_reopened] if model_class == Child
    @permitted_field_names << 'tracing_names' if model_class == TracingRequest
    @permitted_field_names << 'hidden_name' if user.can?(:update, model_class)
    @permitted_field_names += %w[flag_count flagged] if user.can?(:flag, model_class)
    @permitted_field_names += SYNC_FIELDS_SCHEMA.keys if external_sync?
    @permitted_field_names += permitted_incident_field_names
    @permitted_field_names << 'incident_details' if user.can?(:view_incident_from_case, model_class)
    @permitted_field_names += permitted_approval_schema.keys
    @permitted_field_names += permitted_overdue_task_field_names
    @permitted_field_names += PERMITTED_RECORD_INFORMATION_FIELDS if user.can?(:read, model_class)
    @permitted_field_names += ID_SEARCH_FIELDS if id_search.present?
    @permitted_field_names += permitted_reporting_location_field
    @permitted_field_names
  end

  def permitted_fields_schema
    schema = PERMITTED_CORE_FIELDS_SCHEMA.dup
    permitted_actions =
      PERMITTED_FIELDS_FOR_ACTION_SCHEMA.keys.select { |a| user.role.permits?(model_class.parent_form, a) }
    schema = schema.merge(PERMITTED_FIELDS_FOR_ACTION_SCHEMA.slice(*permitted_actions).values.reduce({}, :merge))
    schema['hidden_name'] = { 'type' => 'boolean' } if user.can?(:update, model_class)
    schema = schema.merge(SYNC_FIELDS_SCHEMA) if external_sync?
    schema.merge(permitted_approval_schema)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity

  def permitted_reporting_location_field
    reporting_location_config = user.role.reporting_location_config

    return [] if reporting_location_config.blank?

    ["#{reporting_location_config.field_key}#{reporting_location_config.admin_level}"]
  end

  def external_sync?
    model_class.included_modules.include?(Webhookable) && user.can?(:sync_external, model_class)
  end

  def permitted_approval_schema
    Approval.types.each_with_object({}) do |approval_id, schema|
      next unless approval_access?(user, approval_id)

      schema['approval_subforms'] = { 'type' => %w[array null], 'items' => { 'type' => 'object' } }
      schema["#{approval_id}_approved"] = { 'type' => 'boolean' }
      schema["approval_status_#{approval_id}"] = { 'type' => 'string' }
      schema["#{approval_id}_approved_date"] = { 'type' => %w[date string], 'format' => 'date' }
      schema["#{approval_id}_approved_comments"] = { 'type' => 'string' }
      schema["#{approval_id}_approval_type"] = { 'type' => 'string' } if approval_id == Approval::CASE_PLAN
    end
  end

  def approval_access?(user, approval_id)
    user.can?(:"request_approval_#{approval_id}", model_class) ||
      user.can?(:"approve_#{approval_id}", model_class) ||
      user.role.permitted_dashboard?("approvals_#{approval_id}") ||
      user.role.permitted_dashboard?("approvals_#{approval_id}_pending")
  end

  def permitted_field_names_from_action_name
    return [] unless action_name && user.can?(action_name.to_sym, model_class)

    PERMITTED_FIELDS_FOR_ACTION_SCHEMA[action_name]&.keys || []
  end

  def permitted_overdue_task_field_names
    overdue_task_fields = []
    overdue_task_fields << 'assessment_due_dates' if user.can?(:cases_by_task_overdue_assessment, Dashboard)
    overdue_task_fields << 'case_plan_due_dates' if user.can?(:cases_by_task_overdue_case_plan, Dashboard)
    overdue_task_fields << 'service_due_dates' if user.can?(:cases_by_task_overdue_services, Dashboard)
    overdue_task_fields << 'followup_due_dates' if user.can?(:cases_by_task_overdue_followups, Dashboard)
    overdue_task_fields
  end

  def permitted_incident_field_names
    return [] unless model_class == Incident

    incident_field_names = []
    incident_field_names << 'incident_date_derived'

    return incident_field_names unless user.can?(Permission::INCIDENT_FROM_CASE.to_sym, Child)

    incident_field_names << 'incident_case_id'
    incident_field_names << 'case_id_display'

    incident_field_names
  end
end
# rubocop:enable Metrics/ClassLength
