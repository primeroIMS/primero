class RecordFlagController < ApplicationController

  before_filter :current_user
  before_filter :set_class_name
  before_filter :set_record

  include RecordFilteringPagination

  def flag
    authorize! :flag, @record
    flag = @record.add_flag(params[:flag_message], params[:flag_date], current_user_name)
    if @record.save
      render :json => flag if params[:redirect_url].blank?
    else
      render :json => {:error => @record.errors.full_messages + flag.errors.full_messages} if params[:redirect_url].blank?
    end
    #TODO should we keep? the parameter is to keep compatibilty with the current tag form, but that will change. 
    redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url].present?
  end

  def unflag
    authorize! :flag, @record
    flag = @record.remove_flag(params[:flag_message], params[:flag_index], current_user_name, params[:unflag_message])
    if flag.present? and @record.save
      render :json => flag if params[:redirect_url].blank?
    else
      render :json => {:error => @record.errors.full_messages + [I18n.t("errors.models.flags.index", :index => params[:flag_index])]} if params[:redirect_url].blank?
    end
    #TODO should we keep? the new unflag feature for multiple flags is not implemented yet.
    redirect_to "#{params[:redirect_url]}?follow=true" if params[:redirect_url].present?
  end

  def flag_records
    authorize! :flag, @model_class
    success = true
    reload_page = false
    error_message = ""
    child_filters = nil
    records_to_flag = []

    if @model_class == Child
      child_filters = filter
      child_filters["child_status"] ||= "open"
    end

    if params[:all_records_selected] == "true"
      pagination_ops = {:page => 1, :per_page => 100}
      begin
        search = @model_class.list_records(child_filters||filter, order, pagination_ops, users_filter, params[:query])
        results = search.results
        records_to_flag.concat(results)
        pagination_ops[:page] = results.next_page
      end until results.next_page.nil?
    else
      params[:selected_records].each { |id| records_to_flag << @model_class.get(id) }
    end

    records_to_flag.each do |record|
      record.add_flag(params[:flag_message], params[:flag_date], current_user_name)
      if record.save
        reload_page = true
      else
        success = false
        error_message += "\n#{I18n.t("messages.record_not_flagged_message", short_id: record.short_id)}"
      end
    end

    error_message = I18n.t("messages.flag_multiple_records_error_message") + error_message unless success
    render :json => {:success => success, :error_message => error_message, :reload_page => reload_page}
  end

  private

  def set_class_name
    #Tag the model from the params, the parameter is injected by the routes and don't allow any arbitrary class
    #just the one defined in the routes.
    @model_class = params[:model_class].constantize
  end

  def set_record
    id = params[:id]
    @record = @model_class.get(id)
  end

end
