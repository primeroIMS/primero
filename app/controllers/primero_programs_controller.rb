class PrimeroProgramsController < ApplicationController

  @model_class = PrimeroProgram

  include LoggerActions

  def index
    authorize! :index, PrimeroProgram
    @page_name = t("primero_programs.label")
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @primero_programs = params[:show] == "All" ? PrimeroProgram.by_name(:descending => sort_option) : PrimeroProgram.by_name(:descending => sort_option).find_all{|program| program.has_permission(params[:show])}

    respond_to do |format|
      format.html
      #respond_to_export(format, @primero_programs)
    end
  end

  def show
    @primero_program = PrimeroProgram.get(params[:id])
    authorize! :view, @primero_program

    respond_to do |format|
      format.html
      #respond_to_export(format, [@primero_program])
    end
  end

  def edit
    @primero_program = PrimeroProgram.get(params[:id])
    authorize! :update, @primero_program
  end

  def update
    @primero_program = PrimeroProgram.get(params[:id])
    authorize! :update, @primero_program

    if @primero_program.update_attributes(params[:primero_program].to_h)
      flash[:notice] = t("primero_program.successfully_updated")
      redirect_to(primero_programs_path)
    else
      flash[:error] = t("primero_program.error_in_updating")
      render :action => "edit"
    end
  end

  def new
    authorize! :create, PrimeroProgram
    @primero_program = PrimeroProgram.new
  end

  def create
    authorize! :create, PrimeroProgram
    @primero_program = PrimeroProgram.new(params[:primero_program].to_h)
    if @primero_program.save
      return redirect_to primero_programs_path
    else
      render :new
    end
  end

  def destroy
    @primero_program = PrimeroProgram.get(params[:id])
    authorize! :destroy, @primero_program
    @primero_program.destroy
    redirect_to(primero_programs_url)
  end


end
