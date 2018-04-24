
[1mFrom:[0m /vagrant/app/helpers/index_helper.rb @ line 502 IndexHelper#view_data:

    [1;34m496[0m: [32mdef[0m [1;34mview_data[0m(record)
    [1;34m497[0m:   data = []
    [1;34m498[0m:   form_sections = record.class.allowed_formsections(current_user, record.module)
    [1;34m499[0m:   form_sections.each [32mdo[0m |n, fs|
    [1;34m500[0m:     fs.each [32mdo[0m |form|
    [1;34m501[0m:       binding.pry
 => [1;34m502[0m:       form.fields.select{ |field| field.show_on_minify_form }.each [32mdo[0m |f|
    [1;34m503[0m:         data << { [35mdisplay_name[0m: f.display_name, [35mvalue[0m: f.display_text(record[f.name]) }
    [1;34m504[0m:       [32mend[0m
    [1;34m505[0m:     [32mend[0m
    [1;34m506[0m:   [32mend[0m
    [1;34m507[0m: 
    [1;34m508[0m:   data.to_json
    [1;34m509[0m: [32mend[0m

