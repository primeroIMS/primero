class Role < CouchRest::Model::Base
  use_database :role

  include PrimeroModel
  include Namable
  include Cloneable
  include Importable
  include Memoizable

  property :permissions_list, :type => [Permission]
  property :group_permission, :type => String, :default => Permission::SELF
  property :permitted_form_ids, :type => [String]
  property :referral, TrueClass, :default => false
  property :transfer, TrueClass, :default => false

  alias_method :permissions, :permissions_list
  alias_method :permissions=, :permissions_list=

  validates_presence_of :permissions_list, :message => I18n.t("errors.models.role.permission_presence")

  before_save :add_permitted_subforms

  after_save :update_users_with_current_role

  design #Create the default all design view

  def self.get_unique_instance(attributes)
    find_by_name(attributes['name'])
  end

  # input: either an action string (ex: read, write, flag, etc)
  #        or a colon separated string, with the first part being resource, action, or management,
  #        and the second being the value (ex: read, write, case, incident, etc)
  def has_permission(permission)
    perm_split = permission.split(':')

    #if input is a single string, not colon separated, then default the key to actions
    perm_key = (perm_split.count == 1) ? 'actions' : perm_split.first
    perm_value = perm_split.last

    if perm_key == 'management'
      self.group_permission == perm_value
    else
      self.permissions_list.map{|p| p[perm_key]}.flatten.include? perm_value
    end
  end

  def has_permitted_form_id?(form_id)
    self.permitted_form_ids.include? form_id
  end

  def add_permitted_subforms
    if self.permitted_form_ids.present?
      permitted_forms =  FormSection.by_unique_id(keys: self.permitted_form_ids).all
      subforms = FormSection.get_subforms(permitted_forms)
      all_permitted_form_ids = permitted_forms.map(&:unique_id) | subforms.map(&:unique_id)
      all_permitted_form_ids = all_permitted_form_ids.select{|id| id.present?}
      unless all_permitted_form_ids.nil?
        self.permitted_form_ids = all_permitted_form_ids
      end
    end
  end

  def self.memoized_dependencies
    [FormSection, PrimeroModule, User]
  end

  class << self
    alias :old_all :all
    def all(*args)
      old_all(*args)
    end
    memoize_in_prod :all

    alias :old_get :get
    def get(*args)
      old_get(*args)
    end
    memoize_in_prod :get

    def names_and_ids_by_referral
      self.all.select{|r| r.referral}.map{|r| [r.name, r.id]}
    end
    memoize_in_prod :names_and_ids_by_referral

    def names_and_ids_by_transfer
      self.all.select{|r| r.transfer}.map{|r| [r.name, r.id]}
    end
    memoize_in_prod :names_and_ids_by_transfer
  end

  def associated_role_ids
    self.permissions_list.select{|p| p.resource == 'role'}.map{|p| p[:role_ids]}.flatten if permissions_list.present?
  end


  def is_super_user_role?
    superuser_resources = [
      Permission::CASE, Permission::INCIDENT, Permission::REPORT,
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    has_managed_resources?(superuser_resources)
  end

  def is_user_admin_role?
    admin_only_resources = [
      Permission::ROLE, Permission::USER, Permission::USER_GROUP,
      Permission::AGENCY, Permission::METADATA, Permission::SYSTEM
    ]
    has_managed_resources?(admin_only_resources)
  end

  private

  def has_managed_resources?(resources)
    current_managed_resources = self.permissions_list
      .select{|p| p.actions == [Permission::MANAGE]}
      .map{|p| p.resource}
    (resources - current_managed_resources).empty?
  end

  def update_users_with_current_role
    users = User.find_by_role_ids([self.id])
    Sunspot.index!(users) if users.any?
  end

end

