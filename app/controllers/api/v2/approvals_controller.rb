module Api::V2
  class ApprovalsController < RecordResourceController
    before_action :approval_params, :approval_permission, only: [:update]

    def update
      authorize! @approval_permission, @model_class

      approval = Approval.new(record: @record, approval_id: params[:id])
      approval.perform!(
        @approval_params[:approval_status],
        approval_type: @approval_params[:approval_type],
        user_name: current_user.user_name,
        comments: @approval_params[:notes]
      )
      @record.save!
      updates_for_record(@record)
      render 'api/v2/approvals/show'
    end

    private

    def approval_params
      @approval_id ||= params.require(:id)
      @approval_params ||= params.require(:data).permit(%i[approval_status approval_type notes])
    end

    def approval_permission
      permission_type = case @approval_params[:approval_status]
                        when Child::APPROVAL_STATUS_REQUESTED then 'Permission::REQUEST_APPROVAL'
                        else 'Permission::APPROVE'
                        end
      @approval_permission ||= "#{permission_type}_#{@approval_id.upcase}".constantize.to_sym
    end
  end
end