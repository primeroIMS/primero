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
end
