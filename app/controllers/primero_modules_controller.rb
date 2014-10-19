class PrimeroModulesController < ApplicationController

  @model_class = PrimeroModule

  def index
    authorize! :index, PrimeroModule
    @page_name = t("modules.label")
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @primero_modules = params[:show] == "All" ? PrimeroModule.by_name(:descending => sort_option) : PrimeroModule.by_name(:descending => sort_option).find_all{|primero_module| primero_module.has_permission(params[:show])}

    respond_to do |format|
      format.html
      #respond_to_export(format, @primero_modules)
    end
  end

  def show
    @primero_module = PrimeroModule.get(params[:id])
    authorize! :view, @primero_module

    respond_to do |format|
      format.html
      #respond_to_export(format, [@primero_module])
    end
  end

  def edit
    @primero_module = PrimeroModule.get(params[:id])
    authorize! :update, @primero_module
  end

  def update
    @primero_module = PrimeroModule.get(params[:id])
    authorize! :update, @primero_module

    if @primero_module.update_attributes(params[:primero_module])
      flash[:notice] = t("module.successfully_updated")
      redirect_to(primero_modules_path)
    else
      flash[:error] = t("module.error_in_updating")
      render :action => "edit"
    end
  end

  def new
    authorize! :create, PrimeroModule
    @primero_module = PrimeroModule.new
  end

  def create
    authorize! :create, PrimeroModule
    @primero_module = PrimeroModule.new(params[:primero_module])
    return redirect_to primero_modules_path if @primero_module.save
    render :new
  end

  def destroy
    @primero_module = PrimeroModule.get(params[:id])
    authorize! :destroy, @primero_module
    @primero_module.destroy
    redirect_to(primero_modules_url)
  end


end
