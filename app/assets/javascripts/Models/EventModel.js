(function ($) {

  AssembleApp.Models.Event = Backbone.MomentifiedModel.extend({
    url: '/api/events',
    
    format: 'unix',

    validation: {
      starts_at: { 
        required: true,
        pattern: 'date_mm_dd_yyyy'
      },

      ends_at: {
        required: false,
        pattern: 'date_mm_dd_yyyy'
      }
    },

    sync: (new AssembleApp.Models.APIRequest()).sync
  });

  AssembleApp.Collections.Events = AssembleApp.Collections.Loadable.extend({
    model: AssembleApp.Models.Event, 

    url: '/api/events',

    comparator: function (eventA, eventB) {
        var a = eventA.get("starts_at"),
            b = eventB.get("starts_at");

        if (a.isBefore(b)) {
          return -1;
        }else if (a.isAfter(b)) {
          return 1;
        }else{
          return 0;
        }
    },
    
    sync: (new AssembleApp.Models.APIRequest()).sync

  });
})(jQuery);
