require 'delegate'

module PrimeroModel
  extend ActiveModel::Naming
  extend ActiveSupport::Concern

  # @param attr_keys: An array whose elements are properties and array indeces
  # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(self) do |acc, prop|
      if acc.nil?
        nil
      elsif prop.is_a?(Numeric)
        # We use 1-based numbering in the output but arrays in Ruby are
        # still 0-based
        acc[prop - 1]
      else
        acc.send(prop.name.to_sym)
      end
    end
  end

  def persisted?
    !new_record?
  end

  def _id=(new_id)
    self["_id"] = new_id
  end

  def _id
    self["_id"]
  end

  def errors
    ErrorsAdapter.new super
  end

  def logger
    Rails.logger
  end

  class ErrorsAdapter < SimpleDelegator
    def [](key)
      __getobj__[key] || []
    end

    def length
      count
    end
  end
end
