class Role < CouchRest::Model::Base
  use_database :role

  include RapidFTR::Model
  include Namable

  property :permissions, :type => [String]
  property :permitted_form_ids, :type => [String]

  validates_presence_of :permissions, :message => I18n.t("errors.models.role.permission_presence")

  before_save :sanitize_permissions

  def has_permission(permission)
    self.permissions.include? permission
  end

  def sanitize_permissions
    self.permissions.reject! { |permission| permission.blank? } if self.permissions
  end

  def has_permitted_form_id?(form_id)
    self.permitted_form_ids.include? form_id
  end

end

