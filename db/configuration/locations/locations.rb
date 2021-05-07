# TODO: This is a temporary fake location set.
# Once we sort out a location management strategy, we will start using real locations.

puts 'Loading temporary locations!'

Location.destroy_all

Location.create!(placename_en: 'Country 1', location_code: 'XX', admin_level: 0, type: 'country', hierarchy_path: 'XX')
Location.create!(placename_en: 'Province 1', location_code: 'XX01', admin_level: 1, type: 'province', hierarchy_path: 'XX.XX01')
Location.create!(placename_en: 'District 1', location_code: 'XX0101', admin_level: 2, type: 'district', hierarchy_path: 'XX.XX01.XX0101')
Location.create!(placename_en: 'District 2', location_code: 'XX0102', admin_level: 2, type: 'district', hierarchy_path: 'XX.XX01.XX0102')
