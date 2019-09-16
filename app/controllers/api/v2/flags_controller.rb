module Api::V2
  class FlagsController < RecordResourceController

    before_action { authorize! :flag, model_class }

    def create
      @record.add_flag(params['data']['message'], params['data']['date'], current_user.user_name)
      status = params[:data][:id].present? ? 204 : 200
      render :create, status: status
    end

    def update
      @flag = @record.remove_flag(params['id'], current_user.user_name, params['data']['unflag_message'])
    end

    def create_bulk
      model_class.batch_flag(@records, params['data']['message'], params['data']['date'].to_date, current_user.user_name)
    end

  end

end
