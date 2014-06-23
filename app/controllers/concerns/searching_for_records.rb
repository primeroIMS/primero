module SearchingForRecords
  extend ActiveSupport::Concern
  
  
  def search
    authorize! :index, @className

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
    if can? :view_all, @className
      @results, @full_results = @className.search(@search, page_number)
    else
      @results, @full_results = @className.search_by_created_user(@search, current_user_name, page_number)
    end
  end
  
  def default_search_respond_to
    respond_to do |format|
      format.html do
        if @results && @results.length == 1
          #TODO - fix this path
          #redirect_to @className.name.downcase + _path @results.first
          redirect_to child_path(@results.first)
        end
      end

      #TODO - pull this into the concern?
      respond_to_export format, @results
    end
  end
  
end