module Attachable
  extend ActiveSupport::Concern

  ATTACHMENT_TYPES = %w(images documents audio)
  MAX_PHOTOS = 10
  MAX_DOCUMENTS = 100
  module ClassMethods
    attr_accessor :attachment_images_fields, :attachment_documents_fields, :attachment_audio_fields

    def attach_documents(args)
      if args[:fields].present?
        @attachment_documents_fields = args[:fields]
        args[:fields].each do |f|
          validates f, length: { maximum: MAX_DOCUMENTS }
          build_association(f, 'documents')
        end
      end
    end

     def attach_images(args)
      if args[:fields].present?
        @attachment_images_fields = args[:fields]
        args[:fields].each do |f|
          validates f, length: { maximum: MAX_PHOTOS, message: 'errors.models.photo.photo_count' }
          build_association(f, 'images')
          define_method "current_#{f.to_s.singularize}" do
            primary_image = self.send(f).find_by(is_current: true) || self.send(f).first
            primary_image&.image
          end

          define_method "current_#{f.to_s.singularize}=" do | primary |
            primary_image = self.send(f).find(primary)
            primary_image&.is_current = true
            primary_image.save
          end
        end
      end
    end

    def attach_audio(args)
      if args[:fields].present?
        @attachment_audio_fields = args[:fields]
        args[:fields].each do |f|
          build_association(f, 'audio')
        end
      end
    end

    def attachment_model(type)
      "Attachment#{type.singularize.titleize}"
    end

    def compact_properties(properties={})
      properties.each { |attachments| attachments.compact! }.delete_if &:empty?
    end

    private

    def build_association(field, type)
      build_attachment_association(field, attachment_model(type))
      accepts_nested_attributes_for(field, allow_destroy: true)
    end

    def build_attachment_association(field_name, class_name)
      has_many field_name, -> { where record_field_scope: field_name.to_s },
        as: :record, class_name: class_name
    end
  end

  def set_attachment_fields(record_data)
    ATTACHMENT_TYPES.each do |type|
      fields = self.class.try(:"attachment_#{type}_fields")

      if fields.present?
        fields.each do |f|
          if record_data[f.to_s].present?
            attachments = self.class.compact_properties(record_data[f.to_s])

            attachments.each do |attachment|
              if attachment['id'].present?
                self.send("#{f}_attributes=".to_sym, [attachment])
              else
                self.send(f).send(:build, attachment)
              end
            end
            self.data.delete(f.to_s)
          end
        end
      end
    end
  end
end
