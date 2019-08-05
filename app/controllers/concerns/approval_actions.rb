#NOTE: This depends on record_actions concern
#      It requires @system_settings which is loaded by a before_action in application_controller
module ApprovalActions
  extend ActiveSupport::Concern

  BIA = "bia"
  CASE_PLAN = "case_plan"
  CLOSURE = "closure"
  APPROVED_STATUS = "approved"
  REJECTED_STATUS = "rejected"

  def approve_form
    authorize! :"approve_#{params[:approval_type]}", model_class
    load_record
    if @record.present?
      begin
        set_approval
        if @system_settings.try(:notification_email_enabled)
          is_gbv = @record.module_id.eql?(PrimeroModule::GBV)
          @record.send_approval_response_mail(current_user.id, params[:approval_type], params[:approval], request.base_url, is_gbv)
        end
        @record.remove_approval_alert(params[:approval_type])
        @record.save!
        flash[:notice] = [t("approvals.#{params[:approval_type]}"), t("approvals.status.#{approval_status}") ].join(' - ')
      rescue => error
        logger.error "Case #{@record.id} approve #{params[:approval_type]}... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_back(fallback_location: root_path)
  end

  def log_action(action_requested=nil, action_response=nil, type=nil, status=nil, comments=nil, approved_by=nil)
    {
      approval_requested_for: action_requested,
      approval_response_for: action_response,
      approval_for_type: type,
      approval_date: Date.today,
      approval_manager_comments: comments,
      approval_status: status == Child::APPROVAL_STATUS_PENDING ? Child::APPROVAL_STATUS_REQUESTED : status,
      approved_by: approved_by
    }
  end

  private

  def set_approval
    approved = ((params[:approval].present?) && params[:approval] == 'true') ? true : false

    if params[:approval_type].present?
      case params[:approval_type]
        when BIA
          @record.bia_approved = approved
          @record.approval_status_bia = approval_status
          @record.bia_approved_date = Date.today
          @record.bia_approved_comments = params[:comments] if params[:comments].present?
        when CASE_PLAN
          @record.case_plan_approved = approved
          @record.approval_status_case_plan = approval_status
          @record.case_plan_approved_date = Date.today
          @record.case_plan_approved_comments = params[:comments] if params[:comments].present?
        when CLOSURE
          @record.closure_approved = approved
          @record.approval_status_closure = approval_status
          @record.closure_approved_date = Date.today
          @record.closure_approved_comments = params[:comments] if params[:comments].present?
        else
          raise("Invalid Approval Type")
      end

      @record.approval_subforms << log_action(
        nil,
        params[:approval_type],
        @record.case_plan_approval_type,
        approval_status,
        params[:comments],
        current_user.user_name
      )
    end
  end

  def approval_status
    (params[:approval].present? && params[:approval] == 'true') ? APPROVED_STATUS : REJECTED_STATUS
  end
end
