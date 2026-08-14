# frozen_string_literal: true

require 'rails_helper'

describe BulkUserEmailService do
  before :each do
    clean_data(AuditLog, User, Role, Agency, UserGroup)

    @role = Role.new(
      name: 'Test Role',
      unique_id: 'test-role',
      permissions: [
        Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])
      ],
      group_permission: Permission::ALL
    )
    @role.save(validate: false)

    @agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    @agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2')

    @user_group_a = UserGroup.create!(unique_id: 'user-group-1', name: 'user group 1')
    @user_group_b = UserGroup.create!(unique_id: 'user-group-2', name: 'user group 2')

    @sender = create_user(user_name: 'sender', email: 'sender@localhost.com', agency: @agency_a)
    @user_a = create_user(
      user_name: 'user_a', email: 'user_a@localhost.com', agency: @agency_a,
      user_groups: [@user_group_a, @user_group_b]
    )
    @user_b = create_user(user_name: 'user_b', email: 'user_b@localhost.com', agency: @agency_b)
    @user_no_email = create_user(user_name: 'user_no_email', email: nil, agency: @agency_a)
    @user_disabled = create_user(
      user_name: 'user_disabled', email: 'user_disabled@localhost.com', agency: @agency_a, disabled: true
    )
  end

  def create_user(user_name:, email:, agency:, user_groups: [], disabled: false)
    user = User.new(user_name:, email:, full_name: user_name, role: @role, agency:, user_groups:, disabled:)
    user.save(validate: false)
    user
  end

  def build_mail_double
    mail = double('mail')
    allow(mail).to receive(:deliver_now)
    mail
  end

  describe '#send_emails!' do
    it 'sends an email to every emailable recipient matching the ids' do
      mail = build_mail_double
      expect(UserMailer).to receive(:bulk_email).with(@user_a.id, @sender.id, 'A subject', 'A message')
                                                .and_return(mail)
      expect(UserMailer).to receive(:bulk_email).with(@user_b.id, @sender.id, 'A subject', 'A message')
                                                .and_return(mail)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message', { 'ids' => [@user_a.id, @user_b.id] }
      ).send_emails!
    end

    it 'skips users that are not emailable' do
      expect(UserMailer).not_to receive(:bulk_email)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message', { 'ids' => [@user_no_email.id, @user_disabled.id] }
      ).send_emails!

      expect(AuditLog.count).to eq(0)
    end

    it 'writes an audit log entry per recipient' do
      allow(UserMailer).to receive(:bulk_email).and_return(build_mail_double)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message', { 'ids' => [@user_a.id, @user_b.id] }
      ).send_emails!

      audit_logs = AuditLog.where(action: AuditLog::BULK_EMAIL)
      expect(audit_logs.count).to eq(2)
      expect(audit_logs.map(&:record_id)).to match_array([@user_a.id.to_s, @user_b.id.to_s])
      expect(audit_logs.map(&:record_type).uniq).to eq(['User'])
      expect(audit_logs.map(&:user_id).uniq).to eq([@sender.id])
      expect(audit_logs.first.metadata['user_name']).to eq('sender')
    end

    it 'sends a single email per user even if the user belongs to several selected user groups' do
      mail = build_mail_double
      expect(UserMailer).to receive(:bulk_email).once.with(@user_a.id, @sender.id, 'A subject', 'A message')
                                                .and_return(mail)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message',
        { 'user_group_ids' => [@user_group_a.unique_id, @user_group_b.unique_id] }
      ).send_emails!
    end

    it 'continues sending when a recipient raises an error' do
      mail = build_mail_double
      expect(UserMailer).to receive(:bulk_email).with(@user_a.id, @sender.id, 'A subject', 'A message')
                                                .and_raise(StandardError, 'boom')
      expect(UserMailer).to receive(:bulk_email).with(@user_b.id, @sender.id, 'A subject', 'A message')
                                                .and_return(mail)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message', { 'ids' => [@user_a.id, @user_b.id] }
      ).send_emails!

      audit_logs = AuditLog.where(action: AuditLog::BULK_EMAIL)
      expect(audit_logs.map(&:record_id)).to eq([@user_b.id.to_s])
    end

    it 'enables activity stats when the filters include a last date filter' do
      expect(PermittedUsersService).to receive(:new).with(@sender, true).and_call_original

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message',
        { 'last_access' => { 'from' => '2010-01-01T00:00:00Z', 'to' => '2010-01-31T00:00:00Z' } }
      ).send_emails!
    end

    it 'supports last date filters with time values as parsed from JSON requests' do
      expect(UserMailer).not_to receive(:bulk_email)

      BulkUserEmailService.new(
        @sender, 'A subject', 'A message',
        {
          'last_access' => {
            'from' => Time.zone.parse('2010-01-01T00:00:00Z'), 'to' => Time.zone.parse('2010-01-31T00:00:00Z')
          }
        }
      ).send_emails!
    end

    it 'does not enable activity stats without last date filters' do
      expect(PermittedUsersService).to receive(:new).with(@sender, false).and_call_original

      BulkUserEmailService.new(@sender, 'A subject', 'A message', { 'ids' => [@user_a.id] }).send_emails!
    end

    it 'only emails users permitted for the sender' do
      agency_read_role = Role.new(
        name: 'Agency Read Role',
        unique_id: 'agency-read-role',
        permissions: [
          Permission.new(
            resource: Permission::USER, actions: [Permission::AGENCY_READ, Permission::SEND_EMAIL_MULTIPLE]
          )
        ]
      )
      agency_read_role.save(validate: false)
      agency_sender = create_user(user_name: 'agency_sender', email: 'agency_sender@localhost.com', agency: @agency_a)
      agency_sender.role = agency_read_role
      agency_sender.save(validate: false)

      mail = build_mail_double
      expect(UserMailer).to receive(:bulk_email).with(@user_a.id, agency_sender.id, 'A subject', 'A message')
                                                .and_return(mail)
      expect(UserMailer).not_to receive(:bulk_email).with(@user_b.id, anything, anything, anything)

      BulkUserEmailService.new(
        agency_sender, 'A subject', 'A message', { 'ids' => [@user_a.id, @user_b.id] }
      ).send_emails!
    end
  end

  after :each do
    clean_data(AuditLog, User, Role, Agency, UserGroup)
  end
end
