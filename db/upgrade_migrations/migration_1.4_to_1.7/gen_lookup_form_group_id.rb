form_group_cp = [
 {id: "identification_registration", ar: "الاكتشاف/ الاستقبال", en: "Identification / Registration"},
 {id: "response_planning", ar: "تخطيط الاستجابة", en: "Response Planning"},
 {id: "service_provider_details", ar: "تفاصيل مقدم الخدمة", en: "Service Provider Details"},
 {id: "attachments", ar: "مرفقات", en: "Attachments"},
 {id: "referral_transfer", ar: "الإحالات والتحويلات", en: "Referrals and Transfers"},
 {id: "record_owner", ar: "معلومات السجل", en: "Record Information"},
 {id: "notes", ar: "ملاحظات", en: "Notes"},
 {id: "consent", ar: "الموافقة", en: "Consent"},
 {id: "closure_form", ar: "إغلاق ملف الحالة ", en: "Case Closure"},
 {id: "approvals", ar: "الموافقات", en: "Approvals"},
]

form_group_incident = [
    { id: "cp_offender_details", ar:"تفاصيل المسيء", en:"Abusers"},
    { id: "cp_individual_details", ar:"التفاصيل المتعلقة بالفرد", en:"Individual Details"},
    { id: "cp_incident_form", ar:"الحادثة", en:"Incident"},
    { id: "cp_incident_record_owner", ar:"سجل الحالة", en:"Record Owner"}
]

def create_lookup_form_group (id, name, values)
    lookup_fgc  = "Lookup.create_or_update "
    lookup_fgc << " :id => \"#{id}\","
    lookup_fgc << " :name_en => \"#{name}\","

    lookup_fgc << " :lookup_values_en => [ "
    values.each do |value|
      lookup_fgc << "{ id: \"#{value[:id]}\", display_text: \"#{value[:en]}\"}, "
    end
    lookup_fgc << "  ].map(&:with_indifferent_access), "

    lookup_fgc << " :lookup_values_ar => [ "
    values.each do |value|
      lookup_fgc << "{ id: \"#{value[:id]}\", display_text: \"#{value[:ar]}\"}, "
    end
    lookup_fgc << "  ].map(&:with_indifferent_access) "

    puts lookup_fgc
end


create_lookup_form_group("lookup-form-group-cp-case", "Form Groups - CP Case", form_group_cp )
create_lookup_form_group("lookup-form-group-cp-incident", "Form Groups - CP Incident", form_group_incident )
