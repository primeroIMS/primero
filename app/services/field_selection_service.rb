class FieldSelectionService

  def self.select_fields_to_show(params, model_class, permitted_field_names, user)
    selected_field_names = nil
    if params[:fields] == 'short'
      selected_field_names = model_class.summary_field_names
      if preview?(params, model_class, user)
        selected_field_names |= model_class.preview_field_names
      end
      selected_field_names
    elsif params[:fields].present?
      selected_field_names = params[:fields].split(',')
    end
    if selected_field_names.present?
      selected_field_names & permitted_field_names
    else
      permitted_field_names
    end
  end

  def self.preview?(params, model_class, user)
    params[:id_search] && user.can_preview?(model_class)
  end

end