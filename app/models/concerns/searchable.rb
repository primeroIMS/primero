module Searchable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable

    #TODO: Not sure how well this will work when the set of indexable fields changes with the form
    searchable do
      searchable_text_fields.each {|f| text f}
      searchable_text_fields.each {|f| string f}
      searchable_date_fields.each {|f| date f}
      searchable_string_fields.each {|f| string f}
      searchable_multi_fields.each {|f| string f, multiple: true}
      boolean :duplicate
      boolean :flag
    end

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
  end


  #TODO: Remove this, once we have satisied that its not neccessary to refresh Sunspot with every save
  def index_record
    #TODO: Experiment with getting rid of the solr schema rebuild on EVERY save.
    #      This should take place when the form sections change.
    begin
      #self.class.refresh_in_sunspot
      Sunspot.index!(self)
    rescue
      Rails.logger.error "***Problem indexing record for searching, is SOLR running?"
    end
    true
  end


  module ClassMethods

    #Pull back all records from CouchDB that pass the filter criteria.
    #Searching, filtering, sorting, and pagination is handled by Solr.
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

    #TODO: Need to delve into whether we keep this method as is, or ditch the schema rebuild.
    #      Currently nothing calls this?
    def reindex!
      self.refresh_in_sunspot
      Sunspot.remove_all(self)
      self.all.each { |record| Sunspot.index!(record) }
    end


    #TODO: What is going on with that date_fields loop?
    #Refreshes Sunspot to index this class correctly after new field definitions were added.
    #TODO: We should probably just get rid of this, or attach to a form rebuild
    def refresh_in_sunspot
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

    #TODO: Move to case/incident?
    def searchable_string_fields
      ["unique_identifier", "short_id",
       "created_by", "created_by_full_name",
       "last_updated_by", "last_updated_by_full_name",
       "created_organisation"] + Field.all_filterable_field_names(self.parent_form)
    end

    def searchable_multi_fields
      Field.all_filterable_multi_field_names(self.parent_form)
    end

    #TODO: Why is this method on the model at all? Look into this when dealing with scheduled tasks
    def schedule(scheduler)
      scheduler.every("24h") do
        self.reindex!
      end
    end

  end
end
