# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe LanguageService do
  describe 'strip_arabic_vowels' do
    it 'strips the vowels in arabic strings' do
      expect(
        ['فَتَحَ', 'أصلاً', 'عُنف', 'طفلٌ', 'مِلف', 'راح إلى محطةٍ', 'احْمد', 'محمّد'].map do |elem|
          LanguageService.strip_arabic_vowels(elem)
        end
      ).to eq(['فتح', 'أصلا', 'عنف', 'طفل', 'ملف', 'راح إلى محطة', 'احمد', 'محمد'])
    end
  end
end
