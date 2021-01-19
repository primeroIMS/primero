module Api::V2
  class ApprovalsController < RecordResourceController
    before_action :approval_params, only: [:update]

    def update
      approval = Approval.get!(params[:id], @record, current_user.user_name, @approval_params)
      authorize! approval_permission, @model_class
      approval.perform!(@approval_params[:approval_status])
      updates_for_record(@record)
    end

    def update_action_message
      "#{params[:id]}_#{approval_params[:approval_status]}"
    end

    private

    def approval_params
      @approval_params ||= params.require(:data).permit(%i[approval_status approval_type notes])
    end

    def approval_permission
      permission_suffix = if @approval_params[:approval_status] == Approval::APPROVAL_STATUS_REQUESTED
                            'request_approval'
                          else
                            'approve'
                          end
      "#{permission_suffix}_#{params[:id]}".to_sym
    end
  end
end
