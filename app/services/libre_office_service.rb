# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service to convert documents using LibreOffice
class LibreOfficeService
  def initialize(attachment, model_property, output_file_type = 'pdf')
    @attachment = attachment
    @output_file_type = output_file_type
    @model_property = model_property
  end

  def download_file_to_convert
    Dir.mktmpdir do |dir|
      input_path = File.join(dir, @attachment.file.filename.to_s)
      output_path = dir

      File.binwrite(input_path, @attachment.file.download)
      yield input_path, output_path
    end
  end

  def run_conversion_command(input_path, output_path)
    system('soffice', '--headless', '--convert-to', @output_file_type, '--outdir', output_path, input_path)

    File.join(
      output_path,
      "#{File.basename(input_path, '.*')}.#{@output_file_type}"
    )
  rescue StandardError => e
    Rails.logger.error "Error converting document: #{e.message}"
    nil
  end

  def attach_converted_file_to_model(path_to_converted_file)
    if File.exist?(path_to_converted_file)
      @attachment.send(@model_property).attach(
        io: File.open(path_to_converted_file),
        filename: "#{@attachment.file.filename.base}.#{@output_file_type}",
        content_type: "application/#{@output_file_type}"
      )
    else
      Rails.logger.error "Error saving converted document to Attachment #{@attachment.id}"
    end
  end

  def convert
    download_file_to_convert do |input_path, output_path|
      path_to_converted_file = run_conversion_command(input_path, output_path)
      attach_converted_file_to_model(path_to_converted_file)
    end
  end

  def self.convert(attachment, model_property)
    new(attachment, model_property).convert
  end
end
