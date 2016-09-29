/**
 * jQuery Syaku Rolling ver 1.3.1
 *
 * Copyright (c) Seok Kyun. Choi. �ּ���
 * GNU Lesser General Public License
 * http://www.gnu.org/licenses/lgpl.html
 *
 * registered date 20110830
 * http://syaku.tistory.com
 */

(function($) {

  $.fn.srolling = function(settings) {

    settings = jQuery.extend({
      data : [ ], // �Ѹ��� ������ ������
      name : '#srolling_area', // �Ѹ� ��� element
      item_count : 1, // �ѹ� �̵��� ������ ��
      cache_count : 5, // ���� �ѹ� �ӽ÷� ������ ������ �� (��ġ��������)
      width : 100, // ����� ������ ũ�� (�ʼ� : ���� ������ ���� �ణ ũ�� �����ϼ���)
      height : 100, // ����� ������ ũ�� (�ʼ� : ���� ������ ���� �ణ ũ�� �����ϼ���)
      auto : false, // �ڵ� �̵� ����
      delay : 1000, // �ڵ� �̵� �� ��� �ð�
      delay_frame : 500, // �̵� �ӵ� (�����̴� ȿ���� ���ְ� ������ 0)
      move : 'left', // �̵� ���� left , right , up , down 
      prev : '#srolling_prev', // ���� ������ �̵� ��ư element
      next : '#srolling_next', // ���� ������ �̵� ��ư element
      is_bullet : false, // �� ��뿩��
      bullet : '#srolling_bullet', // �� ��ư element
      bullet_item : '#srolling_bullet_item', // �� ��ư item element
      bullet_style_func : null // ���õ� �� ȿ���ֱ�
    }, settings);

    var name = settings.name;
    var auto = settings.auto;
    var auto_go = auto;
    var delay_time = settings.delay;
//    var delay_time = delay;
    var delay_frame = settings.delay_frame
    var move = settings.move;
    var prev = settings.prev;
    var next = settings.next;
    var is_bullet = settings.is_bullet;
    var bullet = settings.bullet;
    var bullet_item = settings.bullet_item;
    var bullet_style_func = settings.bullet_style_func;

    var data = settings.data;
    var item_count = settings.item_count;
    var cache_count = settings.cache_count;
    var index = settings.index;
    var item_width = settings.width;
    var item_height = settings.height;

    var item_total = data.length; // ������ �Ѽ�
    cache_count = (item_total > cache_count) ? item_total : cache_count; // ĳ������ ��
    var prev_idx = item_total;
    var next_idx = 0;
    var start_left = item_width * (cache_count * -1);
    var w_full_size = (parseInt(item_width) * parseInt(item_total)) * 10;

    switch (move) {
      case 'down' : 
      case 'up' : 
        w_full_size = item_width; 
        start_left = item_height * (cache_count *-1);
      break;
    }

    var box = this;
    name = name + '_' + box.attr('id');
    var str_name = name.replace('#','');
    var box_area = box.append("<div id='" + str_name + "' style='width:" + w_full_size + "px;position: absolute;white-space:nowrap;'></div><!-- Copyright (c) Seok Kyun. Choi. �ּ��� http://syaku.tistory.com -->");
    box_area = jQuery(name,box);
    var item_area = jQuery("<div></div>").css("width",item_width).css("height",item_height).css("float","left").css("overflow","hidden");

    var sTime = null;
    var item_idx = 1; // ���� ������ ����

    function _initialize() {
      _items();

      // �� ����
      if (is_bullet) _bullet_init();
      _bullet_style(); // �ʱ� �� Ȱ��ȭ

      if (auto) { _play(); }

      jQuery(prev).click(function() {
        _prev_act();
      });

      jQuery(next).click(function() {
        _next_act();
      });

      if (auto) {
        jQuery(box_area).mouseover(function() {
            clearTimeout(sTime);
            auto_go = false;

        });

        jQuery(box_area).mouseout(function() {
            auto_go = true;
            _play();
        });

      }

      // html5 & jquerymobile
      box_area.bind('swipeleft', function(event) {
        _next_act();
      });
      box_area.bind('swiperight', function(event) {
        _prev_act();
      });

    }

    function _start_box() {
      switch (move) {
        case 'down' : 
        case 'up' : box_area.css('top',start_left); break;
        case 'right' : 
        case 'left' : box_area.css('left',start_left); break;
      }
    }

    function _play() {
      switch (move) {
        case 'down' : 
        case 'right' : sTime = setTimeout(_prev_auto_act,delay_time); break;
        case 'up' : 
        case 'left' : sTime = setTimeout(_next_auto_act,delay_time); break;
      }
    }

    function _prev_auto_act() {
      if (auto_go) _prev_act();

    }
    
    function _next_auto_act() {
      if (auto_go) _next_act();
    }

    function _prev_act() {
      _item_idx(-1);
      _bullet_style();
      _move_wait(true);

      switch (move) {
        case 'left' : 
        case 'right' : 
          _animate({ left: '+=' + (item_width * item_count) },item_count,'prev');
        break;

        case 'up' : 
        case 'down' : 
          _animate({ top: '+=' + (item_height * item_count) },item_count,'prev');
        break;

      }

    }

    function _next_act() {
      _item_idx(1);
      _bullet_style();
      _move_wait(true);
      switch (move) {
        case 'down' : 
        case 'up' : 
        _animate({ top: '-=' + (item_height * item_count) },item_count);
        break;

        case 'right' : 
        case 'left' : 
        _animate({ left: '-=' + (item_width * item_count) },item_count);
        break;
      }

    }


    // ���� ������ idx ���ϱ�
    function _item_idx(idx) {
      if (idx > 0) { item_idx++; }
      else { item_idx--; }
      if (item_idx > item_total) { item_idx = 1; }
      if (item_idx < 1){ item_idx = item_total; }
    }

    // �� Ȱ��ȭ
    function _bullet_init() {
      for (var i = 0; i < item_total; i++) {
        var bullet_item_btn = jQuery(bullet_item).clone();
        var obj = bullet_item_btn.removeAttr('id').addClass('syaku_r_bullet_'+i);
        var html = obj.html();
        obj.html(html.replace('{idx}',i+1));
        jQuery(bullet).append(obj.click(function() {
            _bullet_act(this);
        }));
      }
      jQuery(bullet_item).remove();

    }

    // ���õ� �� ȿ���ֱ�
    function _bullet_style() {
      if (jQuery.isFunction(bullet_style_func) && is_bullet) {
        bullet_style_func(jQuery(bullet),jQuery(bullet + ' .syaku_r_bullet_' + (item_idx-1)));
      }
    }

    
    // �� �̺�Ʈ �߻�
    function _bullet_act(bullet_obj) {
      var get_idx = jQuery(bullet_obj).attr('class');
      get_idx = get_idx.replace('syaku_r_bullet_','');
      get_idx = Number(get_idx)+1;

      var move_idx = 0;
      if (item_idx > get_idx) {
        move_idx = (item_total+get_idx) - item_idx
      } else {
        move_idx = get_idx - item_idx
      }

      if (move_idx > 0) {
        item_idx = get_idx; // ���� ������ ����
        _bullet_style();
        _move_wait(true);
        
        switch (move) {
          case 'down' : 
          case 'up' : 
            var get_item = item_height * move_idx;
            _animate({ top: '-=' + get_item },move_idx);
          break;
          case 'right' : 
          case 'left' : 
            var get_item = item_width * move_idx;
            _animate({ left: '-=' + get_item },move_idx);
          break;
        }

      }
    }

    function _animate(get_item,move_idx,act) {
      box_area.animate(
      get_item
      , delay_frame, function() { 

      switch (act) {
        case 'prev':
        for (var i = 0; i < move_idx; i++) { box_area.children().last().remove(); }
        _create_prev(move_idx);
        break;
        default :
        for (var i = 0; i < move_idx; i++) { box_area.children().first().remove(); }
        _create_next(move_idx);
        break;
      }
      _start_box();
      _move_wait(false);
      jQuery(box_area).mouseover(function() { auto_go = false; });
      });
    }


    // �� �̺�Ʈ �߻��� ��� ��Ű��
    function _bullet_wait(is) {


    }

    function _move_wait(is) {
      if (is_bullet) {
        var obj = jQuery(bullet + ' li');
        
        obj.each(function() {
          var me = this;
          if (is) { // Ŭ�� ����
            jQuery(me).unbind('click');
          } else { // Ŭ�� Ȱ��ȭ
            jQuery(me).click(function() {
              _bullet_act(me);
            });
          }
        });
      }

      if (is) { // Ŭ�� ����
          if (auto) { // �ڵ� ���� ����
          clearTimeout(sTime);
          auto_go = false;
        }

        jQuery(prev).unbind('click');
        jQuery(next).unbind('click');
      } else { // Ŭ�� Ȱ��ȭ

        jQuery(next).click(_next_act);
        jQuery(prev).click(_prev_act);

        if (auto) { // �ڵ� �̵� ����
        auto_go = true;
        _play();
        }

      }
    }

    function _items() {
      _start_box();
      
      for (var i = cache_count; i > 0; i--) {
        if (item_total <= prev_idx || prev_idx < 0) { prev_idx = item_total-1; }
        var t_obj = item_area.clone();
        box_area.prepend( t_obj.append(jQuery(data[prev_idx])).attr('class','srolling_item_' + prev_idx) );
        prev_idx--;
      }
      
      for (var i=0; i < cache_count; i++) {
        if (item_total <= next_idx || next_idx < 0) { next_idx = 0; }
        var t_obj = item_area.clone();
        box_area.append( t_obj.append(jQuery(data[next_idx])).attr('class','srolling_item_' + next_idx) );
        next_idx++;
      }

    }

    function _create_prev() {
      var p_obj = box_area.children().first().attr('class');
      prev_idx = parseInt(p_obj.replace('srolling_item_','')) - 1;

      for (var i = item_count; i > 0; i--) {
        if (item_total <= prev_idx || prev_idx < 0) { prev_idx = (item_total-1); }

        var t_obj = item_area.clone();
        box_area.prepend( t_obj.append(jQuery(data[prev_idx])).attr('class','srolling_item_' + prev_idx) );
        prev_idx--;
      }
    }

    function _create_next(c_num) {
      var create_num = item_count;
      if (!isNaN(c_num)) create_num = c_num;
      var n_obj = box_area.children().last().attr('class');
      next_idx = parseInt(n_obj.replace('srolling_item_','')) + 1;
      for (var i=0; i < create_num; i++) {
        if (item_total <= next_idx || next_idx < 0) { next_idx = 0; }

        var t_obj = item_area.clone();
        box_area.append( t_obj.append(jQuery(data[next_idx])).attr('class','srolling_item_' + next_idx) );
        next_idx++;
      }
    }

    _initialize();
  };
  
})(jQuery);
