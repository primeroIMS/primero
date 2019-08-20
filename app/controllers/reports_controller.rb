class ReportsController < ApplicationController

  @model_class = Report

  include RecordFilteringPagination
  include ReportsHelper
  include FieldsHelper
  include DeleteAction

  #include RecordActions
  before_action :load_report, except: [:new, :index]
  before_action :sanitize_multiselects, only: [:create, :update]
  before_action :sanitize_filters, only: [:create, :update]
  before_action :set_aggregate_order, only: [:create, :update]
  before_action :load_age_range, only: [:new, :edit]
  before_action :get_lookups, only: [:lookups_for_field, :edit]

  include LoggerActions

  def index
    authorize!(:read_reports, Report)
    # NOTE: If we start needing anything more complicated than module filtering on reports,
    #       index them in Solr and make searchable. Replace all these views and paginations with Sunspot.

    #TODO refactor... this extra query to fetch report_ids is not necessary
    #TODO refactor... the TOTAL count of records can be obtained by getting the result.count
    #TODO refactor... so, First fetch the reults.  Set @total_records to result.count.  Set reports to result.all
    #TODO refactor... See implementation in audit_logs_controller and audit_log model
    report_ids = Report.by_module_id(keys: current_user.modules.map{|m|m.id}).values.uniq
    @current_modules = nil #TODO: Hack because this is expected in templates used.
    reports = Report.all(keys: report_ids).page(page).per(per_page).all
    @total_records = report_ids.count
    @per = per_page
    @reports = paginated_collection(reports, report_ids.count)
  end

  def show
    authorize!(:read_reports, @report)
    begin
      @report.permission_filter = report_permission_filter(current_user)
      @report.build_report
    rescue Sunspot::UnrecognizedFieldError => e
      redirect_to(edit_report_path(@report), notice: e.message)
    end
  end

  # Method for AJAX GET of graph data.
  # This is returned in a format readable by Chart.js.
  # NOTE: We will need to change this if the Charting library changes
  # TODO: This is a seemingly redundant call to rebuild the report data for presentation on for the chart.
  #       For now I don't want to solve this problem: Report generation is relatively fast and relatively infrequent.
  #       The proper solution would be to load the report data once as an AJAX call and then massage on the
  #       client side for representation on the table and the chart. Or we culd get funky with caching generated reports,
  #       but really this isn't worth it unless we find that this is a performance bottleneck.
  def graph_data
    authorize!(:read_reports, @report)
    @report.permission_filter = report_permission_filter(current_user)
    @report.build_report #TODO: Get rid of this once the rebuild works
    render json: @report.graph_data
  end

  def new
    authorize! :create, Report
    @report = Report.new
    @report.add_default_filters = true
    set_reportable_fields
  end

  def create
    authorize! :create, Report
    @report = Report.new(params[:report].to_h)

    Primero::Application::locales.each do |locale|
      unless @report["name_#{locale}"].present?
        @report["name_#{locale}"] = @report.name
      end
    end

    if (@report.valid?)
      redirect_to report_path(@report) if @report.save
    else
      load_age_range
      set_reportable_fields
      render :new
    end
  end

  def edit
    authorize! :update, @report
    set_reportable_fields
  end

  def update
    authorize! :update, @report

    if @report.update_attributes(params[:report].to_h)
      flash[:notice] = t("report.successfully_updated")
      redirect_to(report_path(@report))
    else
      load_age_range
      set_reportable_fields
      flash[:error] = t("report.error_in_updating")
      render :action => "edit"
    end
  end

  def permitted_field_list
    authorize!(:read_reports, Report)
    module_ids = (params[:module_ids].present? && params[:module_ids]!='null') ? params[:module_ids] : []
    modules = PrimeroModule.all(keys: module_ids).all
    record_type = params[:record_type]
    if record_type.present?
      permitted_fields = select_options_fields_grouped_by_form(
        FormSection.all_exportable_fields_by_form(modules, record_type, @current_user, Report::REPORTABLE_FIELD_TYPES, true),
        true
      )
    else
      permitted_fields = []
    end
    render json: permitted_fields
  end

  #This method returns a list of lookups for a particular field.
  #TODO: This really belongs in a fields or form section controller
  def lookups_for_field
    authorize!(:read_reports, Report)
    field_options = []
    field_name = params[:field_name]
    field = Field.find_by_name(field_name)
    field_options = field.options_list(nil, nil, nil, true)
    render json: field_options
  end

  # Method to trigger a report rebuild.
  # TODO: Currently this isn't used as we are not storing the generated report data.
  #       See models/report.rb and graph_data method above.
  def rebuild
    authorize!(:read_reports, @report)
    @report.permission_filter = report_permission_filter(current_user)
    @report.build_report
    @report.save
    render status: :accepted
  end

  def report_permission_filter(user)
    unless can?(:read, @report)
      { "attribute" => "owned_by_groups", "value" => user.user_group_ids_sanitized }
    end
  end

  protected

  def set_aggregate_order
    params['report']['aggregate_by'] = params['report']['aggregate_by_ordered']
    params['report']['disaggregate_by'] = params['report']['disaggregate_by_ordered']
  end

  def sanitize_multiselects
    sanitize_multiselect_params(:report, [:module_ids, :aggregate_by, :disaggregate_by])
  end

  def sanitize_filters
    if params[:report][:filters].present?
      if params[:report][:filters][:template].present?
        params[:report][:filters].delete(:template)
        #convert to array: bad!
        filters = params[:report][:filters].to_h.values
        params[:report][:filters] = filters.map {|f| f.delete_if {|_k,v| v.empty?} }.reject(&:blank?)
      end
    end
  end

  def set_reportable_fields
    if @report.record_type.present?
      readonly = @current_user.readonly?(@report.record_type)
      @reportable_fields_aggregate_counts_from ||= FormSection.all_exportable_fields_by_form(@report.modules, @report.record_type, @current_user, Report::AGGREGATE_COUNTS_FIELD_TYPES, true)
      @reportable_fields ||= FormSection.all_exportable_fields_by_form(@report.modules, @report.record_type, @current_user, Report::REPORTABLE_FIELD_TYPES, true)
      #TODO: There is probably a better way to deal with this than using hashes. Fix! Simplify the JS as well!
      @field_type_map = {}
      @reportable_fields.values.each do |module_properties|
        module_properties.each do |form_properties|
          form_properties[1].each do |property|
            @field_type_map[property[0]] = property[2]
          end
        end
      end
    end
  end

  private

  def get_lookups
    @lookups = Lookup.all
  end

  def load_report
    @report = Report.get(params[:id])
  end

  def action_class
    Report
  end

  #Override method in LoggerActions.
  def logger_action_identifier
    if @report.present?
      "#{logger_model_titleize} '#{@report.name}'"
    elsif action_name == 'create' && params[:report].present? && params[:report][:name].present?
      "#{logger_model_titleize} '#{params[:report][:name]}'"
    else
      super
    end
  end

end
