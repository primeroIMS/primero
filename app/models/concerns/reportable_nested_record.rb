# frozen_string_literal: true

# Describes all record subforms that shoudl be indexed in Solr as individual entities
module ReportableNestedRecord
  extend ActiveSupport::Concern
  # TODO: For now this will be used to only read and index data on nested forms.
  # TODO: This is similar to Violations and may need to be combined with Violations when refactoring
  #       or have violations extend this class
  # TODO: Make similar (and test exhaustively!) to Flag model to perform reads and writes

  included do
    include Indexable
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

    # Sunspot expects this to be an active record object. So we are tricking it.
    def before_save(*_); end

    def after_save(*_); end

    def after_destroy(*_); end

    def after_commit(*_); end
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

  # Shared Sunspot indexing configuration. Its a big messy thing, but that's how hacks work.
  module Searchable
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/PerceivedComplexity
    def configure_searchable(record_class)
      string :parent_record_id do |f|
        f.record_value('id')
      end
      record_class.parent_record_type.minimum_reportable_fields.each do |type, fields|
        case type
        when 'string'
          fields.each { |f| string(f, as: "#{f}_sci".to_sym) { record_value(f) } }
        when 'multistring'
          fields.each { |f| string(f, multiple: true) { record_value(f) } }
        when 'boolean'
          fields.each { |f| boolean(f) { record_value(f) } }
        when 'date'
          fields.each { |f| date(f) { record_value(f) } }
        when 'integer'
          fields.each { |f| integer(f) { record_value(f) } }
        when 'location'
          fields.each do |field|
            Location::ADMIN_LEVELS.each do |admin_level|
              string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
                parent_record.location_service.ancestor_code(record_value(field), admin_level)
              end
            end
          end
        end
      end

      object_form = record_class.object_form
      return unless object_form.present?

      object_form.fields.each do |field|
        case field.type
        when Field::SELECT_BOX, Field::RADIO_BUTTON
          if field.multi_select
            string(field.name, multiple: true) { object_value(field.name) }
          else
            string(field.name, as: "#{field.name}_sci".to_sym) { object_value(field.name) }
          end
        when Field::TICK_BOX
          boolean(field.name) { object_value(field.name) }
        when Field::DATE_FIELD
          if field.date_include_time
            time(field.name) { object_value(field.name) }
          else
            date(field.name) { object_value(field.name) }
          end
        when Field::NUMERIC_FIELD
          integer(field.name) { object_value(field.name) }
        end
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
