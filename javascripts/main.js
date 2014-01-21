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
            '<li class="widest"><strong>Spread</strong><%= spread %><%= percentage %></li>'+
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

    /**
     * Break down a copper price into denominations
     * @param  {Integer} copper
     * @return {String}
     */
    function monetise(copper) {
      var negative = false;
      if (copper === 0) {
        return '0';
      } else if (copper < 0) {
        negative = true;
        copper = copper * -1;
      }
      var gold = Math.floor(copper / 10000);
      copper = copper % 10000;
      var silver = Math.floor(copper / 100);
      copper = copper % 100;
      var money = [copper+' '+coins.copper];
      if (silver) { money.unshift(silver+' '+coins.silver); }
      if (gold) { money.unshift(gold+' '+coins.gold); }
      if (negative) {
        money.unshift('<span class="negative">-');
        money.push('</span>');
      }
      return money.join(' ');
    }

    // Retrieve data from API
    var itemLookup = {};
    var itemIds = _.flatten(_.map($('.tp-list ol'), function(list) {
      return $(list).data('items').split(',');
    }));
    $.ajax({
      url: 'http://api.gw2tp.com/1/items?ids='+itemIds.join()+'&fields=name,buy,sell,supply,demand,img',
      dataType: 'json',
      success: function(data) {
        var itemData;
        _.forEach(data.results, function(item) {
          itemData = _.zipObject(itemKeys, item);
          itemLookup[itemData.id] = itemData;
        });
        populateLists();
      }
    });

    /**
     * Populate lists using the itemLookup
     */
    function populateLists() {
      var item;
      $('.tp-list ol').each(function() {
        _($(this).data('items').split(',')).each(function(id) {
          item = itemLookup[id];
          if (item) {
            item.buy = item.buy || 1;
            item.sell = item.sell || 1;
            var spread = Math.floor((item.sell * 0.85) - item.buy);
            item.spread = monetise(spread);
            item.percentage = (spread !== 0) ? ' ('+Math.floor((spread / item.buy) * 100)+'%)' : '';
            item.buy = monetise(item.buy);
            item.sell = monetise(item.sell);
            $(this).append(itemTemplate(item));
          }
        }, this);
      });
    }

    // Bind show/hide toggles
    $('.toggle-list').on('click', function() {
      var toggle = $(this);
      if (toggle.hasClass('fa-angle-double-up')) {
        toggle.parents('.tp-list').find('.tp-wrap').hide();
        $(this).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
      } else {
        toggle.parents('.tp-list').find('.tp-wrap').show();
        $(this).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
      }
    });
  });
})();
