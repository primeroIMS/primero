class UserGroupsController < ApplicationController

  @model_class = UserGroup

  include LoggerActions
  include RecordFilteringPagination

  def index
    authorize! :index, UserGroup
    @page_name = t("user_groups.label")
    sort_option = params[:sort_by_descending_order] || false
    params[:show] ||= "All"
    @user_groups = params[:show] == "All" ? UserGroup.by_name(:descending => sort_option) : UserGroup.by_name(:descending => sort_option).find_all{|group| group.has_permission(params[:show])}

    @total_records = @user_groups.count
    per_page
    @user_groups = paginated_collection(@user_groups.try(:all), @user_groups.count)
  end

  def show
    @user_group = UserGroup.get(params[:id])
    authorize! :view, @user_group

    respond_to do |format|
      format.html
      #respond_to_export(format, [@user_group])
    end
  end

  def edit
    @user_group = UserGroup.get(params[:id])
    authorize! :update, @user_group
  end

  def update
    @user_group = UserGroup.get(params[:id])
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
    return redirect_to user_groups_path if @user_group.save
    render :new
  end

  def destroy
    @user_group = UserGroup.get(params[:id])
    authorize! :destroy, @user_group
    @user_group.destroy
    redirect_to(user_groups_url)
  end

  #Override method defined in record_filtering_pagination
  def per_page
    @per_page ||= params[:per] ? params[:per].to_i : 50
    @per_page
  end

end
