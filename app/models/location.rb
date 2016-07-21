class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Namable
  include Memoizable
  include Disableable

  #TODO - I18n
  BASE_TYPES = ['country', 'region', 'province', 'district', 'chiefdom', 'county', 'state', 'city', 'camp', 'site', 'village', 'zone', 'other']
  ADMIN_LEVELS = [0, 1, 2, 3, 4, 5]

  property :placename #This is the individual placename
  property :location_code
  property :type
  property :hierarchy, type: [String]
  property :hierarchical_name, read_only: true
  property :admin_level, Integer
  attr_accessor :parent_id


  design do
    view :by_parent,
            :map => "function(doc) {
              if (doc['couchrest-type'] == 'Location' && doc['hierarchy']){
                for(var i in doc['hierarchy']){
                  emit(doc['hierarchy'][i], null);
                }
              }
            }"

    view :by_type_enabled,
         :map => "function(doc) {
                if (doc.hasOwnProperty('type') && (!doc.hasOwnProperty('disabled') || !doc['disabled'])) {
                  emit(doc['type'], null);
                }
              }"

    view :by_type
    view :by_placename
  end

  validates_presence_of :placename, :message => I18n.t("errors.models.#{self.name.underscore}.name_present")
  #TODO - add this validation back after seeds are cleaned up
  #       currently only the Sierra Leone location seed has location_code
  #       none of the other location seeds have location_code
  # NOTE that commenting this out causes rspec test related to requiring location_code to fail
  #validates_presence_of :location_code, :message => I18n.t("errors.models.#{self.name.underscore}.code_present")

  before_save :calculate_admin_level
  before_save do
    self.name = self.hierarchical_name
  end

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

    def ancestor_name_by_type(location, admin_type)
      location = Location.placename_from_name(location)
      location_obj = Location.find_by_location(location)
      ancestor = location_obj.present? ? location_obj.first.ancestor_by_type(admin_type) : nil
      return ancestor.present? ? ancestor.placename : nil
    end

  end

  def hierarchical_name
    if self.hierarchy.present?
      self.hierarchy + [self.placename]
    else
      [self.placename]
    end.join('::')
  end

  #TODO - need rspec tests for all of this!!!
  def calculate_admin_level
    parentLct = self.parent
    self.admin_level = ((parentLct.admin_level || 0) + 1) if parentLct.present?
  end

  def descendants
    response = Location.by_parent(key: self.placename)
    response = response.present? ? response.all : []
    return response
  end

  def ancestor_names
    ancestors = []

    self.hierarchy.each_with_index {|item, index|
      if index == 0
        ancestors[index] = item
      else
        ancestors[index] = "#{ancestors[index-1]}::#{item}"
      end
    }
    return ancestors
  end

  def ancestors
    response = Location.by_name(keys: self.ancestor_names)
    response = response.present? ? response.all : []
    return response
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
end
