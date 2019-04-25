module Attachable
  extend ActiveSupport::Concern

  ATTACHMENT_TYPES = %w(images documents audio)

  module ClassMethods
    ATTACHMENT_TYPES.each do |type|
      attr_accessor :"attachment_#{type}_fields"

      # self.class.class_eval do
        define_method(:"attach_#{type}") do |args|
          if args[:fields].present?
            self.instance_variable_set("@attachment_#{type}_fields", args[:fields])

            args[:fields].each do |f|
              build_attachment_association(f, attachment_model(type))
              accepts_nested_attributes_for f
            end
          end
        end
      # end
    end

    def attachment_model(type)
      "Attachment#{type.singularize.titleize}"
    end

    private

    def build_attachment_association(field, class_name)
      has_many field, -> { where record_field_scope: field.to_s },
        as: :record, class_name: class_name
    end
  end

  def set_attachment_fields(properties)
    ATTACHMENT_TYPES.each do |type|
      fields = self.class.try(:"attachment_#{type}_fields")

      if fields.present?
        fields.each do |f|
          if properties[f.to_s].present?
            properties[f.to_s].each do |attachment|
              self.send(f)
                .send(attachment['id'].present? ? :update : :build, attachment)
            end
            self.data.delete(f.to_s)
          end
        end
      end
    end
  end
end
