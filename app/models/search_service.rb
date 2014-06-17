class SearchService

  def self.search(page_number, criteria_list, searchClass = Child)
    query = SearchCriteria.lucene_query(criteria_list)
    searchClass.sunspot_search(page_number, query)
  end


end
