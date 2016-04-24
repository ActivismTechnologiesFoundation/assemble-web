(function ($) {

    AssembleApp.Views.UploadView = Backbone.View.extend({
        el: $('#upload-top-level-view'),

        events: {
            'change #file-chooser' : 'uploadFile',
            'click .upload-button' : 'uploadButtonClicked'
        },

        initialize: function(options) {
            this.model = new Backbone.Model();
            this.template = Handlebars.compile($('#upload-top-level-view-template').html());

            this.dropbox = new Dropbox.Client({ 
                key: "jefqjpg8rb84plt", 
                token: "g0x9N7N4TPMAAAAAAAAVGBFlp98PZZh50jGz00Vwa2ce4OmA_tIauWBnDTHuh6Mu" 
            });

            this.listenTo(this.model, 'change', this.render);
        },

        routed: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
        },

        uploadButtonClicked: function() {
            this.model.clear();
            this.$('#file-chooser').click();
        },

        uploadFile: function() {
            var file = this.$("#file-chooser").get(0).files[0],
                makeUrlCompletion = function(error, stat){
                    if (error) {
                        alert('Error: Unable to obtain public url');
                    }
                    else {
                        this.createEvents(stat.url);
                    }
                }.bind(this),
                writeCompletion = function(error, stat){
                    if (!error) {
                        this.dropbox.makeUrl(stat.path, { download: true}, makeUrlCompletion);
                    }
                    else {
                        alert('Error: Unable to upload to dropbox.');
                    }
                }.bind(this),
                xhrListener = function(dbXhr){
                    dbXhr.xhr.upload.onprogress = function(event){
                        var percentage = event.loaded / event.total * 100.0;
                        this.model.set('percentage', percentage.toFixed(1));
                    }.bind(this);
                    return true;  // otherwise, the XMLHttpRequest is canceled
                }.bind(this);
            this.dropbox.onXhr.addListener(xhrListener);
            this.dropbox.writeFile(file.name, file, writeCompletion);
            this.dropbox.onXhr.removeListener(xhrListener);
        },

        createEvents: function(url) {
            this.$('.upload-button').addClass('pulse');
            superagent
                .post('/api/events/bulk_upload')
                .send({ file_url: url })
                .timeout(5*60*1000) // 5 minutes
                .set("Authorization", "Token token="+AssembleApp.Data.Shared.apiKey)
                .set("Accept", "application/json")
                .end(function(error, response){
                    this.$('.upload-button').removeClass('pulse');

                    if (!error) { 
                        this.model.set({ 
                            failed_events: response.body.failed_events,
                            upload_count: response.body.upload_count,
                            finished_upload: true
                        });

                        console.log('errors: ', response.body.failed_events);
                    }
                    else {
                        alert('Error: Unable to create events');
                    }
                }.bind(this));
        }


    });

})(jQuery);