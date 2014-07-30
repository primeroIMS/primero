module Searchable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable

    #TODO: Not sure how well this will work when the set of indexable fields changes with the form
    searchable do
      searchable_text_fields.each {|f| text f}
      searchable_date_fields.each {|f| date f}
      searchable_string_fields.each {|f| string f}
      boolean :duplicate
    end

    #TODO: Shouldn't this code go in an initializer?
    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self

    #after_create :index_record
    #after_update :index_record
    #after_save :index_record

  end


  def index_record
    #TODO: Experiment with getting rid of the solr schema rebuild on EVERY save.
    #      This should take place when the form sections change.
    begin
      #Rack::MiniProfiler.step("BUILD SOLR SCHEMA") do
      #self.class.refresh_in_sunspot
      #end
      #Rack::MiniProfiler.step("INDEX IN SUNSPOT") do
      Sunspot.index!(self)
      #end
    rescue
      Rails.logger.error "***Problem indexing record for searching, is SOLR running?"
    end
    true
  end


  module ClassMethods

    #Pull back all records from CouchDB that pass the filter criteria.
    #Searching, filtering, sorting, and pagination is handled by Solr.
    #TODO: The per_page default is really clunky! It shouldnt live where it lives!
    #TODO: This better avoid N+1!
    #TODO: Exclude duplicates I presume?
    #TODO: Possibly this method is a useless wrapper around the Sunspot search. Delete and refactor if so.
    def list_records(filters={}, sort={:created_at => :desc}, pagination={}, owner=nil)
      self.search do
        filters.each{|filter,value| with(filter, value)} if filters.present?
        with(:created_by, owner) if owner.present?
        sort.each{|sort,order| order_by(sort, order)}
        paginate pagination
      end
    end

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
      puts "REFRESH IN SUNSPOT"
      text_fields = searchable_text_fields
      date_fields = searchable_date_fields
      Sunspot.setup(self) do
        text *text_fields
        date *date_fields
        date_fields.each { |date_field| date date_field }
        boolean :duplicate
      end
    end

    #TODO: Move to case/incident?
    def searchable_text_fields
      ["unique_identifier", "short_id",
       "created_by", "created_by_full_name",
       "last_updated_by", "last_updated_by_full_name",
       "created_organisation"] + Field.all_searchable_field_names(self.parent_form)
    end

    #TODO: Move to case/incident?
    def searchable_date_fields
      ["created_at", "last_updated_at"]
    end

    def searchable_string_fields
      ["unique_identifier", "short_id",
       "created_by", "created_by_full_name",
       "last_updated_by", "last_updated_by_full_name",
       "created_organisation"] + Field.all_filterable_field_names(self.parent_form)
    end




    #TODO: This is only used in the controllers/concerns/searching_for_records which itself is never invoked.
    def search_by_created_user(search, created_by, page_number = 1)
      created_by_criteria = [SearchCriteria.new(:field => "created_by", :value => created_by, :join => "AND")]
      search(search, page_number, created_by_criteria, created_by)
    end

    #  #TODO: This is only used in the controllers/concerns/searching_for_records which itself is never invoked.
    # def search(search, page_number = 1, criteria = [], created_by = "")
    #   return [] unless search.valid?
    #   search_criteria = [SearchCriteria.new(:field => "short_id", :value => search.query)]
    #   search_criteria.concat([SearchCriteria.new(:field => self.search_field, :value => search.query, :join => "OR")]).concat(criteria)
    #   SearchService.search page_number, search_criteria, self
    # end


    #TODO: Why is this method on the model at all?
    def schedule(scheduler)
      scheduler.every("24h") do
        self.reindex!
      end
    end

  end

  #TODO: Shouldnt this code go in a lib or an initializer?
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

    def load_all(ids)
      @clazz.all(:keys => ids).all
    end
  end


end
