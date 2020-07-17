# frozen_string_literal: true

# Concern that describes how fields on forms should be indexed in Sunspot.
module Searchable
  extend ActiveSupport::Concern

  # Almost never disable Rubocop, but Sunspot searchable blocks are special
  # rubocop:disable Metrics/BlockLength
  included do
    include Indexable
    # Note that the class will need to be reloaded when the fields change.
    searchable do
      string(:record_id) { id }

      searchable_string_fields.each do |f|
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
      searchable_location_fields.each do |f|
        text(f, as: "#{f}_lngram".to_sym) { data[f] }
      end
      all_searchable_location_fields.each do |field|
        Location::ADMIN_LEVELS.each do |admin_level|
          string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
            Location.value_for_index(data[field], admin_level)
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

    def searchable_string_fields
      (
        %w[
          unique_identifier short_id created_by created_by_full_name
          last_updated_by last_updated_by_full_name created_organization
          owned_by_agency_id owned_by_location
        ] + Field.all_filterable_field_names(parent_form)
      ).uniq
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
        %w[owned_by_location] + Field.all_location_field_names(parent_form)
      ).uniq
    end
  end
end
