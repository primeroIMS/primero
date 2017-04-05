class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include IndexHelper
  include RecordFilteringPagination
  include RecordActions
  require "will_paginate/array"


  #TODO v1.3: need controller rspec for this
  def index
    authorize! :index, model_class
    @page_name = t("home.view_records")
    @aside = "shared/sidebar_links"
    @associated_users = current_user.managed_user_names
    @filters = record_filter(filter)
    #make sure to get all records when querying for ids to sync down to mobile
    params["page"] = "all" if params["mobile"] && params["ids"]

    @potential_matches, @total_records = retrieve_records_and_total(@filters)

    # TODO figure out user filter
    match_model_class
    @associated_user_names = users_filter
    set_visibility(@potential_matches, @associated_user_names)
    @grouped_potential_matches = grouped_records(@potential_matches)

    @per_page = per_page
    @grouped_potential_matches = @grouped_potential_matches.paginate(:page => page, :per_page => per_page)
    @total_records = @grouped_potential_matches.total_entries

    respond_to do |format|
      format.html
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


  def load_tracing_request
    if params[:match].present?
      tracing_request_id = params[:match].split("::").first
      @subform_id = params[:match].split("::").last
      @tracing_request = TracingRequest.get(tracing_request_id) if tracing_request_id.present?
    end
  end

  def record_filter(filter)
    filter["status"] ||= {:type => "single", :value => "#{PotentialMatch::POTENTIAL}"}
    if params[:match].present?
      load_tracing_request
      filter["tracing_request_id"] ||= {:type => "single", :value => @tracing_request.id}
      filter["tr_subform_id"] ||= {:type => "single", :value => @subform_id}
    end
    filter
  end

  private

  def set_visibility(records=[], associated_user_names)
    records.each{|r| r.set_visible(associated_user_names, @type)}
  end

  def match_model_class
    @type ||= params[:type] || "tracing_request"
    @match_model_class ||= (@type == 'case' ? 'child' : @type).camelize.constantize
  end

  def grouped_records(records=[])
    grouped_records = []
    if @type == 'case'
      grouped_records = records.group_by(&:child_id).to_a
    elsif @type == 'tracing_request'
      grouped_records = records.group_by{|r| [r.tracing_request_id, r.tr_subform_id]}.to_a
    end
    grouped_records = PotentialMatch.sort_list(grouped_records) if grouped_records.present?
    grouped_records
  end
end
