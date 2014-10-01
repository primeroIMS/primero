class RecordFlagController < ApplicationController

  before_filter :current_user
  before_filter :set_class_name
  before_filter :set_record

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
    params[:selected_records].each do |id|
      record = @model_class.get(id)
      record.add_flag(params[:flag_message], params[:flag_date], current_user_name)
      if record.save
        reload_page = true
      else
        success = false
        error_message += "\n#{record.short_id}: Not flagged"
      end
    end
    # TODO: This needs to be translated
    error_message = "There was an error trying to flag records:" + error_message unless success
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
