class CreateSystemSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :system_settings do |t|
      #TODO We now use locales.yml to set default locale, but leaving this now for backwards compatibility
      t.string 'default_locale', default: Primero::Application::LOCALE_ENGLISH
      t.string 'locales', array: true, default: [Primero::Application::LOCALE_ENGLISH]
      t.string 'base_language', default: Primero::Application::LOCALE_ENGLISH
      t.string 'case_code_format', array: true, default: []
      t.string 'case_code_separator'
      t.jsonb 'auto_populate_list', array: true, default: []
      t.jsonb 'unhcr_needs_codes_mapping'
      t.jsonb 'reporting_location_config'
      t.jsonb 'age_ranges'
      t.jsonb 'welcome_email_text_i18n'
      t.string 'primary_age_range'
      t.string 'location_limit_for_api'
      t.string 'approval_forms_to_alert'
      t.string 'changes_field_to_form'
      t.string 'export_config_id'
      t.string 'duplicate_export_field'
      t.string 'primero_version'
      t.jsonb 'system_options'
    end
  end
end
