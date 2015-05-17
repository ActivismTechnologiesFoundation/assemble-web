(function ($) {

  AssembleApp.Router = Backbone.Router.extend({

    routes: {
      "" : "landingPage",
      "api/v1/(:module)(/*subroute)" : "initView",
      "api/(:module)(/*subroute)" : "initView",
      ":module(/*subroute)" : "initView"
    },

    landingPage: function(){
      this.RootView = new AssembleApp.Views.RootView(AssembleApp.Data.Root);
    },

    initialize: function(){
      AssembleApp.settings = new AssembleApp.Models.Settings(AssembleApp.settings);
    },

    initView: function(module, subroute) { 
      module = module.camelCase().capitalize();

      var view = module+"View";
      if(AssembleApp.Views[view]) {
        if(!this[view]) {
          var options = _.extend(AssembleApp.Data[module] || {},{"subroute":subroute, settings: AssembleApp.settings});
          options = _.extend(options, AssembleApp.Data.Shared);
          this[view] = new AssembleApp.Views[view](options);
        } 
        if(this[view].routed) {
          this[view].routed();
        }
      }
    }
  });
})(jQuery);
