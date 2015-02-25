module DeleteAction extend ActiveSupport::Concern
  def destroy
    authorize! :destroy, get_action_class
    load_record
    if @record.present?
      @record.destroy
      flash[:notice] = t("#{get_action_class.to_s.downcase}.messages.delete_success")
      redirect_to :action => 'index'
    end
  end

  def load_record
    if params[:id].present?
      @record = get_action_class.get(params[:id])
    end

    # Alias the record to a more specific name since the record controllers
    # already use it
    instance_variable_set("@#{get_action_class.name.underscore}", @record)
  end

  def get_action_class
    model_class ||= action_class
  end
end