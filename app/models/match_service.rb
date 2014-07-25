#TODO: Get rid of this. All search functionality will be in models/concerns/searchable.rb
#      This will need to be refactored when we refactor the enquiry

class MatchService

  def self.search_for_matching_children(criteria)
    query = MatchCriteria.dismax_query(criteria)
    Child.sunspot_matches(query)
  end

end