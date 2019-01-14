class DuplicatesController < ApplicationController

  include RecordFilteringPagination

  before_action :load_matching_configuration, only: [:index]

  def new
    @child = Child.get params[:child_id]
    authorize! :update, @child

    redirect_to child_filter_path("flagged") and return if @child.nil?
    @page_name = t("child.mark_child_as_duplicate", :short_id => @child.short_id)
  end

  def create
    @child = Child.get params[:child_id]
    authorize! :update, @child

    @child.mark_as_duplicate params[:parent_id]
    render :new and return unless @child.save
    redirect_to @child
  end

  def index
    authorize! :index, Duplicate

    @type ||= params[:record_type] || 'case'

    # @filters = filter
    # load_match_configuration({ case_fields: @filters['case_fields'].try(:[], :value).to_h })
    #
    # if @type == 'case' && @match.present?
    #   @potential_duplicates = []
    #   load_potential_case_duplicates
    # end

    # respond_to do |format|
      # format.html do
      #   if @potential_duplicates.blank? && params[:match].present?
      #     flash[:notice] = t('potential_duplicates.no_match', type: I18n.t("forms.record_types.#{@type}"), id: @match)
      #   else
      #     flash[:notice] = nil
      #   end
      # end
      # unless params[:password]
      #   format.json do
      #     render :json => @potential_duplicates.to_json
      #   end
      # end
      # unless params[:format].nil? || params[:format] == :json
      #   if @potential_duplicates.blank?
      #     flash[:notice] = t('exports.no_records')
      #     redirect_to :action => :index and return
      #   end
      # end
    # end
  end

  private

  def load_matching_configuration
    @filters = filter
    match_fields = {
      case_fields: @filters['case_fields'].try(:[], :value).try(:to_h),
      tracing_request_fields: @filters['tracing_request_fields'].try(:[], :value).try(:to_h)
    }
    @matching_configuration = MatchingConfiguration.find_for_filter(match_fields)
  end


  # def load_match_configuration(match_fields)
  #   @potential_matching_configuration = MatchingConfiguration.find_matchable(match_fields)
  # end
  #
  # def load_potential_case_duplicates
  #   case_id = @match
  #   @child = Child.get case_id
  #   if @child.present?
  #     @potential_duplicates = @child.search_duplicates @potential_matching_configuration.case_fields.to_h
  #   end
  # end
end
