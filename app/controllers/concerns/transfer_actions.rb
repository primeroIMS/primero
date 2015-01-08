module TransferActions
  extend ActiveSupport::Concern

  include SelectActions

  def transfer
    authorize! :transfer, model_class
    get_selected_ids

    @transfer_records = []
    if @selected_ids.present?
      @transfer_records = model_class.all(keys: @selected_ids).all
    else
      #Transfer all records
      @filters = record_filter(filter)
      @transfer_records, @total_records = retrieve_records_and_total(@filters)
    end

    if params[:is_remote].present? && params[:is_remote] == 'true'
      remote_transfer(@transfer_records)
    else
      local_transfer(@transfer_records)
      redirect_to :back
    end
  end

  private

  def remote_transfer(transfer_records)
    exporter = ((params[:remote_primero].present? && params[:remote_primero] == 'true') ? Exporters::JSONExporter : Exporters::CSVExporter)
    props = filter_permitted_export_properties(transfer_records, exported_properties)
    export_data = exporter.export(transfer_records, props, current_user)
    encrypt_data_to_zip export_data, transfer_filename(transfer_records, exporter), transfer_password
  end

  def transfer_password
    #TODO - prob should not default to 123... rather require a password like export
    transfer_password = (params[:transfer_password].present? ? params[:transfer_password] : "123")
  end

  def transfer_filename(models, exporter)
    if params[:transfer_file_name].present?
      "#{params[:transfer_file_name]}.#{exporter.mime_type}"
    elsif models.length == 1
      "#{models[0].unique_identifier}.#{exporter.mime_type}"
    else
      "#{current_user.user_name}-#{model_class.name.underscore}.#{exporter.mime_type}"
    end
  end

  def local_transfer(transfer_records)
    #TODO
    flash[:notice] = "Testing...Local Transfer"
  end

end