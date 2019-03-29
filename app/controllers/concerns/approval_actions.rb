#NOTE: This depends on record_actions concern
#      It requires @system_settings which is loaded by a before_action in application_controller
module ApprovalActions
  extend ActiveSupport::Concern

  def request_approval
    #TODO move business logic to the model.
    authorize! :update, @child

    @child.request_approval(params[:approval_type], params[:approval_status], params[:approval_status_type])
    if @child.save
      @child.send_approval_request_mail(params[:approval_type], request.base_url) if @system_settings.try(:notification_email_enabled)
      render :json => { :success => true, :error_message => "", :reload_page => true }
    else
      errors = @child.errors.messages
      render :json => { :success => false, :error_message => errors, :reload_page => true }
    end
  end

  def approve_form
    authorize! :"approve_#{params[:approval_type]}", model_class
    load_record
    if @record.present?
      begin
        @record.give_approval(params[:approval], params[:approval_type], params[:comments], current_user)
        if @system_settings.try(:notification_email_enabled)
          is_gbv = @record.module_id.eql?(PrimeroModule::GBV)
          @record.send_approval_response_mail(current_user.id, params[:approval_type], params[:approval], request.base_url, is_gbv)
        end
        @record.save!
        flash[:notice] = [t("approvals.#{params[:approval_type]}"), t("approvals.status.approved")].join(' - ')
      rescue => error
        logger.error "Case #{@record.id} approve #{params[:approval_type]}... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_back(fallback_location: root_path)
  end

end