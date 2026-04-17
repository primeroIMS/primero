# frozen_string_literal: true

# Select permitted fields on the record, based on the role, given the query params
class FieldSelectionService
  def self.select_fields_to_show(params, model_class, permitted_field_names, user)
    selected = selected_field_names(params, model_class, user)
    selected.present? ? (selected & permitted_field_names) : permitted_field_names
  end

  def self.selected_field_names(params, model_class, user)
    if params[:fields] == 'short'
      selected_field_names = model_class.summary_field_names
      selected_field_names |= model_class.preview_field_names if preview?(params, model_class, user)
      selected_field_names
    elsif params[:fields].present?
      params[:fields].split(',')
    end
  end

  def self.preview?(params, model_class, user)
    params[:id_search] && user.can_preview?(model_class)
  end
end
