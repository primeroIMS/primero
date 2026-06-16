# frozen_string_literal: true

class AddTimestampsToConfigTables < ActiveRecord::Migration[5.2]
  def change
    %i[agencies
       contact_informations
       export_configurations
       fields
       form_sections
       form_sections_roles
       identity_providers
       lookups
       primero_modules
       primero_programs
       roles
       system_settings
       user_groups
       webhooks].each { |table| add_timestamps(table, null: false, default: -> { 'CURRENT_TIMESTAMP' }) }
  end
end
