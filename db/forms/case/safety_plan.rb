# frozen_string_literal: true

safety_plan_fields = [
  Field.new('name' => 'safety_plan_needed',
            'mandatory_for_completion' => true,
            'mobile_visible' => true,
            'show_on_minify_form' => true,
            'type' => 'radio_button',
            'display_name_en' => 'Is a safety plan needed for this case?',
            'option_strings_source' => 'lookup lookup-yes-no',
            'help_text_en' => 'Safety planning enables the survivor to proceed with a pre-determined course of action '\
                                'when she is in a lifethreatening situation. Safety planning can help her minimize the '\
                                'harm done by the perpetrator by identifying resources and means to avoid harm and places '\
                                'she can go temporarily for safety. Developing a safety plan is a collaborative process '\
                                'undertaken by the casework and survivor together. The safety plan addresses the fundamental '\
                                'question: what needs to happen or  to be in place in order for the survivor to safe? '\
                                'It includes identifying: dangerous situations, risks and warning signs, activities survivor '\
                                'can undertake on her own, specific people to call on for help, supportive people that '\
                                "make sruvivor feel safe and  survivor's own stregngths that help her get by."),
  Field.new('name' => 'safety_plan_developed_with_survivor',
            'mandatory_for_completion' => true,
            'mobile_visible' => true,
            'show_on_minify_form' => true,
            'type' => 'radio_button',
            'display_name_en' => 'Was a safety plan developed with the survivor (if applicable)?',
            'option_strings_source' => 'lookup lookup-yes-no'),
  Field.new('name' => 'safety_plan_completion_date',
            'mandatory_for_completion' => true,
            'mobile_visible' => true,
            'type' => 'date_field',
            'display_name_en' => 'Safety Plan Completion Date'),
  Field.new('name' => 'safety_plan_main_concern',
            'mandatory_for_completion' => true,
            'show_on_minify_form' => true,
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => "Identify safety concern (in survivor's words)"),
  Field.new('name' => 'safety_plan_resources_header',
            'mobile_visible' => true,
            'type' => 'separator',
            'display_name_en' => 'Resources',
            'help_text_en' => 'Name the resources I am using now that I have, that can help me stay safe in following categories'),
  Field.new('name' => 'safety_plan_resources_economic',
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'Economic / material'),
  Field.new('name' => 'safety_plan_resources_relationships',
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'Relationships'),
  Field.new('name' => 'safety_plan_resources_community',
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'Community help'),
  Field.new('name' => 'safety_plan_resources_other',
            'mobile_visible' => false,
            'type' => 'textarea',
            'display_name_en' => 'Other'),
  Field.new('name' => 'safety_plan_preparedness_header',
            'mobile_visible' => true,
            'type' => 'separator',
            'display_name_en' => 'Safety preparedness'),
  Field.new('name' => 'safety_plan_preparedness_signal',
            'mandatory_for_completion' => true,
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'What steps did the survivor identify as options to minimize risk of further harm for '\
                                   'herself (and her children) before violence occurs (safety preparedness)?',
            'guiding_questions' => 'Examples could include: The survivor will agree on a code or signal with friends, '\
                                    'neighbors or family that the survivor will communicate that she needs help if she '\
                                    'cannot talk in front of the perpetrator she will use this signal to tell them that '\
                                    'she needs help; The survivor will gather some basic things and important documents, '\
                                    'and leave these things in a place where she can reach them if she has to leave my '\
                                    'home (list those things); The survivor will teach her children that when the violence '\
                                    'starts they should go to a specific place; The survivor will come up with a code word '\
                                    'or a signal with her children so that she can safely tell them when they should leave. '\
                                    'Please refer to the Safety Planning tool for the full list of guiding questions to '\
                                    'discuss with the survivor.'),
  Field.new('name' => 'safety_plan_strategies_header',
            'mobile_visible' => true,
            'type' => 'separator',
            'display_name_en' => 'Safety strategies'),
  Field.new('name' => 'safety_plan_preparedness_gathered_things',
            'mandatory_for_completion' => true,
            'show_on_minify_form' => true,
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'What actions did the survivor identify as options to mitigate risks when violence happens (safety strategies)?',
            'guiding_questions' => 'Examples could include: The survivor can recognize some patterns in the abuser’s '\
                                    'violence that may tell her when he is about to become violent, such as (certain times '\
                                    'of the day or week, when he is around certain friends, when he is using drugs or '\
                                    'drinking, etc.): The survivor can  identify the pattern of violence or when the '\
                                    'violence starts; If the survivor has to leave her home for a few days or more, she '\
                                    'knows where to go; The survivor will check with friends, family, etc to find out if '\
                                    'they will let her stay with them if she needs to leave; The survivor will check with '\
                                    'these people to find out if they would lend her money or food in an emergency. Please '\
                                    'refer to the Safety Planning tool for the full list of guiding questions to discuss '\
                                    'with the survivor.'),
  Field.new('name' => 'safety_plan_leaving_steps_header',
            'mobile_visible' => true,
            'type' => 'separator',
            'display_name_en' => 'Steps after leaving'),
  Field.new('name' => 'safety_plan_preparedness_children_destination',
            'mobile_visible' => true,
            'type' => 'textarea',
            'display_name_en' => 'What steps did the survivor identify as options to minimze risks after leaving her '\
                                   'home/community if she chooses to do so?',
            'guiding_questions' => 'Examples could include: The survivor knows how to deal emotionally if people blame '\
                                    'her for leaving; The survivors knows who talk to for support; The survivor recognizes '\
                                    'the trauma and stress that the situation has caused her; The survivor knows what to '\
                                    'do to make her feel stronger.'),
  Field.new('name' => 'safety_plan_completion_timing',
            'show_on_minify_form' => true,
            'mobile_visible' => true,
            'type' => 'select_box',
            'display_name_en' => 'How long did it take you to develop the safety plan with the survivor for this case?',
            'option_strings_source' => 'lookup lookup-assessment-duration')
]

FormSection.create_or_update!(
  unique_id: 'safety_plan',
  parent_form: 'case',
  visible: true,
  order_form_group: 70,
  order: 10,
  order_subform: 0,
  form_group_id: 'safety_plan',
  editable: true,
  fields: safety_plan_fields,
  name_en: 'Safety Plan',
  description_en: 'Safety Plan',
  mobile_form: true
)
