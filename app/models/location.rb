class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Memoizable
  include Disableable
  include LocalizableProperty

  #TODO - I18n - YES!!!! - possible as a lookup
  ADMIN_LEVELS = [0, 1, 2, 3, 4, 5]
  ADMIN_LEVEL_OUT_OF_RANGE = 100
  LIMIT_FOR_API = 200

  localize_properties [:name, :placename]
  property :location_code

  #TODO - i18n  - Need translation of some sort
  property :type
  property :hierarchy, type: [String]
  property :admin_level, Integer
  attr_accessor :parent_id

  design do
    view :by_ancestor,
            :map => "function(doc) {
              if (doc['couchrest-type'] == 'Location' && doc['hierarchy']){
                for(var i in doc['hierarchy']){
                  emit(doc['hierarchy'][i], null);
                }
              }
            }"

    view :by_parent,
         :map => "function(doc) {
              if (doc['couchrest-type'] == 'Location' && doc['hierarchy']){
                var i = doc['hierarchy'].length - 1;
                emit(doc['hierarchy'][i], null);
              }
            }"

    #Emit the hierarchy in the values to enable some more efficient lookups
    view :by_location_code,
         :map => "function(doc) {
                if (doc.hasOwnProperty('location_code')) {
                  emit(doc['location_code'], doc['hierarchy']);
                }
              }"

    view :by_hierarchy
    view :by_admin_level
    view :by_admin_level_and_location_code
    view :by_admin_level_and_disabled
    view :by_location_code_and_type
    view :by_type_and_disabled
  end

  validates_presence_of :placename, :message => I18n.t("errors.models.location.name_present")
  validates_presence_of :admin_level, :message => I18n.t("errors.models.location.admin_level_present"), :if => :admin_level_required?
  validates_presence_of :location_code, :message => I18n.t("errors.models.location.code_present")
  validate :is_location_code_unique

  before_validation :set_name_from_hierarchy_placenames

  # Only top level locations' admin levels are editable
  # All other locations' admin levels are calculated based on their parent's admin level
  before_save :calculate_admin_level, unless: :is_top_level?
  after_save :update_descendants

  def is_location_code_unique
    named_object = Location.get_by_location_code(self.location_code)
    return true if named_object.nil? or self.id == named_object.id
    errors.add(:name, I18n.t("errors.models.location.unique_location_code"))
  end

  class << self
    alias :old_all :all
    alias :by_all :all
    alias :list_by_all :all

    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all
    memoize_in_prod :list_by_all

    #WARNING: Do not memoize this method.  Doing so will break the Location seeds.
    def get_by_location_code(location_code)
      Location.by_location_code(key: location_code).first
    end

    #TODO not sure this should return 'first' but trying to keep with original
    def find_types_in_hierarchy(location_code, location_types)
      hierarchy = Location.by_location_code(key: location_code).values.flatten + [location_code]
      keyz = []
      location_types.each{|t| keyz += hierarchy.map{|h| [h, t]}}
      Location.by_location_code_and_type(keys: keyz).first
    end
    memoize_in_prod :find_types_in_hierarchy

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for location fields
    def all_names
      self.by_disabled(key: false).map{|r| {id: r.location_code, display_text: r.name}.with_indifferent_access}
    end
    memoize_in_prod :all_names

    def find_by_location_code(location_code = "")
      Location.by_location_code(key: location_code).first
    end
    memoize_in_prod :find_by_location_code

    def find_by_location_codes(location_codes = [])
      response = Location.by_location_code(keys: location_codes)
      response.present? ? response.all : []
    end
    memoize_in_prod :find_by_location_codes

    def type_by_admin_level(admin_level = 0)
      Location.by_admin_level(key: admin_level).all.map{|l| l.type}.uniq
    end
    memoize_in_prod :type_by_admin_level

    def find_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL)
      response = Location.by_admin_level_and_disabled(key: [admin_level, false])
      response.present? ? response.all : []
    end
    memoize_in_prod :find_by_admin_level_enabled

    def find_names_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL, reg_ex_filter = nil)
      location_names = Location.find_by_admin_level_enabled(admin_level).map{|r| {id: r.location_code, display_text: r.placename}.with_indifferent_access}.sort_by!{|l| l['display_text']}
      location_names = location_names.select{|l| l['display_text'] =~ Regexp.new(reg_ex_filter)} if reg_ex_filter.present?
      location_names
    end
    memoize_in_prod :find_names_by_admin_level_enabled

    def find_by_type_and_hierarchy(type, hierarchy=[])
      type_and_disabled= [type, false]
      find_by_type = Location.by_type_and_disabled(key: type_and_disabled)
      find_by_type.select{|location| location[:hierarchy]==hierarchy}.sort_by!{ |m| m.placename.downcase }
    end

    def ancestor_placename_by_name_and_admin_level(location_name, admin_level)
      return "" if location_name.blank? || ADMIN_LEVELS.exclude?(admin_level)
      lct = Location.by_name(key: location_name).first
      if lct.present?
        (lct.admin_level == admin_level) ? lct.placename : lct.ancestor_by_admin_level(admin_level).try(:placename)
      else
        ""
      end
    end
    memoize_in_prod :ancestor_placename_by_name_and_admin_level

    def find_by_admin_level_and_location_codes(admin_level, location_codes)
      Location.by_admin_level_and_location_code(keys: location_codes.map{|l| [admin_level, l]})
    end
    memoize_in_prod :find_by_admin_level_and_location_codes

    def base_type_ids
      lookup_values = Lookup.get_location_types.try(:lookup_values)
      base_type_ids = (lookup_values.present? ? lookup_values.map{|lv| lv['id'] } : [])
    end
    memoize_in_prod :base_type_ids

    def display_text(location_code)
      lct = Location.find_by_location_code(location_code)
      value = (lct.present? ? lct.name : '')
    end
    memoize_in_prod :display_text

  end

  def generate_hierarchy_placenames
    hierarchical_name = {}.with_indifferent_access
    Primero::Application::locales.each {|locale| hierarchical_name[locale] = []}

    if self.hierarchy.present?
      self.hierarchy.each do |lct_code|
        lct = Location.get_by_location_code(lct_code)
        if lct.present?
          Primero::Application::locales.each {|locale| hierarchical_name[locale] << lct.send("placename_#{locale}")}
        end
      end
    end
    Primero::Application::locales.each {|locale| hierarchical_name[locale] << self.send("placename_#{locale}")}
    hierarchical_name
  end

  def set_name_from_hierarchy_placenames
    name_hash = generate_hierarchy_placenames
    if name_hash.present?
      Primero::Application::locales.each {|locale| self.send "name_#{locale}=", name_hash[locale].reject(&:blank?).join('::') }
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
    response = Location.by_ancestor(key: self.location_code)
    response.present? ? response.all : []
  end

  def direct_descendants
    response = Location.by_parent(key: self.location_code)
    response.present? ? response.all : []
  end

  def ancestors
    Location.find_by_location_codes(self.hierarchy)
  end

  def ancestor_by_admin_level(admin_level)
    Location.find_by_admin_level_and_location_codes(admin_level, self.hierarchy).first
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
    #Figure out the new hierarchy
    hierarchy_of_parent = (parent && parent.hierarchy.present? ? parent.hierarchy : [])
    new_hierarchy = hierarchy_of_parent
    if parent
      new_hierarchy << parent.location_code
    end

    #Update the hierarchies of all descendants
    subtree = descendants + [self]
    subtree.each do |node|
      old_hierarchy = node.hierarchy
      index_of_self = old_hierarchy.find_index(self.location_code) || old_hierarchy.length
      node.hierarchy = new_hierarchy +
        old_hierarchy.slice(index_of_self, old_hierarchy.length - index_of_self)
      node.save
    end
  end

  def set_hierarchy_from_parent(parent)
    #Figure out the new hierarchy
    hierarchy_of_parent = (parent && parent.hierarchy.present? ? parent.hierarchy : [])
    self.hierarchy = hierarchy_of_parent
    if parent
      self.hierarchy << parent.location_code
    end
  end

  def parent
    result = nil
    if self.hierarchy.present?
      result = Location.get_by_location_code(self.hierarchy.last)
    end
    return result
  end

  def remove_parent
    self.set_parent nil
  end

  def generate_hierarchy
    if self.parent_id.present?
      a_parent = Location.get(self.parent_id)
      set_hierarchy_from_parent(a_parent) if a_parent.present?
    end
  end

  def update_hierarchy
    if self.parent_id.present?
      a_parent = Location.get(self.parent_id)
      set_parent(a_parent) if a_parent.present?
    end
  end

  def is_top_level?
    self.hierarchy.blank?
  end
  alias_method :admin_level_required?, :is_top_level?

  # HANDLE WITH CARE
  # If a top level location's admin level changes,
  # the admin level of all of its descendants must be recalculated
  def update_descendants
    self.calculate_admin_level unless is_top_level?
    self.set_name_from_hierarchy_placenames
    self.save!

    #Here be dragons...Beware... recursion!!!
    self.direct_descendants.each {|lct| lct.update_descendants}
  end
end
