class NotificationMailer < ApplicationMailer
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

  def transition_notify(transition_type, record_class, record_id, transition_id, host_url)
    @model_class = record_class.constantize
    @record = @model_class.find_by(id: record_id)
    if @record.present? && @record.transitions.present?
      transition = @record.transition_by_type_and_id(transition_type, transition_id)
      if transition.present?
        @transition_type = transition_type
        @user_to = User.find_by_user_name(transition.to_user_name)
        @user_from = User.find_by_user_name(transition.transitioned_by)
        if @user_to.present? && @user_to.email.present? && @user_to.send_mail && @user_from.present?
          @agency_from = @user_from.agency.try(:name)
          @service_type = (transition_type == Transition::REFERRAL ?  Lookup.display_value('lookup-service-type', transition.service) : '')
          @url = "#{host_url}/#{@model_class.parent_form.pluralize}/#{@record.id}"
          @record_type = @model_class.parent_form.titleize
          mail(:to => @user_to.email,
               :subject => t("email_notification.#{transition_type}_subject", record_type: @record_type, id: @record.short_id))
        else
          Rails.logger.error "#{transition_type} Mail not sent - Valid user not found for [RecordType: #{record_class}  "\
                             "ID: #{record_id}  To User: #{@user_to.try(:id)}  To User Email: #{@user_to.try(:email)}  "\
                             "To User send_mail: #{@user_to.try(:send_mail)}  From User: #{@user_from.try(:id)}]"
        end
      else
        Rails.logger.error "#{transition_type} Mail not sent - Transition not found for [RecordType: #{record_class} ID: #{record_id}]"
      end
    else
      Rails.logger.error "#{transition_type} Mail not sent - Transition not found for [RecordType: #{record_class} ID: #{record_id}]"
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
