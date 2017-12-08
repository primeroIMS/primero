class ContactInformationController < ApplicationController
  skip_before_action :check_authentication, :only => %w{show}
  before_action :system_settings, :only => [:show, :edit]

  @model_class = ContactInformation

  include LoggerActions

  # GET /contact_information/Administrator
  def show
    @page_name = I18n.t("header.contact")
    @contact_information = ContactInformation.get_by_id(params[:id])
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @contact_information }
    end
  end

  # GET /contact_information/Administrator/edit
  def edit
    @page_name =I18n.t("contact.edit_info")
    @contact_information = ContactInformation.get_or_create(params[:id])
    authorize! :edit, @contact_information
  end

  # PUT /contact_information/Administrator
  def update
    @contact_information = ContactInformation.get_by_id(params[:id])
    authorize! :update, @contact_information

    @contact_information.update_attributes(params[:contact_information].to_h)
    @contact_information.save!
    flash[:notice] = I18n.t("contact.updated")
    redirect_to edit_contact_information_path(params[:id])
  end

  private

  def system_settings
    @system_settings ||= SystemSettings.first
  end
end