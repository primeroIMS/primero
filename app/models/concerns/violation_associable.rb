# frozen_string_literal: true

# This describes all models that may be associable to a violation (MRM)
module ViolationAssociable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :unique_id
    attr_accessor :violations_ids

    after_initialize :set_unique_id
  end

  def set_unique_id
    self.unique_id ||= id
  end

  def associations_as_data
    data['violations_ids'] = violations.ids
    data
  end

  # Define class methods
  module ClassMethods
    def build_record(data)
      record = find_or_initialize_by(id: data['unique_id'])
      record.violations_ids = data.delete('violations_ids')
      record.data = data
      record
    end
  end
end
