module MarkForMobileActions
  extend ActiveSupport::Concern

  include SelectActions

  def mark_for_mobile
    authorize! :sync_mobile, model_class
    get_selected_ids

    @records = []
    if @selected_ids.present?
      @records = model_class.all(keys: @selected_ids).all
      mark_the_records(@records, mobile_value)
      render json: {success: true}
    else
      flash[:notice] = t('mark_for_mobile.no_records_selected')
      render json: {success: false}
    end

    #if @records.blank?
      #TODO - should we log or display something here?
      #logger.info "#{model_class.parent_form}s not marked for mobile... no eligible records"
      #message_failure @selected_ids.size
      #redirect_to :back
    #else
      #redirect_to :back
    #end
  end

  private

  def mark_the_records(mobile_records, mobile_val)
    failed_count = 0
    mobile_records.each do |record|
      binding.pry
      if record.marked_for_mobile.present?
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
    end
    if failed_count > 0
      message_failure failed_count
    else
      message_success  mobile_records.size
    end
  end

  def is_single_or_batch?
    @single_or_batch ||= (params[:id].present? ? "single" : "batch")
  end

  def message_failure(failed_count = 0)
    if is_single_or_batch? == 'single'
      flash[:notice] = t('flag_as_mobile.failure', record_type: record_type, id: record_id)
    else
      flash[:notice] = t('flag_as_mobile.failure_batch', failed_count: failed_count)
    end
  end

  def message_success(success_count = 0)
    if is_single_or_batch? == 'single'
      flash[:notice] = t('flag_as_mobile.success', record_type: record_type, id: record_id)
    else
      flash[:notice] = t('flag_as_mobile.success_batch', success_count: success_count)
    end
  end

  def record_type
    @record_type ||= model_class.parent_form.titleize if model_class.present?
  end

  def record_id
    @record_id ||= @record.short_id if @record.present?
  end

  def mobile_value
    params[:mobile_value] == 'true'
  end

end
