(function ($) {
  AssembleApp.Models.APIRequest = Backbone.Model.extend({
    sync: function(method, model, options) {
      options = options || {};
      options.headers = {
        Authorization: "Token token="+AssembleApp.Data.Shared.apiKey,
        Accept: "application/json"
      };
      return Backbone.sync(method, model, options);
    }
  });
})(jQuery);
