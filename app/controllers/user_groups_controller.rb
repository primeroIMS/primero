class UserGroupsController < ApplicationController

  @model_class = UserGroup

  include LoggerActions
  include RecordFilteringPagination

  before_action :find_user_group, only: [:show, :edit, :update, :destroy]

  def index
    authorize! :index, UserGroup
    @page_name = t("user_groups.label")
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @user_groups = params[:show] == "All" ? UserGroup.all : UserGroup.all.find_all{|group| group.has_permission(params[:show])}
    @total_records = @user_groups.count
    @user_groups = @user_groups.order(:unique_id).paginate(:page => page, :per_page => per_page)
  end

  def show
    authorize! :view, @user_group

    respond_to do |format|
      format.html
      #respond_to_export(format, [@user_group])
    end
  end

  def edit
    authorize! :update, @user_group
  end

  def update
    authorize! :update, @user_group
    if @user_group.update_attributes(params[:user_group].to_h)
      flash[:notice] = t("user_group.successfully_updated")
      redirect_to(user_groups_path)
    else
      flash[:error] = t("user_group.error_in_updating")
      render :action => "edit"
    end
  end

  def new
    authorize! :create, UserGroup
    @user_group = UserGroup.new
  end

  def create
    authorize! :create, UserGroup
    @user_group = UserGroup.new(params[:user_group].to_h)
    if @user_group.save
      if current_user.has_group_permission?(Permission::GROUP)
        current_user.user_group_ids << @user_group.id
        current_user.save
      end
      redirect_to user_groups_path
    else
      render :new
    end
  end

  def destroy
    authorize! :destroy, @user_group
    @user_group.destroy
    redirect_to(user_groups_url)
  end

  #Override method defined in record_filtering_pagination
  def per_page
    @per_page ||= params[:per] ? params[:per].to_i : 50
    @per_page
  end

  private

  def find_user_group
    @user_group = UserGroup.find(params[:id])
  end

end
