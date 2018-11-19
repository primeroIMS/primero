class SystemUsers < CouchRest::Model::Base

  include PrimeroModel
  self.database = COUCHDB_SERVER.database("_users")

  property :name
  property :password
  property :type
  property :roles
  property :_id

  validates_presence_of :name, :password

  validate :is_user_name_unique

  before_save :generate_id, :assign_admin_role

  design

  private

  def generate_id
    self._id = "org.couchdb.user:#{self.name}"
  end

  def is_user_name_unique
    if self.name.present?
      user = SystemUsers.get(generate_id)
      return true if user.nil?
      return true if !self.new? && self._id == user._id
      errors.add(:name, I18n.t("errors.models.system_users.username_unique"))
    end
  end

  def assign_admin_role
    self.roles = ["admin"]
    self.type = "user"
  end

end
