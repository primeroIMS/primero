# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

describe ContactInformationMailJob, type: :job do
  include ActiveJob::TestHelper

  let(:mailer_double) { double('ContactInformationMailer', deliver_now: true) }

  describe 'perform_later' do
    it 'calls ContactInformationMailer with the correct notification_type' do
      expect(ContactInformationMailer).to receive(:notify)
        .with(:maximum_attachments_space)
        .and_return(mailer_double)

      ContactInformationMailJob.new.perform(:maximum_attachments_space)
    end

    it 'delivers the mail immediately' do
      allow(ContactInformationMailer).to receive(:notify).and_return(mailer_double)

      expect(mailer_double).to receive(:deliver_now)

      ContactInformationMailJob.new.perform(:maximum_attachments_space)
    end
  end

  describe 'queue' do
    it 'is enqueued on the mailer queue' do
      expect do
        ContactInformationMailJob.perform_later(:maximum_attachments_space_warning)
      end.to have_enqueued_job(ContactInformationMailJob).on_queue('mailer')
    end
  end
end
