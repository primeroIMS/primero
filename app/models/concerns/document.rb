class Document

  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  property :file_name, String
  property :attachment_key, String
  property :document_type, String
  property :document_description, String
  property :date, Date
  property :comments, String


  validates_presence_of :file_name
  validate :type_validation

  TYPE_BIA = "bia" # Reachable as Document::TYPE_BIA
  TYPE_BID = "bid"
  TYPE_OTHER = "other"

  def type_validation
    return true if [TYPE_BIA, TYPE_BID, TYPE_OTHER].include? self.document_type
    errors.add(:document, I18n.t("errors.models.#{self.class.name.underscore.downcase}.document_type", :type => :document_type))
  end
end