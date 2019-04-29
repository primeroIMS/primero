module CopyActions extend ActiveSupport::Concern
  def copy
    authorize! :copy, model_class
    old_record = model_class.find_by(id: params[:id])
    if old_record.present?
      new_record = old_record.clone(name_from_params)
      begin
        if new_record.save
          flash[:notice] = t("#{model_class.to_s.downcase}.copy_success")
        else
          flash[:notice] = t("#{model_class.to_s.downcase}.copy_failure")
        end
      rescue => e
        # Fail gracefully, especially in case where the "copy to" role already exists (i.e. a 409 conflict)
        Rails.logger.error "Error [#{e.to_s}] copying #{model_class}: #{old_record.id} to #{new_record.id}"
        e.backtrace.each { |line| Rails.logger.error line }
        flash[:notice] = t("#{model_class.to_s.downcase}.copy_failure")
      end
    end
    redirect_back(fallback_location: root_path)
  end

  private

  def name_from_params
    params[:name] || ''
  end


end