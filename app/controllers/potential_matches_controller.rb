class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include IndexHelper
  include RecordFilteringPagination
  include RecordActions
  require "will_paginate/array"


  #TODO v1.3: This controller should be merged with RecordActions and the business logic refactored into the models
  #TODO v1.3: need controller rspec for this
  def index
    authorize! :index, model_class
    @page_name = t("home.view_records")
    @aside = "shared/sidebar_links"
    @associated_users = current_user.managed_user_names
    @filters = record_filter(filter)
    #make sure to get all records when querying for ids to sync down to mobile
    params["page"] = "all" if params["mobile"] && params["ids"]
    @records, @total_records = retrieve_records_and_total(@filters)

    @referral_roles = Role.by_referral.all
    @transfer_roles = Role.by_transfer.all
    module_ids = @records.map(&:module_id).uniq if @records.present? && @records.is_a?(Array)
    @associated_agencies = User.agencies_by_user_list(@associated_users).map { |a| {a.id => a.name} }
    #TODO v1.3: This should be removed/meregd with Record actions
    #TODO i18n
    @options_districts = Location.by_type_enabled.key("district").all.map { |loc| loc.placename }.sort
    module_users(module_ids) if module_ids.present?
    instance_variable_set("@#{list_variable_name}", @records)

    #TODO v1.3: this next section needs to be refactored - WIP
    #Most of this index method is a carbon copy of the one in record_actions
    match_model_class
    @associated_user_names = users_filter
    @match_results = @match_model_class.all_matches(@associated_user_names)
    @match_results = @match_model_class.all_match_details(@match_results, @potential_matches, @associated_user_names) if @match_results.present?

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

  private

  def match_model_class
    #TODO v1.3: I know this is a little hokey, but @type is used in the view
    @type ||= params[:type] || "tracing_request"
    @match_model_class ||= (@type == 'case' ? 'child' : @type).camelize.constantize
  end
end
