# frozen_string_literal: true

class AddForeignKeys < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :primero_modules, :primero_programs, column: 'primero_program_id'
    add_foreign_key :primero_modules_saved_searches, :primero_modules, column: 'primero_module_id'
    add_foreign_key :primero_modules_saved_searches, :saved_searches, column: 'saved_search_id'
    add_foreign_key :primero_modules_roles, :primero_modules, column: 'primero_module_id'
    add_foreign_key :primero_modules_roles, :roles, column: 'role_id'
    add_foreign_key :form_sections_primero_modules, :primero_modules, column: 'primero_module_id'
    add_foreign_key :form_sections_primero_modules, :form_sections, column: 'form_section_id'
    add_foreign_key :form_sections_roles, :roles, column: 'role_id'
    add_foreign_key :form_sections_roles, :form_sections, column: 'form_section_id'
    add_foreign_key :fields, :form_sections, column: 'form_section_id'
    # TODO: This causes an error when new configs are applied.
    # add_foreign_key :fields, :form_sections, column: 'collapsed_field_for_subform_psection_id'
    add_foreign_key :cases, :cases, column: 'duplicate_case_id'
    # TODO: The foreign key can't be created because matched_trace_id is a varchar and trace_id is an uuid.
    # add_foreign_key :cases, :traces, column: 'matched_trace_id'
    add_foreign_key :agencies_user_groups, :agencies, column: 'agency_id'
    add_foreign_key :agencies_user_groups, :user_groups, column: 'user_group_id'
    add_foreign_key :user_groups_users, :users, column: 'user_id'
    add_foreign_key :user_groups_users, :user_groups, column: 'user_group_id'
    add_foreign_key :traces, :tracing_requests, column: 'tracing_request_id'
    add_foreign_key :traces, :cases, column: 'matched_case_id'
    add_foreign_key :alerts, :users, column: 'user_id'
    add_foreign_key :alerts, :agencies, column: 'agency_id'
    add_foreign_key :saved_searches, :users, column: 'user_id'
    add_foreign_key :incidents, :cases, column: 'incident_case_id'
    add_foreign_key :cases, :registry_records, column: 'registry_record_id'
    add_foreign_key :perpetrators_violations, :violations, column: 'violation_id'
    add_foreign_key :perpetrators_violations, :perpetrators, column: 'perpetrator_id'
    add_foreign_key :individual_victims_violations, :violations, column: 'violation_id'
    add_foreign_key :individual_victims_violations, :individual_victims, column: 'individual_victim_id'
    add_foreign_key :group_victims_violations, :violations, column: 'violation_id'
    add_foreign_key :group_victims_violations, :group_victims, column: 'group_victim_id'

    add_index :primero_modules_roles, :primero_module_id
    add_index :primero_modules_roles, :role_id
    add_index :form_sections_primero_modules, :primero_module_id
    add_index :form_sections_primero_modules, :form_section_id
    add_index :form_sections_roles, :role_id
    add_index :form_sections_roles, :form_section_id
    # TODO: This causes an issue with the order of the collapsed fields.
    # add_index :fields, :collapsed_field_for_subform_section_id
    add_index :cases, :duplicate_case_id
  end
end
