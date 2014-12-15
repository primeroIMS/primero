class ReportsController < ApplicationController

  include RecordFilteringPagination
  include ReportsHelper
  #include RecordActions
  before_filter :sanitize_multiselects, only: [:create, :update]

  def index
    authorize! :index, Report
    # NOTE: If we start needing anything more complicated than module filtering on reports,
    #       index them in Solr and make searchable. Replace all these views and paginations with Sunspot.
    report_ids = Report.by_module_id(keys: current_user.modules.map{|m|m.id}).values.uniq
    @current_modules = nil #TODO: Hack because this is expected in templates used.
    reports = Report.all(keys: report_ids).page(page).per(per_page).all
    @reports = paginated_collection(reports, reports.count)
  end

  def show
    @report = Report.get(params[:id])
    authorize! :show, @report
    @report.build_report
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
    @report = Report.get(params[:id])
    authorize! :show, @report
    @report.build_report #TODO: Get rid of this once the rebuild works
    render json: @report.graph_data
  end

  def new
    authorize! :create, Report
    @report = Report.new
  end

  def create
    authorize! :create, Report
    @report = Report.new(params[:report])
    return redirect_to reports_path if @report.save
    render :new
  end

  def edit
    @report = Report.get(params[:id])
    authorize! :update, @report
  end

  def update
    @report = Report.get(params[:id])
    authorize! :update, @report

    if @report.update_attributes(params[:report])
      flash[:notice] = t("report.successfully_updated")
      redirect_to(reports_path)
    else
      flash[:error] = t("report.error_in_updating")
      render :action => "edit"
    end
  end

  def permitted_field_list
    authorize! :read, Report
    module_ids = (params[:module_ids].present? && params[:module_ids]!='null') ? params[:module_ids] : []
    modules = PrimeroModule.all(keys: module_ids).all
    record_type = params[:record_type]
    permitted_fields = select_options_fields_grouped_by_form(
      Report.all_reportable_fields_by_form(modules, record_type, @current_user)
    )
    render json: permitted_fields
  end

  # Method to trigger a report rebuild.
  # TODO: Currently this isn't used as we are not storing the generated report data.
  #       See models/report.rb and graph_data method above.
  def rebuild
    @report = Report.get(params[:id])
    authorize! :show, @report
    @report.build_report
    @report.save
    render status: :accepted
  end

  protected

  #TODO: This is a hack to get rid of empty values that sneak in due to this Rails select Gotcha:
  #      http://api.rubyonrails.org/classes/ActionView/Helpers/FormOptionsHelper.html#method-i-select
  #      We are trying to handle it in assets/javascripts/chosen.js and this is probably the best way to deal on refactor,
  #      but currently I don't want to sneeze on any card houses.
  def sanitize_multiselects
    [:module_ids, :aggregate_by, :disaggregate_by].each do |multiselect|
      if params[:report][multiselect].is_a? Array
        params[:report][multiselect].reject!{|e|!e.present?}
      else
        params[:report][multiselect] = nil
      end
    end
  end

end
