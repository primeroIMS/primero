#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do
    store_accessor :data,
      :owned_by, :owned_by_full_name, :owned_by_agency, :owned_by_groups, :owned_by_location, :owned_by_user_code,
      :previously_owned_by, :previously_owned_by_full_name, :previously_owned_by_agency, :previously_owned_by_location,
      :assigned_user_names, :module_id

    searchable auto_index: self.auto_index? do
      string :associated_user_names, multiple: true
      string :owned_by
      string :owned_by_groups, multiple: true
      string :assigned_user_names, multiple: true
      string :module_id, as: :module_id_sci
    end

    before_save :update_ownership

    def owner
      users_by_association[:owner]
    end

    def associated_user_names
      ([self.owned_by] + (assigned_user_names || [])).compact
    end

    #TODO: Refactor as association or AREL query after we migrated User
    #Note this returns all associated users, including the owner
    def associated_users
      user_ids = associated_user_names
      @associated_users ||= if user_ids.present?
        User.by_user_name(keys: user_ids).all
      else
        []
      end
    end

    #TODO: Refactor as association or AREL query after we migrated PrimeroModule
    def module
      @record_module ||= PrimeroModule.get(self.module_id) if self.module_id
    end

    def users_by_association
      @users_by_association ||= associated_users.reduce({assigned_users: []}) do |hash, user|
        hash[:owner] = user if (user.user_name == owned_by)
        #TODO: Put this in only if we need to get user info about the other assigned users (probably transfers)
        #hash[:assigned_users] << user if assigned_user_names && assigned_user_names.include? user.user_name
        hash
      end
    end

    def refresh_users_by_association
      @users_by_association = nil
    end
  end

  module ClassMethods
    #TODO: Refactor with Export
    #Returns the hash with the properties within the form sections based on module and current user.
    # def get_properties_by_module(user, modules)
    #   read_only_user = user.readonly?(self.name.underscore)
    #   properties_by_module = {}
    #   modules.each do |primero_module|
    #     form_sections = allowed_formsections(user, primero_module)
    #     form_sections = form_sections.map{|key, forms| forms }.flatten
    #     properties_by_module[primero_module.id] = {}
    #     form_sections.each do |section|
    #       properties = self.properties_by_form[section.unique_id]
    #       if read_only_user
    #         readable_props = section.fields.map{|f| f.name if f.showable?}.flatten.compact
    #         properties = properties.select{|k,v| readable_props.include?(k)}
    #       end
    #       properties_by_module[primero_module.id][section.unique_id] = properties
    #     end
    #   end
    #   properties_by_module
    # end

    def allowed_formsections(user, primero_module)
      FormSection.get_allowed_visible_forms_sections(primero_module, self.parent_form, user)
    end

    # Returns all of the properties that the given user is permitted to view/edit
    # read_only_user params is to indicate the user should not see properties
    # that don't display on the show page.
    def permitted_properties(user, primero_module, read_only_user = false)
      permitted = []
      form_sections = allowed_formsections(user, primero_module)
      form_sections = form_sections.map{|key, forms| forms }.flatten
      form_sections.each do |section|
        #TODO: Refactor with MRM
        # if section.is_violation_wrapper?
        #   properties = Incident.properties.select{|p| p.name == 'violations'}
        # else
          #properties = self.properties_by_form[section.unique_id].values
          if read_only_user
            fields = section.fields
          else
            fields = section.fields.select(&:showable?)
          end
        #end
        permitted += fields
      end
      permitted = permitted.uniq{|f| f.name}
      return permitted
    end

    def permitted_property_names(user, primero_module, read_only_user = false)
      self.permitted_properties(user, primero_module, read_only_user).map {|p| p.name }
    end
  end

  def update_ownership
    refresh_users_by_association

    unless self.owner.present?
      self.owned_by = nil
    end

    self.previously_owned_by = self.changes['owned_by'].try(:fetch, 0) || owned_by
    self.previously_owned_by_full_name = self.changes['owned_by_full_name'].try(:fetch, 0) || owned_by_full_name

    if (self.owned_by.present? && (self.new_record? || self.changes_to_save_for_record['owned_by'].present?))
      self.owned_by_agency = self.owner.try(:organization)
      self.owned_by_groups = self.owner.try(:user_group_ids)
      self.owned_by_location = self.owner.try(:location)
      self.owned_by_user_code = self.owner.try(:code)
      self.previously_owned_by_agency = self.attributes_in_database['data']['owned_by_agency'] || self.owned_by_agency
      self.previously_owned_by_location = self.attributes_in_database['data']['owned_by_location'] || self.owned_by_location
    end
  end

  def update_last_updated_by(current_user)
    self.last_updated_by = current_user.user_name
    self.last_updated_by_full_name = current_user.full_name
    self.last_updated_organization = current_user.agency
    self.last_updated_at = DateTime.now
  end
end
