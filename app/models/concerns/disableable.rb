#This describes all models that can be disabled or re-enabled
module Disableable
  extend ActiveSupport::Concern

  included do
    property :disabled, TrueClass, default: false

    design do
      view :by_disabled,
           :map => "function(doc) {
              if (doc['couchrest-type'] == '#{self.model.name}' && (doc.hasOwnProperty('disabled') && doc['disabled']))
               {
                  emit(doc);
               }
           }"

      view :by_enabled,
           :map => "function(doc) {
              if (doc['couchrest-type'] == '#{self.model.name}' && (!doc.hasOwnProperty('disabled') || !doc['disabled']))
               {
                  emit(doc);
               }
           }"
    end

    def enabled
      (self.disabled.present? ? !self.disabled : true)
    end
  end

end
