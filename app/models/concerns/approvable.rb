module Approvable
  extend ActiveSupport::Concern

  BIA = "bia" ; CASE_PLAN = "case_plan" ; CLOSURE = "closure"

  APPROVAL_STATUS_PENDING = 'pending'
  APPROVAL_STATUS_REQUESTED = 'requested'
  APPROVAL_STATUS_APPROVED = 'approved'
  APPROVAL_STATUS_REJECTED = 'rejected'


  included do
    store_accessor :data,
      :approval_status_bia, :approval_status_case_plan, :approval_status_closure, :case_plan_approval_type,
      :bia_approved_date, :closure_approved_date, :case_plan_approved_date,
      :approval_subforms

    searchable auto_index: self.auto_index? do
      string :approval_status_bia, as: 'approval_status_bia_sci'
      string :approval_status_case_plan, as: 'approval_status_case_plan_sci'
      string :approval_status_closure, as: 'approval_status_closure_sci'
      string :case_plan_approval_type, as: 'case_plan_approval_type_sci'
      date :case_plan_approved_date
      date :bia_approved_date
      date :closure_approved_date
    end
  end

  def request_approval(approval_type, approval_status, approval_status_type)
    # TODO: Performance - Should we use @system_settings ||= pattern instead of SystemSettings.current?
    self.add_approval_alert(approval_type, SystemSettings.current)
    case approval_type
    when BIA
      self.approval_status_bia = approval_status
    when CASE_PLAN
      self.approval_status_case_plan = approval_status

      if self.module.selectable_approval_types.present?
        self.case_plan_approval_type = approval_status_type
      end
    when CLOSURE
      self.approval_status_closure = approval_status
    end
    self.approval_subforms = self.approval_subforms || []
    self.approval_subforms << approval_action_record(approval_type, nil, approval_status_type, approval_status)
  end

  def give_approval(approval, approval_type, comments, user)
    approval_status = (approval == 'true') ? APPROVAL_STATUS_APPROVED : APPROVAL_STATUS_REJECTED
    approved = (approval == 'true') ? true : false

    if approval_type.present?
      case approval_type
      when BIA
        self.bia_approved = approved
        self.approval_status_bia = approval_status
        self.bia_approved_date = Date.today
        self.bia_approved_comments = comments if comments.present?
      when CASE_PLAN
        self.case_plan_approved = approved
        self.approval_status_case_plan = approval_status
        self.case_plan_approved_date = Date.today
        self.case_plan_approved_comments = comments if comments.present?
      when CLOSURE
        self.closure_approved = approved
        self.approval_status_closure = approval_status
        self.closure_approved_date = Date.today
        self.closure_approved_comments = comments if comments.present?
      else
        raise("Invalid Approval Type")
      end

      self.approval_subforms << approval_action_record(
          nil,
          approval_type,
          self.case_plan_approval_type,
          approval_status,
          comments,
          user.user_name
      )
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

  def approval_action_record(action_requested=nil, action_response=nil, type=nil, status=nil, comments=nil, approved_by=nil)
    {
        approval_requested_for: action_requested,
        approval_response_for: action_response,
        approval_for_type: type,
        approval_date: Date.today,
        approval_manager_comments: comments,
        approval_status: status == APPROVAL_STATUS_PENDING ? APPROVAL_STATUS_REQUESTED : status,
        approved_by: approved_by
    }
  end

end
