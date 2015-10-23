module ApproveCasePlanActions
  extend ActiveSupport::Concern

  def approve_case_plan
    authorize! :approve_case_plan, model_class
    load_record
    if @record.present?
      begin
        set_approval
        @record.save!
      rescue => error
        logger.error "Case #{@record.id} approve_case_plan... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_to :back
  end

  private

  def set_approval
    @record.case_plan_approved = ((params[:approval].present?) && params[:approval] == 'true') ? true : false
    @record.case_plan_approved_date = Date.today
    @record.case_plan_approved_comments = params[:comments] if params[:comments].present?
  end

end