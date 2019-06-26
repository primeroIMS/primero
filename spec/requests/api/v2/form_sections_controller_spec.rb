require 'rails_helper'

describe Api::V2::FormSectionsController, type: :request do
  before :each do
    @form_1 = FormSection.create!(
      unique_id: 'form_section_1', 
      name_i18n: { en: 'Form Section 1' }
    )
    @form_2 = FormSection.create!(
      unique_id: 'form_section_2', 
      name_i18n: { 
        en: 'Form Section 2',
        es: 'Sección de formulario 2'
      }
    )
    @form_3 = FormSection.create!(
      unique_id: 'form_section_3', 
      name_i18n: { en: 'Form Section 3' },
    )
    
    @form_4 = FormSection.create!(
      unique_id: "form_section_4", 
      name_i18n: { en: "Form Section_4 " },
      is_nested: true
    )
    
    @form_3.fields = [
      Field.create!({ 
        name: 'subform_form_4',
        type: Field::SUBFORM,
        subform_section: @form_4,
        display_name: {
          en: "Subform Field for Form 4"
        }
      })
    ]
    
    @form_3.save!

  end
  
  let(:json) { JSON.parse(response.body) }
  
  describe 'GET /api/v2/forms' do
    it 'list the permitted forms' do
      login_for_test({ 
        form_sections: [@form_1, @form_2],
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ] 
      })

      get '/api/v2/forms'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'].map{|c| c['unique_id']}).to include(@form_1.unique_id, @form_2.unique_id)
      expect(json['data'].map{|c| c['unique_id']}).not_to include(@form_3.unique_id)
    end

    it 'refuses unauthorized access' do
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
  
  describe 'GET /api/v2/forms/:id' do
    it 'fetches the correct record with code 200' do
      login_for_test({ 
        form_sections: [@form_1, @form_2],
        permissions: [
          Permission.new(:resource => Permission::METADATA, :actions => [Permission::MANAGE])
        ] 
      })

      get "/api/v2/forms/#{@form_1.id}"

      expect(response).to have_http_status(200)

      expect(json['data']['id']).to eq(@form_1.id)
    end

  end

  after :each do
    Field.destroy_all
    FormSection.destroy_all
  end

end
