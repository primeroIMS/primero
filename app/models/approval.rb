# frozen_string_literal: true
class Approval < ValueObject
  attr_accessor :record, :fields, :user_name, :approval_type, :approval_id, :comments

  BIA = 'bia'
  CASE_PLAN = 'case_plan'
  CLOSURE = 'closure'

  APPROVAL_STATUS_PENDING = 'pending'
  APPROVAL_STATUS_REQUESTED = 'requested'
  APPROVAL_STATUS_APPROVED = 'approved'
  APPROVAL_STATUS_REJECTED = 'rejected'

  BIA_FIELDS = {
    approved: 'bia_approved',
    approval_status: 'approval_status_bia',
    approved_date: 'bia_approved_date',
    approved_comments: 'bia_approved_comments',
  }.freeze

  CASE_PLAN_FIELDS = {
    approved: 'case_plan_approved',
    approval_status: 'approval_status_case_plan',
    approved_date: 'case_plan_approved_date',
    approved_comments: 'case_plan_approved_comments',
    approval_type: 'case_plan_approval_type'
  }.freeze

  CLOSURE_FIELDS = {
    approved: 'closure_approved',
    approval_status: 'approval_status_closure',
    approved_date: 'closure_approved_date',
    approved_comments: 'closure_approved_comments'
  }.freeze

  def self.get!(approval_id, record, user_name, params = {})
    raise Errors::UnknownPrimeroEntityType, 'approvals.error_invalid_approval' if [
      Approval::BIA, Approval::CLOSURE, Approval::CASE_PLAN
    ].exclude?(approval_id)

    Approval.new(
      approval_id: approval_id,
      record: record,
      user_name: user_name,
      fields: "Approval::#{approval_id.upcase}_FIELDS".constantize,
      approval_type: params[:approval_type],
      comments: params[:notes]
    )
  end

  def perform!(status)
    case status
    when Approval::APPROVAL_STATUS_REQUESTED then request!
    when Approval::APPROVAL_STATUS_APPROVED then approve!
    when Approval::APPROVAL_STATUS_REJECTED then reject!
    else raise Errors::InvalidPrimeroEntityType, 'approvals.error_invalid_status'
    end
    record.save!
  end

  def request!
    record.add_approval_alert(approval_id, SystemSettings.current)
    record.send("#{fields[:approval_status]}=", Approval::APPROVAL_STATUS_PENDING)

    if record.module.selectable_approval_types.present? && approval_id == Approval::CASE_PLAN
      record.send("#{fields[:approval_type]}=", approval_type)
    end

    record.approval_subforms ||= []
    record.approval_subforms << approval_request_action(Approval::APPROVAL_STATUS_PENDING, approval_id, user_name)
  end

  def approve!
    record.send("#{fields[:approved]}=", true)
    record.send("#{fields[:approval_status]}=", Approval::APPROVAL_STATUS_APPROVED)
    record.send("#{fields[:approved_date]}=", Date.today)
    record.send("#{fields[:approved_comments]}=", comments) if comments.present?
    record.approval_subforms ||= []
    record.approval_subforms << approval_response_action(
      Approval::APPROVAL_STATUS_APPROVED,
      approval_id,
      user_name,
      comments
    )
  end

  def reject!
    record.send("#{fields[:approved]}=", false)
    record.send("#{fields[:approval_status]}=", Approval::APPROVAL_STATUS_REJECTED)
    record.send("#{fields[:approved_date]}=", Date.today)
    record.send("#{fields[:approved_comments]}=", comments) if comments.present?
    record.approval_subforms ||= []
    record.approval_subforms << approval_response_action(
      Approval::APPROVAL_STATUS_REJECTED,
      approval_id,
      user_name,
      comments
    )
  end

  protected

  def approval_request_action(status, approval_id, requested_by)
    approval_action(status, approval_requested_for: approval_id, requested_by: requested_by)
  end

  def approval_response_action(status, approval_id, approved_by, comments = nil)
    approval_action(
      status,
      approval_response_for: approval_id,
      approval_status: status,
      approved_by: approved_by,
      approval_manager_comments: comments
    )
  end

  def approval_action(status, properties)
    action = {
      approval_requested_for: nil,
      approval_response_for: nil,
      approval_for_type: nil,
      approval_date: Date.today,
      approval_status: status == Approval::APPROVAL_STATUS_PENDING ? Approval::APPROVAL_STATUS_REQUESTED : status,
      approved_by: nil,
      requested_by: nil,
      approval_manager_comments: nil
    }.merge(properties)

    if [action[:approval_requested_for], action[:approval_response_for]].include?(Approval::CASE_PLAN)
      action = action.merge(approval_for_type: record.case_plan_approval_type)
    end

    action.compact
  end
end
