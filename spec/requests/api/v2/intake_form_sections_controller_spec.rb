# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::IntakeFormSectionsController, type: :request do
	before do
		clean_data(Field, FormSection, PrimeroModule, Role, SystemSettings)

		@primero_module = PrimeroModule.create!(
			unique_id: PrimeroModule::CP,
			name: 'Child Protection',
			associated_record_types: ['case']
		)
		@intake_form = FormSection.create!(
			unique_id: 'intake_identity',
			name: 'Intake Identity',
			parent_form: 'case',
			fields: [Field.new(name: 'name', type: Field::TEXT_FIELD, display_name: 'Name')]
		)
		@excluded_form = FormSection.create!(
			unique_id: 'excluded_form',
			name: 'Excluded Form',
			parent_form: 'case',
			fields: [Field.new(name: 'excluded_field', type: Field::TEXT_FIELD, display_name: 'Excluded field')]
		)
		@role = Role.new_with_properties(
			name: 'Intake Role',
			unique_id: 'intake-role',
			group_permission: Permission::ALL,
			primero_modules: [@primero_module],
			permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE])],
			form_section_read_write: { @intake_form.unique_id => 'rw' }
		)
		@role.save!
		@primero_module.update!(form_sections: [@intake_form, @excluded_form], roles: [@role])
		SystemSettings.create!(registration_streams: [{ unique_id: 'intake-stream', role: @role.unique_id }])
	end

	after do
		clean_data(Field, FormSection, PrimeroModule, Role, SystemSettings)
	end

	let(:json) { JSON.parse(response.body) }

	describe 'GET /api/v2/intakes/:id/forms' do
		around do |example|
			Rack::Attack.enabled = false
			example.run
		ensure
			Rack::Attack.enabled = true
		end

		it 'returns the form sections permitted by the registration stream role' do
			get '/api/v2/intakes/intake-stream/forms'

			expect(response).to have_http_status(:ok)
			expect(json['data'].map { |form| form['unique_id'] }).to contain_exactly(@intake_form.unique_id)
			expect(json['data'].first['fields'].map { |field| field['name'] }).to contain_exactly('name')
		end
	end
end
