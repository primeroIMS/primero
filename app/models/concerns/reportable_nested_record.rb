# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes all record subforms that shoudl be indexed in Solr as individual entities
module ReportableNestedRecord
  extend ActiveSupport::Concern
  # TODO: For now this will be used to only read and index data on nested forms.
  # TODO: This is similar to Violations and may need to be combined with Violations when refactoring
  #       or have violations extend this class
  # TODO: Make similar (and test exhaustively!) to Flag model to perform reads and writes

  included do
    attr_accessor :parent_record, :object
  end

  # Class methods
  module ClassMethods
    def from_record(record)
      objects = []
      record.send(record_field_name).each do |object|
        reportable = new
        reportable.parent_record = record
        reportable.object = object
        objects << reportable
      end
      objects
    end

    def object_form
      field = Field.includes(form_section: :fields)
                   .joins(:form_section)
                   .where(name: record_field_name,
                          type: Field::SUBFORM,
                          form_sections: { parent_form: parent_record_type.parent_form })
                   .first
      field.try(:subform)
    end
  end

  def id
    "#{parent_record.id}-#{object_value('unique_id') || 0}"
  end

  def record_value(field_name)
    return unless parent_record

    parent_record.data[field_name]
  end

  def object_value(field_name)
    return unless object

    object[field_name]
  end
end
