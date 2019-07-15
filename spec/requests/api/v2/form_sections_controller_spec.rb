require 'rails_helper'

describe Api::V2::FormSectionsController, type: :request do
  before :each do
    @form_1 = FormSection.create!(
      unique_id: 'form_section_1', 
      name_i18n: { en: 'Form Section 1' },
      fields: [
        Field.new(
          name: 'fs1_field_1', 
          type: Field::TEXT_FIELD, 
          display_name_i18n: {en: 'First field in form section'},
          editable: false
        )
      ]
    )
    @form_2 = FormSection.create!(
      unique_id: 'form_section_2', 
      name_i18n: { 
        en: 'Form Section 2',
        es: 'Sección de formulario 2'
      },
      fields: [
        Field.new(
          name: 'fs2_field_1', 
          type: Field::TEXT_FIELD, 
          display_name_i18n: {en: 'First field in form section 2'}
        )
      ]
    )
    @form_3 = FormSection.create!(
      unique_id: 'form_section_3',
      name_i18n: { en: 'Form Section 3' },
    )

    @form_4 = FormSection.create!(
      unique_id: 'form_section_4',
      name_i18n: { en: 'Form Section_4 ' },
      is_nested: true
    )

    @form_3.fields = [
      Field.create!({ 
        name: 'subform_form_4',
        type: Field::SUBFORM,
        subform_section: @form_4,
        display_name: {
          en: 'Subform Field for Form 4'
        }
      })
    ]

    @form_3.save!

  end

  let(:json) { JSON.parse(response.body) }

  describe "GET /api/v2/forms" do
    it "list the permitted forms" do
      login_for_test({ 
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      get '/api/v2/forms'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map{|c| c['unique_id']}).to include(@form_1.unique_id, @form_2.unique_id, @form_3.unique_id)
    end

    it "refuses unauthorized access" do
      login_for_test({ 
        form_sections: [@form_1, @form_3],
        permissions: [] 
      })

      get '/api/v2/forms'

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms')
    end
  end

  describe "GET /api/v2/forms/:id" do
    it "fetches the correct form with code 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form_1.id)
    end
    
    it "fetches the correct form_group_name with code 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form_1.id)
      expect(json['data']['form_group_name']['en']).to eq(@form_1.form_group_name)
    end

    it "fetches a form which is nested" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      get "/api/v2/forms/#{@form_4.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form_4.id)
    end

    it "returns 403 if user isn't authorized to access" do
      login_for_test

      get "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form_1.id}")
    end

    it "returns a 404 when trying to fetch a form with a non-existant id" do
      login_for_test({ 
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ] 
      })

      get '/api/v2/forms/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end

  end

  describe "POST /api/v2/forms" do
    it "creates a new form with fields and returns 200 and json" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = {data: {
          unique_id: 'client_created_form_1',
          name: {
            en: 'Client Created Form 1',
          },
          fields: [
            {
              'name': 'custom_field_by_api',
              'type': 'separator',
              'display_name': {
                'en': 'Custom Field by API'
              }
            }
          ]
        }
      }
      post '/api/v2/forms', params: params

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_nil
      form_section = FormSection.find_by(id: json['data']['id'])
      expect(form_section).not_to be_nil
      expect(form_section.name_en).to eq(params[:data][:name][:en])
      expect(form_section.fields.size).to eq(1)
      expect(form_section.fields.first.name).to eq(params[:data][:fields][0][:name])
    end

    it "creates a new form with 200 and correctly sets the localized properties" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = {data: {
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
      post '/api/v2/forms', params: params

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
      params = {data: {
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

    it "returns a 409 if record already exists" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })
      params = {
        data: {
          id: @form_1.id,
          name: {
            en: 'This form will not be created'
          }
        }
      }
      post '/api/v2/forms', params: params

      expect(response).to have_http_status(409)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms')
    end

    it "returns a 422 if the case record is invalid" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = {
        data: {
          unique_id: @form_1.unique_id,
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

  describe "PATCH /api/v2/forms/:id" do

    it "updates an existing form with 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = { 
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          visible: false
        }
      }
      patch "/api/v2/forms/#{@form_1.id}", params: params

      @form_1.reload
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_1.id)
      expect(@form_1.name_en).to eq(params[:data][:name][:en])
      expect(@form_1.visible).to eq(params[:data][:visible])
    end

    it "merges the changes in a form with fields and returns 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      display_name_en = @form_1.fields.first.display_name_en

      params = { 
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          fields: [
            {
              name: 'fs1_field_1',
              type: 'separator',
              display_name: {
                es: 'Traduccion del campo'
              }
            }
          ]
        }
      }

      patch "/api/v2/forms/#{@form_1.id}", params: params


      @form_1.reload
      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_1.id)

      field = @form_1.fields.first
      expect(field.display_name_en).to eq(display_name_en)
      expect(field.display_name_es).to eq(params[:data][:fields][0][:display_name][:es])
      expect(field.type).to eq(params[:data][:fields][0][:type])
    end

    it "add fields if they dont exist in the form" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

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

      patch "/api/v2/forms/#{@form_1.id}", params: params

      @form_1.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_1.id)

      field = @form_1.fields.last
      expect(@form_1.name_en).to eq(params[:data][:name][:en])
      expect(field.name).to eq(params[:data][:fields][1][:name])
      expect(@form_1.fields.size).to eq(2)
    end


    it "deletes fields if they are not part of the request" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

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

      expect(@form_2.fields.last.name).to eq('fs2_field_1')

      patch "/api/v2/forms/#{@form_2.id}", params: params

      @form_2.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_2.id)

      field = @form_2.fields.last
      expect(@form_2.name_en).to eq(params[:data][:name][:en])
      expect(field.name).to eq(params[:data][:fields][0][:name])
      expect(@form_2.fields.size).to eq(1)
    end

    it "does not delete fields if they are not editable" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = { 
        data: {
          name: {
            en: 'Form Section Updated 1'
          },
          fields: [
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

      expect(@form_1.fields.last.name).to eq('fs1_field_1')

      patch "/api/v2/forms/#{@form_1.id}", params: params

      @form_1.reload

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_1.id)

      field = @form_1.fields.last
      expect(@form_1.name_en).to eq(params[:data][:name][:en])
      expect(field.name).to eq(params[:data][:fields][0][:name])
      expect(@form_1.fields.size).to eq(2)
    end

    it "returns 403 if user isn't authorized to update records" do
      login_for_test({
        form_sections: [@form_1],
        permissions: []
      })

      params = { 
        data: {
          name: {
            en: 'Form Section Updated 1'
          }
        }
      }

      patch "/api/v2/forms/#{@form_1.id}", params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form_1.id}")
    end

    it "returns a 404 when trying to update a record with a non-existant id" do
      login_for_test({
        form_sections: [@form_1, @form_2],
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = { data: { name: { en: 'Form Section Updated 1' } } }

      patch '/api/v2/forms/thisdoesntexist', params: params

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end

    it "returns a 422 if the form is invalid" do
      login_for_test({
        form_sections: [@form_1, @form_2],
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      params = { 
        data: {
          unique_id: '',
          name: {
            en: 'Form Section Updated 1'
          }
        }
      }

      patch "/api/v2/forms/#{@form_1.id}", params: params

      expect(response).to have_http_status(422)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form_1.id}")
      expect(json['errors'][0]['detail']).to eq('unique_id')
    end

  end

  describe "DELETE /api/v2/forms/:id" do

    it "successfully deletes a form and its fields with a code of 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      delete "/api/v2/forms/#{@form_2.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_2.id)
      expect(FormSection.find_by(id: @form_2.id)).to be_nil
      expect(Field.where(name: 'fs2_field_1').first).to be_nil
    end

    it "successfully deletes a form, fields and subforms with a code of 200" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      delete "/api/v2/forms/#{@form_3.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(@form_3.id)
      expect(FormSection.find_by(id: @form_3.id)).to be_nil
      expect(FormSection.find_by(id: @form_4.id)).to be_nil
      expect(Field.where(name: 'subform_form_4').first).to be_nil
    end

    it "returns 403 if the form is not editable" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      delete "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form_1.id}")
      expect(json['errors'][0]['message']).to eq('Forbidden')
      expect(FormSection.find(@form_1.id)).not_to be_nil
    end

    it "returns 403 if user isn't authorized to delete forms" do
      login_for_test
      delete "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq("/api/v2/forms/#{@form_1.id}")
    end

    it "returns a 404 when trying to delete a form with a non-existant id" do
      login_for_test({
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ]
      })

      delete '/api/v2/forms/thisdoesntexist'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/forms/thisdoesntexist')
    end

  end

  after :each do
    Field.where(editable: false).each do |f|
      f.editable = true
      f.save!
    end
    Field.destroy_all
    FormSection.where(editable: false).each do |fs|
      fs.editable = true
      fs.save!
    end
    FormSection.destroy_all
  end

end
