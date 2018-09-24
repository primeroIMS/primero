class ExportConfiguration < CouchRest::Model::Base
  use_database :export_configuration

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  localize_properties [:name]
  property :export_id
  property :property_keys, :type => [String]
  property :record_type, :default => 'Child'    # Child, TracingRequest, or Incident
  property :opt_out_field     # Field on the Record that indicates if the individual wants to opt out of sharing info in the export
  property :property_keys_opt_out, :type => [String] # Only these fields will export if individual opts out
  property :duplicate_export_field, :type => String

  validate :valid_record_type
  validate :opt_out_field_exists

  design do
    view :by_export_id
  end

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