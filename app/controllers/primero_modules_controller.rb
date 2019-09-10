class PrimeroModulesController < ApplicationController

  @model_class = PrimeroModule

  include AuditLogActions

  def index
    authorize! :index, PrimeroModule
    @page_name = t("primero_modules.label")
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @primero_modules = params[:show] == "All" ? PrimeroModule.order(name: :desc) :
        PrimeroModule.order(name: :desc).find_all{|primero_module| primero_module.has_permission(params[:show])}

    respond_to do |format|
      format.html
      #respond_to_export(format, @primero_modules)
    end
  end

  def show
    @primero_module = PrimeroModule.find_by(id: params[:id])
    authorize! :view, @primero_module
    load_lookups

    respond_to do |format|
      format.html
      #respond_to_export(format, [@primero_module])
    end
  end

  def edit
    @primero_module = PrimeroModule.find_by(id: params[:id])
    authorize! :update, @primero_module
    load_lookups
  end

  def update
    @primero_module = PrimeroModule.find_by(id: params[:id])
    authorize! :update, @primero_module

    if @primero_module.update_attributes(params[:primero_module].to_h)
      flash[:notice] = t("primero_module.successfully_updated")
      redirect_to(primero_modules_path)
    else
      load_lookups
      flash[:error] = t("primero_module.error_in_updating")
      render :action => "edit"
    end
  end

  def new
    authorize! :create, PrimeroModule
    @primero_module = PrimeroModule.new
    load_lookups
  end

  def create
    authorize! :create, PrimeroModule
    @primero_module = PrimeroModule.new(params[:primero_module].to_h)
    if @primero_module.save
      return redirect_to primero_modules_path
    else
      load_lookups
      render :new
    end
  end

  def destroy
    @primero_module = PrimeroModule.find_by(id: params[:id])
    authorize! :destroy, @primero_module
    @primero_module.destroy
    redirect_to(primero_modules_url)
  end

  private

  def load_lookups
    @programs = PrimeroProgram.all
    @record_types = FormSection::RECORD_TYPES
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
  end


end
