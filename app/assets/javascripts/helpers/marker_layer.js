(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.Helper.MarkerLayer = App.Helper.Class.extend({

    defaults: {},

    template: HandlebarsTemplates['marker'],

    colors: {
      'project-markers': ['#5aade4', '#f57823', '#68299b', '#CCC'],
      'people-markers': ['#FFF', '#8653AF'],
      'event-markers': ['#FFF', '#F59356']
    },

    strokeColors: {
      'project-markers': '#FFF',
      'people-markers': '#68299b',
      'event-markers': '#f57823'
    },
    // tooltipEl: $('#locationTooltipView'),
    // tooltipTpl: HandlebarsTemplates['locationsTooltipTpl'],

    initialize: function(map, settings) {
      if (!map && map instanceof L.Map) {
        throw 'First params "map" is required and a valid instance of L.Map.';
      }
      var opts = settings || {};
      this.options = _.extend({}, this.defaults, opts);
      this.map = map;
    },

    /**
     * Create a CartoDB layer
     * @param  {Function} callback
     */
    create: function(callback) {
      var markers = this.options.markers;

      this.markers = _.map(markers, function(marker){
        var size = this.getSize(marker.value),
            svg = this.getSVG(marker);

        // Create icon
        var icon = new L.divIcon({
          iconSize: [size,size],
          // Need to set marker.type on each marker
          className: marker.type ?
            'c-marker -' + marker.type :
            'c-marker -' + this.options.type,
          html: this.template({
            value: marker.value > 1 ? marker.value : '',
            svg: this.getHtmlString(svg)
          })
        });

        var markerIcon = L.marker(marker.center, {
          icon: icon
        }).on('mouseover', this._onMouseover.bind(this))
          .on('mouseout', this._onMouseout.bind(this))
          .on('click', this._onMouseclick.bind(this));

        /* Need to set markers investigators */
        if (marker.investigators) {
          var peopleList = '<div class="people">';
          marker.investigators.map(function(investigator) {
            peopleList += '<p class="person">'+ investigator +'</p>';
          });
          peopleList += '</div>';
          markerIcon.bindPopup(peopleList);
        }

        // Return a leaflet marker
        return markerIcon;

      }.bind(this));

      // Group the markers and add them to the map
      var group = L.featureGroup(this.markers).addTo(this.map);
      // Fit bounds to see all the markers
      this.map.fitBounds(group.getBounds());
    },

    /**
     * Remove cartodb layer and sublayers
     */
    remove: function() {
      if (this.markers) {
        _.compact(_.map(this.markers, function(marker){
          marker.off('mouseover')
                .off('mouseout')
                .off('click');
          this.map.removeLayer(marker);
        }.bind(this)));
        this.markers = null;
      } else {
        console.info('There aren\'t markers.');
      }
    },

    getSize: function(value) {
      var constant = 30,
          multiplier = 15,
          size = Math.round(constant + (Math.log(value) * multiplier));

      return size;
    },

    getSVG: function(marker) {
      var marker = marker,
          size = this.getSize(marker.value),
          total = marker.value,
          pi = Math.PI;


      // Create an svg element
      var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

      // Set the svg with the arc
      var vis = d3.select(svg)
                  .attr('width', size)
                  .attr('height', size)

      // Add each arc to the svg element
      if (!marker.type) {
        var angle = 0;
        _.each(marker.segments, function(segment, i){
          var degrees = Math.round(360*(segment.value/total));
          // Create an arc
          var arc = d3.svg.arc()
            .innerRadius(size/2 - 10)
            .outerRadius(size/2 - 4)
            .startAngle(angle * (pi/180)) //converting from degs to radians
            .endAngle((angle + degrees) * (pi/180)) //converting from degs to radians

          vis.append('path')
            .attr('d', arc)
            .attr('fill', this.colors[this.options.type][i])
            .attr('stroke-width', 2)
            .attr('stroke', this.strokeColors[this.options.type])
            .attr('transform', 'translate('+size/2+','+size/2+')');

          angle = angle + Math.round(360*segment.value/total);

        }.bind(this));
      }


      return svg;
    },

    getHtmlString: function(xmlNode) {
      if (typeof window.XMLSerializer != 'undefined') {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
      } else if (typeof xmlNode.xml != 'undefined') {
        return xmlNode.xml;
      }
      return "";
    },

    _onMouseover: function(e) {
      // var pos = this.map.latLngToContainerPoint(e.target._latlng);
      // var data = e.target.options.data;
      // e.target.bringToFront();
      // this.tooltipEl
      //   .css({
      //     left: pos.x,
      //     top: pos.y
      //   })
      //   .html(this.tooltipTpl(data))
      //   .removeClass()
      //   .addClass('m-location-tooltip -active -'+data.category);
    },

    _onMouseout: function(e) {
      // this.tooltipEl
      //   .html('')
      //   .removeClass()
      //   .removeClass('-active');
    },

    _onMouseclick: function(e) {
      // // set default radius to all markers
      // this._resetSelected();
      // // set default radius to current
      // Backbone.Events.trigger('Location/update', e.target.options.data.cartodb_id);
    },

    _setSelected: function(id) {
      // if (!!this.markers && !!this.markers.length) {
      //   var currentMarker = _.find(this.markers, function(marker) {
      //     return (marker.options.data.cartodb_id == id);
      //   });

      //   currentMarker.bringToFront();
      //   currentMarker.setRadius(25);
      // }
    },

    _resetSelected: function() {
      // if (!!this.markers && !!this.markers.length) {
      //   // set default radius to all markers
      //   _.each(this.markers, function(marker){
      //     marker.setRadius(10);
      //   }.bind(this));
      // }
    }

  });

})(this.App);