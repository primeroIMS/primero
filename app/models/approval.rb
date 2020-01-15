class Approval < ValueObject
  attr_accessor :record, :approval_id, :fields

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

  def initialize(args = {})
    super

    raise ArgumentError, 'Invalid Approval Type' if [Child::BIA, Child::CLOSURE, Child::CASE_PLAN].exclude?(approval_id)

    self.fields = "Approval::#{approval_id.upcase}_FIELDS".constantize
  end

  def perform!(status, properties = {})
    case status
    when Child::APPROVAL_STATUS_REQUESTED
      request!(properties[:approval_type])
    when Child::APPROVAL_STATUS_APPROVED
      approve!(properties[:user_name], properties[:comments])
    when Child::APPROVAL_STATUS_REJECTED
      reject!(properties[:user_name], properties[:comments])
    else
      raise ArgumentError, 'Invalid Approval Status'
    end
  end

  def request!(approval_type = nil)
    record.add_approval_alert(approval_id, SystemSettings.current)
    record.send("#{fields[:approval_status]}=", Child::APPROVAL_STATUS_PENDING)

    if record.module.selectable_approval_types.present? && approval_id == Child::CASE_PLAN
      record.send("#{fields[:approval_type]}=", approval_type)
    end

    record.approval_subforms = record.approval_subforms || []
    record.approval_subforms << approval_request_action(Child::APPROVAL_STATUS_PENDING, approval_id)
  end

  def approve!(user_name, comments = nil)
    record.send("#{fields[:approved]}=", true)
    record.send("#{fields[:approval_status]}=", Child::APPROVAL_STATUS_APPROVED)
    record.send("#{fields[:approved_date]}=", Date.today)
    record.send("#{fields[:approved_comments]}=", comments) if comments.present?
    record.approval_subforms << approval_response_action(Child::APPROVAL_STATUS_APPROVED, approval_id, user_name, comments)
  end

  def reject!(user_name, comments = nil)
    record.send("#{fields[:approved]}=", false)
    record.send("#{fields[:approval_status]}=", Child::APPROVAL_STATUS_REJECTED)
    record.send("#{fields[:approved_date]}=", Date.today)
    record.send("#{fields[:approved_comments]}=", comments) if comments.present?
    record.approval_subforms << approval_response_action(Child::APPROVAL_STATUS_REJECTED, approval_id, user_name, comments)
  end

  def approval_request_action(status, approval_id)
    approval_action(status, approval_requested_for: approval_id)
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

  protected

  def approval_action(status, properties)
    {
      approval_requested_for: nil,
      approval_response_for: nil,
      approval_for_type: record.case_plan_approval_type,
      approval_date: Date.today,
      approval_status: status == Child::APPROVAL_STATUS_PENDING ? Child::APPROVAL_STATUS_REQUESTED : status,
      approved_by: nil,
      approval_manager_comments: nil
    }.merge(properties)
  end
end