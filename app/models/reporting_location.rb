class ReportingLocation < ValueObject

  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_LABEL_KEY = 'district'
  DEFAULT_ADMIN_LEVEL = 2

  attr_accessor :field_key, :label_key, :admin_level, :reg_ex_filter, :hierarchy_filter

  def initialize(args={})
    super(args)
    self.admin_level ||= 0
    self.hierarchy_filter ||= []
  end

  def default_label_key
    if self.label_key.blank?
      self.label_key = ReportingLocation::DEFAULT_LABEL_KEY
    end
  end

  def is_valid_admin_level?
    Location::ADMIN_LEVELS.include?(self.admin_level) ? true : false
  end

end
