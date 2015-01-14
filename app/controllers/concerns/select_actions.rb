module SelectActions
  extend ActiveSupport::Concern

  def get_selected_ids
    @selected_ids = []
    if params[:id].present?
      @selected_ids << params[:id]
    elsif params[:selected_records].present?
      @selected_ids = params[:selected_records].split(',')
    end

    return @selected_ids
  end

end