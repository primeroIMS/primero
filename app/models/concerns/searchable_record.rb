module SearchableRecord
  extend ActiveSupport::Concern
  include Record
  include Searchable
  
  included do
    #Sunspot::Adapters::InstanceAdapter.register(DocumentInstanceAccessor, Child)
    #Sunspot::Adapters::DataAccessor.register(DocumentDataAccessor, Child)
  end
  
  module ClassMethods
    def build_solar_schema
      text_fields = build_text_fields_for_solar
      date_fields = build_date_fields_for_solar
      Sunspot.setup(self) do
        text *text_fields
        date *date_fields
        date_fields.each { |date_field| date date_field }
        boolean :duplicate
      end
    end
    
    def build_text_fields_for_solar
      ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name", "created_organisation"] + Field.all_searchable_field_names(self.parent_form)
    end
  
    def build_date_fields_for_solar
      ["created_at", "last_updated_at"]
    end
    
    def search_by_created_user(search, created_by, page_number = 1)
      created_by_criteria = [SearchCriteria.new(:field => "created_by", :value => created_by, :join => "AND")]
      search(search, page_number, created_by_criteria, created_by)
    end
  
    def search(search, page_number = 1, criteria = [], created_by = "")
      return [] unless search.valid?
      search_criteria = [SearchCriteria.new(:field => "short_id", :value => search.query)]
      search_criteria.concat([SearchCriteria.new(:field => self.search_field, :value => search.query, :join => "OR")]).concat(criteria)
      SearchService.search page_number, search_criteria, self
    end
    
    def schedule(scheduler)
      scheduler.every("24h") do
        self.reindex!
      end
    end
  end
  
end