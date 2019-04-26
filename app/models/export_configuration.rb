class ExportConfiguration < ApplicationRecord
  # include Memoizable
  include LocalizableJsonProperty
  include Configuration

  localize_properties :name

  validate :valid_record_type
  validate :opt_out_field_exists

  def valid_record_type
    return true if ['Child', 'TracingRequest', 'Incident'].include?(self.record_type)
    errors.add(:record_type, I18n.t("errors.models.export_configuration.record_type"))
  end

  #If there is a consent field defined, make sure it is a valid property of the Record
  def opt_out_field_exists
    return true if opt_out_field.blank?
    klass = Object.const_get(record_type)
    return true if klass.method_defined?(opt_out_field)
    errors.add(:opt_out_field, I18n.t("errors.models.export_configuration.opt_out_field_does_not_exist"))
  end
end
