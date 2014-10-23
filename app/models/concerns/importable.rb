module Importable
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

    def import(attributes, current_user)
      given_id = attributes.delete '_id'
      existing_by_id = given_id.present? ? self.get(given_id) : nil

      (get_unique_instance(attributes) || existing_by_id || create_new_model({'_id' => given_id}, current_user)).tap do |inst|
        model_type = attributes.delete('model_type')

        if inst.class.name != model_type
          raise TypeError.new("Import data model_type field is #{model_type}, expected #{inst.class.name}")
        end

        self.update_existing_model(inst, attributes, current_user)

        if given_id.present? && given_id != inst.id
          old_id, inst.id = inst.id, given_id
          inst.changed_attributes['id'] = old_id

          self.get(old_id).destroy
        end

        inst
      end
    end
  end
end
