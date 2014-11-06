require 'delegate'
require 'observer'

module PrimeroModel
  extend ActiveModel::Naming
  extend ActiveSupport::Concern

  # @param attr_keys: An array whose elements are properties and array indeces
  # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(self) do |acc, attr|
      if acc.nil?
        nil
      elsif attr.is_a?(Numeric)
        acc[attr]
      else
        acc.send(attr.to_sym)
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

  private 

  def set_dirty_tracking(enabled)
    dirty, self.disable_dirty = self.disable_dirty, !enabled
    begin
      yield
    ensure
      self.disable_dirty = dirty
    end
  end

  def without_dirty_tracking(&block)
    set_dirty_tracking(false, &block)
  end
end
