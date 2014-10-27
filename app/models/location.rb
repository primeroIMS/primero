class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Namable

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
                var index = doc['hierarchy'].length - 1
                emit(doc['hierarchy'][index], null);
              }
            }"
    view :by_type
    view :by_placename
  end

  # "before_validation" is necessary here to ensure these are executed before the validations and the "before_save" in the Namable concern
  before_validation :generate_hierarchy, :generate_name
  after_save :update_hierarchy_of_descendants, on: :update

  def name
    self.hierarchical_name
  end

  def self.find_by_location(placename)
    #TODO: For now this makes the bold assumption that high-level locations are uniqueish.
    location = Location.by_placename(key: placename).all[0..0]
    return location + location.first.descendants
  end

  def self.placename_from_name(name)
    result = ""
    result = name.split('::').last if name.present?
    return result
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
      result = Location.by_placename(self.hierarchy.last)
    end
    return result
  end

  def remove_parent
    self.set_hierarchy_from_parent nil
  end

  private

  def generate_hierarchy
    if self.parent_id.present?
      a_parent = Location.get(self.parent_id)
      set_hierarchy_from_parent(a_parent) if a_parent.present?
    end
  end

  def generate_name
    self.name = self.hierarchical_name
  end

  def update_hierarchy_of_descendants
    subtree = descendants
    subtree.each do |descendant|
      descendant.set_hierarchy_from_parent(self)
      descendant.save
    end
  end
end
