module MarkForMobileActions
  extend ActiveSupport::Concern

  def mark_for_mobile
    authorize! :sync_mobile, model_class
    message = ''
    was_successful = false
    @records << @record if @record.present?
    if @records.present?
      failed_count = mark_the_records(@records, mobile_value)
      if failed_count > 0
        message = message_failure(failed_count)
      else
        was_successful = true
        message = message_success(@records.size)
        flash[:notice] = message
      end
    else
      message = t('mark_for_mobile.no_records_selected')
    end
    render json: {success: was_successful,
                  message: message}
  end

  private

  def mark_the_records(mobile_records, mobile_val)
    failed_count = 0
    mobile_records.each do |record|
      record.marked_for_mobile = mobile_val
      if record.valid?
        unless record.save
          failed_count += 1
        end
      else
        logger.error "#{model_class.parent_form} #{record.short_id} not marked for mobile... not valid"
        failed_count += 1
      end
    end
    return failed_count
  end

  def is_single_or_batch?
    @single_or_batch ||= (params[:id].present? ? "single" : "batch")
  end

  def message_failure(failed_count = 0)
    error_message = ''
    if is_single_or_batch? == 'single'
      error_message = (mobile_value ?   t('mark_for_mobile.failure', record_type: record_type, id: record_id)
                                      : t('unmark_for_mobile.failure', record_type: record_type, id: record_id)
                      )
    else
      error_message = (mobile_value ?   t('mark_for_mobile.failure_batch', failed_count: failed_count)
                                      : t('unmark_for_mobile.failure_batch', failed_count: failed_count)
                      )
    end
    return error_message
  end

  def message_success(success_count = 0)
    success_message = ''
    if is_single_or_batch? == 'single'
      success_message = (mobile_value ?   t('mark_for_mobile.success', record_type: record_type, id: record_id)
                                        : t('unmark_for_mobile.success', record_type: record_type, id: record_id)
                      )
    else
      success_message = (mobile_value ?   t('mark_for_mobile.success_batch', success_count: success_count)
                                        : t('unmark_for_mobile.success_batch', success_count: success_count)
                      )
    end
    return success_message
  end

  def record_type
    @record_type ||= model_class.parent_form.titleize if model_class.present?
  end

  def record_id
    @record_id ||= @record.short_id if @record.present?
  end

  def mobile_value
    @mobile_value ||= (params[:mobile_value] == 'true')
  end

end
