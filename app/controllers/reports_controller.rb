class ReportsController < ApplicationController

  include RecordFilteringPagination
  #include RecordActions
  before_filter :current_modules, :only => [:index]

  def index
    authorize! :index, Report
    reports = Report.all.page(page).per(per_page)
    @reports = paginated_collection(reports.all, reports.count)
  end

  def show
    @report = Report.get(params[:id])
    #authorize! :show, @report
    @report.build_report
  end

  # Method for AJAX GET of graph data.
  # This is returned in a format readable by Chart.js
  def graph_data
    @report = Report.get(params[:id])
    #authorize! :show, @report
    @report.build_report #TODO: Get rid of this once the rebuild works
    render json: @report.graph_data
  end

  #Method to trigger a report rebuild
  def rebuild
    @report = Report.get(params[:id])
    #authorize! :show, @report
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
