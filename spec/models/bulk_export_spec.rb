# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'
require 'roo'

describe BulkExport, { search: true } do
  before :each do
    clean_data(BulkExport, Location, UserGroup, User, Agency, Role, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings,
               FormPermission)

    @form_section = create(
      :form_section,
      unique_id: 'test_form',
      fields: [
        build(:field, name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        build(:field, name: 'case_id', type: 'text_field', display_name: 'Case Id'),
        build(:field, name: 'unhcr_individual_no', type: 'text_field', display_name: 'Unh No'),
        build(:field, name: 'child_name_last_first', type: 'text_field', display_name: 'Name'),
        build(:field, name: 'age', type: 'numeric_field', display_name: 'Age'),
        build(:field, name: 'family_count_no', type: 'numeric_field', display_name: 'Family No')
      ]
    )
    primero_module = create(:primero_module)
    role = create(:role, form_sections: [@form_section], modules: [primero_module], group_permission: Permission::SELF)
    @user = create(:user, role:)
  end

  describe 'custom bulk export' do
    let(:child1) { Child.create!(data: { age: 5, owned_by: @user.user_name }) }
    let(:child2) { Child.create!(data: { age: 10 }) }
    let(:bulk_export) do
      BulkExport.new(
        format: Exporters::SelectedFieldsExcelExporter.id,
        record_type: 'case',
        custom_export_params: { field_names: %w[age sex] },
        owned_by: @user.user_name
      )
    end

    let(:export_spreadsheet) do
      bulk_export.export('XXX')
      data = bulk_export.exporter.buffer.string
      book = Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      book.sheet(book.sheets.first)
    end

    before do
      child1
      child2
    end

    it 'exports only the selected fields for cases' do
      expect(export_spreadsheet.row(1)).to eq %w[ID Age]
    end

    it 'exports only the record in the user scope' do
      expect(export_spreadsheet.count).to eq(2)
      expect(export_spreadsheet.row(1)).to eq %w[ID Age]
      expect(export_spreadsheet.row(2)).to eq([child1.short_id, child1.age])
    end
  end

  describe 'export time filtering' do
    let(:bulk_export) do
      BulkExport.new(
        format: Exporters::SelectedFieldsExcelExporter.id,
        record_type: 'case',
        custom_export_params: { field_names: ['age'] },
        owned_by: @user.user_name,
        started_on: Time.now.utc,
        filters: {'status' => 'open'}
      )
    end

    let(:export_spreadsheet) do
      bulk_export.export('XXX')
      data = bulk_export.exporter.buffer.string
      book = Roo::Spreadsheet.open(StringIO.new(data), extension: :xlsx)
      book.sheet(book.sheets.first)
    end

    it 'does not include records created after export started' do
      child_before = Child.create!(data: { status: 'open', age: 3, owned_by: @user.user_name, created_at: 1.hour.ago })

      travel 1.minute do
        Child.create!(data: { status: 'open', age: 4, owned_by: @user.user_name })
      end

      expect(export_spreadsheet.column(1)).to contain_exactly('ID', child_before.short_id)
      expect(export_spreadsheet.row(2)).to eq([child_before.short_id, child_before.age])
    end
  end


  describe '#search_records' do
    let(:bulk_export) { BulkExport.new(record_type: 'case') }
    let(:default_exporter) { instance_double(Exporters::ExcelExporter) }
    let(:photowall_exporter) { instance_double(Exporters::PhotoWallExporter) }

    before do
      allow(bulk_export).to receive(:record_query_scope).and_return(nil)
    end

    context 'when using a default exporter' do
      before do
        allow(bulk_export).to receive(:exporter).and_return(default_exporter)
        allow(default_exporter).to receive(:skip_attachments?).and_return(true)
      end

      it 'calls PhoneticSearchService with skip_attachments: true' do
        expect(PhoneticSearchService).to receive(:search).with(
          any_args,
          hash_including(skip_attachments: true)
        ).and_return(double(records: [], total: 0))

        bulk_export.search_records({}, 100, 1, nil)
      end
    end

    context 'when using PhotoWallExporter' do
      before do
        allow(bulk_export).to receive(:exporter).and_return(photowall_exporter)
        allow(photowall_exporter).to receive(:skip_attachments?).and_return(false)
      end

      it 'calls PhoneticSearchService with skip_attachments: false' do
        expect(PhoneticSearchService).to receive(:search).with(
          any_args,
          hash_including(skip_attachments: false)
        ).and_return(double(records: [], total: 0))

        bulk_export.search_records({}, 100, 1, nil)
      end
    end
  end

  after :each do
    travel_back
    clean_data(BulkExport, Location, UserGroup, User, Agency, Role, Field,
               FormSection, Child, PrimeroModule, PrimeroProgram, SystemSettings,
               FormPermission)
  end
end
