module DisableActions
  extend ActiveSupport::Concern

  def disable
    authorize! :disable, model_class
    load_record
    if @record.present?
      begin
        @record.disabled = true
        @record.save!
      rescue => error
        logger.error "TODO set model name #{@record.id} disable... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_to :back
  end

  def enable
    authorize! :disable, model_class
    load_record
    if @record.present?
      begin
        @record.disabled = false
        @record.save!
      rescue => error
        logger.error "TODO set model name #{@record.id} enable... failure"
        logger.error error.message
        logger.error error.backtrace
      end
    end
    redirect_to :back
  end

end