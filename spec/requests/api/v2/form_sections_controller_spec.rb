# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::FormSectionsController, type: :request do
  before :each do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Role, Lookup)
    Field.where(editable: false).each do |f|
      f.editable = true
      f.save(validate: false)
    end
    Field.destroy_all
    FormSection.where(editable: false).each do |fs|
      fs.editable = true
      fs.save(validate: false)
    end
    FormSection.destroy_all

    @form1 = FormSection.create!(
      unique_id: 'form_section_1',
      name_i18n: { en: 'Form Section 1' },
      parent_form: 'case',
      editable: false,
      fields: [
        Field.new(
          name: 'fs1_field_1',
          type: Field::TEXT_FIELD,
          display_name_i18n: { en: 'First field in form section' },
          editable: false
        )
      ]
    )
    @form2 = FormSection.create!(
      unique_id: 'form_section_2',
      name_i18n: {
        en: 'Form Section 2',
        es: 'Sección de formulario 2'
      },
      parent_form: 'case',
      fields: [
        Field.new(
          name: 'fs2_field_1',
          type: Field::TEXT_FIELD,
          display_name_i18n: { en: 'First field in form section 2' }
        )
      ]
    )
    @form3 = FormSection.create!(
      unique_id: 'form_section_3',
      name_i18n: { en: 'Form Section 3' }
    )

    @form4 = FormSection.create!(
      unique_id: 'form_section_4',
      name_i18n: { en: 'Form Section_4 ' },
      is_nested: true
    )

    @form3.fields = [
      Field.create!(
        name: 'subform_form_4',
        type: Field::SUBFORM,
        subform_section: @form4,
        display_name: {
          en: 'Subform Field for Form 4'
        }
      )
    ]

    @form3.save!
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/forms' do
    context 'when not excluding subforms' do
      it 'list all forms' do
        login_for_test

        get '/api/v2/forms'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(4)
        expected = [@form1.unique_id, @form2.unique_id, @form3.unique_id, @form4.unique_id]
        expect(json['data'].map { |c| c['unique_id'] }).to match_array(expected)
      end
    end

    context 'when not including subforms' do
      it 'list only main level forms' do
        login_for_test

        params = { exclude_subforms: true }
        get '/api/v2/forms', params: params

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(3)
        expected = [@form1.unique_id, @form2.unique_id, @form3.unique_id]
        expect(json['data'].map { |c| c['unique_id'] }).to match_array(expected)
      end
    end
  end

  describe 'GET /api/v2/forms/:id' do
    it 'fetches the correct form with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/forms/#{@form1.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form1.id)
    end

    it 'NO fetches form_group_name with code 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/forms/#{@form1.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form1.id)
      expect(json['data'].keys).not_to include('form_group_name')
    end

    it 'fetches a form which is nested' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      get "/api/v2/forms/#{@form4.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form4.id)
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test

      get "/api/v2/forms/#{@form1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form1.id}")
    end

    it 'returns a 404 when trying to fetch a form with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      get '/api/v2/forms/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end
  end

  describe 'POST /api/v2/forms' do
    before do
      @form_section_a = FormSection.create!(unique_id: 'A', name: 'A', parent_form: 'case', form_group_id: 'm')
      @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: 'Some program')
      @primero_module = PrimeroModule.create!(
        primero_program: @primero_program, name: 'Test Module', associated_record_types: ['case'],
        form_sections: [@form_section_a]
      )
      @permission_form_manage = Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
      @role = Role.create!(
        form_sections: [@form_section_a],
        name: 'Test Role', permissions: [@permission_form_manage],
        modules: [@primero_module]
      )
    end

    it 'creates a new form with fields and returns 200 and json' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          unique_id: 'client_created_form_1',
          name: {
            en: 'Client Created Form 1'
          },
          fields: [
            {
              'name': 'custom_field_by_api',
              'type': 'separator',
              'order': 777,
              'display_name': {
                'en': 'Custom Field by API'
              }
            }
          ]
        }
      }
      post '/api/v2/forms', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      form_section = FormSection.find_by(id: json['data']['id'])
      expect(form_section).not_to be_nil
      expect(form_section.name_en).to eq(params[:data][:name][:en])
      expect(form_section.fields.size).to eq(1)
      expect(form_section.fields.first.name).to eq(params[:data][:fields][0][:name])
      expect(json['data']['fields'][0]['order']).to eq(777)
    end

    it 'Creates a new form with several fields and validates their order by index' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          unique_id: 'client_created_form_1', name: { en: 'Client Created Form 1' },
          fields: [
            {
              'name': 'custom_field_0', 'type': 'separator', 'display_name': { 'en': 'Custom Field 1' }
            },
            {
              'name': 'custom_field_1', 'type': 'separator', 'display_name': { 'en': 'Custom Field 2' }
            },
            {
              'name': 'custom_field_2', 'type': 'separator', 'display_name': { 'en': 'Custom Field 3' }
            }
          ]
        }
      }
      post '/api/v2/forms', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['fields'].map { |field| [field['name'], field['order']] }).to eq(
        [['custom_field_0', 0], ['custom_field_1', 1], ['custom_field_2', 2]]
      )
    end

    it 'Creates a new form with several fields and adding a customised order' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          unique_id: 'client_created_form_1', name: { en: 'Client Created Form 1' },
          fields: [
            {
              'name': 'custom_field_0', 'type': 'separator', 'display_name': { 'en': 'Custom Field 1' }
            },
            {
              'name': 'custom_field_1', 'type': 'separator', 'display_name': { 'en': 'Custom Field 2' },
              order: 777
            },
            {
              'name': 'custom_field_2', 'type': 'separator', 'display_name': { 'en': 'Custom Field 3' }
            }
          ]
        }
      }
      post '/api/v2/forms', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['fields'].map { |field| [field['name'], field['order']] }).to eq(
        [['custom_field_0', 0], ['custom_field_1', 777], ['custom_field_2', 2]]
      )
    end

    it 'creates a new form with 200 and correctly sets the localized properties' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          unique_id: 'client_created_form_1',
          name: {
            en: 'Client Created Form 1',
            es: 'Formulario creado por el ciente 1'
          },
          fields: [
            {
              'name': 'custom_field_by_api',
              'type': 'separator',
              'display_name': {
                'en': 'Custom Field by API',
                'es': 'Campo personalizado por API'
              }
            }
          ]
        }
      }
      post '/api/v2/forms', params: params, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      form_section = FormSection.find_by(id: json['data']['id'])
      expect(form_section).not_to be_nil
      expect(form_section.name_en).to eq(params[:data][:name][:en])
      expect(form_section.name_es).to eq(params[:data][:name][:es])
      expect(form_section.fields.first.display_name_en).to eq(params[:data][:fields][0][:display_name][:en])
      expect(form_section.fields.first.display_name_es).to eq(params[:data][:fields][0][:display_name][:es])
    end

    it "returns 403 if user isn't authorized to create records" do
      login_for_test(permissions: [])
      unique_id = 'client_created_form_1'
      params = {
        data: {
          unique_id: unique_id,
          name: {
            en: 'Client Created Form 1',
            es: 'Formulario creado por el cliente 1'
          }
        }
      }

      post '/api/v2/forms', params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms')
      expect(FormSection.find_by(unique_id: unique_id)).to be_nil
    end

    it 'returns a 409 if record already exists' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          id: @form1.id,
          name: {
            en: 'This form will not be created'
          }
        }
      }
      post '/api/v2/forms', params: params, as: :json

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms')
    end

    it 'returns a 422 if the case record is invalid' do
      login_for_test(role: @role, permissions: [@permission_form_manage])
      params = {
        data: {
          unique_id: @form1.unique_id,
          name: {
            en: 'This form will not be created'
          }
        }
      }
      post '/api/v2/forms', params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms')
      expect(json['errors'][0]['detail']).to eq('unique_id')
    end
  end

  describe 'PATCH /api/v2/forms/:id' do
    it 'updates an existing form with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          visible: false
        }
      }
      patch "/api/v2/forms/#{@form1.id}", params: params, as: :json

      @form1.reload
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form1.id)
      expect(@form1.name_en).to eq(params[:data][:name][:en])
      expect(@form1.visible).to eq(params[:data][:visible])
    end

    it 'updates the collapsed_field_names with 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          is_nested: true,
          collapsed_field_names: ['fs1_field_1']
        }
      }
      patch "/api/v2/forms/#{@form1.id}", params: params, as: :json

      @form1.reload
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form1.id)
      expect(@form1.collapsed_fields.map(&:name)).to eq(params[:data][:collapsed_field_names])
    end

    it 'merges the changes in a form with fields and returns 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      display_name_en = @form1.fields.first.display_name_en

      params = {
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          fields: [
            {
              name: 'fs1_field_1',
              type: Field::TEXT_FIELD,
              display_name: {
                es: 'Traduccion del campo'
              },
              order: 777
            }
          ]
        }
      }

      patch "/api/v2/forms/#{@form1.id}", params: params, as: :json

      @form1.reload
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form1.id)

      field = @form1.fields.first
      expect(field.display_name_en).to eq(display_name_en)
      expect(field.display_name_es).to eq(params[:data][:fields][0][:display_name][:es])
      expect(field.type).to eq(params[:data][:fields][0][:type])
      expect(field.order).to eq(params[:data][:fields][0][:order])
    end

    it 'add fields if they dont exist in the form' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          fields: [
            {
              name: 'fs1_field_1',
              type: 'separator',
              display_name: { en: 'First field in form section' },
              editable: false
            },
            {
              name: 'fs1_field_2',
              type: 'text_field',
              display_name: {
                en: 'Second field in form section 1'
              }
            }
          ]
        }
      }

      patch "/api/v2/forms/#{@form1.id}", params: params, as: :json

      @form1.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form1.id)

      field = @form1.fields.last
      expect(@form1.name_en).to eq(params[:data][:name][:en])
      expect(field.name).to eq(params[:data][:fields][1][:name])
      expect(@form1.fields.size).to eq(2)
    end

    it 'deletes fields if they are not part of the request' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          name: {
            en: 'Form Section Updated 2'
          },
          fields: [
            {
              name: 'fs2_field_2',
              type: 'text_field',
              display_name: {
                en: 'Second field in form section 1'
              }
            }
          ]
        }
      }

      expect(@form2.fields.last.name).to eq('fs2_field_1')

      patch "/api/v2/forms/#{@form2.id}", params: params, as: :json

      @form2.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form2.id)

      field = @form2.fields.last
      expect(@form2.name_en).to eq(params[:data][:name][:en])
      expect(field.name).to eq(params[:data][:fields][0][:name])
      expect(@form2.fields.size).to eq(1)
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test(
        form_sections: [@form1],
        permissions: []
      )

      params = {
        data: {
          name: {
            en: 'Form Section Updated 1'
          }
        }
      }

      patch "/api/v2/forms/#{@form1.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form1.id}")
    end

    it 'returns a 404 when trying to update a record with a non-existant id' do
      login_for_test(
        form_sections: [@form1, @form2],
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = { data: { name: { en: 'Form Section Updated 1' } } }

      patch '/api/v2/forms/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end

    it 'returns a 422 if the form is invalid' do
      login_for_test(
        form_sections: [@form1, @form2],
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: {
          unique_id: '',
          name: {
            en: 'Form Section Updated 1'
          }
        }
      }

      patch "/api/v2/forms/#{@form1.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form1.id}")
      expect(json['errors'][0]['detail']).to eq('unique_id')
    end
  end

  describe 'DELETE /api/v2/forms/:id' do
    it 'successfully deletes a form and its fields with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/forms/#{@form2.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form2.id)
      expect(FormSection.find_by(id: @form2.id)).to be_nil
      expect(Field.where(name: 'fs2_field_1').first).to be_nil
    end

    it 'successfully deletes a form, fields and subforms with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/forms/#{@form3.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form3.id)
      expect(FormSection.find_by(id: @form3.id)).to be_nil
      expect(Field.where(name: 'subform_form_4').first).to be_nil
    end

    it 'returns 403 if the form is not editable' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete "/api/v2/forms/#{@form1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form1.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
      expect(FormSection.find(@form1.id)).not_to be_nil
    end

    it "returns 403 if user isn't authorized to delete forms" do
      login_for_test
      delete "/api/v2/forms/#{@form1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form1.id}")
    end

    it 'returns a 404 when trying to delete a form with a non-existant id' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
        ]
      )

      delete '/api/v2/forms/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end
  end

  describe 'GET /api/v2/forms/export' do
    before do
      clean_data(PrimeroModule, PrimeroProgram, Lookup)

      @lookup_yes_no = Lookup.create!(
        unique_id: 'lookup-yes-no',
        name_i18n: { en: 'Yes / No' },
        lookup_values_i18n: [
          { id: 'true', display_text: { en: 'Yes' } },
          { id: 'false', display_text: { en: 'No' } }
        ]
      )

      @lookup_sex = Lookup.create!(
        unique_id: 'lookup-sex',
        name_i18n: { en: 'Sex' },
        lookup_values_i18n: [
          { id: 'male', display_text: { en: 'Male' } },
          { id: 'female', display_text: { en: 'Female' } }
        ]
      )

      #### Build Hidden Form Section ######
      cp_form_hidden = FormSection.new(name: 'cases_test_form_hidden', parent_form: 'case', visible: false,
                                       order_form_group: 1, order: 0, order_subform: 0, form_group_id: 'form_group2',
                                       unique_id: 'cases_test_form_hidden')
      cp_form_hidden.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      cp_form_hidden.fields << Field.new(name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field',
                                         multi_select: true,
                                         option_strings_text: [{ id: 'option_1', display_text: 'Option 1' },
                                                               { id: 'option_2', display_text: 'Option 2' }])
      cp_form_hidden.save!

      #################
      # Build GBV Forms
      #################

      #### Build Form Section with subforms fields and others kind of fields ######
      subform4 = FormSection.new(name: 'cases_test_subform_4', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                 unique_id: 'cases_test_subform_4')
      subform4.fields << Field.new(name: 'field_1', type: Field::TEXT_FIELD, display_name: 'field_1')
      subform4.fields << Field.new(name: 'field_2', type: Field::TEXT_FIELD, display_name: 'field_2')
      subform4.save!
      subform5 = FormSection.new(name: 'cases_test_subform_5', parent_form: 'case', visible: false, is_nested: true,
                                 order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                 unique_id: 'cases_test_subform_5')
      subform5.fields << Field.new(name: 'field_5', type: Field::TEXT_FIELD, display_name: 'field_5')
      subform5.fields << Field.new(name: 'field_6', type: Field::TEXT_FIELD, display_name: 'field_6')
      subform5.save!

      gbv_form1 = FormSection.new(name: 'cases_test_form_gbv', parent_form: 'case', visible: true,
                                  order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'form_group_gbv',
                                  unique_id: 'cases_test_form_gbv')
      gbv_form1.fields << Field.new(name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      gbv_form1.fields << Field.new(name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      gbv_form1.fields << Field.new(name: 'subform_field_4', type: Field::SUBFORM, display_name: 'subform 4 field',
                                    subform_section_id: subform4.id)
      gbv_form1.fields << Field.new(name: 'subform_field_5', type: Field::SUBFORM, display_name: 'subform 5 field',
                                    subform_section_id: subform5.id)
      gbv_form1.save!

      cp_forms = FormSection.where(unique_id: %w[form_section_1 form_section_2 form_section_3 cases_test_form_hidden])
      @primero_module_cp = create(:primero_module, unique_id: 'primeromodule-cp', name: 'CP', form_sections: cp_forms)

      gbv_forms = FormSection.where(unique_id: %w[cases_test_form_gbv])
      @primero_module_gbv = create(:primero_module, unique_id: 'primeromodule-gbv', name: 'GBV',
                                                    form_sections: gbv_forms)
    end

    context 'when user has export permission' do
      before do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
          ]
        )
      end

      context 'and no params are passed' do
        it 'returns an error' do
          get '/api/v2/forms/export'

          expect(response).to have_http_status(422)
          expect(json['errors'].size).to eq(1)
          expect(json['errors'][0]['message']).to eq('No Exporter Specified')
        end
      end

      context 'and export type is passed' do
        it 'exports all visible CP forms' do
          params = { export_type: 'xlsx' }
          get '/api/v2/forms/export', params: params

          expect(response).to have_http_status(200)
          expect(json['data']['export_file_url']).to be
          expect(json['data']['export_file_url'].starts_with?('/rails/active_storage/blobs/')).to be_truthy
          expect(json['data']['export_file_url'].ends_with?(json['data']['export_file_name'])).to be_truthy

          get(json['data']['export_file_url'])
          expect(response).to have_http_status(302)
        end
      end
    end

    context 'when user does not have export permission' do
      before do
        login_for_test
      end

      it 'returns unauthorized' do
        get '/api/v2/forms/export'

        expect(response).to have_http_status(403)
      end
    end

    after do
      clean_data(PrimeroModule, PrimeroProgram, Lookup)
    end
  end

  after do
    clean_data(Field, FormSection, PrimeroModule, PrimeroProgram, Role, Lookup)
  end
end
