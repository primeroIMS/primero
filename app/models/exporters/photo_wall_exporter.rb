# frozen_string_literal: true

require 'prawn/document'
require 'prawn/measurement_extensions'

module Exporters
  # Bulk export for PhotoWall
  class PhotoWallExporter < BaseExporter
    class << self
      def id
        'photowall'
      end

      def mime_type
        'pdf'
      end

      def supported_models
        [Child]
      end

      def authorize_fields_to_user?
        false
      end
    end

    def initialize(output_file_path = nil, pdf = nil)
      super(output_file_path)
      @pdf = pdf || Prawn::Document.new
    end

    def complete
      buffer.set_encoding(::Encoding::ASCII_8BIT)
      @pdf.render(buffer)
      buffer.rewind
    end

    def export(child_data, _, *_args)
      cases_with_photo = child_data.select(&:has_photo)
      return no_photo_available(@pdf) if cases_with_photo.empty?

      cases_with_photo.each do |child|
        add_child_photo(@pdf, child, true)
        @pdf.start_new_page unless cases_with_photo.last == child
      end
    end

    private

    def no_photo_available(pdf)
      pdf.text I18n.t('exports.photowall.no_photos_available'), size: 40, align: :center, style: :bold
    end

    def add_child_photo(pdf, child, with_full_id = false)
      blob_data = child&.photo&.file&.blob&.download
      return unless blob_data

      storage = StringIO.new(blob_data)
      render_image(pdf, storage)
      pdf.move_down 25
      pdf.text child.short_id, size: 40, align: :center, style: :bold if with_full_id
      pdf.y -= 3.mm
    end

    def render_image(pdf, data)
      image_bounds = [pdf.bounds.width, pdf.bounds.width]
      pdf.image(
        data,
        position: :center,
        vposition: :top,
        fit: image_bounds
      )
    end

    def flag_if_suspected(pdf, child)
      pdf.text(I18n.t('exports.photowall.flag_suspect_record'), style: :bold) if child.flag?
    end

    def flag_if_reunited(pdf, child)
      pdf.text(I18n.t('exports.photowall.reunited'), style: :bold) if child.reunited?
    end
  end
end
