require 'delegate'
require 'observer'

module PrimeroModel
  extend ActiveModel::Naming
  extend ActiveSupport::Concern

  module ClassMethods
    def get_unique_instance(attributes)
      nil
    end

    def create_new_model(attributes={}, current_user=nil)
      self.create(attributes)
    end

    def update_existing_model(inst, attributes, current_user=nil)
      inst.attributes = attributes
    end
  end

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

  def set_value_for_attr_keys(attr_keys, value)
    parent = value_for_attr_keys(attr_keys[0..-2])
    if attr_keys[-1].is_a?(Numeric)
      parent[attr_keys[-1]] = value
    else
      parent.send("#{attr_keys[-1]}=", value)
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
