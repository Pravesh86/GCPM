(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Layers = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Layers.prototype, {

    initialize: function (params) {
      this.params = params;
      this.state = new StateModel();
      this.layersView = new App.View.Layers({ el: '#layers' });
      this.fc = App.facade.cartoLayer;
      this.layersCollection = new App.Collection.Layers();
      this.params.active = false;

      this.setLayers();
      this.setEvents();
      this.setSubscriptions();
      this.setState(this.params);
    },

    setEvents: function () {
      this.state.on('change', function () {
        this.render();
        App.trigger('Layers:change', this.getState());
      }, this);

      this.layersView.on('change', this.handleLayer.bind(this));
      this.layersView.on('close', this.toggleActive.bind(this));
    },

    setSubscriptions: function () {
      App.on('Actionbar:action', this.toggleActive, this);
    },

    setLayers: function() {
      this.layersCollection.fetch().done(function() {
        var groups = _.groupBy(_.filter(this.layersCollection.toJSON(), 'layer_group'),
          function(layer) { return layer.layer_group.name; });
        var individual = $.extend({}, _.reject(this.layersCollection.toJSON(), 'layer_group'));

        this.layersList = {
          groups: {groups: true, elements: groups},
          individual: {individual: true, elements: individual}
        };

        this.setState({ layers: this.layersList });
      }.bind(this));
    },

    setState: function (params) {
      this.state.set(params);
    },

    getState: function () {
      return this.state.attributes;
    },

    render: function () {
      var data = this.state.attributes;
      this.layersView.updateData(data);
    },

    handleLayer: function(element) {
      if (element) {
        var layer = _.findWhere(this.layersCollection.toJSON(), {slug: element.id});
        var options = {
          sql: layer.query,
          cartocss: layer.css
        };

        /* Create layer */
        this.fc.getLayer(options).done(function(layer) {
          App.trigger('Layer:change', layer);
        });
      } else App.trigger('Layer:remove', null);
    },

    toggleActive: function(){
      var active = this.getState().active ? false : true;
      var layerBtn = $('.js-actionbar-action[data-action=layers]');

      active ? layerBtn.addClass('-active') : layerBtn.removeClass('-active') ;

      this.setState({active: active});
    }

  });

})(this.App);