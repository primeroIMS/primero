# frozen_string_literal: true

require 'rails_helper'

describe PrimeroConfiguration do
  before do
    clean_data(
      User, Role, PrimeroModule, PrimeroConfiguration, Field, FormSection, Lookup, Agency,
      UserGroup, Report, ContactInformation, SystemSettings
    )
    @form1 = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
    @lookup1 = Lookup.create!(unique_id: 'lookup1', name: 'lookup1')
    @agency1 = Agency.create!(name: 'irc', agency_code: '12345')
    permissions = [Permission.new(resource: Permission::CASE, actions: [Permission::READ])]
    @module1 = PrimeroModule.create!(
      unique_id: 'primeromodule-cp-a', name: 'CPA', associated_record_types: %w[case], form_sections: [@form1]
    )
    @role1 = Role.create!(name: 'Role', permissions:, primero_modules: [@module1])
    @user_group1 = UserGroup.create!(name: 'Test Group')
    @report1 = Report.create!(
      record_type: 'case', name_en: 'Test', unique_id: 'report-test',
      aggregate_by: %w[a b], module_id: @module1.unique_id, is_graph: true
    )
    @contact_info = ContactInformation.create!(name: 'test')
    SystemSettings.create(primary_age_range: 'primary',
                          age_ranges: { 'primary' => [1..2, 3..4] },
                          reporting_location_config: { field_key: 'owned_by_location',
                                                       admin_level: 2,
                                                       admin_level_map: { '1' => ['region'],
                                                                          '2' => ['district'] } })
  end

  describe '.current_configuration_data' do
    let(:current_configuration_data) { PrimeroConfiguration.current_configuration_data }

    it 'is a hash of all managed configurations' do
      expect(current_configuration_data.keys).to match_array(
        %w[FormSection Lookup Agency Role UserGroup Report ContactInformation]
      )
      current_configuration_data.each_value do |config_records|
        expect(config_records).to be_a_kind_of(Array)
        expect(config_records.size.positive?).to be_truthy
      end
    end
  end

  describe '#apply!' do
    it 'resets the configuration to the saved state' do
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!
      @form1.update!(name: 'B')
      @role1.update!(name: 'Role2')
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
      expect(Report.first.is_graph).to be_truthy
    end

    it 'reverts new subforms when applying configuration state' do
      form2 = FormSection.create!(unique_id: 'X', name: 'X', parent_form: 'case', form_group_id: 'm')
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!

      subform = FormSection.create!(unique_id: 'Y', name: 'Y - Subform', parent_form: 'case', form_group_id: 'm')
      # field_on_subform
      Field.create!(
        name: 'test2', type: Field::TEXT_FIELD, form_section_id: subform.id, display_name: 'test',
        collapsed_field_for_subform_section_id: subform.id
      )
      # subform_field
      Field.create!(
        name: 'test3', type: Field::SUBFORM, form_section_id: form2.id,
        subform_section_id: subform.id, display_name: 'test'
      )
      current_configuration.apply!

      expect(FormSection.count).to eq(2)
      form2.reload
      expect(form2.fields.count).to eq(0)
      expect(Field.count).to eq(0)
    end

    it 'preserves links between forms and subforms' do
      subform = FormSection.create!(
        unique_id: 'Y', name: 'Y - Subform', parent_form: 'case', form_group_id: 'm', is_nested: true
      )
      # field_on_subform
      Field.create!(
        name: 'test2', type: Field::TEXT_FIELD, form_section_id: subform.id, display_name: 'test',
        collapsed_field_for_subform_section_id: subform.id
      )
      # subform_field
      Field.create!(
        name: 'test3', type: Field::SUBFORM, form_section_id: @form1.id,
        subform_section_id: subform.id, display_name: 'test'
      )
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!

      Field.destroy_all
      FormSection.destroy_all
      current_configuration.apply!

      expect(FormSection.count).to eq(2)
      subform_field = FormSection.find_by(unique_id: @form1.unique_id).fields.find { |f| f.name == 'test3' }
      expect(subform_field.subform.unique_id).to eq(subform.unique_id)
    end

    it 'does not apply the configuration if the version is newer' do
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!

      @form1.update!(name: 'B')
      @role1.update!(name: 'Role2')
      FormSection.create!(unique_id: 'X', name: 'X', parent_form: 'case', form_group_id: 'm')
      Lookup.create!(unique_id: 'lookupX', name: 'lookupX')
      Report.create!(
        record_type: 'case', name_en: 'Test2', unique_id: 'report-test2',
        aggregate_by: %w[a b], module_id: @module1.unique_id
      )

      current_configuration.primero_version = "#{Primero::Application::VERSION.split('.').first.to_i + 1}.0.0"
      current_configuration.apply!

      expect(FormSection.count).to eq(2)
      expect(Role.count).to eq(1)
      expect(Lookup.count).to eq(2)
      expect(Report.count).to eq(2)
    end

    it 'creates a new form' do
      unique_id = 'X'
      new_form = FormSection.create!(unique_id:, name: 'X', parent_form: 'case', form_group_id: 'm')
      @module1.form_sections << new_form
      @module1.save!
      @role1.associate_all_forms
      current_configuration = PrimeroConfiguration.current
      current_configuration.save!
      new_form.destroy
      current_configuration.apply!

      expect(FormSection.all.pluck(:unique_id)).to match_array(%w[A X])
      expect(@role1.form_permissions.count).to eq(2)
    end
  end

  describe '#apply_with_api_lock!' do
    before(:each) { primero_configuration.apply_with_api_lock! }

    describe 'on success' do
      let(:primero_configuration) do
        current_configuration = PrimeroConfiguration.current
        current_configuration.save!
        current_configuration
      end

      it 'applied successfully' do
        expect(primero_configuration.reload.applied_on).not_to be_nil
      end
      it 'does not leave behind the api lock' do
        expect(SystemSettings.first.config_update_lock).to be_falsey
      end
    end

    describe 'on failure' do
      # This will generate an exception because the apply! code expects that all model types are present.
      # The agency specification is valid.
      let(:primero_configuration_hash) do
        {
          'Agency' => [
            { 'name_i18n' => { 'en' => 'IRC' }, 'unique_id' => 'agency-irc', 'agency_code' => 'IRC' }
          ]
        }
      end

      let(:primero_configuration) do
        conf = PrimeroConfiguration.new(data: primero_configuration_hash)
        conf.save(validate: false)
        conf
      end

      it 'rolls back the transaction' do
        expect(Agency.find_by(agency_code: 'IRC')).to be_nil
      end

      it 'does not leave behind the api lock' do
        expect(SystemSettings.first.config_update_lock).to be_falsey
      end
    end
  end

  describe '#save!' do
    let(:current_configuration_data) { PrimeroConfiguration.current_configuration_data }
    it 'save the record with the primero version' do
      primero_configuration = PrimeroConfiguration.current(fake_user)
      primero_configuration.primero_version = 'v2.5.5'
      primero_configuration.save!

      expect(primero_configuration.reload.primero_version).to eq('v2.5.5')
    end
  end

  after do
    clean_data(
      User, Role, PrimeroModule, PrimeroConfiguration, Field, FormSection, Lookup, Agency, UserGroup, Report,
      ContactInformation, SystemSettings
    )
  end
end
