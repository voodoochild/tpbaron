(function() {
  'use strict';

  require.config({
    baseUrl: '../components',
    paths: {
      lodash: 'lodash/dist/lodash.min',
      jquery: 'jquery/jquery.min'
    }
  });

  require(['jquery', 'lodash'],

  function($, _) {

    var itemKeys = ['id', 'name', 'buy', 'sell', 'supply', 'demand', 'img'];
    var itemTemplate = _.template(
      '<li class="item">'+
        '<a class="img" href="http://www.gw2tp.com/item/<%= id %>"><img src="<%= img %>" /></a>'+
        '<div class="bd">'+
          '<a class="name" href="http://www.gw2tp.com/item/<%= id %>"><%= name %></a>'+
          '<ul>'+
            '<li class="wider"><strong>Buy</strong><%= buy %></li>'+
            '<li class="wider"><strong>Sell</strong><%= sell %></li>'+
            '<li class="wider"><strong>Spread</strong><%= spread %></li>'+
            '<li><strong>Supply</strong><%= supply %></li>'+
            '<li><strong>Demand</strong><%= demand %></li>'+
          '</ul>'+
        '</div>'+
      '</li>');
    var coins = {
      gold:   '<img src="http://www.gw2tp.com/static/img/gold.png" />',
      silver: '<img src="http://www.gw2tp.com/static/img/silver.png" />',
      copper: '<img src="http://www.gw2tp.com/static/img/copper.png" />'
    };

    function monetise(copper) {
      if (copper <= 0) { return '<i class="fa fa-minus"></i>'; }
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
      $.ajax({
        url: 'http://api.gw2tp.com/1/items?ids='+items.join()+'&fields=name,buy,sell,supply,demand,img',
        dataType: 'json',
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

    $('.toggle-list').on('click', function() {
      var toggle = $(this);
      if (toggle.hasClass('fa-angle-double-up')) {
        toggle.parents('.tp-list').find('ol').slideUp(100);
        $(this).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
      } else {
        toggle.parents('.tp-list').find('ol').slideDown(100);
        $(this).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
      }
    });
  });
})();
