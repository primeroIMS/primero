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
        @record.save!
      rescue => error
        logger.error "Case #{@record.id} approve #{params[:approval_type]}... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_to :back
  end

  private

  def set_approval
    approval_status = ((params[:approval].present?) && params[:approval] == 'true') ? APPROVED_STATUS : REJECTED_STATUS
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
    end
  end
end