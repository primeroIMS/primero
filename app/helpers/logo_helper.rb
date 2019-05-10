module LogoHelper
  def display_agency_logos
    @agency_logos.each do |lk|
      img = lk.variant(resize: '30')
      concat(content_tag(:li, image_tag(img)))
    end
  end
end
