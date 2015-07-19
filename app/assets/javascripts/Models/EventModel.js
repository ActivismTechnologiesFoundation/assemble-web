(function ($) {

  AssembleApp.Models.Event = Backbone.MomentifiedModel.extend({
    url: '/api/events',
    format: 'unix',
    sync: (new AssembleApp.Models.APIRequest()).sync
  });

  AssembleApp.Collections.Events = AssembleApp.Collections.Loadable.extend({
    model: AssembleApp.Models.Event, 

    url: '/api/events',

    sync: (new AssembleApp.Models.APIRequest()).sync
  });
})(jQuery);
