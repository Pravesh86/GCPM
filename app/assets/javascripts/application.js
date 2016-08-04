// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require leaflet
//= require handlebars
//= require underscore/underscore
//= require backbone/backbone
//= require backbone-syphon
//= require d3
//= require fuse
//= require chosen
//= require pickadate/picker
//= require pickadate/picker.date
//= require_self

//= require_tree ./templates
//= require_tree ./helpers/
//= require_tree ./collections/
//= require_tree ./views/

//= require main
//= require router
//= require dispatcher

//= require forms

(function() {

  'use strict';

  this.App = {
    Events: _.extend(Backbone.Events),
    View: {},
    Model: {},
    Collection: {},
    Helper: {}
  };

}).call(this);
