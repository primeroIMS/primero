class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Namable
  include Memoizable

  BASE_TYPES = ['country', 'region', 'province', 'county', 'state', 'city', 'camp', 'site' 'village', 'zone', 'other']

  property :placename #This is the individual placename
  property :type
  property :hierarchy, type: [String]
  property :hierarchical_name, read_only: true
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
    view :by_type
    view :by_placename
  end

  before_save do
    self.name = self.hierarchical_name
  end

  def name
    self.hierarchical_name
  end

  class << self
    alias :old_all :all

    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all

    def find_by_location(placename)
      #TODO: For now this makes the bold assumption that high-level locations are uniqueish.
      location = Location.by_placename(key: placename).all[0..0]
      return location + location.first.descendants
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
    memoize_in_prod :find_type_in_hierarchy

  end

  def hierarchical_name
    if self.hierarchy.present?
      self.hierarchy + [self.placename]
    else
      [self.placename]
    end.join('::')
  end

  def descendants
    response = Location.by_parent(key: self.placename)
    response = response.present? ? response.all : []
    return response
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
