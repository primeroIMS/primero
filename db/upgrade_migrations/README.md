These Migration Scripts are for migrating a system from an older version to a newer version
(Usually upgrading to version 1.6 or above)
============================================================================================

At a high level, the upgrade process is as follows

- Load config json file from the old version on your local system and run the initial migration scripts in the target
  version subfolder below to migrate the configuration data per instructions in the README in that subfolder
- Generate the configuration scripts by running the export rake task per instructions in the README in the subfolder
- Verify the configuration scripts and manually patch things that were not covered by the migration scripts.
  A list of things to look for are shown below
- Migrate the production data (Child, Incident, TracingRequest, User, etc) per the instructions in the README in the
  subfolders below.
  This data migration portion is intended to be a step-by-step migration.  Begin with the lowest level migration below 
  and one at a time, run each migration in each folder until you have completed each up to your target version.
  NOTE: The migration scripts here are intended to be generic and not specific to any one location or configuration
- Any location specific or configuration specific changes or migration steps should be in migration scripts located 
  in the `fixtures` directory of the configuration.
  These fixture scripts should be run after all of the generic data migration scripts have been run.
  Refer to the README files in the subfolders below and in the fixture directory on the configuraiton for more detailed
  instructions.
  

Things to verify in the generated config scripts and correct if necessary
--------------------------------------------------------------------------
- remove references to locales that aren’t being used

- option_strings_text from /n delimited string to id: display_text: hash
  The lookups should have been covered by the config migration scripts but some of the fields in the form definitions
   may have been missed
   
- clean up localizable fields... example name should be name_en 

- fix locations create script
  - Make sure each location has a location code
    NOTE that Location codes should be all caps… not mixed case… due to dashboard and solr constraints 
  - Change hierarchy to use location codes instead of place names
  - Remove name attribute
  - Change placename to placename_en
  
- Fix Agency Logos so that the images are no longer embedded in the agency load script, but are loaded from a logo directory.
  Add a `agency_logos` directory under `lookups`.  
  Agency logo .png files should go in this directory
  Logo .png files should be named according to its agency's _id.
  These take the form of 'agency-#{agency.agency_code}.png'
  
- Verify there is a case form "Incident Details"
  If that form does not exist, copy it over from the default 1.6 seeds
  
- Remove all associated forms of MRM module (for non-MRM upgrades).

- Cleanup empty user-groups on Users

- SystemSettings reporting location config uses a regex in some old configurations. 
  If you do this in v1.6 and above, it will break. Remove any regex from this file.
  
- Reports should use the id's from the new lookups instead of the display text string.
  Example:  The reports should filter on child_status = "open" instead of "Open"
  
- Add new permissions to roles that did not exist in the old version
  DASH_CASES_BY_SOCIAL_WORKER
  DASH_REFFERALS_BY_SOCIAL_WORKER
  VIEW_PROTECTION_CONCERNS_FILTER
  
- Add 'approvals' to the associated_form_ids for the CP module
  
- Create lookup:  lookup-gender
  Find any fields in the form configs that use option_strings_text: male/female and change to use this lookup
  
- Create lookup:  lookup-yes-no & lookup-yes-no-unknown
  Find any fields in the form configs that use option_strings_text: yes/no and change to use this lookup
  NOTE: In 1.6 and up the id's for yes/no should be "true"/"false" instead of "yes/no"

- Create lookup:  lookup-service-response-type
  
- Create lookup:  lookup-location-type
