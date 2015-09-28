class RolesController < ApplicationController
  @model_class = Role

  include ExportActions
  include ImportActions

  def index
    authorize! :index, Role
    @page_name = t("roles.label")
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
    #TODO - edit form not pre-populated with permissions_list settings
    @forms_by_record_type = FormSection.all_forms_grouped_by_parent
    authorize! :update, @role
  end

  def update
    @role = Role.get(params[:id])
    authorize! :update, @role

    #TODO - add role_from_params here...
    if @role.update_attributes(params[:role])
      flash[:notice] = t("role.successfully_updated")
      redirect_to(roles_path)
    else
      flash[:error] = t("role.error_in_updating")
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
    @role = Role.new(role_from_params)
    binding.pry
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
    #TODO - role_ids
    #TODO - group settings
    role_hash = {}
    role_hash[:name] = params[:role][:name]
    role_hash[:description] = params[:role][:description]
    role_hash[:transfer] = params[:role][:transfer]
    role_hash[:referral] = params[:role][:referral]
    role_hash[:permitted_form_ids] = params[:role][:permitted_form_ids]
    role_hash[:permissions_list] = []
    params[:role][:permissions_list].each do |permission|
      #First element is the index value, second element is the actual hash
      perm_hash = permission.second
      if perm_hash[:actions].present?
        new_permission = Permission.new(resource: perm_hash[:resource], actions: perm_hash[:actions])
        role_hash[:permissions_list] << new_permission
      end
    end
    return role_hash
  end

end
