#TODO: Child and Incidents dont use the search method in this concern. Either refactor or completely get rid of all this.
#TODO: Just do some analysis and get rid of this.

module SearchingForRecords
  extend ActiveSupport::Concern


  def search
    authorize! :index, model_class

    @page_name = t("search")
    if (params[:query])
      @search = Search.new(params[:query])
      if @search.valid?
        search_by_user_access(params[:page] || 1)
      else
        render :search
      end
    end
    default_search_respond_to
  end

  private

  def search_by_user_access(page_number = 1)
    if can? :view_all, model_class
      @results, @full_results = model_class.search(@search, page_number)
    else
      @results, @full_results = model_class.search_by_created_user(@search, current_user_name, page_number)
    end
  end

  def default_search_respond_to
    respond_to do |format|
      format.html do
        if @results && @results.length == 1
          redirect_to_show_page
        end
      end

      #TODO - pull this into the concern?
      respond_to_export format, @results
    end
  end

  def redirect_to_show_page
    #TODO - is there a better way to do this?
    if "Child" == model_class.name
      redirect_to case_path @results.first
    elsif "Incident" == model_class.name
      redirect_to incident_path @results.first
    elsif "TracingRequest" == model_class.name
      redirect_to tracing_request_path @results.first
    end
  end

end