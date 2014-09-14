class Location < CouchRest::Model::Base

  use_database :location

  include RapidFTR::Model


  BASE_TYPES = ['country', 'region', 'province', 'county', 'state', 'city', 'camp', 'site' 'village', 'zone', 'other']

  property :name
  property :type #TODO: what types do we have? Do we even need to specify?
  #TODO: This is the somewhat generalized version of the user/manager code. We may need to refactor into a hierarchical concern.
  property :hierarchy, type: [String]

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
    view :by_name
  end


  def self.find_by_location(name)
    #TODO: Forn now this makes the bold assumption that high-level locations are uniqueish.
    location = Location.by_name(key: name).all[0..0]
    return location + location.first.descendants
  end

  def hierarchical_name
    if self.hierarchy.present?
      self.hierarchy + [self.name]
    else
      [self.name]
    end
  end

  def descendants
    response = Location.by_parent(key: self.name)
    response = response.present? ? response.all : []
    return response
  end

  def set_parent(parent)
    #Figure out the new hierarchy
    hierarchy_of_parent = (parent && parent.hierarchy.present? ? parent.hierarchy : [])
    new_hierarchy = hierarchy_of_parent
    if parent
      new_hierarchy << parent.name
    end

    #Update the hierarchies of all descendants
    subtree = descendants + [self]
    subtree.each do |node|
      old_hierarchy = node.hierarchy
      index_of_self = old_hierarchy.find_index(self.name) || old_hierarchy.length
      node.hierarchy = new_hierarchy +
        old_hierarchy.slice(index_of_self, old_hierarchy.length - index_of_self)
      node.save
    end
  end

  def parent
    result = nil
    if self.hierarchy.present?
      result = Location.by_name(self.hierarchy.last)
    end
    return result
  end

  def remove_parent
    self.set_parent nil
  end


end