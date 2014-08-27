module DocumentHelper
  include AttachmentHelper

  def upload_document=(new_documents)
    @documents = []
    self['other_documents'] ||= []
    self['document_keys'] ||= []
    new_documents.each do |uploaded_document|
      @documents.push uploaded_document
      @document_file_name = uploaded_document.original_filename
      attachment = FileAttachment.from_uploadable_file uploaded_document, "document-#{uploaded_document.path.hash}"
      self['document_keys'].push attachment.name
      self['other_documents'].push({:file_name => @document_file_name, :attachment_key => attachment.name})
      attach attachment
    end
  end

  def delete_documents(document_names)
    return unless document_names
    document_names = document_names.keys if document_names.is_a? Hash
    document_names.each do |document_key|
      document_key_index = self['document_keys'].find_index(document_key)
      unless document_key_index.nil?
        self['document_keys'].delete_at(document_key_index)
        self['other_documents'].delete_at(document_key_index)
        delete_attachment(document_key)
      end
    end
  end
end