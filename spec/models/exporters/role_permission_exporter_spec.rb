# frozen_string_literal: true

require 'rails_helper'

require 'spreadsheet'

module Exporters
  xdescribe RolePermissionsExporter do
    before :each do
      clean_data(Field, FormSection, Role)
    end

    describe 'Export format' do
      it 'contains the default permission list in the exporter file' do
        data = RolePermissionsExporter.new(nil).export(nil)
        workbook = Spreadsheet.open(data.path)

        sheet = workbook.worksheets.last
        headers = sheet.row(0).to_a
        metadata_headers = %w[Resource Action]
        expect(headers).to eq(metadata_headers)

        permissions_all = Permission.all_available
        resources = permissions_all.map(&:resource)
        actions = permissions_all.map(&:actions).flatten
        expect(sheet.rows.size).to eq(10 + resources.count + actions.count)

        file_resources = [
          'Resource',
          I18n.t('role.group_permission_label', locale: :en),
          I18n.t('permissions.permission.referral', locale: :en),
          I18n.t('permissions.permission.transfer', locale: :en),
          I18n.t('role.role_ids_label', locale: :en)
        ] + resources.map { |resource| I18n.t("permissions.permission.#{resource}", locale: :en) }
        expect(sheet.rows.map { |column| column[0] }.compact.sort).to eq(file_resources.sort)

        file_actions = %w[Action self group all referral transfer] + actions
        expect(sheet.rows.map { |column| column[1] }.compact.count).to eq(file_actions.count)
      end
    end

    describe 'Export format with Role' do
      before :each do
        form = FormSection.new(
          name: 'cases_test_form_1', parent_form: 'case', 'visible' => true, order_form_group: 0,
          order: 0, order_subform: 0, form_group_id: 'cases_test_form_1', unique_id: 'cases_test_form_1'
        )
        form.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
        form.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
        form.save!
        Role.create!(name: 'Admin', permissions: Permission.all_permissions_list)
      end

      it 'contains roles and actions and FormSection list in the exporter file' do
        data = RolePermissionsExporter.new(nil).export(nil)
        workbook = Spreadsheet.open(data.path).worksheets.last.rows
        expect(workbook[0]).to eq(['Resource', 'Action', Role.first.name])

        admin_actions = workbook.map { |work| work[1] if work[2] == '✔' }.compact
        expect(admin_actions).to eq(
          [
            'Access only my records or user', 'Manage', 'Manage', 'Manage', 'Read', 'Manage',
            'Manage', 'Manage', 'Manage', 'Manage', 'Manage', 'Manage', 'Manage', 'Manage', 'Read',
            FormSection.first.name
          ]
        )
        expect(workbook.last.compact).to eq([FormSection.first.name, '✔'])
      end
    end

    after :each do
      clean_data(Field, FormSection, Role)
    end
  end
end
