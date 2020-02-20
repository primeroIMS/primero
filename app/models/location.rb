class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Namable
  include Memoizable
  include Disableable

  #TODO - I18n
  BASE_TYPES = ['country', 'region', 'province', 'district', 'governorate', 'chiefdom', 'county', 'state', 'city', 'camp', 'site', 'village', 'zone', 'other', 'locality', 'sub-district', 'cercle', 'commune', 'territory', 'collectivity', 'department', 'municipality' ]
  ADMIN_LEVELS = [0, 1, 2, 3, 4, 5]
  ADMIN_LEVEL_OUT_OF_RANGE = 100

  property :placename #This is the individual placename
  property :location_code
  property :type
  property :hierarchy, type: [String]
  property :hierarchical_name, read_only: true
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

    view :by_type_enabled,
         :map => "function(doc) {
                if (doc.hasOwnProperty('type') && (!doc.hasOwnProperty('disabled') || !doc['disabled'])) {
                  emit(doc['type'], null);
                }
              }"

    view :by_admin_level_enabled,
         :map => "function(doc) {
                if (doc.hasOwnProperty('admin_level') && (!doc.hasOwnProperty('disabled') || !doc['disabled'])) {
                  emit(doc['admin_level'], null);
                }
              }"

    view :by_type
    view :by_placename
    view :by_hierarchy
    view :by_admin_level
    view :by_admin_level_and_name
  end

  validates_presence_of :placename, :message => I18n.t("errors.models.#{self.name.underscore}.name_present")
  validates_presence_of :admin_level, :message => I18n.t("errors.models.location.admin_level_present"), :if => :admin_level_required?
  #TODO - add this validation back after seeds are cleaned up
  #       currently only the Sierra Leone location seed has location_code
  #       none of the other location seeds have location_code
  # NOTE that commenting this out causes rspec test related to requiring location_code to fail
  #validates_presence_of :location_code, :message => I18n.t("errors.models.#{self.name.underscore}.code_present")


  before_save do
    self.name = self.hierarchical_name
  end

  # Only top level locations' admin levels are editable
  # All other locations' admin levels are calculated based on their parent's admin level
  before_save :calculate_admin_level, unless: :is_top_level?
  after_save :update_descendants_admin_level, if: :is_top_level?

  def self.get_unique_instance(attributes)
    by_name(key: attributes['name']).first
  end

  # Override Namable concern.
  # Allow CouchDB to set the Location's ID as a GUID
  def generate_id
    true
  end

  def name
    self.hierarchical_name
  end

  class << self
    alias :old_all :all
    alias :by_all :all

    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all

    def find_by_location(placename)
      #TODO: For now this makes the bold assumption that high-level locations are uniqueish.
      location = Location.by_placename(key: placename).all[0..0]
      if location.present?
        return location + location.first.descendants
      end
    end
    memoize_in_prod :find_by_location

    def placenames_from_name(name)
      return [] unless name.present?
      name.split('::')
    end

    def placename_from_name(name)
      placenames_from_name(name).last || ""
    end
    memoize_in_prod :placename_from_name

    def get_by_location(placename)
      #TODO: For now this makes the bold assumption that high-level locations are uniqueish.
      location = Location.by_placename(key: placename).all[0..0]
      return location.first
    end
    memoize_in_prod :get_by_location

    def find_by_placenames(placenames)
      by_placename(keys: placenames)
    end
    memoize_in_prod :find_by_placenames

    # Produce the location that matches a given type from the hierarchy of the given location.
    # If multiple types are included, returns the first matched types
    # TODO: This method is fairly specific to the IR exporter.
    #       Is there a more generic way of expressing this? Is there a need?
    #       Don't really want to stick this on the instance to avoid the extra DB call.
    def find_types_in_hierarchy(name, types)
      placenames = placenames_from_name(name)
      locations = find_by_placenames(placenames)
      result = []
      types.each do |type|
        result = locations.select{|loc| loc.type == type}
        break if result
      end
      return result.last
    end
    memoize_in_prod :find_types_in_hierarchy

    def all_names
      self.by_enabled.map{|r| r.name}
    end
    memoize_in_prod :all_names

    def all_top_level_ancestors
      response = self.by_hierarchy(key: [])
      response.present? ? response.all : []
    end

    def find_by_names(location_names = [])
      response = Location.by_name(keys: location_names)
      response.present? ? response.all : []
    end
    memoize_in_prod :find_by_names

    def type_by_admin_level(admin_level = 0)
      Location.by_admin_level(key: admin_level).all.map{|l| l.type}.uniq
    end
    memoize_in_prod :type_by_admin_level

    def find_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL)
      response = Location.by_admin_level_enabled(key: admin_level)
      response.present? ? response.all : []
    end
    memoize_in_prod :find_by_admin_level_enabled

    def find_names_by_admin_level_enabled(admin_level = ReportingLocation::DEFAULT_ADMIN_LEVEL, reg_ex_filter = nil)
      location_names = Location.find_by_admin_level_enabled(admin_level).map{|loc| loc.name}.sort
      location_names = location_names.select{|l| l =~ Regexp.new(reg_ex_filter)} if reg_ex_filter.present?
      location_names
    end
    memoize_in_prod :find_names_by_admin_level_enabled

    #find_by_name defined in namable concern
    memoize_in_prod :find_by_name

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

    def find_by_admin_level_and_names(admin_level, names)
      Location.by_admin_level_and_name(keys: names.map{|l| [admin_level, l]})
    end
    memoize_in_prod :find_by_admin_level_and_names

  end

  def hierarchical_name
    if self.hierarchy.present?
      self.hierarchy + [self.placename]
    else
      [self.placename]
    end.join('::')
  end

  def calculate_admin_level
    parentLct = self.parent
    if parentLct.present?
      new_admin_level = ((parentLct.admin_level || 0) + 1)
      self.admin_level = (ADMIN_LEVELS.include? new_admin_level) ? new_admin_level : ADMIN_LEVEL_OUT_OF_RANGE
    end
  end

  def descendants
    response = Location.by_ancestor(key: self.placename)
    response.present? ? response.all : []
  end

  def direct_descendants
    response = Location.by_parent(key: self.placename)
    response.present? ? response.all : []
  end

  def ancestor_names
    ancestor_list = []

    self.hierarchy.each_with_index {|item, index|
      if index == 0
        ancestor_list[index] = item
      else
        ancestor_list[index] = "#{ancestor_list[index-1]}::#{item}"
      end
    }
    return ancestor_list
  end

  def ancestors
    Location.find_by_names(self.ancestor_names)
  end

  def ancestor_by_admin_level(admin_level)
    Location.find_by_admin_level_and_names(admin_level, self.ancestor_names).first
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
      new_hierarchy << parent.placename
    end

    #Update the hierarchies of all descendants
    subtree = descendants + [self]
    subtree.each do |node|
      old_hierarchy = node.hierarchy
      index_of_self = old_hierarchy.find_index(self.placename) || old_hierarchy.length
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
      self.hierarchy << parent.placename
    end
  end

  def parent
    result = nil
    if self.hierarchy.present?
      result = Location.get_by_location(self.hierarchy.last)
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
  def update_descendants_admin_level
    unless is_top_level?
      self.calculate_admin_level
      self.save!
    end

    #Here be dragons...Beware... recursion!!!
    self.direct_descendants.each {|lct| lct.update_descendants_admin_level}
  end
end
