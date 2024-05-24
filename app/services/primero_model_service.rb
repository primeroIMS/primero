# frozen_string_literal: true

# Copyright (c) 2014 - 2024 UNICEF. All rights reserved.

# Use this service to convert name strings of Primero models into class objects.
# Thsi is useful if a record saves a type field. Only permitted strings can be turned into classes.
class PrimeroModelService
  VALID_MODEL_NAMES = %w[
    Child Incident Violation TracingRequest Trace RegistryRecord Family
    ReportableFollowUp ReportableProtectionConcern ReportableService Dashboard
    Flag Alert Attachment AuditLog BulkExport RecordHistory SavedSearch Transition Task ActivityLog
    Agency ContactInformation Field FormSection Location Lookup PrimeroModule PrimeroProgram Report User Role
    Permission SystemSettings UserGroup ExportConfiguration PrimeroConfiguration Webhook IdentityProvider
  ].freeze

  def self.to_model(name)
    name = if %w[case Case].include?(name)
             'Child'
           else
             name.classify
           end
    return unless VALID_MODEL_NAMES.include?(name)

    Object.const_get(name)
  rescue NameError
    nil
  end

  def self.to_name(name)
    name = name.underscore
    name == 'child' ? 'case' : name
  end
end
