class NotificationMailer < ActionMailer::Base
  def manager_approval_request(user_id, manager_id, case_id, approval_type, host_url)
    @user = User.get(user_id)
    @manager = User.get(manager_id)
    @recipients = @user.managers.select{ |manager| manager.email.present? && manager.send_mail }
    @child = Child.get(case_id)
    @url = host_url

    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)

    if @manager.present? && @child.present?
      mail(:to => @manager.email,
      :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
      :subject => t("email_notification.approval_request_subject", name: @user.full_name))
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] or Manager [#{manager_id}] not found"
    end
  end

  def manager_approval_response(manager_id, case_id, approval_type, approval, host_url)
    @child = Child.get(case_id)
    @owner = @child.owner
    @url = host_url

    if @owner.send_mail && @owner.present? && @owner.email.present? && @child.present?
      @manager = User.get(manager_id)

      @approval_type = Lookup.display_value('lookup-approval-type', approval_type)
      @approval = approval == 'true' ? t('approvals.status.approved') : t('approvals.status.rejected')

      mail(:to => @owner.email,
        :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
        :subject => t("email_notification.approval_response_subject", id: @child.short_id))
    else
      Rails.logger.error "Mail not sent - User [#{manager_id}] not found"
    end
  end
end
