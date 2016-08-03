(function(App) {

  'use strict';
  /**
   * Main Application View
   */
  App.MainView = Backbone.View.extend({

    /**
     * Main DOM element
     * @type {Object}
     */
    el: 'body',

    events: {
      'click a[data-magic]': 'isMagicLink'
    },

    initialize: function() {
      this.$content = $('#content');
      this.router = new App.Router();
      this.listeners();
    },

    listeners: function() {
      this.listenTo(this.router, 'route', this.initCommonViews);
      this.listenTo(this.router, 'route:map', this.mapPage);
      this.listenTo(this.router, 'route:countries', this.countriesPage);
      this.listenTo(this.router, 'route:country', this.countryPage);
      this.listenTo(this.router, 'route:network', this.userPage);

      // Listening magic links
      App.Events.on('remote:load', this.replaceContent);
      
      // Update params
      App.Events.on('params:update', this.publishParams.bind(this));

    },

    start: function() {
      Backbone.history.start({ pushState: true });
    },

    stop: function() {
      Backbone.history.stop();
    },

    update: function() {
      console.log('update please');
    },

    /**
     * Use data-magic attribute with remote: true
     * @param  {Event}  e
     */
    isMagicLink: function(e) {
      var href = e.currentTarget.getAttribute('href');
      this.router.navigate(href);
    },

    initCommonViews: function() {
      new App.View.MobileHeader();
      new App.View.UserDropdownMenu();
    },

    replaceContent: function(data) {
      console.log('replace content');
      console.log(data);
      var contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.innerHTML = data.content;
      }
    },

    mapPage: function() {
      var params = this.setParams(this.router.getParams()),
          layersCollection = new App.Collection.Layers();

      // Views
      new App.View.Map({
        layers: layersCollection,
        params: params
      });

      new App.View.MapMenu();
      new App.View.MapFilters({
        params: params
      });
      new App.View.MapLayers();

      // Sync layers
      layersCollection.toggleLayers([
        params.type || 'projects'
      ]);
    },

    countriesPage: function() {
      var params = this.router.getParams();

      /* Countries index search view */
      var regionsCollection = new App.Collection.Regions();
      var regionsView = new App.View.SearchList({
        searchList: regionsCollection,
        options: {
          isTwoLevels: true,
          template: HandlebarsTemplates['countries-list'],
          innerSearchListName: 'countries',
          itemSearchedCategory: 'country_name'
        }
      });

      regionsCollection.fetch();
    },

    countryPage: function() {
      var params = this.router.getParams();

      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);
    },

    userPage: function() {
      var params = this.router.getParams();

      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);
    },

    /**
     * - setParams
     * - publishParams
     * This function will parse the params of the url
     */
    setParams: function(params) {
      var params = params;

      if (params['regions[]']) {
        params.group = 'countries';
      }

      if (params['countries[]']) {
        params.group = 'projects';
      }

      return params;
    },

    publishParams: function(newParams) {
      this.params = _.extend({}, this.params, newParams);
      this.router.navigate('/map?' + $.param(this.params), { trigger: true });
      Turbolinks.visit('/map?' + $.param(this.params));
    }

  });

})(this.App);
