class ReportsController < ApplicationController

  def index
    authorize! :index, Report
    @reports = Report.all
  end

  def show
    @report = Report.get(params[:id])
    authorize! :show, @report
  end

  #TODO: deal with new, create, edit, update later.

end
