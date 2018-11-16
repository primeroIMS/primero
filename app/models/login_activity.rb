class LoginActivity < CouchRest::Model::Base
  use_database :login_activity

  include PrimeroModel

  property :imei
  property :user_name
  property :login_timestamp, DateTime
  property :mobile_number

  design

  design :by_user_name_and_login_timestamp do
    view :by_user_name_and_login_timestamp,
         :map => "function(doc) {
                 if (doc['couchrest-type'] == 'LoginActivity') {
                   emit([doc.user_name, doc.login_timestamp], null);
                 }
              }"
  end

  before_save :set_timestamp

  def set_timestamp
    self.login_timestamp = DateTime.now
  end

  def mobile?
    self.imei.present?
  end
end
