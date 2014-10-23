module Searchable
  extend ActiveSupport::Concern

  ALL_FILTER = 'all'

  included do
    include Sunspot::Rails::Searchable

    # Note that the class will need to be reloaded when the fields change. The current approach is to gently bounce Passenger.
    searchable do
      eval(self.name).quicksearch_fields.each {|f| text f}
      searchable_string_fields.each {|f| string f, as: "#{f}_sci".to_sym}
      searchable_multi_fields.each {|f| string f, multiple: true}
      # TODO: Left date as string. Getting invalid date format error
      searchable_date_fields.each {|f| date f}
      searchable_numeric_fields.each {|f| integer f}
      # TODO: boolean with have to change if we want to index arbitrary index fields
      boolean :duplicate
      boolean :flag
      boolean :has_photo
      boolean :record_state
      string :sortable_name, as: :sortable_name_sci
      if self.include?(Ownable)
        string :associated_user_names, multiple: true
        string :owned_by
      end
      searchable_location_fields.each {|f| text f, as: "#{f}_lngram".to_sym}
    end

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
  end

  # #TODO: Remove this, once we have satisied that its not neccessary to refresh Sunspot with every save
  # def index_record
  #   #TODO: Experiment with getting rid of the solr schema rebuild on EVERY save.
  #   #      This should take place when the form sections change.
  #   begin
  #     #self.class.refresh_in_sunspot
  #     Sunspot.index!(self)
  #   rescue
  #     Rails.logger.error "***Problem indexing record for searching, is SOLR running?"
  #   end
  #   true
  # end

  module ClassMethods

    #Pull back all records from CouchDB that pass the filter criteria.
    #Searching, filtering, sorting, and pagination is handled by Solr.
    # TODO: Exclude duplicates I presume?
    # TODO: Also need integration/unit test for filters.
    def list_records(filters={}, sort={:created_at => :desc}, pagination={}, associated_user_names=[], query=nil)
      self.search do
        if filters.present?
          #TODO: pop off the locations filter and perform a fulltext search
          filters.each do |filter,value|
            if searchable_location_fields.include? filter
              fulltext("\"#{value}\"", fields: filter)
            else
              values = value.split("||")
              type = values.shift
              any_of do
                values.each do |v|
                  if type == 'range'
                    v = v.split("-")
                    if v.count == 1
                      # Range +
                      with(filter).greater_than_or_equal_to(v.first.to_i)
                    else
                      range_start, range_stop = v.first.to_i, v.last.to_i
                      with(filter, range_start...range_stop)
                    end
                  elsif type == 'date_range'
                    v = v.split('.').each { |d| convert_date(d) }
                    if v.count > 1
                      to, from = v.first, v.last
                      with(filter).between(to..from)
                    else
                      with(filter, v.first)
                    end
                  else
                    if properties_by_name[filter].try(:type) == TrueClass
                      v = v == 'true' ? true : false
                    end
                    with(filter, v) unless v == 'all'
                  end
                end
              end
            end
          end
        end
        if associated_user_names.present? && associated_user_names.first != ALL_FILTER
          any_of do
            associated_user_names.each do |user_name|
              with(:associated_user_names, user_name)
            end
          end
        end
        if query.present?
          fulltext(query.strip) do
            fields(*self.quicksearch_fields)
          end
        end
        sort.each{|sort,order| order_by(sort, order)}
        paginate pagination
      end
    end

    def convert_date(date)
      Date.parse(date)
    end

    # TODO: Need to delve into whether we keep this method as is, or ditch the schema rebuild.
    #      Currently nothing calls this?
    def reindex!
      Sunspot.remove_all(self)
      self.all.each { |record| Sunspot.index!(record) }
    end


    # TODO: What is going on with that date_fields loop?
    #Refreshes Sunspot to index this class correctly after new field definitions were added.
    # TODO: We should probably just get rid of this, or attach to a form rebuild
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

    #TODO: do we need these?
    def searchable_text_fields
      # "created_by", "created_by_full_name",
      #  "last_updated_by", "last_updated_by_full_name",
      ["unique_identifier", "short_id"]
    end

    def searchable_date_fields
      ["created_at", "last_updated_at", "registration_date"] + Field.all_searchable_date_field_names(self.parent_form)
    end

    def searchable_string_fields
      ["unique_identifier", "short_id",
       "created_by", "created_by_full_name",
       "last_updated_by", "last_updated_by_full_name",
       "created_organization"] +
       Field.all_filterable_field_names(self.parent_form)
    end

    def searchable_multi_fields
      Field.all_filterable_multi_field_names(self.parent_form)
    end

    def searchable_numeric_fields
      Field.all_filterable_numeric_field_names(self.parent_form)
    end

    def searchable_location_fields
      ['location_current', 'incident_location']
    end

    # TODO: I (JT) would recommend leaving this for now. This should be refactored at a later date
    def schedule(scheduler)
      scheduler.every("24h") do
        self.reindex!
      end
    end
  end
end
