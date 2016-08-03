class ReopenLog
  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  property :reopened_date, DateTime
  property :reopened_user, String

end
