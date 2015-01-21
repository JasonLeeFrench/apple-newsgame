/*
init.js
Copyright (c) 2015, Jason French

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
BASE64.js
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com

Permission is hereby granted, free of charge, to any personh3
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
function StringBuffer(){this.buffer=[]}function Utf8EncodeEnumerator(e){this._input=e;this._index=-1;this._buffer=[]}function Base64DecodeEnumerator(e){this._input=e;this._index=-1;this._buffer=[]}StringBuffer.prototype.append=function(t){this.buffer.push(t);return this};StringBuffer.prototype.toString=function e(){return this.buffer.join("")};var Base64={codex:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t=new StringBuffer;var n=new Utf8EncodeEnumerator(e);while(n.moveNext()){var r=n.current;n.moveNext();var i=n.current;n.moveNext();var s=n.current;var o=r>>2;var u=(r&3)<<4|i>>4;var a=(i&15)<<2|s>>6;var f=s&63;if(isNaN(i)){a=f=64}else if(isNaN(s)){f=64}t.append(this.codex.charAt(o)+this.codex.charAt(u)+this.codex.charAt(a)+this.codex.charAt(f))}return t.toString()},decode:function(e){var t=new StringBuffer;var n=new Base64DecodeEnumerator(e);while(n.moveNext()){var r=n.current;if(r<128)t.append(String.fromCharCode(r));else if(r>191&&r<224){n.moveNext();var i=n.current;t.append(String.fromCharCode((r&31)<<6|i&63))}else{n.moveNext();var i=n.current;n.moveNext();var s=n.current;t.append(String.fromCharCode((r&15)<<12|(i&63)<<6|s&63))}}return t.toString()}};Utf8EncodeEnumerator.prototype={current:Number.NaN,moveNext:function(){if(this._buffer.length>0){this.current=this._buffer.shift();return true}else if(this._index>=this._input.length-1){this.current=Number.NaN;return false}else{var e=this._input.charCodeAt(++this._index);if(e==13&&this._input.charCodeAt(this._index+1)==10){e=10;this._index+=2}if(e<128){this.current=e}else if(e>127&&e<2048){this.current=e>>6|192;this._buffer.push(e&63|128)}else{this.current=e>>12|224;this._buffer.push(e>>6&63|128);this._buffer.push(e&63|128)}return true}}};Base64DecodeEnumerator.prototype={current:64,moveNext:function(){if(this._buffer.length>0){this.current=this._buffer.shift();return true}else if(this._index>=this._input.length-1){this.current=64;return false}else{var e=Base64.codex.indexOf(this._input.charAt(++this._index));var t=Base64.codex.indexOf(this._input.charAt(++this._index));var n=Base64.codex.indexOf(this._input.charAt(++this._index));var r=Base64.codex.indexOf(this._input.charAt(++this._index));var i=e<<2|t>>4;var s=(t&15)<<4|n>>2;var o=(n&3)<<6|r;this.current=i;if(n!=64)this._buffer.push(s);if(r!=64)this._buffer.push(o);return true}}};

/*
game.js
Copyright (c) 2013, Aaron Meier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function() {

  var last_tick = (new Date).getTime(),
  tick_ms = 250,
  save_ms = 2500,
  last_click = 0;

  function Game() {

    var gd = {
      'title': '',
      'version': '0.0.1',
      'roi' : 1,
      'sell_roi': 0.5,
      'pop' : 50,
      'happy' : 50,
      'you_make': 0,
      'make_amount': 1,
      'sell_amount': 1,
      'wage': {
        'percent': 50,
        'to_pay': 0
      },
      'cash': {
        'amount': 0,
        'label': 'Cash'
      },
      'stuff': {
        'quantity': 0
      },
      //MANUFACTURING
      'makers': {
        'kid_worker': {
          'label': 'Child',
          'quantity': 0,
          'description':'Kid hired for small hands that can grab in the machines',
          'rps': 0.2,
          'base_cost': 20,
          'cost': 20,
          'unlocked': true,
          'sid': 'm1'
        },
        'unskilled_worker': {
          'label': 'Unskilled Worker',
          'quantity': 0,
          'description':'High-school graduate',
          'rps': 1,
          'base_cost': 210,
          'cost': 210,
          'unlocked': true,
          'sid': 'm2'
        },
        'worker': {
          'label': 'Worker',
          'quantity': 0,
          'description':'Husband with wife and two kids',
          'rps': 5,
          'base_cost': 1000,
          'cost': 1000,
          'unlocked': false,
          'unlock_rps':1.2,
          'sid': 'm3'
        },
        '05_factory':{
          'label':'Small Factory',
          'description':'A small factory in a bad neighbourhood',
          'quantity':0,
          'rps':25,
          'base_cost':5000,
          'cost':5000,
          'unlock_rps':6,
          'unlocked':false,
          'sid':'c4',
        },
        '07_warehouse':{
          'label':'Abandoned Warehouse',
          'description':'A large abandoned warehouse with vaulted ceilings',
          'quantity':0,
          'rps':100,
          'risk':0.05,
          'base_cost':25000,
          'cost':25000,
          'unlock_rps':50,
          'unlocked':false,
          'sid':'c5',
        }
      },
      //DISTRIBUTION
      'sellers': {
        'unskilled_salesman': {
          'label': 'Unskilled Salesman',
          'quantity': 0,
          'description':'Negotiates to sell your product to the big corporations',
          'rps': 0.2,
          'base_cost': 20,
          'cost': 20,
          'unlocked': true,
          'sid':'s1'
        },
        'salesman': {
          'label': 'Door-to-door Salesman',
          'quantity': 0,
          'description':'Sell your phones, direct to the customer',
          'rps': 1,
          'base_cost': 230,
          'cost': 230,
          'unlocked': true,
          'sid': 's2'
        },
        'market_van':{
          'label':'Market Van',
          'description':'A run-down van that actively seeks out customers',
          'quantity':0,
          'risk':0.05,
          'rps':8,
          'base_cost':2300,
          'cost':2300,
          'unlocked':true,
          'sid':'s3',
        },
        'grotty_shop':{
          'label':'Grotty Shop',
          'description':'Purchase a grubby little shop and sell your product to the punters',
          'quantity':0,
          'rps':100,
          'base_cost':25000,
          'cost':25000,
          'unlock_rps':50,
          'unlocked':false,
          'sid':'s5',
        },
        'shiny_shop':{
          'label':'Shiny Shop',
          'description':'A wonderful place to sell your product',
          'quantity':0,
          'rps':400,
          'base_cost':125000,
          'cost':125000,
          'unlock_rps':250,
          'unlocked':false,
          'sid':'s7',
        }
      },
      //MANAGING
      'managers': {
      },
      //UPGRADES
      'upgrades': {
      },
      //ACIEVEMENTS
      'achievements': {
        'employment_1': {
          'label': 'Partnership!',
          'description': 'Buy - I mean, employ - a worker',
          'property': 'stats.workers_employed',
          'required': 1,
          'unlocked': false,
          'hidden':false,
          'value': 1,
          'group': 10,
          'min_time': 1,
          'sid': 'a01'
        },
        'employment_2': {
          'label': 'Private Limited Company!',
          'description': 'Buy ten workers',
          'property': 'stats.workers_employed',
          'required': 10,
          'unlocked': false,
          'hidden':false,
          'value': 2,
          'group': 12,
          'min_time': 1,
          'sid': 'a02'
        },
        'employment_3': {
          'label': 'Public Limited Company!',
          'description': 'Buy one hundred workers',
          'property': 'stats.workers_employed',
          'required': 100,
          'unlocked': false,
          'hidden':false,
          'value': 3,
          'group': 12,
          'min_time': 1,
          'sid': 'a03'
        },
        'kid_1': {
          'label': 'Day Care',
          'description': 'Hire a kid',
          'property': 'makers.kid_worker.quantity',
          'required': 1,
          'unlocked': false,
          'hidden':false,
          'value': 1,
          'group': 20,
          'min_time': 1,
          'sid': 'a04'
        },
        'kid_2': {
          'label': 'Child-friendly Employer',
          'description': 'Hire ten kids',
          'property': 'makers.kid_worker.quantity',
          'required': 10,
          'unlocked': false,
          'hidden':false,
          'value': 1,
          'group': 21,
          'min_time': 1,
          'sid': 'a05'
        },
        'kid_3': {
          'label': 'Child Army',
          'description': 'Hire one hundred kids',
          'property': 'makers.kid_worker.quantity',
          'required': 100,
          'unlocked': false,
          'hidden':false,
          'value': 1,
          'group': 21,
          'min_time': 1,
          'sid': 'a05'
        },
        'a_playtime1':{
          'label':'A Minute of Your Time',
          'description':'You\'ve managed a factory for 1 minute',
          'property':'stats.seconds_played',
          'required':60,
          'unlocked':false,
          'hidden':false,
          'value':1,
          'group':301,
          'min_time':1,
          'sid':'a22',
        },
        'a_playtime2':{
          'label':'Five Minutes of Fame',
          'description':'You\'ve managed a factory for 5 minutes',
          'property':'stats.seconds_played',
          'required':300,
          'unlocked':false,
          'hidden':false,
          'value':2,
          'group':302,
          'min_time':1,
          'sid':'a23',
        },
        'a_playtime3':{
          'label':'First Factory Hour',
          'description':'You\'ve managed a factory for an hour',
          'property':'stats.seconds_played',
          'required':3600,
          'unlocked':false,
          'hidden':false,
          'value':3,
          'group':303,
          'min_time':1,
          'sid':'a24',
        },
        'a_playtime4':{
          'label':'Half a day down the drain',
          'description':'You\'ve managed a production empire for 12 hours',
          'property':'stats.seconds_played',
          'required':43200,
          'unlocked':false,
          'hidden':false,
          'value':5,
          'group':304,
          'min_time':1,
          'sid':'a25',
        },
        'a_playtime5':{
          'label':'Addict',
          'description':'You\'ve managed a production empire for an entire day',
          'property':'stats.seconds_played',
          'required':86400,
          'unlocked':false,
          'hidden':false,
          'value':10,
          'group':305,
          'min_time':1,
          'sid':'a26',
        },
        'a_playtime6':{
          'label':'Junkie',
          'description':'You\'ve managed a production empire for an entire week!',
          'property':'stats.seconds_played',
          'required':86400*5,
          'unlocked':false,
          'hidden':false,
          'value':10,
          'group':306,
          'min_time':1,
          'sid':'a27',
        },
        'a_playtime7':{
          'label':'Burnout',
          'description':'You\'ve managed a production empire for a month! Dayum!',
          'property':'stats.seconds_played',
          'required':86400*30,
          'unlocked':false,
          'hidden':false,
          'value':10,
          'group':307,
          'min_time':1,
          'sid':'a28',
        },
        'cheat_cash':{
          'label':'Cheat cash',
          'description':'You hacked in some cash!',
          'property':'stats.cash_cheated',
          'required':1,
          'unlocked':false,
          'hidden':true,
          'value':11,
          'group':307,
          'min_time':1,
          'sid':'a29',
        },
        'cheat_stuff':{
          'label':'Cheat stuff',
          'description':'You hacked in some product!',
          'property':'stats.stuff_cheaed',
          'required':1,
          'unlocked':false,
          'hidden':true,
          'value':11,
          'group':307,
          'min_time':1,
          'sid':'a30'
        }
      },
      //EVENTS
      'events': {
        'cash_found_small':{
          'chance':0.05,
          'action':'event_found_cash(60)',
        },
        'cash_found_med': {
          'chance':0.005,
          'action':'event_found_cash(240)',
        },
        'cash_found_large': {
          'chance':0.001,
          'action':'event_found_cash(640)',
        },
        'worker_die':{
          'chance':0.0075,
          'action':'event_worker_die(1)'
        },
      },
      'stats': {
        'seconds_played': 0,
        'maker_rps': 0,
        'seller_rps': 0,
        'made_stuff': 0,
        'stuff_cheated': 0,
        'sold_stuff': 0,
        'cash_earned': 0,
        'cash_cheated': 0,
        'wage_ps': 0,
        'wages_paid': 0,
        'wages_flunked': 0,
        'workers_employed': 0,
        'start_time': (new Date).getTime()
      }
    };

    window.add_cash = function(n){
      earn_cash(n);
      gd.stats.cash_cheated += n;
    }

    window.add_stuff = function(n) {
      gd.stuff.quantity +=(n);
      gd.stats.stuff_cheated +=(n);
    }

    this.do_setup = function(){
      setup_makers();
      setup_sellers();
      setup_managers();
      setup_upgrades();
      setup_achievements();
      setup_wages();
    }

    function get_item_cost(scl) {
      var cst = ((scl.quantity + 1) * scl.base_cost) * (scl.quantity + 1);
      // Double costs if > 10 are owned
      if((scl.quantity + 1) > 10) {
        cst *= 2;
      }
      return cst;
    }

    function get_item_sell_value(i){
      return get_item_last_cost(i) * (0.5 * gd.roi);
    }

    function get_item_last_cost(i) {
      var cst = ((i.quantity) * i.base_cost) * (i.quantity);
      // Double costs if > 10 are owned
      if(i.quantity > 10) {
        cst *= 2;
      }
      return cst;
    }

    function setup_wages(){
      $('input.wage').val(gd.wage.percent);
      $('input.wage').change(set_wage);
    }

    function set_wage(){
      gd.wage.percent = $('input.wage').val();
    }


    function setup_makers(){
      var list = [];
      for(var k in gd.makers){
        list.push([k, gd.makers[k].cost]);
      }
      var sorted = list.sort(function(x,y){ return x[1] - y[1] });
      for(var i in sorted){
        var k = sorted[i][0],
        cl = gd.makers[k];
        var template = "<div class='item' id='{{k}}'><h3>{{cl.label}}</h3><label id='{{k}}-amt' class='grey pull_right'>{{cl.quantity}}</label><p class='small'><b>$<span id='{{k}}-cst'>{{cl.cost}}</span></b> — <em class='grey'>{{cl.description}}</em></p><button class='buy' id='{{k}}-btn'>Purchase</button><button class='sell' id='{{k}}-sell-btn'>Sell</button></div>";
        var data = {'k':k, 'cl':cl};
        var html = Mustache.to_html(template, data);
        $('#makers').prepend(html);
      }
      $('#makers .buy').click(function(){
        buy_makers($(this).attr('id').split('-').shift());
      });
      $('#makers .sell').click(function(){
        sell_makers($(this).attr('id').split('-').shift());
      });

    }

    function setup_sellers(){
      var list = [];
      for(var k in gd.sellers){
        list.push([k, gd.sellers[k].cost]);
      }
      var sorted = list.sort(function(x,y){ return x[1] - y[1] });
      for(var i in sorted){
        var k = sorted[i][0],
        cl = gd.sellers[k];
        var template = "<div class='item' id='{{k}}'><h3>{{cl.label}}</h3><label id='{{k}}-amt' class='grey pull_right'>{{cl.quantity}}</label><p class='small'><b>$<span id='{{k}}-cst'>{{cl.cost}}</span></b> — <em class='grey'>{{cl.description}}</em></p><button class='buy' id='{{k}}-btn'>Purchase</button><button class='sell' id='{{k}}-sell-btn'>Sell</button></div>";
        var data = {'k':k, 'cl':cl};
        var html = Mustache.to_html(template, data);
        $('#sellers').prepend(html);
      }
      $('#sellers .buy').click(function(){
        buy_sellers($(this).attr('id').split('-').shift());
      });
      $('#sellers .sell').click(function(){
        sell_sellers($(this).attr('id').split('-').shift());
      });
    }

    function setup_managers(){

    }

    function setup_upgrades(){

    }

    function setup_achievements() {
      var sortlist = [];
      for(var k in gd.achievements) {
        sortlist.push([k, gd.achievements[k].group]);
      }
      var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });
      var ac_el = $('#achievements');
      ac_el.html('');

      for(var i in sorted) {
        var k = sorted[i][0];
        var cl = gd.achievements[k];
        var template = "<div class='item' id='{{k}}'><h3>{{cl.label}}</h3> - <em class='grey'>{{cl.description}}</em></div>";
        var data = {'k':k, 'cl':cl};
        var html = Mustache.to_html(template, data);
        $('#achievements').prepend(html);
      }
    }

    window.stats = gd.stats;

    function update_display(){
      fix_sellers();
      fix_makers();
      fix_stats();
      fix_display();
      fix_achievements();
      fix_unlocks();

    }

    function fix_display(){
      $('.money').html(pretty_int(gd.cash.amount));
      $('#sell_roi').html(gd.sell_roi.toFixed(2));
      var sell_rate = gd.stats.seller_rps;
      if((gd.stats.seller_rps > gd.stats.maker_rps)&&(gd.stuff.quantity < gd.stats.seller_rps)) {
        sell_rate = gd.stats.maker_rps;
      }
      $('.seller_rps').html(pretty_int(sell_rate));
      $('.amount').html(pretty_int(gd.stuff.quantity));
      $('#clicker_rps').html(pretty_int(gd.stats.maker_rps-gd.stats.seller_rps));
      $('#clicker_rps_g').html(pretty_int(gd.stats.maker_rps));
      $('.wage_ps').html(pretty_int(gd.wage.to_pay));
      $('.you_make').html(you_make(gd.you_make));
    }

    function you_make(n){
      if(n > 0){
        return 'making money';
      } else if(n < 0){
        return 'losing money';
      } else {
        return 'neither making nor losing money';
      }
    }

    function fix_stats(){
      gd.stats.seconds_played += 1;
    }

    function fix_achievements(){
      for(var k in gd.achievements) {
        var ac = gd.achievements[k];
        var el = $('#'+k);
        var el_lbl = $('#'+k+'_lbl');
        if((ac.hidden)&&(!ac.unlocked)) {
          el.addClass('hidden');
          continue;
        }
        if(ac.unlocked) {
          el.removeClass('hidden');
          el.removeClass('semi_trans');
          el_lbl.addClass('purchased');
          el.removeClass('locked');
        } else {
          el.addClass('locked');
          el.addClass('semi_trans');
        }
      }
    }

    function fix_sellers(){
      for(k in gd.sellers){
        var el = $('#'+k);
        var el_btn = $('#'+k+'-btn');
        var el_sell_btn = $('#'+k+'-sell-btn');
        var el_amt = $('#'+k+'-amt');
        var el_cst = $('#'+k+'-cst');
        var el_rps = $('#'+k+'-rps');
        var el_rsk = $('#'+k+'-rsk');
        var sl = gd.sellers[k];

        sl.cost = get_item_cost(sl);

        if(sl.quantity < 1){
          el_sell_btn.attr('disabled', true);
        } else {
          el_sell_btn.attr('disabled', false);
        }

        if(sl.cost > gd.cash.amount) {
          el_btn.attr('disabled', true);
        } else {
          el_btn.attr('disabled', false);
        }
        if(!sl.unlocked) {
          el.addClass('hidden');
        } else {
          el.removeClass('hidden');
        }
        el_cst.html(pretty_bigint(sl.cost));
        el_amt.html(pretty_int(sl.quantity));
        el_rps.html(pretty_bigint(sl.rps));
        el_rsk.html(pretty_int(sl.risk * 100));
      }
    }

    function fix_makers() {

      for(var k in gd.makers) {
        var el = $('#'+k);
        var el_btn = $('#'+k+'-btn');
        var el_sell_btn = $('#'+k+'-sell-btn');
        var el_amt = $('#'+k+'-amt');
        var el_cst = $('#'+k+'-cst');
        var el_rps = $('#'+k+'-rps');
        var el_rsk = $('#'+k+'-rsk');
        var cl = gd.makers[k];



        if(cl.quantity > 0) {
          el_sell_btn.attr('disabled', false);
        } else {
          el_sell_btn.attr('disabled', true);
        }

        cl.cost = get_item_cost(cl);

        if(cl.cost > gd.cash.amount) {
          el_btn.attr('disabled', true);
        } else {
          el_btn.attr('disabled', false);
        }
        if(!cl.unlocked) {
          el.addClass('hidden');
        } else {
          el.removeClass('hidden');
        }
        el_cst.html(pretty_bigint(cl.cost));
        el_amt.html(pretty_int(cl.quantity));
        el_rps.html(pretty_bigint(cl.rps));
        el_rsk.html(pretty_int(cl.risk * 100));
      }
    }

    function buy_makers(k){
      var mk = gd.makers[k];
      if(!spend_cash(mk.cost)){
        return false;
      }
      mk.quantity += 1;
      gd.stats.workers_employed += 1;
      message('You have purchased '+mk.label+' for $'+pretty_bigint(mk.cost));
      fix_makers();
      return true;
    }

    function sell_makers(k){
      var cl = gd.makers[k];
      if(cl.quantity < 1) {
        return false;
      }
      var sell_val = get_item_sell_value(cl);
      earn_cash(sell_val * gd.sell_roi);
      cl.quantity -= 1;
      return true;
    }

    function buy_sellers(k) {
      var sl = gd.sellers[k];
      if(!spend_cash(sl.cost)) {
        return false;
      }
      sl.quantity += 1;
      message('You have purchased '+sl.label+' for $'+pretty_bigint(sl.cost));
      fix_sellers();
      return true;
    }

    function sell_sellers(k){
      var sl = gd.sellers[k];
      if(sl.quantity < 1) {
        return false;
      }
      var sell_val = get_item_sell_value(sl);
      earn_cash(sell_val);
      message('You sold a '+sl.label+' for $'+pretty_bigint(sell_val));
      //track_page_view('/game_sell_seller');
      sl.quantity -= 1;
      return true;
    }

    this.tick = function() {
      var this_tick = (new Date).getTime();
      var this_sub = 1000 / tick_ms;
      var ticks = Math.round((this_tick - last_tick) / tick_ms);
      if(ticks > 360000) {
        ticks = 360000;
      } else if (ticks < 1) {
        return;
      }
      last_tick = this_tick;
      make_amount = 0,
      sell_amount = 0;
      var wage_amount = 0;

      if (ticks > 360000) {
        ticks = 360000;
      } else if (ticks < 1) {
        return;
      }

      var make_amount = 0;

      for (var k in gd.makers) {
        var mk = gd.makers[k];
        make_amount += mk.quantity * mk.rps;
        wage_amount += (mk.quantity * mk.rps);
      }

      gd.stats.maker_rps = make_amount;

      make_amount = make_amount / this_sub;
      do_make(make_amount * ticks);

      var sell_amount = 0;
      for(var k in gd.sellers) {
        var sl = gd.sellers[k];
        sell_amount += sl.quantity * sl.rps;
        wage_amount += sl.quantity * sl.rps;
      }

      gd.stats.seller_rps = sell_amount;
      sell_amount = sell_amount / this_sub;

      //do_sell(sell_amount * ticks);

      do_wage((wage_amount * ticks) * (gd.wage.percent / 100));

      gd.wage.to_pay = ((wage_amount) * (gd.wage.percent / 100));

      gd.you_make  = (do_sell(sell_amount * ticks) - ((wage_amount * ticks) * (gd.wage.percent / 100)));

      check_achievements();

      update_display();

      window.gd = gd;

    }

    this.sec_tick = function(n){
    }

    function earn_cash(n){
      gd.cash.amount += n;
      return true;
    }

    function do_make(n) {

      gd.stuff.quantity += (n);
      gd.stats.made_stuff += (n);
      return true;

    }

    function do_sell(n) {

      if(gd.stuff.quantity < 1) {
        return 0;
      }

      if(n > gd.stuff.quantity) {
        n = gd.stuff.quantity;
        if(n < 1) {
          return 0;
        }
      }

      gd.stats.sold_stuff +=(n);
      gd.stuff.quantity -= (n);
      earn_cash(n * gd.roi);
      gd.stats.cash_earned += (n * gd.roi);
      return n;

    }

    function do_wage(n){
      if(n > gd.cash.amount){

      }
      gd.stats.wages_paid += n;
      spend_cash(n * gd.roi);
      return n;
    }

    function spend_cash(n) {
      if(n > (gd.cash.amount)) {
        return false;
      }
      gd.cash.amount -= n;
      gd.stats.total_spent += n;
      set_wage();
      return true;
    }

    function check_achievements() {
      for(var k in gd.achievements) {
        var a = gd.achievements[k];
        if(a.unlocked) {
          continue;
        }
        var pps = a.property.split('.');
        var val = gd;
        for(var i = 0; i<pps.length; i++) {
          val = val[pps[i]];
        }
        if((val === true)&&(val === a.required)) {
          unlock_achievement(k);
        }
        else if((val)&&((a.required >= 0 && val >= a.required)||(a.required < 0 && val <= a.required))) {
          unlock_achievement(k);
        }
      }
    }

    function unlock_achievement(key) {
      var ac = gd.achievements[key];
      if(!ac) {
        return false;
      }
      if(ac.unlocked) {
        return false;
      }
      ac.unlocked = true;
      good_message('You have earned a new achievement: <em>'+ac.label+'</em>');
      return true;
    }

    this.do_sell_click = function() {
      var nw = (new Date).getTime();
      if((nw - last_click) < 70) {
        return false;
      }
      last_click = nw;
      var sale = do_sell(this.get_click_sell_amount() * 0.5);
      if(sale) {
        //gd.stats.hand_sold_widgets += sale;
        //fix_make_sell();
        gd.sell_roi = sale;
        return sale;
      }
      return 0;
    }

    this.do_make_click = function() {
      var nw = (new Date).getTime();
      if((nw - last_click) < 70) {
        return false;
      }
      last_click = nw;
      var amt = this.get_click_make_amount();
      if(do_make(amt)) {
        //gd.stats.hand_made_widgets += amt;
        //fix_make_sell();
      }
    }

    this.get_click_sell_amount = function() {
      return gd.sell_amount + (gd.stats.seller_rps);
    }

    this.get_click_make_amount = function() {
      return gd.make_amount + (gd.stats.maker_rps);
    }

    this.do_save = function(){
      localStorage.sv = Base64.encode(JSON.stringify(gd_to_json()));
      //localStorage.ac = Base64.encode(JSON.stringify(ac_to_json()));
    }

    this.do_load = function(){
      if((localStorage.sv)||(localStorage.ac)) {
        update_gd_from_save();
      }
    }

    function get_hex_from_int(n) {
      return n.toString(24);
    }

    function get_int_from_hex(s) {
      return parseInt(s, 24);
    }

    function gd_to_json() {
      var sdata = {
        'c':get_hex_from_int(Math.round(gd.cash.amount)),
        'w':get_hex_from_int(Math.round(gd.stuff.quantity)),
        'p':get_hex_from_int(Math.round(gd.wage.percent)),
        'tp':get_hex_from_int(Math.round(gd.wage.to_pay)),
        'pop':get_hex_from_int(Math.round(gd.pop)),
        'hap':get_hex_from_int(Math.round(gd.happy)),
      };

      var unlockables = {
        "makers":"cl",
        "sellers":"sl",
        "banks":"bn",
      };

      for(var k in unlockables) {
        var items = gd[k];
        var sk = unlockables[k];
        var tmpa = [];
        for(var ik in items) {
          if(items[ik].unlocked) {
            tmpa.push(
              items[ik].sid
              + ":" +
              get_hex_from_int(items[ik].quantity)
            );
          }
        }
        sdata[sk] = tmpa.join('|');
      }

      // Upgrades
      var tmpu = [];

      for(var k in gd.upgrades) {
        var u = gd.upgrades[k];
        if(u.purchased) {
          tmpu.push(u.sid);
        }
      }

      sdata['u'] = tmpu.join('|')

      // Stats
      var tmps = [];
      for(var k in gd.stats) {
        tmps.push(k+':'
        +get_hex_from_int(gd.stats[k])
      )};
      sdata['s'] = tmps.join('|');
      return sdata;
    }

    function update_gd_from_save() {
      // Achievements
      if(localStorage.ac) {
        var ac = $.parseJSON(Base64.decode(localStorage.ac));
        update_ac_from_json(ac);
      }
      if(localStorage.sv) {
        var sv = $.parseJSON(Base64.decode(localStorage.sv));
        update_gd_from_json(sv);
        window.sv = sv;
      }
    }

    function update_gd_from_json(sv) {
      gd.cash.amount = get_int_from_hex(sv.c);
      if(sv.cs) { gd.cash.safe = get_int_from_hex(sv.cs); }
      gd.wage.percent = get_int_from_hex(sv.p);
      gd.wage.to_pay  = get_int_from_hex(sv.tp);
      //gd.happy        = get_int_from_hex(sv.hap);
      //gd.pop          = get_int_from_hex(sv.pop);
      gd.stuff.quantity = get_int_from_hex(sv.w);
      // Banks, Sellers, makers
      var unlockables = {
        'banks':'bn',
        'makers':'cl',
        'sellers':'sl',
      };
      for(var uk in unlockables) {
        var sk = unlockables[uk];
        if(sv[sk]) {
          var bns = sv[sk].split('|');
          for(var i=0; i<bns.length; i++) {
            var bid = bns[i].split(':');
            for(var k in gd[uk]) {
              if(gd[uk][k].sid == bid[0]) {
                gd[uk][k].quantity = get_int_from_hex(bid[1]);
                gd[uk][k].unlocked = true;
              }
            }
          }
        }
      }

      // Upgrades
      var upgs = sv.u.split('|');
      for(var k in gd.upgrades) {
        var upg = gd.upgrades[k];
        if(upgs.indexOf(upg.sid) > -1) {
          apply_upgrade(k);
        }
      }
      // Stats
      var svs = sv.s.split('|');
      for(var k in gd.stats) {
        for(var i=0; i<svs.length; i++) {
          var svsp = svs[i].split(':');
          if(svsp[0] == k) {
            gd.stats[k] = get_int_from_hex(svsp[1]);
          }
        }
      }

    }

    function fix_unlocks() {
      // Clickers
      var cl_unl = 0;
      var cl_tot = 0;
      for(var k in gd.makers) {
        cl_tot += 1;
        var cl = gd.makers[k];
        if(cl.unlock_rps <= gd.stats.seller_rps) {
          cl.unlocked = true;
          cl_unl += 1;
        }
      }
      $('#clickers_unlocked').html(pretty_int(cl_unl));
      $('#clickers_total').html(pretty_int(cl_tot));

      // Sellers
      var sl_unl = 0;
      var sl_tot = 0;
      for(var k in gd.sellers) {
        sl_tot += 1;
        var sl = gd.sellers[k];
        if(sl.unlock_rps <= gd.stats.seller_rps) {
          sl_unl += 1;
          sl.unlocked = true;
        }
      }
      $('#sellers_unlocked').html(pretty_int(cl_unl));
      $('#sellers_total').html(pretty_int(cl_tot));

      // Achievements
      var ac_unl = 0;
      var ac_tot = 0;
      for(var k in gd.achievements) {
        var ac = gd.achievements[k];
        if((!ac.unlocked)&&(ac.hidden)) {
          continue;
        }
        if(ac.unlocked) {
          ac_unl += 1;
        }
        ac_tot += 1;
      }
      $('#achievements_unlocked').html(pretty_int(ac_unl));
      $('#achievements_total').html(pretty_int(ac_tot));

    }


    function add_message(msg, _type) {
      var el = $("<div></div>");
      el.html(msg);
      el.addClass(_type);
      $('#last_message').html($(el).clone().wrap('<p>').parent().html());
      $('#messages').prepend(el);
      //el.fadeOut(100000);
      if($('#messages div').length > 45) {
        $('#messages div:last').remove();
      }
    }
    function error(msg) {
      add_message('&#10007; '+msg, 'error');
    }
    function message(msg) {
      add_message('&#9993; '+msg, 'message');
    }
    function good_message(msg) {
      add_message('&#9733; '+msg, 'good_message');
    }
    function bad_message(msg) {
      add_message('&#10007; '+msg, 'bad_message');
    }

    window.pretty_bigint = function(num) {
      var sn = '';
      if(num >= 1000000000000000000000000) {
        return pretty_int(num)
      }
      if(num >= 1000000000000000000000) {
        sn = Math.round((num / 1000000000000000000000) * 100) / 100;
        return sn + 'S';
      }
      if(num >= 1000000000000000000) {
        sn = Math.round((num / 1000000000000000000) * 100) / 100;
        return sn + 'Qt';
      }
      if(num >= 1000000000000000) {
        sn = Math.round((num / 1000000000000000)*100) / 100;
        return sn + 'Q';
      }
      if(num >= 1000000000000) {
        sn = Math.round((num / 1000000000000) * 100) / 100;
        return sn + 'T';
      }
      if(num >= 1000000000) {
        sn = Math.round((num / 1000000000) * 100) / 100;
        return sn + 'B';
      }
      if(num >= 1000000) {
        sn = Math.round((num / 1000000) * 100) / 100;
        return sn + 'M';
      }
      return pretty_int(num);
    }

    function pretty_int(num) {
      if(num < 1000) {
        num = Math.round(num * 10) / 10;
      } else {
        num = Math.round(num);
      }
      var num_str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return num_str;
    }

    this.get_roi = function() {
      return gd.roi;
    }

    this.check_events = function() {
      for(var k in gd.events) {
        var rnd = Math.random();
        if(gd.events[k].chance > rnd) {
          run_event(k);
        }
      }
    }

    function run_event(evk) {
      if(gd.events[evk]) {
        eval(gd.events[evk].action);
      }
    }

    function event_found_cash(r) {
      var amt = (gd.stats.seller_rps * gd.roi) * r;
      if(amt < 100) { amt = 100; }
      earn_cash(amt);
      if(amt > 10000000000) {
        good_message('A mystery benefactor has contributed $'
        +pretty_bigint(amt)+' to your cause');
        return;
      }
      if(amt > 10000000) {
        good_message('You found a truck load of cash, containing $'
        +pretty_bigint(amt)+' inside!');
        return;
      }
      if(amt > 100000) {
        good_message('You found a briefcase with $'+pretty_int(amt)+' inside!');
        return;
      }
      good_message('You found some extra cash hidden in a shoe box, worth $'
      +pretty_int(amt)+'!');
    }

    function event_worker_die(r){
      if(gd.happy > 50){ return }
      worker_lost(r);
      if(worker_lost()){
        if(r == 1){
          bad_message('Oh no. A worker died on the job');
          return;
        } else {
          bad_message('Oh no. '+pretty_int(r)+' died in apparent mass-suicides');
          return;
        }
      }
    }

    function worker_lost(n){
      var picks = [];
      for(var k in gd.makers) {
        var cl = gd.makers[k];
        if((cl.quantity > 0)) {
          picks.push(k);
        }
      }
      if(picks.length < 1) {
        return false;
      }
      var pick = picks[Math.floor(Math.random()*picks.length)];
      gd.makers[pick].quantity -= 1;
      return true;

    }

  };

  (function(){
    var width = 100;
    var height = 25;
    var x = d3.scale.linear().range([0, width - 2]);
    var y = d3.scale.linear().range([height - 4, 0]);
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.close);
    });
    function sparkline(elemId, data) {
      data.forEach(function (d) {
        d.date = parseDate(d.Date);
        d.close = +d.Close;
      });
      x.domain(d3.extent(data, function (d) {
        return d.date;
      }));
      y.domain(d3.extent(data, function (d) {
        return d.close;
      }));

      var svg = d3.select(elemId)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 2)');
      svg.append('path')
      .datum(data)
      .attr('class', 'sparkline')
      .attr('d', line);
      svg.append('circle')
      .attr('class', 'sparkcircle')
      .attr('cx', x(data[0].date))
      .attr('cy', y(data[0].close))
      .attr('r', 1.5);
    }

    d3.csv('csv/apple.csv', function (error, data) {
      sparkline('#apple_stock', data);
    });
  })();

  var gm = new Game();

  $(document).ready(function(){
    $('.header').height($(window).height());
    $(window).resize(function(){
      $('.header').height($(window).height());
    });
    gm.do_load();
    var tmr = setInterval(gm.tick, tick_ms);
    var sec_tick = setInterval(gm.sec_tick, 1000);
    var last_float = 10;
    var sv  = setInterval(gm.do_save, save_ms);
    var events = setInterval(gm.check_events, 120000);
    gm.do_setup();
    $('#make-click').click(function(e){
      gm.do_make_click();
      var elc = $('.make_up:first').clone()
      elc.html('+'+pretty_bigint(gm.get_click_make_amount()));
      $('.phone-stats').append(elc);
      elc.show();
      elc.offset({left:e.pageX-30, top:e.pageY-50});
      var end_y = e.clientY-150;
      elc.css('opacity',100);
      if(last_float == 1) {
        var this_float = e.pageX;
        last_float = 0;
      } else {
        var this_float = e.pageX - 60;
        last_float = 1;
      }
      elc.animate({'top':end_y.toString()+'px', 'opacity':0, 'left':this_float.toString()+'px'}, 750, function() {
        $(this).remove();
      });
    });
    $('#sell-click').click(function(e){
      var sale = gm.do_sell_click();
      if(sale == 0) {
        return;
      }
      var elc = $('.sell_up:first').clone();
      elc.html('$'+pretty_bigint(sale*gm.get_roi()));
      $('.cash-stats').append(elc);
      elc.show();
      elc.offset({left:e.pageX-30, top:e.pageY-50});
      var end_y = e.clientY-150;
      elc.css('opacity',100);
      if(last_float == 1) {
        var this_float = e.pageX;
        last_float = 0;
      } else {
        var this_float = e.pageX - 60;
        last_float = 1;
      }
      elc.animate({'top':end_y.toString()+'px', 'opacity':0, 'left':this_float.toString()+'px'}, 750, function() {
        $(this).remove();
      });
    });

    function checkFirst(){
      function isScrolledIntoView(elem){
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
      }
      var first = true;
      $(document).scroll(function(){
        if(isScrolledIntoView($('.game-container')) && first){
          $('body').chardinJs('start');
          first = false;
        }
      });
    }

    checkFirst();

    $('.tabs').children().click(function(){
      var target = $(this).attr('class').split('-').pop();
      if($('#' + target).hasClass('active') || $(this).hasClass('active-tab')){
        return false;
      } else {
        $('.items').children().removeClass('active');
        $('.items').children().addClass('inactive');
        $('#' + target).attr('class','active');
        $('.tabs').children().removeClass('active-tab');
        $(this).addClass('active-tab');
      }
    });

    $('body').removeClass('loading');
  });
})();
