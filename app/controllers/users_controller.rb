class UsersController < ApplicationController
  @model_class = User

  include ExportActions
  include ImportActions
  include DisableActions

  before_action :clean_role_ids, :only => [:update, :create]
  before_action :clean_module_ids, :only => [:update, :create]
  before_action :clean_user_locale, :only => [:update, :create]
  before_action :clean_group_ids, :only => [:update, :create]
  before_action :load_user, :only => [:show, :edit, :update, :destroy]
  before_action :load_records_according_to_disable_filter, :only => [:index]
  before_action :agency_names, :only => [:new, :create, :edit, :update]

  skip_before_action :check_authentication, :set_locale, :only => :register_unverified

  include LoggerActions

  def index
    authorize!(:read, User)

    @page_name = t("home.users")
    @users_details = users_details
    @editable_users = editable_users

    respond_to do |format|
      format.html
      respond_to_export(format, @users)
    end

    if params[:ajax] == "true"
      render :partial => "users/user", :collection => @users
    end
  end

  def unverified
    authorize!(:show, User)
    @page_name = t("users.unverified")
    flash[:verify] = t('users.select_role')
    @users = User.all_unverified
  end

  def show
    @page_name = t("users.account_details")
    authorize!(:show_user, @user)

    respond_to do |format|
      format.html
      respond_to_export(format, [@user])
    end
  end

  def new
    authorize!(:create, User)
    @page_name = t("user.new")
    @user = User.new
    load_lookups
  end

  def edit
    authorize!(:edit_user, @user)
    @page_name = t("account")+": #{@user.full_name}"
    load_lookups
  end

  def create
    authorize!(:create, User)
    @user = User.new(params[:user].to_h)

    if @user.save
      @user.send_welcome_email(request.base_url)
      flash[:notice] = t("user.messages.created")
      redirect_to(@user)
    else
      load_lookups
      render :action => "new"
    end
  end

  def update
    authorize! :disable, @user if params[:user].include?(:disabled)
    authorize!(:edit_user, @user)  if params[:user].except(:disabled).present?
    params[:verify] = !@user.verified?

    if (@user.update_attributes(params[:user]))
      verify_children if params[:verify]
      if request.xhr?
        render plain: 'OK'
      else
        flash[:notice] = t("user.messages.updated")
        redirect_to(@user)
      end
    else
      load_lookups
      render :action => "edit"
    end
  end

  def change_password
    @change_password_request = Forms::ChangePasswordForm.new(:user => current_user)
  end

  def update_password
    @change_password_request = Forms::ChangePasswordForm.new params[:forms_change_password_form].to_h
    @change_password_request.user = current_user
    if @change_password_request.execute
      respond_to do |format|
        format.html do
          flash[:notice] = t("user.messages.password_changed_successfully")
          redirect_to user_path(current_user.id)
        end
        format.json { render :nothing => true }
      end
    else
      respond_to do |format|
        format.html { render :change_password }
        format.json { render :nothing => true, :status => :bad_request }
      end
    end
  end

  def destroy
    authorize! :destroy, @user
    @user.destroy
    redirect_to(users_url)
  end

  def register_unverified
    respond_to do |format|
      format.json do
        params[:user] = JSON.parse(params[:user]) if params[:user].is_a?(String)
        return render(:json => {:response => "ok"}.to_json) unless User.find_by_user_name(params[:user]["user_name"]).nil?
        password = params[:user]["unauthenticated_password"]
        updated_params = params[:user].merge(:verified => false, :password => password, :password_confirmation => password)
        updated_params.delete("unauthenticated_password")
        user = User.new(updated_params.to_h)

        user.save!
        render :json => {:response => "ok"}.to_json
      end
    end
  end

  private
  def write_to_log comment
    File.open("/Users/ambhalla/Desktop/log.txt", "w+") do |f|
      f.write comment
    end
  end

  def verify_children
    children = Child.all_by_creator @user.user_name
    children.each do |child|
      child.verified = true
      child.save
    end
  end
  def load_user
    @user = User.get(params[:id])
    if @user.nil?
      flash[:error] = t("user.messages.not_found")
      redirect_to :action => :index and return
    end
  end

  def agency_names
    if has_agency_read
      @agency_names = Agency.all_names.select do |agency|
        agency['id'] == current_user.agency.id
      end
    else
      @agency_names = Agency.all_names
    end
  end

  def clean_role_ids
    params[:user][:role_ids] = clean_params(params[:user][:role_ids]) if params[:user][:role_ids]
  end

  def clean_group_ids
    params[:user][:user_group_ids] = clean_params(params[:user][:user_group_ids]) if params[:user][:user_group_ids]
  end

  def clean_module_ids
    params[:user][:module_ids] = clean_params(params[:user][:module_ids]) if params[:user][:module_ids]
  end

  def clean_user_locale
    params[:user][:locale] = params[:user][:locale].present? ? params[:user][:locale] : nil
  end

  def users_details
    @users.map do |user|
      {
          :user_url => user_url(:id => user),
          :user_name => user.user_name,
          :token => form_authenticity_token
      }
    end
  end

  def has_agency_read
    @has_agency_read = current_user.has_permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ)
  end

  def editable_users
    @users.select do |user|
      (has_agency_read && current_user.agency == user.agency) || !has_agency_read
    end
  end

  def load_lookups
    @roles = Role.all.select{|r| can? :assign, r}
    @user_groups = UserGroup.all.select{|ug| can?(:assign, ug)}
    @modules = @current_user.has_group_permission?(Permission::ALL) ? PrimeroModule.all.all : PrimeroModule.all(keys: @current_user.module_ids).all
    @agency_offices = Lookup.values('lookup-agency-office')
  end

  #Override method in LoggerActions.
  def logger_action_identifier
    if action_name == 'create' && params[:user].present? && params[:user][:user_name].present?
      "#{logger_model_titleize} 'user-#{params[:user][:user_name]}'"
    else
      super
    end
  end

end
