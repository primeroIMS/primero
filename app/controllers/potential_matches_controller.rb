class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include IndexHelper
  include RecordFilteringPagination
  include RecordActions
  require "will_paginate/array"
  ALL_FILTER = "all"

  def index
    authorize! :index, model_class
    @page_name = t("home.view_records")
    @aside = "shared/sidebar_links"
    @associated_users = current_user.managed_user_names
    puts @associated_users
    @filters = record_filter(filter)
    #make sure to get all records when querying for ids to sync down to mobile
    params["page"] = "all" if params["mobile"] && params["ids"]
    @records, @total_records = retrieve_records_and_total(@filters)

    @referral_roles = Role.by_referral.all
    @transfer_roles = Role.by_transfer.all
    module_ids = @records.map(&:module_id).uniq if @records.present? && @records.is_a?(Array)
    @associated_agencies = User.agencies_by_user_list(@associated_users).map { |a| {a.id => a.name} }
    @options_districts = Location.by_type_enabled.key("district").all.map { |loc| loc.placename }.sort
    module_users(module_ids) if module_ids.present?
    instance_variable_set("@#{list_variable_name}", @records)

    @type = params[:type] || "tracing_request"

    case @type
      when "case"
        @match_results = get_all_case @associated_users
        @match_results = get_all_match_details_by_case @match_results, @potential_matches, @associated_users
      when "tracing_request"
        @match_results = get_all_tr_pairs @associated_users
        @match_results = get_all_match_details_by_tr @match_results, @potential_matches, @associated_users
      else
        @match_results = []
    end


    @per_page = per_page
    @match_results = @match_results.paginate(:page => page, :per_page => per_page)
    @total_records = @match_results.total_entries


    respond_to do |format|
      format.html
      unless params[:password]
        format.json do
          render :json => @match_results
        end
      end
      unless params[:format].nil? || params[:format] == :json
        if @potential_matches.empty?
          flash[:notice] = t("exports.no_records")
          redirect_to :action => :index and return
        end
      end

      respond_to_export format, @records
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

  def get_all_tr_pairs associated_users
    search = TracingRequest.search do
      if associated_users.present? && associated_users.first != ALL_FILTER
        any_of do
          associated_users.each do |user_name|
            with(:associated_user_names, user_name)
          end
        end
      end
    end
    @tracing_requests = search.results
    match_result=[]
    for t in @tracing_requests
      for subform in t.tracing_request_subform_section
        inquirer_tr_pair = {}
        inquirer_tr_pair["tracing_request_id"] = t.tracing_request_id || ""
        inquirer_tr_pair["tr_uuid"] = t._id || ""
        inquirer_tr_pair["relation_name"] = t.relation_name || ""
        inquirer_tr_pair["inquiry_date"] = t.inquiry_date || ""
        inquirer_tr_pair["subform_tracing_request_id"] = subform.unique_id
        inquirer_tr_pair["subform_tracing_request_name"] = subform.name
        inquirer_tr_pair["match_details"] = []
        match_result << inquirer_tr_pair
      end
    end
    match_result
  end

  def get_all_case associated_users
    search = Child.search do
      if associated_users.present? && associated_users.first != ALL_FILTER
        any_of do
          associated_users.each do |user_name|
            with(:associated_user_names, user_name)
          end
        end
      end
    end
    @cases = search.results
    match_result=[]
    for c in @cases
      case_details = {}
      case_details["case_id"] = c.case_id
      case_details["child_id"] = c._id
      case_details["age"] = c.age
      case_details["sex"] = c.sex
      case_details["registration_date"] = c.registration_date
      case_details["match_details"] = []
      match_result << case_details
    end
    match_result
  end

  def get_all_match_details_by_tr(match_results=[], potential_matches=[], associated_users)
    for match_result in match_results
      count = 0
      for potential_match in potential_matches
        if potential_match["tr_id"] == match_result["tracing_request_id"] && potential_match["tr_subform_id"] == match_result["subform_tracing_request_id"] && count < 20
          match_detail = {}
          match_detail["child_id"] = potential_match.child_id
          child = Child.find_by_case_id potential_match.child_id
          match_detail["case_id"] = potential_match.case_id
          match_detail["age"] = is_visible?(child.owned_by, associated_users) ? child.age : "***"
          match_detail["sex"] = is_visible?(child.owned_by, associated_users) ? child.sex : "***"
          match_detail["registration_date"] = is_visible?(child.owned_by, associated_users) ? child.registration_date : "***"
          match_detail["owned_by"] = child.owned_by
          match_detail["average_rating"] =potential_match.average_rating
          match_result["match_details"] << match_detail
          count += 1
        end
      end
    end
    compact_result match_results
    sort_hash match_results
  end

  def get_all_match_details_by_case(match_results=[], potential_matches=[], associated_users)
    for match_result in match_results
      count = 0
      for potential_match in potential_matches
        if potential_match["case_id"] == match_result["case_id"] && count < 20
          match_detail = {}
          match_detail["tracing_request_id"] = potential_match.tr_id
          inquiry = TracingRequest.find_by_tracing_request_id potential_match.tr_id
          match_detail["tr_uuid"] = inquiry._id
          for subform in inquiry.tracing_request_subform_section
            if subform.unique_id == potential_match.tr_subform_id
              match_detail["subform_tracing_request_name"] = is_visible?(inquiry.owned_by, associated_users) ? subform.name : "***"
            end
          end
          match_detail["inquiry_date"] = is_visible?(inquiry.owned_by, associated_users) ? inquiry.inquiry_date : "***"
          match_detail["relation_name"] = is_visible?(inquiry.owned_by, associated_users) ? inquiry.relation_name : "***"
          match_detail["average_rating"] =potential_match.average_rating
          match_detail["owned_by"] =inquiry.owned_by
          match_result["match_details"] << match_detail
          count += 1
        end
      end
    end
    compact_result match_results
    sort_hash match_results
  end

  def compact_result match_results
    match_results.delete_if { |h| h["match_details"].length == 0 }
    match_results
  end

  def sort_hash match_results
    match_results = match_results.sort_by { |hash| -find_max_score_element(hash["match_details"])["average_rating"] }
    match_results
  end

  def find_max_score_element array
    array = array.max_by do |element|
      element["average_rating"]
    end
    array
  end

  def is_visible? owner, associated_users
    return (associated_users.first == ALL_FILTER || associated_users.include?(owner))
  end
end
