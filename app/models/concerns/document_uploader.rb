module DocumentUploader
  extend ActiveSupport::Concern

  MAX_DOCUMENTS = 10

  include DocumentHelper

  included do
    validate :validate_documents_size
    validate :validate_documents_count
    validate :validate_documents_file_type
  end

  def validate_documents_size
    return true if @documents.blank? || @documents.all? {|document| document.size < 10.megabytes }
    errors.add(:document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_size"))
    error_with_section(:upload_document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_size"))
  end

  def validate_documents_count
    return true if @documents.blank? || self['document_keys'].size <= MAX_DOCUMENTS
    errors.add(:document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.documents_count", :documents_count => MAX_DOCUMENTS))
    error_with_section(:upload_document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.documents_count", :documents_count => MAX_DOCUMENTS))
  end

  def validate_documents_file_type
    return true if @documents.blank? || @documents.all? { |document| !document.original_filename.ends_with? ".exe" }
    errors.add(:document, "errors.models.#{self.class.name.underscore.downcase}.document_format")
    error_with_section(:upload_document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_format"))
  end

end