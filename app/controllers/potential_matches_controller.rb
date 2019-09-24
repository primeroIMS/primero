class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include IndexHelper
  include RecordFilteringPagination
  include RecordActions
  require "will_paginate/array"


  #TODO v1.3: need controller rspec for this
  def index
    authorize! :index, model_class
    authorize! :find_tracing_match, Child if params[:type] == 'case'

    @page_name = t("home.view_records")
    @aside = "shared/sidebar_links"
    @associated_users = current_user.managed_user_names
    @filters = record_filter(filter)
    #make sure to get all records when querying for ids to sync down to mobile
    params["page"] = "all" if params["mobile"] && params["ids"]
    @type ||= params[:type] || "tracing_request"
    @match = params[:match]
    @match_model_class ||= (@type == 'case' ? 'child' : @type).camelize.constantize

    @sex_field = Field.find_by_name_from_view('sex')
    load_match_configuration
    load_potential_matches #@potential_matches, @case, @tracing_request

    #TODO MATCHING: All set visibility code is written by somone who didn't understand how record ownership works in Primero
    #               We don't need to address this now, but it really needs to be done away with.
    @associated_user_names = users_filter[:user_names]
    set_visibility(@potential_matches, @associated_user_names)

    @potential_matches = apply_filter_to_records(@potential_matches,@filters.except('case_fields',
                                                                                    'tracing_request_fields'))
    @grouped_potential_matches = PotentialMatch.group_match_records(@potential_matches, @type)

    #TODO MATCHING: Pagination of grouped record is just broken.
    #               Luckily for this we will just display matches for an individual TR/case

    respond_to do |format|
      format.html do
        flash[:notice] = t('potential_matches.no_match', type: I18n.t("forms.record_types.#{@type}"), id: @display_id) if @potential_matches.blank? && params[:match].present?
      end
      unless params[:password]
        format.json do
          render :json => PotentialMatch.format_list_for_json(@grouped_potential_matches, @type)
        end
      end
      unless params[:format].nil? || params[:format] == :json
        if @grouped_potential_matches.blank?
          flash[:notice] = t("exports.no_records")
          redirect_to :action => :index and return
        end
      end
      respond_to_export format, @potential_matches
    end
  end

  #TODO: Consider moving this to concern and combine with quick_view in ChildrenController
  def quick_view
    authorize! :read, model_class
    @potential_match = PotentialMatch.new(params) #TODO: recreate from params
    special_comparison_fields = ['age', 'sex', 'date_of_birth', 'name', 'name_other', 'name_nickname']
    @comparison = @potential_match.compare_case_to_trace
    @special_comparison = special_comparison_fields.map do |field_name|
      comparsion_for = @comparison[:case].map{|cv| cv[:case_values].select{|c| c[:case_field].name == field_name}.first}.reject(&:blank?).first
      comparsion_for = comparsion_for[:matches] if comparsion_for.present?
      [field_name, comparsion_for]
    end.to_h
    @lookups = Lookup.all.all

    html = PotentialMatchesController.new.render_to_string(partial: "potential_matches/quick_view", layout: false, locals: {
      lookups: @lookups,
      potential_match: @potential_match,
      special_comparison: @special_comparison,
      special_comparison_fields: special_comparison_fields,
      comparison: @comparison
    })

    respond_to do |format|
      format.html {render plain: html}
    end
  end

  def load_potential_matches
    @potential_matches = []
    #TODO MATCHING: This is a temporary hack, get rid of this
    @total_records = 0
    if @match_model_class == Child
      load_case_matches
    else
      load_tracing_request_matches
    end
  end


  def load_tracing_request_matches
    if params[:match].present?
      tracing_request_id = params[:match].split("::").first
      @subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
      if @tracing_request.present?
        @potential_matches = @tracing_request.matching_cases(@subform_id, @potential_matching_configuration.tracing_request_fields.to_h)
        #TODO MATCHING: This is a temporary hack, get rid of this
        @total_records = 1
        @display_id = @tracing_request.display_id
      end
    end
  end

  def load_case_matches
    if params[:match].present?
      case_id = params[:match]
      @case = Child.get(case_id) if case_id.present?
      if @case.present?
        @potential_matches = @case.matching_tracing_requests(@potential_matching_configuration.case_fields.to_h)
        @display_id = @case.display_id
      end
    end
  end

  def record_filter(filter)
    filter ||= {}
    filter["status"] ||= {:type => "single", :value => "#{PotentialMatch::POTENTIAL}"}
    return filter
  end

  private

  def load_match_configuration
    match_fields = {
      case_fields: @filters['case_fields'].try(:[], :value).try(:to_h),
      tracing_request_fields: @filters['tracing_request_fields'].try(:[], :value).try(:to_h)
    }
    @potential_matching_configuration = MatchingConfiguration.find_for_filter(match_fields)
  end

  def set_visibility(records=[], associated_user_names)
    records.each{|r| r.set_visible(associated_user_names, @type)}
  end
end
