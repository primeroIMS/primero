module Importable
  extend ActiveSupport::Concern

  module ClassMethods
    def get_unique_instance(attributes)
      self.get(attributes['id'])
    end

    def create_new_model(attributes={}, current_user=nil)
      self.create(attributes)
    end

    def update_existing_model(inst, attributes, current_user=nil)
      inst.attributes = attributes
    end

    def import(attributes, current_user)
      # TODO: The better thing to do here is to rework that controller code
      # that checks for last_updated_at and blocks the update.  This will be
      # done in the conflict resolution branch
      attributes.delete 'last_updated_at'

      (get_unique_instance(attributes) || create_new_model({}, current_user)).tap do |inst|
        model_type = attributes.delete('model_type')

        if inst.class.name != model_type
          raise TypeError.new("Import data model_type field is #{model_type}, expected #{inst.class.name}")
        end

        self.update_existing_model(inst, attributes, current_user)
      end
    end
  end
end
