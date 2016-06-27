module Searchable
  extend ActiveSupport::Concern

  ALL_FILTER = 'all'

  included do
    include Sunspot::Rails::Searchable

    # Note that the class will need to be reloaded when the fields change. The current approach is to gently bounce Passenger.
    searchable do
      quicksearch_fields.each {|f| text f}
      searchable_string_fields.each {|f| string f, as: "#{f}_sci".to_sym}
      searchable_multi_fields.each {|f| string f, multiple: true} if self.include?(Record)

      #if instance is a child do phonetic search on names
      # searchable_phonetic_fields.each {|f| text f, as: "#{f}_ph".to_sym}
      # TODO: Left date as string. Getting invalid date format error
      searchable_date_fields.each {|f| date f}
      searchable_numeric_fields.each {|f| integer f} if self.include?(Record)
      # TODO: boolean with have to change if we want to index arbitrary index fields
      if self.include?(Record)
        boolean :duplicate
        boolean :flag
        boolean :has_photo
        boolean :record_state
        boolean :not_edited_by_owner do
          (self.last_updated_by != self.owned_by) && self.last_updated_by.present?
        end
        string :referred_users, multiple: true do
          if self.transitions.present?
            self.transitions.map { |er| [er.to_user_local, er.to_user_remote] }.flatten.compact.uniq
          end
        end
        string :sortable_name, as: :sortable_name_sci
        if self.include?(Ownable)
          string :associated_user_names, multiple: true
          string :owned_by
        end
        if self.include?(SyncableMobile)
          boolean :marked_for_mobile
        end
        #text :name, as: :name_ph
        searchable_location_fields.each { |f| text f, as: "#{f}_lngram".to_sym }
      end
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
    def list_records(filters={}, sort={:created_at => :desc}, pagination={}, associated_user_names=[], query=nil, match=nil)
      self.search do
        if filters.present?
          build_filters(self, filters)
        end
        if match.blank? && associated_user_names.present? && associated_user_names.first != ALL_FILTER
          any_of do
            associated_user_names.each do |user_name|
              with(:associated_user_names, user_name)
            end
          end
        end
        if query.present?
          fulltext(query.strip) do
            #In schema.xml defaultOperator is "AND"
            #the following change that behavior to match on
            #any of the search terms instead all of them.
            minimum_match(1)
            fields(*self.quicksearch_fields)
          end
        end

        sort={:average_rating => :desc} if match.present?
        sort.each{|sort_field,order| order_by(sort_field, order)}
        paginate pagination
      end
    end

    #This method controls filtering logic
    def build_filters(sunspot, filters={})
      sunspot.instance_eval do
        #TODO: pop off the locations filter and perform a fulltext search
        filters.each do |filter,filter_value|
          if searchable_location_fields.include? filter
            #TODO: Could check if also location on line 100, but will it break alot of location code
            if filter_value[:type] == 'location_list'
              with(filter.to_sym, filter_value[:value])
            else
              fulltext("\"#{filter_value[:value]}\"", fields: filter)
            end
          else
            values = filter_value[:value]
            type = filter_value[:type]
            any_of do
              case type
              when 'range'
                values.each do |filter_value|
                  if filter_value.count == 1
                    # Range +
                    with(filter).greater_than_or_equal_to(filter_value.first.to_i)
                  else
                    range_start, range_stop = filter_value.first.to_i, filter_value.last.to_i
                    with(filter, range_start...range_stop)
                  end
                end
              when 'date_range'
                if values.count > 1
                  to, from = values.first, values.last
                  with(filter).between(to..from)
                else
                  with(filter, values.first)
                end
              when 'list'
                with(filter).any_of(values)
              when 'neg'
                without(filter, values)
              else
                with(filter, values) unless values == 'all'
              end
            end
          end
        end
      end
    end

    def find_match_records(match_criteria, match_class, child_id = nil)
      pagination = {:page => 1, :per_page => 20}
      sort={:score => :desc}
      if match_criteria.nil? || match_criteria.empty?
        []
      else
        search = Sunspot.search(match_class) do
          any do
            match_criteria.each do |key, value|
              fulltext(value, :fields => Record.get_match_field(key.to_s))
            end
          end
          with(:id, child_id) unless child_id.nil?
          sort.each{|sort_field,order| order_by(sort_field, order)}
          paginate pagination
        end
        results = {}
        search.hits.each { |hit| results[hit.result.id] = hit.score }
        results
      end
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

    # TODO: we cannot rely on 'district' always being there. SL-specific code
    def searchable_string_fields
      ["unique_identifier", "short_id",
       "created_by", "created_by_full_name",
       "last_updated_by", "last_updated_by_full_name",
       "created_organization", "owned_by_agency", "owned_by_location", "owned_by_location_district"] +
       Field.all_filterable_field_names(self.parent_form)
    end

    def searchable_phonetic_fields
        ["name", "name_nickname", "name_other"]
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
