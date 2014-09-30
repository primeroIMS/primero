module DocumentHelper
  include AttachmentHelper

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
