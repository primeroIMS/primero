class NotificationMailer < ApplicationMailer
  helper :application

  def manager_approval_request(user_id, manager_id, record_id, approval_type, host_url)
    @user = User.find_by(id: user_id)
    @manager = User.find_by(id: manager_id)
    @child = Child.find_by(id: record_id)
    @url = host_url

    @approval_type = Lookup.display_value('lookup-approval-type', approval_type)

    if @manager.present? && @child.present?
      mail(:to => @manager.email,
           :subject => t("email_notification.approval_request_subject", id: @child.short_id))
    else
      Rails.logger.error "Mail not sent - User [#{user_id}] or Manager [#{manager_id}] not found"
    end
  end

  def manager_approval_response(manager_id, record_id, approval_type, approval, host_url, is_gbv)
    @child = Child.find_by(id: record_id)
    if @child.blank?
      Rails.logger.error "Approval Response Mail not sent - case not found.  [Case ID: #{case_id}]"
    else
      @owner = @child.owner
      @url = host_url

      if @owner.present? && @owner.email.present? && @owner.send_mail
        @manager = User.find_by(id: manager_id)

        lookup_name = is_gbv ? 'lookup-gbv-approval-types' : 'lookup-approval-type'
        @approval_type = Lookup.display_value(lookup_name, approval_type)

        #TODO: This looks like an I18n bug
        @approval = approval == 'true' ? t('approvals.status.approved') : t('approvals.status.rejected')

        mail(:to => @owner.email,
             :subject => t("email_notification.approval_response_subject", id: @child.short_id))
      else
        Rails.logger.error "Approval Response Mail not sent - invalid owner. [Owner: #{@owner.try(:id)}  "\
                           "Owner email: #{@owner.try(:email)}  Owner send_mail: #{@owner.try(:send_mail)}]"
      end
    end
  end

  def transition_notify(transition_id)
    @transition = Transition.find_by(id: transition_id)
    if @transition.present?
      record = @transition.record
      transitioned_to_user = @transition.to_user
      if transitioned_to_user&.email && transitioned_to_user&.send_mail
        mail(
          to: transitioned_to_user.email,
          subject: t(
            "email_notification.#{@transition.key}_subject",
            record_type: t("forms.record_types.#{record.class.parent_form}"),
            id: record.short_id
          )
        )
      else
        Rails.logger.error(
          "Mail not sent - Valid user not found for Transition #{transition_id} "\
          "To User: #{@transition.to_user_name} "\
          "To User Email: #{transitioned_to_user&.email} "\
          "To User send_mail: #{transitioned_to_user&.send_mail} "\
          "From User: #{@transition.transitioned_by}]"
        )
      end
    else
      Rails.logger.error "Mail not sent - Transition #{transition_id} not found"
    end
  end

  def transfer_request(record_class, record_id, user_id, request_transfer_notes, host_url)
    @model_class = record_class.constantize
    @record = @model_class.find_by(record_id)
    return Rails.logger.error("Request Transfer [RecordType: #{record_class} ID: #{record_id}] to [User ID: #{user_id}] Mail not sent - Record not found") if @record.blank?
    @user = User.find_by(id: user_id)
    return Rails.logger.error("Request Transfer [RecordType: #{record_class} ID: #{record_id}] to [User ID: #{user_id}] Mail not sent - User not found") if @user.blank?
    @owner_email = @record.owner&.email
    return Rails.logger.error("Request Transfer [RecordType: #{record_class} ID: #{record_id}] to [User ID: #{user_id}] Mail not sent - Record Owner has no email address") if @owner_email.blank?
    @url = "#{host_url}/#{@model_class.parent_form.pluralize}/#{@record.id}"
    @record_type = @model_class.parent_form.titleize
    @agency = @user.agency&.name
    @request_transfer_notes = request_transfer_notes

    mail(:to => @owner_email,
         :subject => t("email_notification.transfer_request_subject"))
  end
end
