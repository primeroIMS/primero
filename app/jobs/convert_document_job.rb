# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
# Converts a doc/docx file to a pdf
class ConvertDocumentJob < ApplicationJob
  queue_as :default

  def perform(attachment_id)
    attachment = Attachment.find(attachment_id)

    return unless attachment.file.attached?

    LibreOfficeService.convert(attachment, :pdf_file)
  end
end
