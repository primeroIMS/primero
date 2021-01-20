require 'rails_helper'

describe FieldI18nService do
  describe 'convert_i18n_properties' do
    it 'returns the params as localized properties' do
      params = { 'name' => { 'en' => 'Lastname', 'es' => 'Apellido' } }
      converted_properties = FieldI18nService.convert_i18n_properties(FormSection, params)
      expect(converted_properties).to eq({ 'name_i18n' => { 'en' => 'Lastname', 'es' => 'Apellido' } })
    end

    it 'returns the same params if no localized properties are found' do
      params = { 'last_name' => { 'en' => 'Test', 'es' => 'Prueba' } }
      converted_properties = FieldI18nService.convert_i18n_properties(FormSection, params)
      expect(converted_properties).to eq(params)
    end
  end

  describe 'merge_i18n_properties' do
    it 'merges the localized properties of the hashes of fields' do
      merged_hash = FieldI18nService.merge_i18n_properties(
                      { name_i18n: { en: "Lastname" } },
                      { name_i18n: { es: "Apellido" } }
                    )
      expect(merged_hash).to eq({ name_i18n: { en: "Lastname", es: "Apellido" } })
    end

    it 'returns an empty hash if no localized properties are found' do
      merged_hash = FieldI18nService.merge_i18n_properties(
                      { name: "Lastname" },
                      { name: "Apellido" }
                    )
      expect(merged_hash).to eq({})
    end

    it 'merges the option_strings_text value' do
      fields1 = {
        name_i18n: { en: 'Lastname' },
        option_strings_text_i18n: [{ id: 'id1', display_text: { en: 'option1' } }]
      }
      fields2 = { name_i18n: { es: 'Apellido' }, option_strings_text_i18n: [] }

      expected_hash = {
        name_i18n: { en: 'Lastname', es: 'Apellido' },
        option_strings_text_i18n: [{ id: 'id1', display_text: { en: 'option1' } }]
      }
      merged_hash = FieldI18nService.merge_i18n_properties(fields1, fields2)

      expect(merged_hash).to eq(expected_hash)
    end
  end

  describe 'strip_i18n_suffix' do
    it 'strips the i18n suffix from the hash' do
      result = FieldI18nService.strip_i18n_suffix({name_i18n: { en: "Lastname" } })
      expect(result).to eq({ name: { en: "Lastname" } })
    end

    it 'returns the same hash if there is no localized property ' do
      source = {name: { en: "Lastname" } }
      result = FieldI18nService.strip_i18n_suffix(source)
      expect(result).to eq(source)
    end
  end

  describe 'fill_keys' do
    it 'fill the key with all the available locales' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      filled = FieldI18nService.fill_keys([:name], { name: { en: "Lastname", es: "Apellido" } })
      expect(filled).to eq({ name: { en: "Lastname", es: "Apellido", fr: ''} })
    end
  end

  describe 'fill_with_locales' do
    it 'return options with all the availables locales' do
      I18n.stub available_locales: %i[en es fr]
      source = { 'en' => 'Lastname', 'es' => 'Apellido' }
      expected = { 'en' => 'Lastname', 'es' => 'Apellido', 'fr' => '' }
      expect(FieldI18nService.fill_with_locales(source)).to eq(expected)
    end
  end

  describe 'fill_options' do
    it 'fill the options with all the available locales' do
      I18n.stub(:available_locales).and_return(%i[en es fr])
      filled = FieldI18nService.fill_options([{"id"=>"true", "display_text"=>{"en"=>"True", "es": "Verdadero"}}])
      expect(filled).to eq(
        'en' => [{ 'id' => 'true', 'display_text' => 'True' }],
        'es' => [{ 'id' => 'true', 'display_text' => 'Verdadero' }],
        'fr' => []
      )
    end
  end

  describe 'fill_lookups_options' do
    it 'fill the lookups options with all the available locales' do
      options = [
        { 'id' => '1', 'display_text' => { 'en' => 'Country', 'es' => 'Pais' } },
        { 'id' => '2', 'display_text' => { 'en' => 'City', 'es' => 'Ciudad' } }
      ]
      I18n.stub(:available_locales).and_return(%i[en es fr])
      lookups_options = FieldI18nService.fill_lookups_options(options)
      expected_lookups_options = [
        { 'id' => '1', 'display_text' => { 'en' => 'Country', 'es' => 'Pais', 'fr' => '' } },
        { 'id' => '2', 'display_text' => { 'en' => 'City', 'es' => 'Ciudad', 'fr' => '' } }
      ]

      expect(lookups_options).to eq(expected_lookups_options)
    end
  end

  describe 'convert_options' do
    it 'return options with all the available locales' do
      options = {
        'en' => [
          { 'id' => '1', 'display_text' => 'Country' },
          { 'id' => '2', 'display_text' => 'City' }
        ],
        'es' => [
          { 'id' => '1', 'display_text' => 'Pais' },
          { 'id' => '2', 'display_text' => 'Ciudad' }
        ]
      }
      expected = [
        { 'id' => '1', 'display_text' => { 'en' => 'Country', 'es' => 'Pais' } },
        { 'id' => '2', 'display_text' => { 'en' => 'City', 'es' => 'Ciudad' } }
      ]
      expect(FieldI18nService.convert_options(options)).to eq(expected)
    end
  end

  describe 'fill_names' do
    it 'return the options hash with all the available locales' do
      I18n.stub available_locales: %i[en es]
      options = [{ 'id' => 'true', 'display_text' => { 'en' => 'True', 'es': 'Verdadero' } }]
      expected = { 'en' => 'True', 'es' => 'Verdadero' }
      expect(FieldI18nService.fill_names(options)).to eq(expected)
    end
  end

  describe 'to_localized_values' do
    it 'return the field with all the availables locales and the requiered order' do
      I18n.stub(:available_locales).and_return(%i[en ar fr])
      field = {
        'ar' => {
          'closure' => 'Closure-AR',
          'case_plan'=>'Case Plan-AR',
          'assessment'=>'SER-AR'
          },
        'en' => {
          'closure' => 'Closure',
          'case_plan' => 'Case Plan',
          'assessment' => 'SER'
        }
      }
      expect_field = {
        "assessment"=>{
          "en"=>"SER",
          "fr"=>"",
          "ar"=>"SER-AR",
        },
        "case_plan"=>{
          "en"=>"Case Plan",
          "fr"=>"",
          "ar"=>"Case Plan-AR"
        },
        "closure"=>{
          "en"=>"Closure",
          "fr"=>"",
          "ar"=>"Closure-AR"
        }
      }
      expect(FieldI18nService.to_localized_values(field)).to eq(expect_field)
    end
  end
end
