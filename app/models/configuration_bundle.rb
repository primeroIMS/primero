class ConfigurationBundle < ApplicationRecord

  # include Memoizable #Nothing to memoize but provides refresh infrastructure

  def self.import(model_data, applied_by=nil)
    Rails.logger.info "Starting configuration bundle import..."
    begin
      cache_users_relations

      model_data.each do |model_clazz, data_arr|
        model = model_clazz.constantize

        Rails.logger.info "Removing the data for: #{model.name}"
        model.clear

        Rails.logger.info "Inserting data for: #{model.name}"
        data_arr.each { |data| model.import(data) }

        Rails.logger.info "#{model.count} records inserted for: #{model.name}"
      end

      update_users_relations

      ConfigurationBundle.create! applied_by: applied_by
    rescue => e
      Rails.logger.error e.inspect
    end
    Rails.logger.info "Successfully completed configuration bundle import."
  end

  def self.export
    bundle_data = {}
    bundle_models.each do |model|
      bundle_data[model.name] = model.export.map {|x| x["class_name"] = model.name; x }
    end
    bundle_data
  end

  def self.export_as_json
    JSON.pretty_generate(export)
  end

  # Keep this order due a export dependencies
  def self.bundle_models
    [
      Agency, ContactInformation, FormSection, Location, Lookup,
      PrimeroProgram, PrimeroModule, Report, Role,
      UserGroup, ExportConfiguration, SystemSettings
    ]
  end

  def self.cache_users_relations
    @user_relations = {}
    User.all.each do |u|
      @user_relations[u.user_name] = {
        agency:u.agency.agency_code,
        role: u.role.unique_id,
        user_groups: u.user_groups.map(&:unique_id),
        modules: u.primero_modules.map(&:unique_id)
      }
    end
  end

  def self.update_users_relations
    @user_relations.each do |key, value|
      user = User.find_by(user_name: key)
      user.agency = Agency.find_by(agency_code: value[:agency])
      user.role = Role.find_by(unique_id: value[:role])
      user.user_groups = UserGroup.where(unique_id: value[:user_groups])
      user.primero_modules = PrimeroModule.where(unique_id: value[:modules])
      user.save
    end
  end


  #Ducktyping to allow refreshing
  # def self.flush_cache ; end
end
