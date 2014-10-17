class LookupsController < ApplicationController
  @model_class = Lookup

  # include ExportActions
  # include ImportActions

  def index
    authorize! :index, Lookup
    @page_name = t("lookup.index")
    @lookups = Lookup.all

    # respond_to do |format|
      # format.html
      # respond_to_export(format, @form_sections.values.flatten)
    # end
  end

  def new
    authorize! :create, Lookup
    @page_name = t("lookup.create")
    @lookup = Lookup.new(params[:lookup])
  end

  def create
    authorize! :create, Lookup
    lookup = Lookup.new(params[:lookup])    

    if (lookup.valid?)
      lookup.create
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
    @lookup = Lookup.get(params[:id])
  end

  def update
    authorize! :update, Lookup
    @lookup = Lookup.get(params[:id])
    @lookup.update_attributes params[:lookup]

    if @lookup.save
      redirect_to lookups_path
    else
      render :edit
    end
  end
end
