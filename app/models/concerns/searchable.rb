# frozen_string_literal: true

# Concern that describes how fields on forms should be indexed in Sunspot.
module Searchable
  extend ActiveSupport::Concern
  PHONETIC_FIELD_NAMES = %w[name name_nickname name_other relation_name relation_nickname relation_other_family tracing_names tracing_nicknames].freeze

  # Almost never disable Rubocop, but Sunspot searchable blocks are special
  # rubocop:disable Metrics/BlockLength
  included do
    include Indexable
    Sunspot::Adapters::DataAccessor.register RecordDataAccessor, self
    # Note that the class will need to be reloaded when the fields change.
    searchable do
      extend TextIndexing
      string(:record_id) { id }

      searchable_option_fields.each do |f|
        string(f, as: "#{f}_sci".to_sym) { data[f] }
      end
      searchable_multi_fields.each do |f|
        string(f, multiple: true) { data[f] }
      end
      searchable_date_fields.each do |f|
        date(f) { data[f] }
      end
      searchable_date_time_fields.each do |f|
        time(f) { data[f] }
      end
      searchable_numeric_fields.each do |f|
        integer(f) { data[f] }
      end
      searchable_boolean_fields.each do |f|
        boolean(f) { data[f] }
      end
      # if self.include?(SyncableMobile) #TODO: refactor with SyncableMobile; recast as store_accessors?
      #   boolean :marked_for_mobile do
      #     self.data['marked_for_mobiles']
      #   end
      # end
      all_searchable_location_fields.each do |field|
        Location::ADMIN_LEVELS.each do |admin_level|
          string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
            location_service.ancestor_code(data[field], admin_level)
          end
        end
      end
    end
  end
  # rubocop:enable Metrics/BlockLength

  # Class methods to derive the record data to index based on the configured forms
  module ClassMethods
    def searchable_date_fields
      Field.all_searchable_date_field_names(parent_form)
    end

    def searchable_date_time_fields
      Field.all_searchable_date_time_field_names(parent_form)
    end

    def searchable_boolean_fields
      (
        %w[duplicate flag has_photo record_state case_status_reopened] +
          Field.all_searchable_boolean_field_names(parent_form)
      ).uniq
    end

    def searchable_option_fields
      Field.all_filterable_option_field_names(parent_form)
    end

    def searchable_multi_fields
      Field.all_filterable_multi_field_names(parent_form)
    end

    def searchable_numeric_fields
      Field.all_filterable_numeric_field_names(parent_form)
    end

    def searchable_location_fields
      %w[location_current incident_location]
    end

    def all_searchable_location_fields
      (
        %w[owned_by_location] + searchable_location_fields + Field.all_location_field_names(parent_form)
      ).uniq
    end
  end

  # Helpers to index text fields
  module TextIndexing
    def text_index(field_name, from: :itself, suffix: nil, subform_field_name: nil)
      stored_field_name = suffix.present? ? "#{field_name}_#{suffix}" : field_name
      solr_field_type = PHONETIC_FIELD_NAMES.include?(field_name) ? 'ph' : 'text'

      text(stored_field_name, as: "#{stored_field_name}_#{solr_field_type}") do
        if subform_field_name.present?
          send(from).values_from_subform(subform_field_name, field_name)&.join(' ')
        else
          field_value(send(from), field_name)
        end
      end
    end

    def field_value(record, field_name)
      value = record.data[field_name] || record.try(field_name)
      value.is_a?(Array) ? value.join(' ') : value
    end
  end

  # Class for allowing Sunspot to eager load record associations
  class RecordDataAccessor < Sunspot::Adapters::DataAccessor
    def load_all(ids)
      @clazz.eager_loaded_class.where(@clazz.primary_key => ids)
    end
  end
end
