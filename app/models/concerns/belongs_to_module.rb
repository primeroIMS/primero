module BelongsToModule
  extend ActiveSupport::Concern

  def validate_modules_present(module_id_property)
    primero_module_ids = self.try module_id_property
    primero_module_ids = [primero_module_ids].compact unless primero_module_ids.is_a? Array
    valid = if primero_module_ids.present?
      all_ids = PrimeroModule.all.rows.map {|r|r['id']}
      (primero_module_ids & all_ids).size == primero_module_ids.size
    else
      false
    end
    self.errors.add(module_id_property, I18n.t('primero_modules.messages.invalid')) unless valid
  end

end