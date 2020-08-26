# frozen_string_literal: true

require 'rails_helper'

describe PrimeroConfiguration do
  before(:each) do
    clean_data(FormSection, Field, Lookup, Agency, Role, UserGroup, Report, ContactInformation, PrimeroModule)
    @form1 = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
    @lookup1 = Lookup.create!(unique_id: 'lookup1', name: 'lookup1')
    @agency1 = Agency.create!(name: 'irc', agency_code: '12345')
    permissions = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
    @module1 = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-a', name: 'CPA', associated_record_types: %w[case], form_sections: [@form1]
    )
    @role1 = Role.create!(name: 'Role', permissions: permissions)
    @user_group1 = UserGroup.create!(name: 'Test Group')
    @report1 = Report.create!(
      record_type: 'case', name_en: 'Test', unique_id: 'report-test',
      aggregate_by: %w[a b], module_id: @module1.unique_id
    )
    @contact_info = ContactInformation.create!(name: 'test')
  end

  describe '.current_configuration_data' do
    let(:current_configuration_data) { PrimeroConfiguration.current_configuration_data }

    it 'is a hash of all managed configurations' do
      expect(current_configuration_data.keys).to match_array(
        %w[FormSection Lookup Agency Role UserGroup Report ContactInformation]
      )
      current_configuration_data.values.each do |config_records|
        expect(config_records).to be_a_kind_of(Array)
        expect(config_records.size.positive?).to be_truthy
      end
    end
  end

  describe '#apply!' do
    before(:each) do
      clean_data(PrimeroConfiguration)
    end

    it 'resets the configuration to the saved state' do
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!
      @form1.update_attributes!(name: 'B')
      @role1.update_attributes!(name: 'Role2')
      FormSection.create!(unique_id: 'X', name: 'X', parent_form: 'case', form_group_id: 'm')
      Lookup.create!(unique_id: 'lookupX', name: 'lookupX')
      Report.create!(
        record_type: 'case', name_en: 'Test2', unique_id: 'report-test2',
        aggregate_by: %w[a b], module_id: @module1.unique_id
      )
      current_configuration.apply!

      expect(FormSection.count).to eq(1)
      expect(FormSection.first.name).to eq('A')
      expect(Role.count).to eq(1)
      expect(Role.first.name).to eq('Role')
      expect(Lookup.count).to eq(1)
      expect(Lookup.first.unique_id).to eq('lookup1')
      expect(Report.count).to eq(1)
      expect(Report.first.unique_id).to eq('report-test')
    end

    it 'reverts new subforms when applying configuration state' do
      form2 = FormSection.create!(unique_id: 'X', name: 'X', parent_form: 'case', form_group_id: 'm')
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!

      subform = FormSection.create!(unique_id: 'Y', name: 'Y - Subform', parent_form: 'case', form_group_id: 'm')
      field_on_subform = Field.create!(
        name: 'test2', type: Field::TEXT_FIELD, form_section_id: subform.id, display_name: 'test',
        collapsed_field_for_subform_section_id: subform.id
      )
      subform_field = Field.create!(
        name: 'test3', type: Field::SUBFORM, form_section_id: form2.id,
        subform_section_id: subform.id, display_name: 'test'
      )
      current_configuration.apply!

      expect(FormSection.count).to eq(2)
      form2.reload
      expect(form2.fields.count).to eq(0)
      expect(Field.count).to eq(0)
    end
  end
end
