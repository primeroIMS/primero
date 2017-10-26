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
      :subject => t("email_notification.approval_request_subject", id: @child.short_id))
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] or Manager [#{manager_id}] not found"
    end
  end

  def manager_approval_response(manager_id, case_id, approval_type, approval, host_url)
    @child = Child.get(case_id)
    @owner = @child.owner
    @url = host_url

    if @owner.present? && @owner.email.present? && @owner.send_mail && @child.present?
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

  def transition_notify(transition_type, record_class, record_id, transition_id, host_url)
    @model_class = record_class.constantize
    @record = @model_class.get(record_id)
    if @record.present? && @record.transitions.present?
      transition = @record.transition_by_type_and_id(transition_type, transition_id)
      if transition.present?
        @transition_type = transition_type
        @user_to = User.find_by_user_name(transition.to_user_local)
        @user_from = User.find_by_user_name(transition.transitioned_by)
        if @user_to.present? && @user_to.email.present? && @user_to.send_mail && @user_from.present?
          @url = "#{host_url}/#{@model_class.parent_form.pluralize}/#{@record.id}"
          @record_type = @model_class.parent_form.titleize
          mail(:to => @user_to.email,
               :from => Rails.application.config.action_mailer[:default_options].try(:[], :from),
               :subject => t("email_notification.#{transition_type}_subject", record_type: @record_type, id: @record.short_id))
        end
      else
        Rails.logger.error "#{transition_type} Mail not sent - Transition not found for [RecordType: #{record_class} ID: #{record_id}]"
      end
    end
  end
end
