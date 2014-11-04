class Location < CouchRest::Model::Base

  use_database :location

  include PrimeroModel
  include Namable

  BASE_TYPES = ['country', 'region', 'province', 'county', 'state', 'city', 'camp', 'site' 'village', 'zone', 'other']

  property :placename #This is the individual placename
  property :type
  property :hierarchy, type: [String]
  property :hierarchical_name, read_only: true

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
    extend Memoist

    def find_by_location(placename)
      #TODO: For now this makes the bold assumption that high-level locations are uniqueish.
      location = Location.by_placename(key: placename).all[0..0]
      return location + location.first.descendants
    end
    memoize :find_by_location

    def placename_from_name(name)
      result = ""
      result = name.split('::').last if name.present?
      return result
    end
    memoize :placename_from_name
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

  def parent
    result = nil
    if self.hierarchy.present?
      result = Location.by_placename(self.hierarchy.last)
    end
    return result
  end

  def remove_parent
    self.set_parent nil
  end
end
