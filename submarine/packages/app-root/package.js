/**
 * Since, global variable is not supported in Meteor,
 * The only way t obtain global namespace is create a meteor Package
 * Under this package, all global namespace is defined
 */

Package.describe({
  "summary": "Submarine Base Namespace Packages",
  "name": "app-root",
  "version": "0.0.1"
});

Package.onUse(function(api) {
  
  // namespace defined for each environment
  api.addFiles('lib/base_all.js', ['client', 'server']);
  api.addFiles('lib/base_client.js', 'client');
  api.addFile('lib/base_server.js', 'server');

  // Expose module as app and Logger
  api.export('App');
});
