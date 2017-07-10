class Alert
  include CouchRest::Model::CastedModel
  include PrimeroModel

  property :type
  property :alert_for, :default => 'new_form'
  property :date, String
  property :form_sidebar_id, :default => nil
  property :unique_id

  def initialize *args
    super

    self.unique_id ||= UUIDTools::UUID.random_create.to_s
  end
end
