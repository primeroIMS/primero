# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern that describes how fields on forms should be indexed in Sunspot.
module Searchable
  extend ActiveSupport::Concern
  # TODO: This is only used in this concern for text indexing.
  PHONETIC_FIELD_NAMES = %w[name name_nickname name_other relation_name relation_nickname relation_other_family
                            tracing_names tracing_nicknames].freeze
  included do
    if Rails.configuration.solr_enabled
      include Indexable
      Sunspot::Adapters::DataAccessor.register RecordDataAccessor, self
    end
  end

  # Helpers to index text fields
  module TextIndexing
    def text_index(field_name, suffix = nil, from = :itself, subform_field_name = nil)
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

  if Rails.configuration.solr_enabled
    # Class for allowing Sunspot to eager load record associations
    class RecordDataAccessor < Sunspot::Adapters::DataAccessor
      def load_all(ids)
        # NOTE: This triggers a query against Attachment and Alert for each loaded record
        @clazz.eager_loaded_class.where(@clazz.primary_key => ids)
      end
    end
  end
end
