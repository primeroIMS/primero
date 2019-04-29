class DuplicatesController < ApplicationController

  include RecordFilteringPagination

  before_action :load_matching_configuration, only: [:index]
  before_action :load_duplicates, only: [:index]

  #Methods new & create are older methods that do not actually work on the Duplicate model
  #Instead, they were used to marke cases as duiplicates
  def new
    @child = Child.find_by(id: params[:child_id])
    authorize! :update, @child

    redirect_to child_filter_path("flagged") and return if @child.nil?
    @page_name = t("child.mark_child_as_duplicate", :short_id => @child.short_id)
  end

  def create
    @child = Child.find_by(id: params[:child_id])
    authorize! :update, @child

    @child.mark_as_duplicate params[:parent_id]
    render :new and return unless @child.save
    redirect_to @child
  end

  def index
    authorize! :index, Duplicate
    @lookups = Lookup.all
    @sex_field = Field.get_by_name('sex')
    @can_display_view_page = can?(:display_view_page, Child)
  end

  private

  def load_matching_configuration
    @filters = filter
    match_fields = {
      case_fields: @filters['case_fields'].try(:[], :value).try(:to_h),
      tracing_request_fields: {}
    }
    @matching_configuration = MatchingConfiguration.find_for_filter(match_fields)
  end

  def load_duplicates
    @duplicates = []
    @type ||= params[:record_type] || 'case'
    if(@type == 'case')
      @duplicates = Duplicate.find(@matching_configuration.case_fields.to_h, search_parameters)
    end
  end

  def search_parameters
    search_parameters = {}
    @filters.each {|k, v| search_parameters[k] = v[:value]}
    search_parameters
  end
end
