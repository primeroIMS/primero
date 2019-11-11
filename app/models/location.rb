class Location < ApplicationRecord

  include LocalizableJsonProperty
  include Configuration
  # include Memoizable

  # we should use `ENUMS`
  ADMIN_LEVELS = [0, 1, 2, 3, 4, 5]
  ADMIN_LEVEL_OUT_OF_RANGE = 100
  LIMIT_FOR_API = 200

  localize_properties :name, :placename

  attr_accessor :parent_id

  validates :admin_level, presence: { message: I18n.t("errors.models.location.admin_level_present") }, if: :is_top_level?
  validates :location_code, presence: { message: I18n.t("errors.models.location.code_present") },
                            uniqueness: { message: I18n.t("errors.models.location.unique_location_code") }
  validate :validate_placename_in_english

  before_validation :generate_hierarchy
  before_validation :set_name_from_hierarchy_placenames

  # Only top level locations' admin levels are editable
  # All other locations' admin levels are calculated based on their parent's admin level
  before_save :calculate_admin_level, unless: :is_top_level?
  after_save :update_descendants
  after_save :generate_location_files

  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }
  scope :by_ancestor, ->(parent_path) { where('hierarchy <@ ?', parent_path) }
  scope :by_parent, ->(parent_path) { where('hierarchy ~ ?', "#{parent_path}.*{1}") }

  def generate_location_files
    OptionsJob.set(wait_until: 5.minutes.from_now).perform_later unless OptionsQueueStats.jobs?
  end

  class << self
    #This class variables should only be set when loading location information in bulk
    #   Location.locations_by_code = Locations.all.map{|l|[l.location_code, l]}.to_h
    attr_accessor :locations_by_code

    alias :list_by_all :all

    #WARNING: Do not memoize this method.  Doing so will break the Location seeds.
    def get_by_location_code(location_code)
      if @locations_by_code.present?
        @locations_by_code[location_code]
      else
        Location.find_by(location_code: location_code) if location_code.present?
      end
    end

    #WARNING: Do not memoize this method.  Doing so will break the Location seeds.
    def fetch_by_location_codes(location_codes)
      if @locations_by_code.present?
        location_codes.map{|l| @locations_by_code[l]}
      else
        Location.where(location_code: location_codes).order(:admin_level)
      end.compact
    end

    def find_types_in_hierarchy(location_code, location_types)
      hierarchy = [location_code]
      hierarchy << Location.find_by(location_code: location_code).try(:hierarchy)
      Location.find_by(type: location_types, location_code: hierarchy.flatten.compact)
    end
    # memoize_in_prod :find_types_in_hierarchy

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for location fields
    def all_names(opts={})
      locale = opts[:locale].presence || I18n.locale
      enabled.map{|r| { id: r.location_code, display_text: r.name(locale) }.with_indifferent_access}
    end
    # memoize_in_prod :all_names

    def type_by_admin_level(admin_level = ADMIN_LEVELS.first)
      Location.where(admin_level: admin_level).pluck(:type).uniq
    end
    # memoize_in_prod :type_by_admin_level

    def find_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL)
      Location.enabled.where(admin_level: admin_level)
    end
    # memoize_in_prod :find_by_admin_level_enabled

    def find_names_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL, hierarchy_filter = nil, opts={})
      locale = opts[:locale].presence || I18n.locale
      #We need the fully qualified :: separated location name here so the reg_ex filter below will work
      location_names = Location.find_by_admin_level_enabled(admin_level).map{|r| {id: r.location_code, hierarchy: r.hierarchy, display_text: r.name(locale)}.with_indifferent_access}.sort_by!{|l| l['display_text']}
      hierarchy_set = hierarchy_filter.to_set if hierarchy_filter.present?
      location_names = location_names.select{|l| l['hierarchy'].present? && (l['hierarchy'].to_set ^ hierarchy_set).length == 0} if hierarchy_filter.present?
      #Now reduce the display text down to just the placename for display
      location_names.each {|l| l['display_text'] = l['display_text'].split('::').last}
      location_names
    end
    # memoize_in_prod :find_names_by_admin_level_enabled

    def ancestor_placename_by_name_and_admin_level(location_code, admin_level)
      return "" if location_code.blank? || ADMIN_LEVELS.exclude?(admin_level)
      lct = Location.find_by(location_code: location_code)
      if lct.present?
        (lct.admin_level == admin_level) ? lct.placename : lct.ancestor_by_admin_level(admin_level).try(:placename)
      else
        ""
      end
    end
    # memoize_in_prod :ancestor_placename_by_name_and_admin_level

    def display_text(location_code, opts={})
      locale = opts[:locale].presence || I18n.locale
      lct = (location_code.present? ? Location.find_by(location_code: location_code) : '')
      value = (lct.present? ? lct.name(locale) : '')
    end
    # memoize_in_prod :display_text

    def get_reporting_location(location)
      reporting_admin_level = SystemSettings.current.reporting_location_config.try(:admin_level) || ReportingLocation::DEFAULT_ADMIN_LEVEL
      if location.admin_level ==  reporting_admin_level
        location
      else
        location.ancestor_by_admin_level(reporting_admin_level)
      end
    end
    # memoize_in_prod :get_reporting_location

    def all_names_reporting_locations(opts={})
      admin_level = SystemSettings.current.reporting_location_config.try(:admin_level) || ReportingLocation::DEFAULT_ADMIN_LEVEL
      reporting_location_hierarchy_filter = SystemSettings.current.reporting_location_config.try(:hierarchy_filter) || nil
      locale = opts[:locale] || I18n.locale
      find_names_by_admin_level_enabled(admin_level, reporting_location_hierarchy_filter, { locale: locale })
    end

    # memoize_in_prod :all_names_reporting_locations

    #This allows us to use the property 'type' on Location, normally reserved by ActiveRecord
    def inheritance_column; 'type_inheritance'; end

    def each_slice(size=500, &block)
      all_locations = self.all
      pages = (all_locations.count / size.to_f).ceil
      (1..pages).each do |page|
        # this can be change to use `limit` and `offset`
        yield(all_locations.paginate(page: page, per_page: size))
      end
    end

    def list_by_enabled
      self.enabled(true)
    end

    def list_by_disabled
      self.enabled(false)
    end

  end

  def generate_hierarchy_placenames(locales)
    hierarchical_name = {}.with_indifferent_access
    locales.each {|locale| hierarchical_name[locale] = []}
    if self.hierarchy.present?
      locations = Location.fetch_by_location_codes(self.hierarchy.split('.')[0..-2])
      if locations.present?
        locations.each do |lct|
          locales.each {|locale| hierarchical_name[locale] << lct.send("placename_#{locale}")}
        end
      end
    end
    locales.each {|locale| hierarchical_name[locale] << self.send("placename_#{locale}")}
    hierarchical_name
  end

  def set_name_from_hierarchy_placenames
    locales = Primero::Application::locales
    name_hash = generate_hierarchy_placenames(locales)
    if name_hash.present?
      locales.each {|locale| self.send "name_#{locale}=", name_hash[locale].reject(&:blank?).join('::') }
    end
  end

  def calculate_admin_level
    parentLct = self.parent
    if parentLct.present?
      new_admin_level = ((parentLct.admin_level || 0) + 1)
      self.admin_level = (ADMIN_LEVELS.include? new_admin_level) ? new_admin_level : ADMIN_LEVEL_OUT_OF_RANGE
    end
  end

  def descendants
    descendants = Location.by_ancestor(self.hierarchy)
    descendants.present? ? descendants.select{ |d| d != self } : []
  end

  def direct_descendants
    # search for the old value of "hierarchy" because the "location_code" can change
    # if we search with the new value(of "hierarchy") will not return any child.
    hierarchy = self.attribute_before_last_save('hierarchy')
    hierarchy.present? ? Location.by_parent(hierarchy) : []
  end

  def location_codes_and_placenames
    ancestors.map{|lct| [lct.location_code, lct.placename]} << [self.location_code, self.placename]
  end

  def ancestors
    Location.where(location_code: self.hierarchy.split('.'))
  end

  def ancestor_by_admin_level(admin_level)
    Location.find_by(admin_level: admin_level, location_code: self.hierarchy.split('.'))
  end

  def ancestor_by_type(type)
    if self.type == type
      return self
    else
      response = self.ancestors.select{|lct| lct.type == type}
      return response.first
    end
  end

  def set_parent(parent)
    self.set_hierarchy_from_parent(parent)
    self.save
  end

  def set_hierarchy_from_parent(parent)
    self.hierarchy = (parent && parent.hierarchy.present? ? "#{parent.hierarchy}." : '')
    self.hierarchy << "#{self.location_code}"
  end

  def parent
    result = nil
    if self.hierarchy.present?
      @parent ||= Location.get_by_location_code(self.hierarchy.split('.')[-2])
      result = @parent
    end
    return result
  end

  def generate_hierarchy
    parent = self.parent_id.presence || self.parent
    a_parent = Location.find_by(id: parent)
    set_hierarchy_from_parent(a_parent)
  end

  def is_top_level?
    size_hierarchy = self.hierarchy.split('.').size
    size_hierarchy == 1
  end

  def admin_level_required?
    self.is_top_level? || self.new_record?
  end

  # HANDLE WITH CARE
  # If a top level location's admin level changes,
  # the admin level of all of its descendants must be recalculated
  # TODO this method should be refactor again when we will decide the way of hierachy should be done
  def update_descendants(is_parent = true)
    # Use a flag to avoid infinite loop
    unless is_parent
      self.calculate_admin_level unless is_top_level?
      self.set_name_from_hierarchy_placenames
      self.generate_hierarchy
      self.save! if  self.has_changes_to_save?
    end
    #Here be dragons...Beware... recursion!!!
    self.direct_descendants.map do |lct|
      lct.parent_id = self.id
      lct.update_descendants(false)
    end
  end

  def validate_placename_in_english
    return true if self.placename_en.present?
    errors.add(:placename, I18n.t("errors.models.location.name_present"))
    return false
  end

end
