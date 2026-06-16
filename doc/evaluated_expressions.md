# Evaluated Expressions

Primero supports expression evaluation for certain features like form skip logic and conditional select options. Currently only boolean expressions are supported, but the approach can be extended for other features such as computed fields.

## Syntax

Expressions are represented as JSON functional trees. For example the expression `age > 5` looks like `{ "gt": {"age": 5 } `. All keys in a hash are either record field names, operators, or comparators.

The primitives are:
 - string
 - numeric
 - date (iso8601)
 - datetime (iso8601)
 - array

Comparators:
 - eq
 - gt (greater than)
 - ge (greater than or equal to)
 - lt (less than)
 - le (less than or equal to)
 - in (value in array)

Boolean operators:
 - and
 - or
 - not


## Skip logic

Fields in Primero record forms can be conditionally visible. This is done by setting the `display_conditions_record` property of a Field record to an evaluated expression. A common use will be to display a text field to enter more detail if the previous field value was selected to be `"other"`.

For example:

```
Field.new(
  name: 'displacement_status_other',
  type: 'text_field',
  display_name_en: 'If Other, please specify'
  display_conditions_record: {
    eq: { displacement_status: 'other' }
  }
),
```

The expressions can be more complicated. For example to display a field if the child is female, or a male with high or medium risk, or is age 5 or younger:

```
{
  or: [
    { sex: 'female' },
    {
      and: [
        { sex: 'male'},
        { in: { risk_level: ['high', 'medium'] } }
      ]
    },
    { le: { age: 5 } }
  ]
}
```

## Conditional select

Evaluated expressions can be used to select a subset of values for a single select or a multi-select field based on the values of other fields.

To do so, options in a Lookup must first be tagged. For example:

```
Lookup.create_or_update!(
  unique_id: 'lookup-armed-force-group-or-other-party',
  name_en: 'Armed Force Group Or Other Party',
  lookup_values: [
    { id: 'armed_force_1', display_text: 'Armed Force 1', tags: %w[armed-force] }
    { id: 'armed_force_2', display_text: 'Armed Force 2', tags: %w[armed-force] }
    { id: 'armed_group_1', display_text: 'Armed Group 1', tags: %w[armed-group] }
    { id: 'armed_group_2', display_text: 'Armed Group 2', tags: %w[armed-group] }
    { id: 'other_party_1', display_text: 'Other Party 1', tags: %w[other-party] }
    { id: 'other_party_2', display_text: 'Other Party 2', tags: %w[other-party] }
    { id: 'unknown', display_text: 'Unknown', tags: %w[armed-force armed-group other-party] }
  ]
)
```

Note that `unknown` has multiple tags associated with it. Tags are optional for lookups.

A select Field will need to set the `option_strings_condition` property. This is a hash, where the value of each key is an evaluated boolean expression. If the expression is `true` then the options with tags associated with that expressions will show up.

See below:

```
Field.new(
  name: 'armed_force_group_party_name',
  type: 'select_box',
  display_name_en: 'To which armed force, group, or other party did the perpetrator belong?',
  option_strings_source: 'lookup lookup-armed-force-group-or-other-party',
  option_strings_condition: {
    'armed-force' => { 'eq' => { 'perpetrator_category' => 'armed_force' } },
    'armed-group' => { 'eq' => { 'perpetrator_category' => 'armed_group' } },
    'other-party' => { 'eq' => { 'perpetrator_category' => 'other_party_to_the_conflict' } }
  }
```
