NW IdolFest Discord Bot
#######################

A set of services for a Discord bot for `NW IdolFest <https://nwidolfest.com>`_.

---------
Extending
---------

Each discrete function the bot should do should be a standalone folder in `features <features>`_ that contains its functionality. The entry point is a function that returns a Promise. To enable it, import the module and include it in the list in `features/all.js <features/all.js>`_. 

If there is shared functionality, they should live in `lib <lib>`_. This would include shared service accessors like Discord or Airtable, or wrappers for common functionality like having a shared event handler when a badge is added or changed. 

All configurable values (including API credentials) are loaded as environment variables. In development, copy `.env.example <.env.example>`_ to `.env` and populate the values as needed. Values should **not** be accessed via the environment directly, but should instead be imported from `lib/options.js <lib/options.js>`_. To add a new value, add it to `lib/options.js <lib/options.js>`_ using the included `assertToken` function (including a validation function if desired), and export the value.

-------
License
-------

Authors of this project maintain exclusive copyright over their contributions.

This project and its derivatives are licensed to Nijiro Events LLC for the exclusive use of NW IdolFest.

Contributors to this project are licensed to run the software locally for purposes of development of functionality. Any contributions fall under the scope of this license, and contributors agree to grant a license to their contributions to those named herein.

All other use is prohibited.