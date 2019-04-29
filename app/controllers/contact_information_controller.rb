class ContactInformationController < ApplicationController
  skip_before_action :authenticate_user!, :only => %w{show}
  before_action :load_contact_information!, :only => [:show, :update]

  @model_class = ContactInformation

  include LoggerActions

  # GET /contact_information/Administrator
  def show
    @page_name = I18n.t("header.contact")
    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @contact_information }
    end
  end

  # GET /contact_information/Administrator/edit
  def edit
    @page_name =I18n.t("contact.edit_info")
    @contact_information = ContactInformation.get_or_create
    authorize! :edit, @contact_information
  end

  # PUT /contact_information/Administrator
  def update
    authorize! :update, @contact_information
    @contact_information.update_attributes(params[:contact_information].to_h)
    @contact_information.save!
    flash[:notice] = I18n.t("contact.updated")
    redirect_to edit_contact_information_path('administrator')
  end

  def load_contact_information!
    @contact_information ||= ContactInformation.current
    raise ErrorResponse.not_found(I18n.t("contact.not_found")) if @contact_information.nil?
  end
end
