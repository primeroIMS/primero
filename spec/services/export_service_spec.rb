# frozen_string_literal: true

require 'rails_helper'

describe ExportService do
  describe '.build' do
    it 'builds a new BulkExport' do
      export = ExportService.build({ format: 'json', record_type: 'case' }, nil)
      expect(export.exporter).to be_instance_of(Exporters::JSONExporter)
    end

    it 'requires the presence of the format key before it builds an export' do
      export = ExportService.build({ record_type: 'case' }, nil)
      expect(export).to be_nil
    end

    it 'requires the presence of the record type key before it builds an export' do
      export = ExportService.build({ format: 'json' }, nil)
      expect(export).to be_nil
    end

    it 'builds a DuplicateBUlkExport based on the format' do
      export = ExportService.build({ format: 'duplicate_id_csv', record_type: 'case' }, nil)
      expect(export.exporter).to be_instance_of(Exporters::DuplicateIdCSVExporter)
    end
  end

  describe '.enqueue' do
    before :each do
      ActiveJob::Base.queue_adapter.enqueued_jobs.clear
      @password = 'password'
      @password_encrypted = 'password_encrypted'
      allow(EncryptionService).to receive(:encrypt).with(@password).and_return(@password_encrypted)
      allow(EncryptionService).to receive(:decrypt).with(@password_encrypted).and_return(@password)
    end

    let(:export) { instance_double('BulkExport', id: 1) }

    it 'enqueues an export job' do
      ExportService.enqueue(export, @password)
      expect(BulkExportJob).to have_been_enqueued
        .with(export.id, @password_encrypted)
        .at_least(:once)
    end

    it 'does not enqueue an export job if the password is missing' do
      ExportService.enqueue(export, nil)
      expect(BulkExportJob).not_to have_been_enqueued
    end

    after :each do
      ActiveJob::Base.queue_adapter.enqueued_jobs.clear
    end
  end
end