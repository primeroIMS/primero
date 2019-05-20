class FieldSelectionService

  def self.select_fields_to_show(params, model_class, permitted_field_names)
    selected_field_names = nil
    if params[:fields] == 'short'
      selected_field_names = model_class.summary_field_names
    elsif params[:fields].present?
      selected_field_names = params[:fields].split(',')
    end
    if selected_field_names.present?
      selected_field_names & permitted_field_names
    else
      permitted_field_names
    end
  end

end