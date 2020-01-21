module Approvable
  extend ActiveSupport::Concern

  included do
    store_accessor :data,
      :bia_approved, :case_plan_approved, :closure_approved,
      :approval_status_bia, :approval_status_case_plan, :approval_status_closure, :case_plan_approval_type,
      :bia_approved_date, :closure_approved_date, :case_plan_approved_date,
      :bia_approved_comments, :case_plan_approved_comments, :closure_approved_comments,
      :approval_subforms

    searchable do
      string :approval_status_bia, as: 'approval_status_bia_sci'
      string :approval_status_case_plan, as: 'approval_status_case_plan_sci'
      string :approval_status_closure, as: 'approval_status_closure_sci'
      string :case_plan_approval_type, as: 'case_plan_approval_type_sci'
      date :case_plan_approved_date
      date :bia_approved_date
      date :closure_approved_date
    end

    after_commit :send_approval_mail
  end

  def send_approval_mail
    return if approval_subforms.blank? || saved_changes_to_record.keys.exclude?('approval_subforms')

    approval = approval_subforms.last
    if approval['approval_requested_for'].present?
      send_approval_request_mail(approval)
    else
      send_approval_response_mail(approval)
    end
  end

  def send_approval_request_mail(approval)
    managers = owner.managers.select{ |manager| manager.email.present? && manager.send_mail }
    if managers.present?
      managers.each do |manager|
        ApprovalRequestJob.perform_later(id, approval['approval_for_type'], manager.user_name)
      end
    else
      Rails.logger.info "Approval Request Mail not sent.  No managers present with send_mail enabled.  User - [#{self.owner.id}]"
    end
  end

  def send_approval_response_mail(approval)
    ApprovalResponseJob.perform_later(
      id,
      send("#{approval['approval_response_for']}_approved"),
      approval['approval_for_type'],
      approval['approved_by']
    )
  end
end
