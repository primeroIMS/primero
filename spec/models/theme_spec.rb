require 'rails_helper'

RSpec.describe Theme, type: :model do
  before do
    I18n.locale = :en
    # rubocop:disable Naming/VariableNumber
    @theme = create(:theme,
                    data: {
                      email_signature: { en: 'email signature', fr: 'email signature fr' }
                    },
                    logo:,
                    logo_white: logo,
                    logo_pictorial_144: logo,
                    logo_pictorial_192: logo,
                    logo_pictorial_256: logo,
                    favicon: logo)
  end

  describe 't' do
    it 'returns string by locale' do
      expect(@theme.t('email_signature', 'fr')).to eql('email signature fr')
    end

    it 'returns default locale string when locale missing' do
      expect(@theme.t('email_signature', 'ar')).to eql('email signature')
    end
  end

  after do
    clean_data(Theme)
  end
end
