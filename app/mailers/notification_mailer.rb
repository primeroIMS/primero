class NotificationMailer < ActionMailer::Base
  def manager_approval_request(user_id, case_id, approval_type)
    @user = User.get(user_id)
    @recipients = @user.managers
    @child = Child.get(case_id)

    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)

    if @recipients.present? && @child.present?
      mail(:to => @recipients.map(&:email).uniq,
        :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
        :subject => "#{@user.full_name} - Approval request")
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] not found"
    end
  end
end
