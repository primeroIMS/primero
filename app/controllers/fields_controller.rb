class FieldsController < ApplicationController
  include FormCustomization

  @model_class = Field

  before_action { authorize! :manage, Field }
  before_action :read_form_section
  before_action :module_id, :only => [:create, :update, :destroy]
  before_action :get_lookups, :only => [:edit, :update, :create]
  after_action :refresh_properties, :only => [:create, :update, :destroy]

  FIELD_TYPES = %w{ text_field textarea check_box select_box radio_button numeric_field date_field }

  include AuditLogActions

  def read_form_section
    @form_section = FormSection.find_by(unique_id: params[:form_section_id])
  end

  def create
    @field = Field.new(clean_field(params[:field].to_h))
    FormSection.add_field_to_formsection @form_section, @field

    if @field.errors.present? || @form_section.errors.present?
      get_form_groups
      @show_add_field = { :show_add_field => @field.errors.present? }
      render :template => "form_section/edit", :locals => @show_add_field
    else
      redirect_to(edit_form_section_path(params[:form_section_id], module_id: @module_id, parent_form: @parent_form), flash: {notice: t("fields.successfully_added")} )
    end
  end

  def edit
    @body_class = 'forms-page'
    @field = @form_section.fields.detect { |field| field.name == params[:id] }
    @show_add_field = {:show_add_field => true, :edit_field_mode => true}
    @module_id = params[:module_id]
    render :template => "form_section/edit", :locals => @show_add_field
  end

  def change_form
    #TODO: Rewrite with Arel Field
    @field = @form_section.fields.detect { |field| field.name == params[:id] }
    @form_section.delete_field @field.name
    #TODO: No longer necessary?
    #destination_form = FormSection.find_by(unique_id: params[:destination_form_id])
    #destination_form.add_field @field
    #destination_form.save
    flash[:notice] = t("moved_from", :field_name => @field.display_name, :from_fs => @form_section.name, :to_fs => destination_form.name)
    redirect_to edit_form_section_path(params[:form_section_id])
  end

  def update
    @field = fetch_field(params[:id])
    @field.update_attributes(convert_multi_selects(params[:field].to_h)) unless params[:field].nil?

    if @field.errors.present?
      get_form_groups
      @show_add_field = {:show_add_field => @field.errors.present?}
      render :template => "form_section/edit",  :locals => @show_add_field
    else
      flash[:notice] = t("fields.updated")
      message = {"status" => "ok"}
      if (request.xhr?)
        render :json => message
      else
        redirect_to(edit_form_section_path(params[:form_section_id], module_id: @module_id, parent_form: @parent_form))
      end
    end
  end

  def save_order
    @form_section.order_fields(params[:ids])
    redirect_to(edit_form_section_path(params[:form_section_id]))
  end

  def show
    redirect_to(edit_form_section_path(params[:form_section_id]))
  end

  def destroy
    field = @form_section.fields.find { |field| field.name == params[:field_name] }
    @form_section.delete_field(field.name)
    flash[:notice] = t("fields.deleted", :display_name => field.display_name)
    redirect_to(edit_form_section_path(params[:form_section_id], module_id: @module_id, parent_form: @parent_form))
  end

  def toggle_fields
    field =  fetch_field params[:id]
    field.visible = !field.visible
    field.save
    render plain: 'OK'
  end

  private

  def fetch_field(field_name)
    Field.find_by(name: field_name)
  end

  def get_lookups
    @lookups = Lookup.all
    @lookup_options = @lookups.map{|lkp| [lkp.name, "lookup #{lkp.id}"]}
    @lookup_options.unshift("", "Location")
  end

  def module_id
    @module_id = params[:module_id] || ""
  end

  def refresh_properties
    if @form_section.parent_form == 'case'
      Child.refresh_form_properties
    elsif @form_section.parent_form == 'incident'
      Incident.refresh_form_properties
    elsif @form_section.parent_form == 'tracing_request'
      TracingRequest.refresh_form_properties
    end
  end

  def clean_field(field = {})
    # Remove empty / blank values from any field array elements
    field.each do |key, value|
      if value.is_a?(Array)
        value.reject!(&:blank?)
      end
    end
    convert_multi_selects(field)
  end

  def convert_multi_selects(field = {})
    # TODO: Will have to be commented back in when we come up with a better scheme to give options a unique id and a
    # way to create/edit them. As a temp solution. I (JT) am making multi-select options not editable. The code in the init
    # function of primero.js will also need to be removed. There is a note there too
    #
    # if field[:multi_select] == 'true' && (field[:option_strings_source].nil? || field[:option_strings_source].empty?)
    #   Primero::Application::locales.each do |locale|
    #     if !field[:"option_strings_text_#{locale}"].empty?
    #       field[:"option_strings_text_#{locale}"] = field[:"option_strings_text_#{locale}"].split(/[\r\n]+/)
    #                      .map{ |option| { id: option.downcase.lstrip.gsub(/[^\w ]/, '').gsub(' ', '_'), display_text: option }}
    #     end
    #   end
    # end
    return field
  end
end
