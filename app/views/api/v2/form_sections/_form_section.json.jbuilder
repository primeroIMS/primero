form_hash = form.as_json.compact.map{ |k,v| { k.gsub(/_i18n/, '') => v } }.inject(&:merge)
fields = form.fields.map{ |f| f.as_json.compact.map { |k,v| { k.gsub(/_i18n/, '') => v } }.inject(&:merge) }
module_ids = form.primero_modules.map(&:unique_id)
json.merge! form_hash.merge({ fields: fields, module_ids: module_ids })
