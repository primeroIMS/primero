#TODO: Get rid of this. All search functionality will be in models/concerns/searchable.rb

class SearchService

  def self.search(page_number, criteria_list, searchClass = Child)
    query = SearchCriteria.lucene_query(criteria_list)
    searchClass.sunspot_search(page_number, query)
  end


end
