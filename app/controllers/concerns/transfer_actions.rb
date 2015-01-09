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
      begin
        local_transfer(@transfer_records)
        #flash[:notice] = t("child.match_record_success")
        #TODO
        flash[:notice] = "Tansfer SUCCESS"
      rescue
        flash[:notice] = "Tansfer FAILED"
      end
      redirect_to :back
    end
  end

  private

  def remote_transfer(transfer_records)
    exporter = ((params[:remote_primero].present? && params[:remote_primero] == 'true') ? Exporters::JSONExporter : Exporters::CSVExporter)
    transfer_user = User.new(
                      role_ids: [params[:transfer_type]],
                      module_ids: ["primeromodule-cp", "primeromodule-gbv"]
                    )
    props = filter_permitted_export_properties(transfer_records, model_class.properties, transfer_user)
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
    #TODO - verify this is desired functionality
    new_user = User.find_by_user_name(params[:existing_user]) if params[:existing_user].present?
    if new_user.present?
      transfer_records.each do |transfer_record|
        if new_user.user_name != transfer_record.owned_by
          transfer_record.previously_owned_by = transfer_record.owned_by
          transfer_record.owned_by = new_user.user_name
          transfer_record.owned_by_full_name = new_user.full_name
          transfer_record.save!
          #TODO log stuff
        end
      end
    end
  end

end