# frozen_string_literal: true

require 'rails_helper'

require 'spreadsheet'

# Spec for the RolePermissionsExporter
module Exporters
  describe RolePermissionsExporter do
    before :each do
      clean_data(Field, FormSection, Role)
    end

    describe 'export file' do
      before do
        @permissions_all = Permission.all_available
        @resources = @permissions_all.map(&:resource)
        @actions = @permissions_all.map(&:actions).flatten
        @permission_actions_translation =
          @actions.map { |action| I18n.t("permissions.permission.#{action}", locale: :en) }
      end

      context 'without Role' do
        before do
          data = RolePermissionsExporter.new(nil).export(nil)
          workbook = Spreadsheet.open(data.path)
          @sheet = workbook.worksheets.last
        end

        describe 'header' do
          before do
            @headers = @sheet.row(0).to_a
          end

          it 'has Resource and Action' do
            metadata_headers = %w[Resource Action]
            expect(@headers).to eq(metadata_headers)
          end
        end

        describe 'rows' do
          before do
            @rows = @sheet.rows

            # TODO: for later... write more tests using these
            @case_permission = @permissions_all.select { |p| p.resource == 'case' }
            @incident_permission = @permissions_all.select { |p| p.resource == 'incident' }
          end

          xit 'has resources and actions' do
            # TODO: fix this test
            # TODO: Why the hard coded 12?  What does that signify?
            expect(@rows.size).to eq(12 + @resources.count + @actions.count)
          end

          it 'has all of the resources' do
            expected_resources = [
              'Resource',
              I18n.t('role.group_permission_label', locale: :en),
              I18n.t('permissions.permission.referral', locale: :en),
              I18n.t('permissions.permission.transfer', locale: :en),
              I18n.t('permissions.permission.case_exports', locale: :en),
              I18n.t('permissions.permission.case_approvals', locale: :en),
              I18n.t('permissions.permission.cases_managed_other_users', locale: :en),
              I18n.t('permissions.permission.case_assignments_referrals_transfers', locale: :en),
              I18n.t('role.role_ids_label', locale: :en)
            ] + @resources.map { |resource| I18n.t("permissions.permission.#{resource}", locale: :en) }
            file_resources = @rows.map { |column| column[0] }.compact
            expect(file_resources).to match_array(expected_resources)
          end

          it 'has all of the actions' do
            action_labels = %w[self group admin_only all] + @actions
            expected_actions = ['Action',
                                I18n.t('role.referral_label', locale: :en),
                                I18n.t('role.transfer_label', locale: :en)] +
                               action_labels.map { |label| I18n.t("permissions.permission.#{label}", locale: :en) }
            file_actions = @rows.map { |column| column[1] }.compact
            expect(file_actions).to match_array(expected_actions)
          end
        end
      end

      context 'with Role' do
        before do
          form = FormSection.new(
            name: 'cases_test_form_1', parent_form: 'case', 'visible' => true, order_form_group: 0,
            order: 0, order_subform: 0, form_group_id: 'cases_test_form_1', unique_id: 'cases_test_form_1'
          )
          form.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
          form.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
          form.save!
          Role.create!(name: 'Admin', permissions: Permission.all_available)

          data = RolePermissionsExporter.new(nil).export(nil)
          workbook = Spreadsheet.open(data.path)
          @sheet = workbook.worksheets.last
        end

        describe 'header' do
          before do
            @headers = @sheet.row(0).to_a
          end

          it 'has Resource and Action' do
            metadata_headers = ['Resource', 'Action', Role.first.name]
            expect(@headers).to eq(metadata_headers)
          end
        end

        describe 'rows' do
          before do
            @rows = @sheet.rows
            @admin_actions = @rows.map { |work| work[1] if work[2] == '✔' }.compact
            @permission_actions_translation = @permission_actions_translation << FormSection.first.name
            @permission_actions_translation = @permission_actions_translation << 'Access only my records or user'
          end

          it 'has all of the actions' do
            # binding.pry
            # x=0
            expect(@admin_actions).to match_array(@permission_actions_translation)
          end

          it 'has form name checked' do
            # binding.pry
            expect(@rows.last.compact).to eq([FormSection.first.name, '✔'])
          end
        end
      end
    end

    after :each do
      clean_data(Field, FormSection, Role)
    end
  end
end
