class RolesController < ApplicationController
  @model_class = Role

  include ExportActions
  include ImportActions
  include CopyActions
  include LoggerActions

  def index
    authorize! :index, Role
    @page_name = t('roles.label')
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @roles = params[:show] == "All" ? Role.by_name(:descending => sort_option) : Role.by_name(:descending => sort_option).find_all{|role| role.has_permission(params[:show])}

    respond_to do |format|
      format.html
      respond_to_export(format, @roles)
    end
  end

  def show
    @role = Role.get(params[:id])
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
    authorize! :view, @role

    respond_to do |format|
      format.html
      respond_to_export(format, [@role])
    end
  end

  def edit
    @role = Role.get(params[:id])
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
    authorize! :update, @role
  end

  def update
    @role = Role.get(params[:id])
    authorize! :update, @role

    if @role.update_attributes(role_from_params.to_h)
      flash[:notice] = t('role.successfully_updated')
      redirect_to(roles_path)
    else
      flash[:error] = t('role.error_in_updating')
      @forms_by_record_type = FormSection.all_forms_grouped_by_parent
      render :action => "edit"
    end
  end

  def new
    authorize! :create, Role
    @role = Role.new
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
  end

  def create
    authorize! :create, Role
    @role = Role.new(role_from_params.to_h)
    return redirect_to roles_path if @role.save
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
    render :new
  end

  def destroy
    @role = Role.get(params[:id])
    authorize! :destroy, @role
    @role.destroy
    redirect_to(roles_url)
  end

  private

  def role_from_params
    role_hash = {}
    role_hash[:name] = params[:role][:name]
    role_hash[:description] = params[:role][:description]
    role_hash[:transfer] = params[:role][:transfer]
    role_hash[:referral] = params[:role][:referral]
    role_hash[:group_permission] = params[:role][:group_permission]
    role_hash[:permitted_form_ids] = params[:role][:permitted_form_ids]
    role_hash[:reporting_location_level] = params[:role][:reporting_location_level]
    role_hash[:permissions] = []
    if params[:role][:permissions_list].present?
      params[:role][:permissions_list].values.each do |permission|
        role_hash[:permissions] << Permission.new(resource: permission[:resource],
                                                  actions: permission[:actions],
                                                  role_ids: permission[:role_ids]
                                                 ) if permission[:actions].present?
      end
    end
    role_hash
  end

end
