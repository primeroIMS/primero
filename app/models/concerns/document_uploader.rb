module DocumentUploader
  extend ActiveSupport::Concern

  include Attachable

  # TODO: Increase the number
  MAX_DOCUMENTS = 10

  included do
    property :document_keys, [String]
    property :other_documents, [Class.new() do #TODO: refactor this to be "documents"
      include Syncable::PrimeroEmbeddedModel
      #TODO: Refactor to a separate file!
      property :file_name, String
      property :attachment_key, String
      property :document_type, String # TODO: This should be like in Transition::TYPE_REFERRAL
      property :document_description, String
    end]
    validate :validate_documents_size
    validate :validate_documents_count
    validate :validate_documents_file_type
  end

  def validate_documents_size
    # TODO: Examine size and perhaps increase 10 !
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
    return true if @documents.blank? || @documents.all? { |document| !document.original_filename.downcase.ends_with? ".exe" }
    errors.add(:document, "errors.models.#{self.class.name.underscore.downcase}.document_format")
    error_with_section(:upload_document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_format"))
  end

  def upload_document=(new_documents)
    @documents = []
    self['other_documents'] ||= []
    self['document_keys'] ||= []
    new_documents.each do |doc|
      uploaded_document = doc["document"]
      document_description = doc["document_description"]
      if uploaded_document.present?
        @documents.push uploaded_document
        @document_file_name = uploaded_document.original_filename
        attachment = FileAttachment.from_uploadable_file uploaded_document, "document-#{uploaded_document.path.hash}"
        self['document_keys'].push attachment.name
        self['other_documents'].push({:file_name => @document_file_name, :attachment_key => attachment.name, :document_description => document_description})
        attach attachment
      end
    end
  end

  def update_document=(updated_documents)
    return unless updated_documents
    document_names = updated_documents.keys if updated_documents.is_a? Hash
    document_names.each do |document_key|
      attachment_index = self['document_keys'].find_index(document_key)
      other_documents_index = self['other_documents'].find_index {|document| document['attachment_key'] == document_key}
      if attachment_index.present? && other_documents_index.present?
        if updated_documents[document_key]["delete_document"].present?
          self['document_keys'].delete_at(attachment_index)
          self['other_documents'].delete_at(attachment_index)
          delete_attachment(document_key)
        elsif self['other_documents'][other_documents_index]['document_description'] != updated_documents[document_key]["document_description"]
          self['other_documents'][other_documents_index]['document_description'] = updated_documents[document_key]["document_description"]
        end
      end
    end
  end
end
