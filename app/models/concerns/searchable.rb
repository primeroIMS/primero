module Searchable
  extend ActiveSupport::Concern

  included do
    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self

    after_create :index_record
    after_update :index_record
    after_save :index_record

  end


  def index_record
    #TODO: Experiment with getting rid of the solr schema rebuild on EVERY save.
    #      This should take place when the forerm sections change.
    begin
      Rack::MiniProfiler.step("BUILD SOLR SCHEMA") do
      self.class.refresh_in_sunspot
      end
      #Rack::MiniProfiler.step("INDEX IN SUNSPOT") do
      Sunspot.index!(self)
      #end
    rescue
      Rails.logger.error "***Problem indexing record for searching, is SOLR running?"
    end
    true
  end


  module ClassMethods

    #TODO: Convert this to the `search` method (unless there is already a Sunspot like this). Ditch!
    def sunspot_search(page_number, query = "")
      self.refresh_in_sunspot
      #TODO: Whoa! This is a potential infinite loop, yes?
      begin
        return paginated_and_full_results(page_number, query)
      rescue
        self.reindex!
        Sunspot.commit
        return paginated_and_full_results(page_number, query)
      end

    end

    #TODO: ditch along with sunspot_search above
    def paginated_and_full_results(page_number, query)
      full_result = []
      get_search(nil, query).hits.each do |hit|
        full_result.push hit.to_param
      end
      return get_search(page_number, query).results, full_result
    end

    #TODO: Need to delve into whether we keep this method as is, or ditch the schema rebuild.
    def reindex!
      self.refresh_in_sunspot
      Sunspot.remove_all(self)
      self.all.each { |record| Sunspot.index!(record) }
    end

    #TODO: ditch along with sunspot_search above
    def get_search(page_number, query)
      response = Sunspot.search(self) do |q|
        q.fulltext(query)
        q.without(:duplicate, true)
        if page_number
          q.paginate :page => page_number, :per_page => ::ChildrenHelper::View::PER_PAGE
        else
          q.paginate :per_page => ::ChildrenHelper::View::MAX_PER_PAGE
        end
        q.adjust_solr_params do |params|
          params[:defType] = "lucene"
          params[:qf] = nil
        end
      end
      response
    end


    #TODO: ditch
    def sunspot_matches(query = "")
      self.refresh_in_sunspot
       #TODO: Whoa! This is a potential infinite loop, yes?
      begin
        return get_matches(query).results
      rescue
        self.reindex!
        Sunspot.commit
        return get_matches(query).results
      end
    end


    #TODO: ditch with sunspot_matches above
    def get_matches(criteria)
      Sunspot.search(self) do
        fulltext(criteria, :minimum_match => 1)
        adjust_solr_params do |params|
          params[:defType] = "dismax"
        end
      end
    end

    #TODO: What is going on with that date_fields loop?
    #Refreshes Sunspot to index this class correctly after new field definitions were added.
    def refresh_in_sunspot
      text_fields = build_text_fields_for_solar
      date_fields = build_date_fields_for_solar
      Sunspot.setup(self) do
        text *text_fields
        date *date_fields
        date_fields.each { |date_field| date date_field }
        boolean :duplicate
      end
    end

    #TODO: Move to case/incident?
    def build_text_fields_for_solar
      ["unique_identifier", "short_id", "created_by", "created_by_full_name", "last_updated_by", "last_updated_by_full_name", "created_organisation"] + Field.all_searchable_field_names(self.parent_form)
    end

    #TODO: Move to case/incident?
    def build_date_fields_for_solar
      ["created_at", "last_updated_at"]
    end


    #TODO: This is only used in the controllers/concerns/searching_for_records which itself is never invoked.
    def search_by_created_user(search, created_by, page_number = 1)
      created_by_criteria = [SearchCriteria.new(:field => "created_by", :value => created_by, :join => "AND")]
      search(search, page_number, created_by_criteria, created_by)
    end

     #TODO: This is only used in the controllers/concerns/searching_for_records which itself is never invoked.
    def search(search, page_number = 1, criteria = [], created_by = "")
      return [] unless search.valid?
      search_criteria = [SearchCriteria.new(:field => "short_id", :value => search.query)]
      search_criteria.concat([SearchCriteria.new(:field => self.search_field, :value => search.query, :join => "OR")]).concat(criteria)
      SearchService.search page_number, search_criteria, self
    end


    #TODO: Why is this method on the model at all?
    def schedule(scheduler)
      scheduler.every("24h") do
        self.reindex!
      end
    end

  end

  #Class for allowing Sunspot to hook into CouchDB and pull back the entire CouchDB document
  class DocumentInstanceAccessor < Sunspot::Adapters::InstanceAdapter
    def id
      @instance.id
    end
  end

  #Class for allowing Sunspot to hook into CouchDB and pull back the entire CouchDB document
  class DocumentDataAccessor < Sunspot::Adapters::DataAccessor
    def load(id)
      @clazz.get(id)
    end
  end

end
