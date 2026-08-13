# frozen_string_literal: true

require 'rails_helper'

describe BulkUserEmailJob, type: :job do
  include ActiveJob::TestHelper

  before do
    clean_data(User, Role, Agency)

    role = Role.new(
      name: 'Test Role',
      unique_id: 'test-role',
      permissions: [Permission.new(resource: Permission::USER, actions: [Permission::MANAGE])]
    )
    role.save(validate: false)
    @sender = User.new(user_name: 'sender', email: 'sender@localhost.com', role:)
    @sender.save(validate: false)
  end

  let(:args) { { 'ids' => [1, 2], 'subject' => 'A subject', 'message' => 'A message' } }

  describe 'perform_later' do
    before { ActiveJob::Base.queue_adapter = :test }

    it 'enqueues a BulkUserEmailJob on the long_running_process queue' do
      expect do
        BulkUserEmailJob.perform_later(@sender.id, args)
      end.to have_enqueued_job(BulkUserEmailJob).on_queue('long_running_process')
    end
  end

  describe 'when job is performed' do
    it 'delegates to BulkUserEmailService#send_emails!' do
      expect(BulkUserEmailService).to receive(:new).with(
        @sender, 'A subject', 'A message', hash_including('ids' => [1, 2])
      ).and_call_original
      expect_any_instance_of(BulkUserEmailService).to receive(:send_emails!)

      BulkUserEmailJob.perform_now(@sender.id, args)
    end
  end

  after :each do
    clean_data(User, Role, Agency)
  end
end
