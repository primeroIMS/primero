class SavedSearchesController < ApplicationController
  @model_class = SavedSearch

  def create
    authorize! :create, SavedSearch
    filter_name = params['name']
    filters = params['filter']
    record_type = params['record_type']
    user_name = current_user.user_name
    module_id = current_user.module_ids

    new_search = SavedSearch.new(name: filter_name, module_id: module_id, record_type: record_type, user_name: user_name)

    filters.each do |key, filter|
      new_search.add_filter(key, filter)
    end

    if new_search.save
      redirect_to(request.referrer, notice: I18n.t('saved_search.save_success'));
    else
      respond_to do |format|
        format.json {render :json => {:error => :true, :message => I18n.t('saved_search.save_error')}}
      end
    end
  end

  def index
    authorize! :read, SavedSearch
    searches_by_user = SavedSearch.where(user_name: current_user.user_name)
    respond_to do |format|
      format.json {render :json => searches_by_user}
    end
  end

  def show
    saved_search = SavedSearch.find_by_id(params['id'])
    authorize! :read, saved_search
    #TODO: Refactor with UIUX
    saved_search_attributes = saved_search.attributes
    saved_search_attributes["filters"] = saved_search.filters.map { |key, value| { 'name' => key, 'value' => value }  }

    respond_to do |format|
      format.json {render :json => saved_search_attributes}
    end
  end

  def destroy
    @saved_search = SavedSearch.find_by_id(params['id'])

    authorize! :write, @saved_search
    if @saved_search.present? && @saved_search.destroy
      notice = 'saved_search.deleted'
    else
      notice = 'saved_search.delete_error'
    end

    respond_to do |format|
      format.html {redirect_to(request.referrer, notice: I18n.t(notice))}
    end
  end
end
