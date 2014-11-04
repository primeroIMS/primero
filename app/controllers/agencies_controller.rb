class AgenciesController < ApplicationController

  @model_class = Agency

  include MediaActions

  before_filter :filter_params_array_duplicates, :only => [:create, :update]
  before_filter :load_record_or_redirect, :only => [ :show, :edit, :destroy ]

  def index
    authorize! :index, Agency
    @page_name = t("agencies.label")
    @agencies = Agency.by_order
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
    @agency = Agency.new(params[:agency])
    if @agency.save
      flash[:notice] = t("agencies.successfully_created")
      return redirect_to agencies_path
    else
      render :new
    end
  end

  def edit
    authorize! :update, @agency
  end

  def update
    @agency = Agency.get(params[:id])
    authorize! :update, @agency

    if @agency.update_attributes(params[:agency])
      flash[:notice] = t("agencies.successfully_updated")
      redirect_to(agencies_path)
    else
      flash[:error] = t("agencies.error_in_updating")
      render :action => "edit"
    end
  end

  def destroy
    authorize! :destroy, @agency
    @agency.destroy
    redirect_to(agencies_path)
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
    @agency = Agency.get(params[:id])

    if @agency.nil?
      respond_to do |format|
        format.html do
          flash[:error] = "Agency with the given id is not found"
          redirect_to :action => :index and return
        end
      end
    end
  end
end