module Importable
  extend ActiveSupport::Concern

  def populate_missing_attributes
    #override in implementing class
  end

  module ClassMethods
    def import(attributes, current_user)
      given_id = attributes.delete '_id'
      existing_by_id = given_id.present? ? self.get(given_id) : nil

      (get_unique_instance(attributes) || existing_by_id || create_new_model({'_id' => given_id}, current_user)).tap do |inst|
        verify_model_type(inst, attributes)
        self.update_existing_model(inst, attributes, current_user)
        inst.populate_missing_attributes

        if given_id.present? && given_id != inst.id
          old_id, inst.id = inst.id, given_id
          inst.changed_attributes['id'] = old_id

          self.get(old_id).destroy
        end
      end
    end

    private

    def verify_model_type(inst, attributes)
      t = attributes.delete('model_type')
      if t
        model_type = {'Case' => 'Child'}.fetch(t, t)

        if inst.class.name != model_type
          raise TypeError.new("Import data model_type field is #{model_type}, expected #{inst.class.name}")
        end
      end
    end

  end
end
