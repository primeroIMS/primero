class ReportsController < ApplicationController

  include RecordFilteringPagination
  #include RecordActions
  before_filter :current_modules, :only => [:index]

  def index
    authorize! :index, Report
    # NOTE: If we start needing anything more complicated than module filtering on reports,
    #       index them in Solr and make searchable. Replace all these views and paginations with Sunspot.
    report_ids = Report.by_module_id(keys: @current_user.module_ids).values.uniq
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
  # TODO: We will need to change this if the Charting library changes
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
  end

  def create
  end

  def edit
  end

  def update
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

  #TODO: deal with new, create, edit, update later.

  protected

  def current_modules
    @current_modules ||= current_user.modules
  end

end
