class LocationsController < ApplicationController

  @model_class = Location

  include DisableActions

  before_action :load_location, :only => [:edit, :update, :destroy]
  before_action :load_records_according_to_disable_filter, :except => [:destroy]
  before_action :load_types, :only => [:index, :new, :edit]

  include AuditLogActions

  def index
    authorize! :index, Location
    @page_name = t("location.index")
  end

  def new
    authorize! :create, Location
    @page_name = t("location.create")
    @location = Location.new(params[:location])
  end

  def create
    authorize! :create, Location
    location = Location.new(params[:location].to_h)

    if location.save
      flash[:notice] = t("location.messages.updated")
      redirect_to locations_path
    else
      @location = location
      load_types
      render :new
    end
  end

  def edit
    authorize! :update, Location
    @page_name = t("location.edit")
  end

  def update
    authorize! :update, Location

    if @location.update_attributes(params[:location].to_h)
      redirect_to locations_path
    else
      load_location
      load_types
      render :edit
    end
  end

  def destroy
    authorize! :destroy, Location
    @location.destroy
    flash[:notice] = t("location.messages.deleted")
    redirect_to locations_path
  end


  private

  def load_location
    @location = Location.find_by(id: params[:id]) if params[:id]
  end

  def load_types
    @location_types = Lookup.get_location_types
  end

  #Override method in AuditLogActions.
  def logger_action_identifier
    if @location.present?
      "#{logger_model_titleize} '#{@location.type} - #{@location.placename}'"
    else
      super
    end
  end

end
