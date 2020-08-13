# frozen_string_literal: true

# A shared concern for all Primero configuration types: FormSections, Agencies, Lookups, etc.
module ConfigurationRecord
  extend ActiveSupport::Concern

  # Class methods
  module ClassMethods
    def create_or_update!(configuration_hash)
      configuration_record = find_or_initialize_by(unique_id: configuration_hash['unique_id'])
      configuration_record.attributes = configuration_hash
      configuration_record.save!
      configuration_record
    end

    # TODO: Do we need this?
    def clear
      delete_all
    end

    # TODO: Do we need this? review with importable.
    def import(data)
      record = new(data)
      record.save!
    end

    # TODO: Do we need this? Review with exporter logic
    def export
      all.map(&:configuration_hash)
    end
  end

  def configuration_hash
    attributes.except('id')
  end
end
