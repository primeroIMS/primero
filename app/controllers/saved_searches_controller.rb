class SavedSearchesController < ApplicationController
  @model_class = SavedSearch

  def create
    if can?(:create, SavedSearch)
      filter_name = params['name']
      filters = params['filter']
      record_type = params['record_type']
      user_id = current_user.id
      module_id = current_user.module_ids

      new_search = SavedSearch.new(name: filter_name, module_id: module_id, record_type: record_type, user_id: user_id)

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
  end

  def index
    if can?(:read, SavedSearch)
      searches_by_user = SavedSearch.by_user_id(key: current_user.id)
      respond_to do |format|
        format.json {render :json => searches_by_user}
      end
    end
  end

  def show
    if can?(:read, SavedSearch)
      searches_by_id = SavedSearch.by_unique_id(key: params['id'])
      respond_to do |format|
        format.json {render :json => searches_by_id}
      end
    end
  end

  def destroy
    if can?(:write, SavedSearch)
      @searches_by_id = SavedSearch.find(params['id'])

      if @searches_by_id.destroy
        respond_to do |format|
          format.html {redirect_to(request.referrer, notice: I18n.t('saved_search.deleted'))}
        end
      end
    end
  end
end