# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Calculate the permitted fields for a record based on the user's role.
# TODO: Currently allows some permitted fields to be represented as a JSON schema,
#       but this functionality should be extracted.
# rubocop:disable Metrics/ClassLength
class PermittedFieldService
  attr_accessor :user, :model_class, :action_name, :id_search, :permitted_form_field_service

  UUID_REGEX = '\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z'

  # case_status_reopened, record_state, incident_case_id, owned_by, module_id,
  PERMITTED_CORE_FIELDS_SCHEMA = {
    'id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'status' => { 'type' => 'string' }, 'state' => { 'type' => 'boolean' },
    'case_status_reopened' => { 'type' => %w[boolean null] }, 'record_state' => { 'type' => 'boolean' },
    'incident_case_id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'registry_record_id' => { 'type' => '%w[string null]', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'family_id' => { 'type' => '%w[string null]', 'format' => 'regex', 'pattern' => UUID_REGEX },
    'created_at' => { 'type' => 'date-time' },
    'owned_by' => { 'type' => 'string' },
    'module_id' => { 'type' => 'string', 'enum' => [PrimeroModule::CP, PrimeroModule::GBV, PrimeroModule::MRM] }
  }.freeze

  # Calculated fields needed to perform searches
  PERMITTED_FILTER_FIELD_NAMES = %w[
    or not cases_by_date record_in_scope associated_user_names not_edited_by_owner referred_users referred_users_present
    transferred_to_users transferred_to_user_groups has_photo survivor_code survivor_code_no case_id_display
    created_at has_incidents short_id record_state sex age registration_date date_closure
    reassigned_transferred_on current_alert_types location_current reporting_location_hierarchy followup_dates
    reunification_dates tracing_dates service_implemented_day_times
  ].freeze

  PERMITTED_MRM_FILTER_FIELD_NAMES = %w[
    individual_violations individual_age individual_sex victim_deprived_liberty_security_reasons
    reasons_deprivation_liberty victim_facilty_victims_held torture_punishment_while_deprivated_liberty
    violation_with_verification_status armed_force_group_party_names has_late_verified_violations perpetrator_category
    date_of_first_report ctfmr_verified_date verification_status
  ].freeze

  PERMITTED_RECORD_INFORMATION_FIELDS = %w[
    alert_count assigned_user_names created_at created_by created_by_agency owned_by owned_by_agency_id
    owned_by_text owned_by_agency_office previous_agency previously_owned_by reassigned_tranferred_on reopened_logs
    last_updated_at last_updated_by owned_by_groups previously_owned_by_agency created_organization
    consent_for_services disclosure_other_orgs
  ].freeze

  PERMITTED_DASHBOARD_FILTERS = {
    Permission::DASH_CASE_RISK => %w[risk_level],
    Permission::DASH_SHARED_WITH_OTHERS => %w[transfer_status],
    Permission::DASH_SHARED_FROM_MY_TEAM => %w[transfer_status]
  }.freeze

  PERMITTED_FIELDS_FOR_ACTION_SCHEMA = {
    Permission::CLOSE => { 'status' => { 'type' => 'string' }, 'date_closure' => { 'type' => 'date' } },
    Permission::REOPEN => {
      'status' => { 'type' => 'string' }, 'workflow' => { 'type' => 'string' },
      'case_status_reopened' => { 'type' => 'boolean' }
    },
    Permission::ENABLE_DISABLE_RECORD => { 'record_state' => { 'type' => 'boolean' } },
    Permission::INCIDENT_FROM_CASE => {
      'incident_case_id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => UUID_REGEX }
    },
    Permission::ADD_REGISTRY_RECORD => {
      'registry_record_id' => { 'type' => %w[string null], 'format' => 'regex', 'pattern' => UUID_REGEX }
    },
    Permission::CASE_FROM_FAMILY => {
      'family_id' => { 'type' => %w[string null], 'format' => 'regex', 'pattern' => UUID_REGEX },
      'family_member_id' => { 'type' => %w[string null], 'format' => 'regex', 'pattern' => UUID_REGEX }
    },
    Permission::LINK_FAMILY_RECORD => {
      'family_id' => { 'type' => %w[string null], 'format' => 'regex', 'pattern' => UUID_REGEX },
      'family_member_id' => { 'type' => %w[string null], 'format' => 'regex', 'pattern' => UUID_REGEX }
    }
  }.freeze

  # TODO: Add more validation. Enums?
  SYNC_FIELDS_SCHEMA = {
    'synced_at' => { 'type' => 'date' }, 'sync_status' => { 'type' => 'string' },
    'mark_synced' => { 'type' => 'boolean' }, 'mark_synced_url' => { 'type' => 'string' },
    'mark_synced_status' => { 'type' => 'string' }
  }.freeze

  ID_SEARCH_FIELDS = %w[age date_of_birth estimated name sex].freeze

  def initialize(user, model_class, permitted_form_field_service = nil, options = {})
    self.user = user
    self.model_class = model_class
    self.action_name = options[:action_name]
    self.id_search = options[:id_search]
    self.permitted_form_field_service = permitted_form_field_service || PermittedFormFieldsService.instance
  end

  # This is a long series of permission conditions. Sacrificing Rubocop for readability.
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  # rubocop:disable Metrics/ParameterLists
  def permitted_field_names(module_unique_id = nil, writeable = false, update = false, roles = [])
    return @permitted_field_names if @permitted_field_names.present?
    return permitted_field_names_from_action_name if permitted_field_names_from_action_name.present?

    @permitted_field_names = permitted_core_fields(update) + PERMITTED_FILTER_FIELD_NAMES
    @permitted_field_names += PERMITTED_MRM_FILTER_FIELD_NAMES if user.module?(PrimeroModule::MRM)
    @permitted_field_names += permitted_form_field_service.permitted_field_names(
      roles.presence || [user.role], model_class.parent_form, module_unique_id, writeable
    )
    # TODO: Consider moving model specific permitted fields to the model class.
    @permitted_field_names += %w[workflow status case_status_reopened] if model_class == Child
    @permitted_field_names << 'tracing_names' if model_class == TracingRequest
    @permitted_field_names << 'hidden_name' if user.can?(:update, model_class)
    @permitted_field_names += %w[flag_count flagged] if user.can?(:flag, model_class)
    @permitted_field_names += SYNC_FIELDS_SCHEMA.keys if external_sync?
    @permitted_field_names += permitted_incident_field_names
    @permitted_field_names << 'incident_details' if user.can?(:view_incident_from_case, model_class)
    approval_fields = permitted_approval_schema.keys
    @permitted_field_names += permitted_approval_schema.keys if approval_fields.present?
    @permitted_field_names << 'approval_subforms' if approval_fields.present?
    @permitted_field_names += permitted_overdue_task_field_names
    @permitted_field_names += PERMITTED_RECORD_INFORMATION_FIELDS if user.can?(:read, model_class)
    @permitted_field_names += ID_SEARCH_FIELDS if id_search.present?
    @permitted_field_names += permitted_dashboard_filter_field_names
    @permitted_field_names += permitted_reporting_location_field if model_class == Child
    @permitted_field_names += permitted_incident_reporting_location_field if model_class == Incident
    @permitted_field_names += permitted_registry_record_id
    @permitted_field_names += permitted_family_id
    @permitted_field_names += permitted_attachment_fields
    @permitted_field_names
  end

  def permitted_core_fields(update = false)
    core_fields = PERMITTED_CORE_FIELDS_SCHEMA.except('registry_record_id').keys
    update ? core_fields - %w[id] : core_fields
  end

  # TODO:  The method is essentially duplicating some logic from permitted_field_names. DRY!
  def permitted_fields_schema
    schema = PERMITTED_CORE_FIELDS_SCHEMA.dup
    permitted_actions =
      PERMITTED_FIELDS_FOR_ACTION_SCHEMA.keys.select { |a| user.role.permits?(model_class.parent_form, a) }
    schema = schema.merge(PERMITTED_FIELDS_FOR_ACTION_SCHEMA.slice(*permitted_actions).values.reduce({}, :merge))
    schema['hidden_name'] = { 'type' => 'boolean' } if user.can?(:update, model_class)
    schema['reporting_location_hierarchy'] = { 'type' => 'string' } if user.can?(:update, model_class)
    schema = schema.merge(SYNC_FIELDS_SCHEMA) if external_sync?
    schema.merge(permitted_approval_schema)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/ParameterLists

  def permitted_reporting_location_field
    reporting_location_config = user.role.reporting_location_config

    return [] if reporting_location_config.blank?

    [reporting_location_config.field_key]
  end

  def permitted_incident_reporting_location_field
    incident_reporting_location_config = user.role.incident_reporting_location_config

    return [] if incident_reporting_location_config.blank?

    [incident_reporting_location_config.field_key]
  end

  def permitted_registry_record_id
    return [] unless model_class == Child

    if user.can?(:view_registry_record, model_class) || user.can?(:add_registry_record, model_class)
      return %w[registry_record_id registry_id_display registry_name registry_no]
    end

    []
  end

  def permitted_family_id
    return [] unless model_class == Child

    if user.can?(:view_family_record, model_class) ||
       user.can?(:case_from_family, model_class) ||
       user.can?(:link_family_record, model_class)
      return %w[family_id family_id_display family_member_id family_name family_number]
    end

    []
  end

  def external_sync?
    model_class.included_modules.include?(Webhookable) && user.can?(:sync_external, model_class)
  end

  def permitted_approval_schema
    Approval.types.each_with_object({}) do |approval_id, schema|
      next unless approval_access?(user, approval_id)

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

  def permitted_attachment_fields
    attachment_field_names = []
    if user.can?(:search_owned_by_others, model_class) && user.can_preview?(model_class)
      attachment_field_names << Attachable::PHOTOS_FIELD_NAME
      attachment_field_names << Attachable::AUDIOS_FIELD_NAME
    end

    attachment_field_names << 'photo' if user.can?(:view_photo, model_class)

    attachment_field_names
  end

  def permitted_dashboard_filter_field_names
    PERMITTED_DASHBOARD_FILTERS.reduce([]) do |memo, (dashboard, field_names)|
      next memo unless user.can?(dashboard.to_sym, Dashboard)

      memo + field_names
    end
  end
end
# rubocop:enable Metrics/ClassLength
