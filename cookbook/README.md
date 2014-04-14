Primero Cookbook
================
Deploys and configures the Primero application server for development, testing
and production environments.

Requirements
------------
Designed to run on Ubuntu 12.04 (to be upgraded to 14.04 LTS).

Attributes
----------

 **node[:primero][:environment]** (Required) - This attribute is used to select
 the ssh keys for the server among other things.  Permitted values: dev, qa,
 uat, prod

Usage
-----
#### primero::default
TODO: Write usage instructions for each cookbook.

e.g.
Just include `primero` in your node's `run_list`:

```json
{
  "name":"my_node",
  "run_list": [
    "recipe[primero]"
  ]
}
```
