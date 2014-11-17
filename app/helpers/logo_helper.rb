module LogoHelper
  def display_agency_logos
    @agency_logos.each do |lk|
      img = send("agency_logo_url", lk[:id], lk[:filename])
      concat(content_tag(:li, image_tag(img, height: '29')))
    end
  end
end
