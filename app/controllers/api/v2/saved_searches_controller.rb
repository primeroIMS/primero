module Api::V2
  class SavedSearchesController < ApplicationApiController
    include Concerns::Pagination

    def index
      authorize! :index, SavedSearch
      searches = SavedSearch.where(user: current_user)
      @total = searches.size
      @saved_searches = searches.paginate(pagination)
    end

    def create
      authorize! :create, SavedSearch
      @saved_search = SavedSearch.new_with_user(current_user, saved_search_params)
      @saved_search.save!
      status = params[:data][:id].present? ? 204 : 200
      render 'api/v2/saved_searches/create', status: status
    end

    def destroy
      @saved_search = SavedSearch.find(params[:id])
      authorize! :write, @saved_search
      @saved_search.destroy!
    end

    protected

    def saved_search_params
      @saved_search_params ||= params.require(:data)
                                     .permit([
                                        'id', 'name', {'module_ids' => [] }, 
                                        'record_type', { 'filters' => [] }
                                      ])
    end
  end
end