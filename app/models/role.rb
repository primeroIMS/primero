class Role < CouchRest::Model::Base
  use_database :role

  include PrimeroModel
  include Namable
  include Importable
  include Memoizable

  property :permissions, :type => [String]
  property :permitted_form_ids, :type => [String]
  property :referral, TrueClass, :default => false
  property :transfer, TrueClass, :default => false

  validates_presence_of :permissions, :message => I18n.t("errors.models.role.permission_presence")

  before_save :sanitize_permissions
  before_save :add_permitted_subforms

  def self.get_unique_instance(attributes)
    find_by_name(attributes['name'])
  end

  def has_permission(permission)
    self.permissions.include? permission
  end

  def sanitize_permissions
    self.permissions.reject! { |permission| permission.blank? } if self.permissions
  end

  def has_permitted_form_id?(form_id)
    self.permitted_form_ids.include? form_id
  end

  #TODO: Can probably be a before_save callback. How often do we update?
  def add_permitted_subforms
    if self.permitted_form_ids.present?
      permitted_forms =  FormSection.by_unique_id(keys: permitted_form_ids).all
      subforms = FormSection.get_subforms(permitted_forms)
      all_permitted_form_ids = permitted_forms.map(&:unique_id) | subforms.map(&:unique_id)
      if all_permitted_form_ids.present?
        permitted_form_ids = all_permitted_form_ids
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
  end

end

