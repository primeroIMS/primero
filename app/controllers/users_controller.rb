class UsersController < ApplicationController
  @model_class = User

  include RecordFilteringPagination
  include ExportActions
  include ImportActions

  before_action :clean_role_ids, :only => [:update, :create]
  before_action :clean_module_ids, :only => [:update, :create]
  before_action :clean_user_locale, :only => [:update, :create]
  before_action :clean_group_ids, :only => [:update, :create]
  before_action :load_user, :only => [:show, :edit, :update, :destroy]
  before_action :agency_names, :only => [:new, :create, :edit, :update]
  before_action :load_services, :only => [:new, :create, :edit]
  before_action :sanitize_services_multiselect, :only => [:create, :update]

  skip_before_action :check_authentication, :set_locale, :only => :register_unverified

  include LoggerActions

  def index
    authorize! :read, User

    @current_modules = [] #Hack because this is expected in templates used.
    @saved_searches = []   #Hack because this is expected in templates used.
    @filters = record_filter(filter)

    @page_name = t("home.users")

    @per_page = per_page

    if params[:page] != 'all'
      editable_users = load_editable_users || load_users
      users_page = editable_users.try(:page, page).try(:per, @per_page)
      @users = users_page.try(:all) || []
      @total_records = users_page.count
      @paginated_users = paginated_collection(@users, @total_records)
    else
      @users = load_users.try(:all) || []
      @total_records = @users.size
    end

    #TODO:  Is user_details used?
    @users_details = users_details

    respond_to do |format|
      format.html
      respond_to_export(format, @users)
    end

    if params[:ajax] == "true"
      #TODO: the partial "users/user" does not exist.
      render :partial => "users/user", :collection => @users
    end
  end

  def search
    authorize! :read, User
    authorize! :search, User

    agency_id = params[:agency_id]
    location = params[:location]
    services = params[:services]

    if services.present? && !services.is_a?(Array)
      services = [services]
    end

    services.reject!(&:blank?) if services.present?

    respond_to do |format|
      format.json do
        users = User.by_disabled(key: false).all.select do |user|
          (agency_id.present? ? user.organization == agency_id : true) &&
          (location.present? ? user.location == location : true) &&
          (services.present? ? services.all? { |service| user[:services].try(:include?, service) } : true)
        end
        render json: {
                success: 1,
                users: users.map{ |user| user.attributes.slice('user_name', 'full_name', 'position', 'code', 'organization') }
              }
      end
    end
  end

  def unverified
    authorize! :show, User
    @page_name = t("users.unverified")
    flash[:verify] = t('users.select_role')
    @users = User.all_unverified
  end

  def show
    @page_name = t("users.account_details")
    authorize! :show, @user

    respond_to do |format|
      format.html
      respond_to_export(format, [@user])
    end
  end

  def new
    authorize! :create, User
    @page_name = t("user.new")
    @user = User.new
    load_lookups
  end

  def edit
    authorize! :update, @user
    @page_name = t("account")+": #{@user.full_name}"
    load_lookups
  end

  def create
    authorize! :create, User

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
    authorize! :update, @user  if params[:user].except(:disabled).present?
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

  def load_editable_users
    enabled_param = get_enabled_param
    if has_agency_read
      if enabled_param.present?
        User.send("by_organization_#{enabled_param}").key(current_user.organization)
      else
        User.send("by_organization").key(current_user.organization)
      end
    end
  end

  def load_users
    enabled_param = get_enabled_param
    if enabled_param.present?
      User.send("by_user_name_#{enabled_param}")
    else
      User.send("by_user_name")
    end
  end

  def load_lookups
    @roles = Role.all.select{|r| can? :assign, r}
    @user_groups = UserGroup.all.select{|ug| can?(:assign, ug)}
    @modules = @current_user.has_group_permission?(Permission::ALL) ? PrimeroModule.all.all : PrimeroModule.all(keys: @current_user.module_ids).all
  end

  #Override method in LoggerActions.
  def logger_action_identifier
    if action_name == 'create' && params[:user].present? && params[:user][:user_name].present?
      "#{logger_model_titleize} 'user-#{params[:user][:user_name]}'"
    else
      super
    end
  end

  def load_services
    @services = Lookup.values_for_select('lookup-service-type')
  end

  def sanitize_services_multiselect
    sanitize_multiselect_params(:user, [:services])
  end

  #Override method defined in record_filtering_pagination
  def per_page
    @per_page ||= params[:per] ? params[:per].to_i : 50
  end

  def record_filter(filter)
    filter["status"] ||= {:type => "list", :value => 'enabled'}
    filter
  end

  def get_enabled_param
    enabled_param = if params[:scope].present? && params[:scope][:status].present?
                      params[:scope][:status].split('||')
                    else
                      ['list','enabled']
                    end
    enabled_param.last if enabled_param.size == 2
  end

end
