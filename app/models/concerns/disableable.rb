#This describes all models that can be disabled or re-enabled
module Disableable
  extend ActiveSupport::Concern

  included do
    property :disabled, TrueClass, default: false

    design do
      view :by_disabled
    end

    def enabled
      (self.disabled.present? ? !self.disabled : true)
    end
  end

  module ClassMethods
    def list_by_enabled
      self.by_disabled(key: false).all
    end

    def list_by_disabled
      self.by_disabled(key: true).all
    end
  end

end
