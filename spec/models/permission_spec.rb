# frozen_string_literal: true

require 'rails_helper'

describe Permission do
  before do
    # TODO add setup and teardown when we add instance method tests
  end

  describe '.resources' do
    it 'returns all rescources' do
      expected = [Permission::CASE, Permission::INCIDENT, Permission::TRACING_REQUEST, Permission::POTENTIAL_MATCH,
                  Permission::REGISTRY, Permission::ROLE, Permission::USER, Permission::USER_GROUP, Permission::AGENCY,
                  Permission::WEBHOOK, Permission::METADATA, Permission::SYSTEM, Permission::REPORT,
                  Permission::MANAGED_REPORT, Permission::DASHBOARD, Permission::AUDIT_LOG,
                  Permission::MATCHING_CONFIGURATION, Permission::DUPLICATE, Permission::CODE_OF_CONDUCT,
                  Permission::ACTIVITY_LOG]
      expect(Permission.resources).to match_array(expected)
    end
  end

  describe '.records' do
    it 'returns all records' do
      expected = [Permission::CASE, Permission::INCIDENT, Permission::TRACING_REQUEST, Permission::REGISTRY]
      expect(Permission.records).to match_array(expected)
    end
  end

  describe '.management' do
    it 'returns all management values' do
      expected = [Permission::SELF, Permission::GROUP, Permission::ALL, Permission::ADMIN_ONLY, Permission::AGENCY,
                  Permission::WEBHOOK]
      expect(Permission.management).to match_array(expected)
    end
  end

  after do
    # TODO add setup and teardown when we add instance method tests
  end
end
