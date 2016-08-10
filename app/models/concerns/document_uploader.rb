module DocumentUploader
  extend ActiveSupport::Concern

  include Attachable

  MAX_DOCUMENTS = 10
  MAX_SIZE = 10.megabytes

  included do
    property :document_keys, [String]
    property :other_documents, [Document], default: []
    property :bia_documents, [Document], default: []
    property :bid_documents, [Document], default: []
    validate :validate_documents_size
    validate :validate_documents_count
    validate :validate_documents_file_type
  end

  def validate_documents_size
    return true if @documents.blank? || @documents.all? {|document| document.size < MAX_SIZE }
    errors.add(:document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_size"))
  end

  def validate_documents_count
    return true if @documents.blank? || self['document_keys'].size <= MAX_DOCUMENTS
    errors.add(:document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.documents_count", :documents_count => MAX_DOCUMENTS))
  end

  def validate_documents_file_type
    return true if @documents.blank? || @documents.all? { |document| !document.original_filename.downcase.ends_with? ".exe" }
    errors.add(:document, "errors.models.#{self.class.name.underscore.downcase}.document_format")
  end

  def upload_other_document=(new_documents)
    upload('other_documents', Document::TYPE_OTHER, new_documents)
  end

  def upload_bia_document=(new_documents)
    upload('bia_documents', Document::TYPE_BIA, new_documents)
  end

  def upload(form_id, type, new_documents)
    @documents = []
    self[form_id] ||= []
    self['document_keys'] ||= []

    new_documents.each do |doc|
      uploaded_document = doc['document']
      description = doc['document_description']
      date = doc['date']
      comments = doc['comments']

      if uploaded_document.present?
        @documents.push uploaded_document
        @document_file_name = uploaded_document.original_filename
        attachment = FileAttachment.from_uploadable_file uploaded_document, "document-#{uploaded_document.path.hash}"
        self['document_keys'].push attachment.name
        self[form_id].push({:file_name => @document_file_name, :attachment_key => attachment.name,
          :document_type => type, :document_description => description, :date => date, :comments => comments })
        attach attachment
      end
    end
  end

  def update_other_document=(updated_documents)
    return unless updated_documents
    document_update('other_documents', Document::TYPE_OTHER, updated_documents)
  end

  def update_bia_document=(updated_documents)
    return unless updated_documents
    document_update('bia_documents', Document::TYPE_BIA, updated_documents)
  end

  def document_update(form_id, type, updated_documents)
    document_names = updated_documents.keys if updated_documents.is_a? Hash
    document_names.each do |document_key|
      attachment_index = self['document_keys'].find_index(document_key)
      documents_index = self[form_id].find_index {|document| document['attachment_key'] == document_key}

      if attachment_index.present? && documents_index.present?
        if updated_documents[document_key]['delete_document'].present?
          self['document_keys'].delete_at(attachment_index)
          self[form_id].delete_at(documents_index)
          delete_attachment(document_key)
        else
          if self[form_id][documents_index]['document_description'] != updated_documents[document_key]['document_description']
            self[form_id][documents_index]['document_description'] = updated_documents[document_key]['document_description']
          end
          if self[form_id][documents_index]['date'] != updated_documents[document_key]['date']
            self[form_id][documents_index]['date'] = updated_documents[document_key]['date']
          end
          if self[form_id][documents_index]['comments'] != updated_documents[document_key]['comments']
            self[form_id][documents_index]['comments'] = updated_documents[document_key]['comments']
          end
        end
      end
    end
  end
end
