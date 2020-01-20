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
  end

  #TODO: This really needs to be on the after_save callback, as soon as we decouple the url host
  def send_approval_request_mail(approval_type, host_url)
    managers = self.owner.managers.select{ |manager| manager.email.present? && manager.send_mail }
    if managers.present?
      managers.each do |manager|
        ApprovalRequestJob.perform_later(self.owner.id, manager.id, self.id, approval_type, host_url)
      end
    else
      Rails.logger.info "Approval Request Mail not sent.  No managers present with send_mail enabled.  User - [#{self.owner.id}]"
    end
  end

  #TODO: This really needs to be on the after_save callback, as soon as we decouple the url host
  def send_approval_response_mail(manager_id, approval_type, approval, host_url, is_gbv = false)
    ApprovalResponseJob.perform_later(manager_id, self.id, approval_type, approval, host_url, is_gbv)
  end
end
