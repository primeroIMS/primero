module Api::V2
  class FlagsController < RecordResourceController

    before_action { authorize! :flag, model_class }

    def create
      authorize! :flag_record, @record
      @flag = @record.add_flag(params['data']['message'], params['data']['date'], current_user.user_name)
      status = params[:data][:id].present? ? 204 : 200
       updates_for_record(@record)
      render :create, status: status
    end

    def update
      authorize! :flag_record, @record
      @flag = @record.remove_flag(params['id'], current_user.user_name, params['data']['unflag_message'])
      updates_for_record(@record)
    end

    def create_bulk
      authorize_all!(:flag, @records)
      model_class.batch_flag(@records, params['data']['message'], params['data']['date'].to_date, current_user.user_name)
    end

    def create_action_message
      'flag'
    end

    def update_action_message
      'unflag'
    end

    def create_bulk_record_resource
      'bulk_flag'
    end
  end
end
