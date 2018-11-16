class PasswordRecoveryRequest < CouchRest::Model::Base
  use_database :password_recovery_request

  include PrimeroModel

  property :user_name
  property :hidden, TrueClass, :default => false

  timestamps!

  design

  validates_presence_of :user_name, :message => I18n.t("errors.models.password_recovery_request.user_name_mandatory")

  def hide!
    self.hidden = true
    save
  end

  def self.to_display
    PasswordRecoveryRequest.all.select { |request| request.hidden == false }
  end
end
