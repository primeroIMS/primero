class LookupsController < ApplicationController

  @model_class = Lookup

  before_action :load_lookup, :only => [:edit, :update, :destroy]

  include AuditLogActions

  def index
    authorize! :index, Lookup
    @page_name = t("lookup.index")
    @lookups = Lookup.all
  end

  def new
    authorize! :create, Lookup
    @page_name = t("lookup.create")
    @lookup = Lookup.new(params[:lookup])
  end

  def create
    authorize! :create, Lookup
    lookup = Lookup.new(params[:lookup].to_h)

    if (lookup.valid?)
      lookup.save
      flash[:notice] = t("lookup.messages.updated")
      redirect_to lookups_path
    else
      @lookup = lookup
      render :new
    end
  end

  def edit
    authorize! :update, Lookup
    @page_name = t("lookup.edit")
  end

  def update
    authorize! :update, Lookup

    @lookup.update_attributes params[:lookup].to_h

    if !has_lookup_values?
      @lookup.clear_all_values
    end

    if @lookup.save
      redirect_to lookups_path
    else
      render :edit
    end
  end

  def destroy
    authorize! :destroy, Lookup
    @lookup.destroy
    redirect_to lookups_path
  end


  private

  def load_lookup
    @lookup = Lookup.find_by(id: params[:id]) if params[:id]
  end

  def has_lookup_values?
    return false if params[:lookup].blank?
    params[:lookup].keys.any? { |key| key.to_s.start_with?('lookup_values') }
  end

end
