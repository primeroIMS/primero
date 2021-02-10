# frozen_string_literal: true

require 'rails_helper'

describe ApiConnector::WebhookConnector do
  before(:each) { clean_data(Role, Field, FormSection, PrimeroModule, AuditLog) }
  let(:form) do
    FormSection.create!(
      unique_id: 'test_form_abc', parent_form: 'case', name_en: 'Basic Identity',
      fields: [
        Field.new(name: 'name', type: 'text_field', display_name_en: 'Name'),
        Field.new(name: 'age', type: Field::NUMERIC_FIELD, display_name_en: 'Age'),
        Field.new(name: 'sex', type: 'text_field', display_name_en: 'Sex')
      ]
    )
  end
  let(:role) do
    Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      group_permission: Permission::SELF,
      permissions: [
        Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      ],
      form_sections: [form]
    )
  end
  let(:url) { 'https://example.com/inbox/abc123' }
  let(:connector) do
    ApiConnector::WebhookConnector.new(
      'webhook_role_unique_id' => role.unique_id,
      'webhook_url' => url
    )
  end
  let(:record) { Child.new(data: { name: 'Test', age: 12, sex: 'female', protection_concerns: %w[a b c] }) }

  # test creation/initializer parsing the webhook url correctly, setting role ,etc
  describe 'initialization' do
    it 'correctly parses the wehook url to build the connection' do
      expect(connector.connection.options['host']).to eq('example.com')
      expect(connector.connection.options['port']).to eq(443)
      expect(connector.connection.options['tls']).to be_truthy
      expect(connector.webhook_path).to eq('/inbox/abc123')
    end

    it 'sets the webhook role' do
      expect(connector.role).to be_a(Role)
      expect(connector.role.unique_id).to eq('test-role-1')
    end
  end

  describe '.post_params' do
    it 'constrains the record params' do
      params = connector.post_params(record)

      expect(params[:data].keys).to include('name', 'age', 'sex')
      expect(params[:data].keys).not_to include('protection_concerns')
    end
  end

  describe 'message logging' do
    let(:connection) { double('connection') }
    before(:each) { connector.connection = connection }

    it 'logs a success message on a success response' do
      expect(connection).to(receive(:post).and_return([204, {}]))
      expect(AuditLog.count.zero?).to be_truthy

      connector.update(record)
      expect(AuditLog.count).to eq(1)
      send_log = AuditLog.first
      expect(send_log.action).to eq(AuditLog::WEBHOOK)
      expect(send_log.resource_url).to eq(url)
      expect(send_log.webhook_status).to eq(AuditLog::SENT)
    end

    it 'logs an error message on a failed response' do
      expect(connection).to(receive(:post).and_return([400, {}]))
      expect(AuditLog.count.zero?).to be_truthy

      connector.update(record)
      expect(AuditLog.count).to eq(1)
      send_log = AuditLog.first
      expect(send_log.action).to eq(AuditLog::WEBHOOK)
      expect(send_log.resource_url).to eq(url)
      expect(send_log.webhook_status).to eq(AuditLog::FAILED)
    end
  end
end
