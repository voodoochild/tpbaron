(function() {
  'use strict';

  require.config({
    baseUrl: '../components',
    paths: {
      domReady: 'requirejs-domready/domReady',
      lodash: 'lodash/dist/lodash.min',
      reqwest: 'reqwest/reqwest',
      bonzo: 'bonzo/bonzo.min',
      qwery: 'qwery/qwery.min'
    }
  });

  require(['domReady!', 'lodash', 'bonzo', 'qwery', 'reqwest'],

  function(domReady, _, bonzo, qwery, reqwest) {
    function $(selector) {
      return bonzo(qwery(selector));
    }

    var itemKeys = ['id', 'name', 'buy', 'sell', 'supply', 'demand', 'img'];
    var itemTemplate = _.template(
      '<li class="item">'+
        '<a href="http://www.gw2tp.com/item/<%= id %>" class="icon"><img src="<%= img %>" /></a>'+
        '<div class="details">'+
          '<a href="http://www.gw2tp.com/item/<%= id %>"><%= name %></a>'+
          '<dl>'+
            '<dt>Buy</dt><dd><%= buy %></dd>'+
            '<dt>Sell</dt><dd><%= sell %></dd>'+
            '<dt>Supply</dt><dd><%= supply %></dd>'+
            '<dt>Demand</dt><dd><%= demand %></dd>'+
            '<dt>Spread</dt><dd><%= spread %></dd>'+
          '</dl>'+
        '</div>'+
      '</li>');
    var coins = {
      gold:   '<img src="http://www.gw2tp.com/static/img/gold.png" />',
      silver: '<img src="http://www.gw2tp.com/static/img/silver.png" />',
      copper: '<img src="http://www.gw2tp.com/static/img/copper.png" />'
    };

    function monetise(copper) {
      copper = copper || 0;
      var gold = Math.floor(copper / 10000);
      copper = copper % 10000;
      var silver = Math.floor(copper / 100);
      copper = copper % 100;
      var money = [coins.copper+' '+copper];
      if (silver) { money.unshift(coins.silver+' '+silver); }
      if (gold)   { money.unshift(coins.gold+' '+gold); }
      return money.join(' ');
    }

    $('.tp-list ol').each(function() {
      var list = $(this);
      var items = list.data('items').split(',');
      reqwest({
        url: 'http://api.gw2tp.com/1/items?ids='+items.join()+'&fields=name,buy,sell,supply,demand,img',
        type: 'json',
        crossOrigin: true,
        success: function(data) {
          _.each(data.results, function(item) {
            var data = _.zipObject(itemKeys, item);
            data.spread = monetise(Math.floor((data.sell * 0.85) - data.buy));
            data.buy = monetise(data.buy);
            data.sell = monetise(data.sell);
            list.append(itemTemplate(data));
          });
        }
      });
    });
  });
})();
