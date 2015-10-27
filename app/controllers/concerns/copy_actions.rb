module CopyActions extend ActiveSupport::Concern
  def copy
    authorize! :copy, model_class
    old_record = model_class.get(params[:id]) if params[:id].present?
    if old_record.present?
      new_record = old_record.clone(name_from_params)
      begin
        if new_record.save
          flash[:notice] = t("#{model_class.to_s.downcase}.copy_success")
        else
          flash[:notice] = t("#{model_class.to_s.downcase}.copy_failure")
          #TODO - Ticket SL-236 says to fail silently.  Is that so?
        end
      rescue => e
        Rails.logger.error "Error [#{e.to_s}] copying #{model_class}: #{old_record.id} to #{new_record.id}"
        e.backtrace.each { |line| Rails.logger.error line }
        flash[:notice] = t("#{model_class.to_s.downcase}.copy_failure")
      end
    end
    redirect_to :back
  end

  private

  def name_from_params
    params[:name] || ''
  end


end