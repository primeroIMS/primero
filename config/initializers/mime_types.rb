# frozen_string_literal: true

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
# Mime::Type.register_alias "text/html", :iphone

mp3s = %w[audio/mpeg audio/x-mpeg audio/x-mp3 audio/mpeg3 audio/x-mpeg3 audio/mpg audio/x-mpg audio/x-mpegaudio]
Mime::Type.register 'audio/mp3', :mp3, mp3s
Mime::Type.register 'audio/mp4', :m4a
Mime::Type.register 'audio/ogg', :ogg
Mime::Type.register 'image/jpeg', :jpg
Mime::Type.register 'application/vnd.ms-excel', :xls
Mime::Type.register 'application/vnd.ms-excel', :selected_xls
Mime::Type.register 'application/vnd.ms-excel', :incident_recorder_xls
Mime::Type.register 'application/vnd.ms-excel', :mrm_violation_xls
Mime::Type.register_alias 'application/pdf', :photowall
Mime::Type.register_alias 'application/pdf', :case_pdf
Mime::Type.register_alias 'text/csv', :unhcr_csv
Mime::Type.register_alias 'text/csv', :duplicate_id_csv
Mime::Type.register_alias 'text/csv', :list_view_csv
