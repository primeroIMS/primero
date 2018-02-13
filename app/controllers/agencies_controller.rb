class AgenciesController < ApplicationController

  @model_class = Agency

  include MediaActions
  include DisableActions

  before_action :filter_params_array_duplicates, :only => [:create, :update]
  before_action :load_record_or_redirect, :only => [ :show, :edit, :destroy, :update ]
  before_action :load_records_according_to_disable_filter, :only => [:index]

  include LoggerActions

  def index
    authorize! :index, Agency
    @page_name = t("agencies.label")
  end

  def show
    authorize! :view, @agency

    respond_to do |format|
      format.html
    end
  end

  def new
    authorize! :create, Agency
    @agency = Agency.new
  end

  def create
    authorize! :create, Agency
    @agency = Agency.new(params[:agency].to_h)

    if @agency.save
      redirect_to agencies_path, notice: t("agencies.successfully_created")
    else
      render :new
    end
  end

  def edit
    authorize! :update, Agency
  end

  def update
    authorize! :update, Agency

    @agency.update_attributes(params[:agency].to_h)

    if @agency.save
      redirect_to agencies_path, notice: t("agencies.successfully_updated")
    else
      flash[:error] = t("agencies.error_in_updating")
      render :action => "edit"
    end
  end

  def destroy
    authorize! :destroy, Agency
    @agency.destroy
    redirect_to agencies_path
  end

  def update_order
    agencies = Agency.all.all

    params['user-row-agency-row'].each_with_index do |id, index|
      agency = agencies.select{ |a| a.name == id }.first
      agency.update_attributes(order: index + 1)
    end

    render :json => ""
  end

  private

  def load_record_or_redirect
    @agency = Agency.get(params[:id]) if params[:id]
  end
end