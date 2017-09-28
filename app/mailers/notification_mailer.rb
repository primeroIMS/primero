class NotificationMailer < ActionMailer::Base
  def manager_approval_request(user_id, case_id, approval_type)
    @user = User.get(user_id)
    @recipients = @user.managers
    @child = Child.get(case_id)

    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)

    if @recipients.present? && @child.present?
      mail(:to => @recipients.map(&:email).uniq,
        :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
        :subject => "#{@user.full_name} - Approval Request")
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end

  def manager_approval_response(user_id, case_id, approval_type, approval)
    @user = User.get(user_id)
    @child = Child.get(case_id)
    @owner = @child.owner
    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)
    @approval = approval == 'true' ? t('approvals.status.approved') : t('approvals.status.rejected')

    if @owner.present? && @child.present?
      mail(:to => @owner.email,
        :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
        :subject => "Case: #{@child.case_id_display} - Approval Response")
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end
end
