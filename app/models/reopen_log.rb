class ReopenLog
  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  property :case_reopened_date, Date
  property :case_reopened_user, String

end
