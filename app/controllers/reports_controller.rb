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
    authorize! :show, @report
    @report.build_report
  end

  #TODO: deal with new, create, edit, update later.

  protected

  def current_modules
    @current_modules ||= current_user.modules
  end

end
