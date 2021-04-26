# frozen_string_literal: true

require 'rails_helper'

describe I18n do
  describe 'translate' do
    it 'returns translation' do
      I18n.backend.store_translations(:en, test_string: 'Test String (EN)')
      I18n.backend.store_translations(:en, test_string: 'Test String (PT)')

      expect(I18n.t('test_string', locale: :pt)).to eq('Test String (PT)')
    end

    it 'fallsback to english' do
      I18n.backend.store_translations(:en, test_string: 'Test String (EN)')
      expect(I18n.t('test_string', locale: :pt)).to eq('Test String (EN)')
    end

    describe 'dialects' do
      it 'fallsback to parent language' do
        I18n.backend.store_translations(:en, test_string: 'Test String (EN)')
        I18n.backend.store_translations(:en, test_string: 'Test String (PT)')
        
        expect(I18n.t('test_string', locale: 'pt-BR')).to eq('Test String (PT)')
      end
  
      it 'fallsback toenglish when parent language missing' do
        I18n.backend.store_translations(:en, test_string: 'Test String (EN)')
        
        expect(I18n.t('test_string', locale: 'pt-BR')).to eq('Test String (EN)')
      end
    end
  end
end
