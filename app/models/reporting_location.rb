class ReportingLocation
  include CouchRest::Model::CastedModel

  property :field_key
  property :label_key
  property :admin_level, Integer, :default => 0
  property :reg_ex_filter

  before_save :set_default_label_key
  validate :validate_admin_level

  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_LABEL_KEY = 'district'
  DEFAULT_ADMIN_LEVEL = 2

  def set_default_label_key
    self.label_key = DEFAULT_LABEL_KEY if self.label_key.blank?
  end

  def validate_admin_level
    if Location::ADMIN_LEVELS.include? self.admin_level
      true
    else
      errors.add(:admin_level, I18n.t("errors.models.reporting_location.admin_level"))
      false
    end
  end
end