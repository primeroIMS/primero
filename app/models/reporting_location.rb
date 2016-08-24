class ReportingLocation
  include CouchRest::Model::CastedModel

  property :field_key
  property :label_key
  property :admin_level, Integer, :default => 0

  validate :validate_label_key

  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_LABEL_KEY = 'district'
  DEFAULT_ADMIN_LEVEL = 2

  def validate_label_key
    if Location::BASE_TYPES.include? self.label_key
      true
    else
      errors.add(:label_key, I18n.t("errors.models.reporting_location.label_key"))
      false
    end
  end
end