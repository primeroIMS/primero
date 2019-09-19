class CustomExportsController < ApplicationController

  include ExportActions
  include Exporters

  before_action :get_modules

  def permitted_forms_list
    record_type = params[:record_type]
    permitted_forms = @current_user.permitted_forms(@modules, record_type)
                                   .select{ |fs| fs.fields.any?{|er| BaseExporter::EXPORTABLE_FIELD_TYPES.include?(er.type)} }
    if params[:only_parent].present?
      permitted_forms = permitted_forms.select{|form| !form.is_nested && params[:only_parent].present? }
    end
    permitted_forms = permitted_forms.map{|form| {name: form.name, id: form.is_nested ? "subf:#{form.unique_id}" : form.unique_id}}
    render json: permitted_forms
  end

  def permitted_fields_list
    record_type = params[:record_type]
    permitted_fields = select_options_fields_grouped_by_form(
      FormSection.all_exportable_fields_by_form(@modules, record_type, @current_user, BaseExporter::EXPORTABLE_FIELD_TYPES),
      true
    )
    render json: permitted_fields
  end

  def select_options_fields_grouped_by_form(grouped_fields, include_type=false)
    unique_fields = Set.new
    grouped_fields_options = []
    if grouped_fields.present?
      grouped_fields.keys.each do |module_name|
        grouped_fields[module_name].each do |form|
          form_array = ["#{form[0]} (#{module_name})", []]
          form[1].each do |field|
            if unique_fields.add? field[0]
              form_array[1] << [field[1], field[0]]
              form_array[1].last << field[2] if include_type
            end
          end
          grouped_fields_options << form_array
        end
      end
    end
    return grouped_fields_options
  end

  private

  def get_modules
    @modules = []
    @modules = PrimeroModule.find_by(id: params[:module]) if params[:module].present?
    @modules
  end

end
