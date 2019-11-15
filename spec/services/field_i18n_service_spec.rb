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
                      { name_i18n: { es: "Apellido"} }
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
      I18n.stub(:available_locales).and_return([:en, :es, :fr])
      filled = FieldI18nService.fill_keys([:name], { name: { en: "Lastname", es: "Apellido" } })
      expect(filled).to eq({ name: { en: "Lastname", es: "Apellido", fr: ''} })
    end
  end

  describe 'fill_options' do
    it 'fill the options with all the available locales' do
      I18n.stub(:available_locales).and_return([:en, :es, :fr])
      filled = FieldI18nService.fill_options({
                 en: [{ id: "true", display_name: "True" }],
                 es: [{ id: "true", display_name: "Verdadero" }]
               })
      expect(filled).to eq({
        en: [{ id: "true", display_name: "True" }],
        es: [{ id: "true", display_name: "Verdadero" }],
        fr: []
      })
    end
  end

  describe 'merge_i18n_options' do
    it 'merges the localized options of the hashes' do
      merged_hash = FieldI18nService.merge_i18n_options(
        { 'en' => [{ 'id' => 'true', 'display_name' => 'Valid' }] },
        { 'en' => [{ 'id' => 'false', 'display_name' => 'Invalid' }] }
      )
      expected_hash = { 'en' => [
          { 'id' => "true", 'display_name' => "Valid" },
          { 'id' => "false", 'display_name' => "Invalid" }
        ]
      }

      expect(merged_hash).to eq(expected_hash)
    end
  end
end