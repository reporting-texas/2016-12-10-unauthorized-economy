(function($) {
  'use strict';

  // load charts and the corechart package
  google.charts.load('current', {'packages':['corechart']});

  // selectors
  var $regions = $('.region');
  var chart_div = document.getElementById('chart');
  var $loading = $('#loading');
  var $interactive = $('#interactive');
  var $dropdown = $('#dropdown');
  var $map_desc = $('.region-map-desc');

  // a var to keep track of currently selected county
  var current_county;

  // map colors
  var map_default_color = '#a9a9a9';
  var map_highlight_color = '#f66a2c';

  // default chart options
  var chart_options = {
    chartArea: {width: '50%'},
    legend: 'none',
    hAxis: {
      title: 'Unauthorized workers 16 years and older',
      minValue: 0
    },
    vAxis: {
      title: 'Top Industries'
    }
  };

  var counties = {
    'Bexar': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 12000, '#f66a2c', '26%' ],
        ['Arts & ent.*', 9000, 'f66a2c', '19%' ],
        ['Prof. & admin.**', 6000, '#f66a2c', '12%' ],
        ['Other services***', 5000, '#f66a2c', '10%' ],
        ['Edu. & health ****', 5000, 'color: #f66a2c', '9%' ]
      ],
      chart_title: 'Bexar County (San Antonio)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)<br/>****Educational, health, and social services'
    },
    'Collin': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Arts & Ent.*', 4000, '#f66a2c', '17%' ],
        ['Prof. & admin.**', 4000, 'f66a2c', '15%' ],
        ['Construction', 3000, '#f66a2c', '12%' ],
        ['Retail Trade', 2000, '#f66a2c', '12%' ],
      ],
      chart_title: 'Collin County (McKinney)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management'
    },
    'Cameron': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Edu. & Health*', 3000, '#f66a2c', '17%' ],
        ['Construction', 3000, 'f66a2c', '15%' ],
        ['Prof. & admin.**', 2000, '#f66a2c', '12%' ],
        ['Other services***', 2000, '#f66a2c', '12%' ],
        ['Arts & Ent. ****', 2000, 'color: #f66a2c', '11%' ]
      ],
      chart_title: 'Cameron County (Brownsville)',
      chatter: '*Educational, health, and social services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)<br/>****Arts, entertainment, recreation, accommodation, and food services'
    },
    'Dallas': {
      chart_data: [
       ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
       ['Construction', 45000, '#f66a2c', '28%' ],
       ['Arts & Ent.*', 29000, '#f66a2c', '18%' ],
       ['Prof. & Admin**', 20000, '#f66a2c', '13%' ],
       ['Manufacturing', 18000, 'color: #f66a2c', '11%' ],
       ['Other Services***', 14000, 'color: #f66a2c', '9%' ],
      ],
      chart_title: 'Dallas County (Dallas)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)'
    },
    'Denton': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Prof. & Admin*', 4000, '#f66a2c', '22%' ],
        ['Arts & Ent.**', 2000, 'color: #f66a2c', '19%' ],
        ['Construction', 2000, 'color: #f66a2c', '13%' ],
      ],
      chart_title: 'Denton County (Denton)',
      chatter: '*Professional, scientific, management, administrative, and waste management<br/>**Arts, entertainment, recreation, accommodation, and food services'
    },
    'El-Paso': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Arts & Ent.*', 4000, '#f66a2c', '17%' ],
        ['Prof. & admin.**', 4000, 'f66a2c', '15%' ],
        ['Construction', 3000, '#f66a2c', '12%' ],
        ['Retail Trade', 2000, '#f66a2c', '12%' ],
      ],
      chart_title: 'El Paso County (McKinney)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management'
    },
    'Fort-Bend': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 3000, '#f66a2c', '19%' ]
      ],
      chart_title: 'Fort Bend County (Richmond)',
      chatter: 'Note: Limited data provided for Fort Bend County.'
    },
    'Harris': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 66000, '#f66a2c', '25%' ],
        ['Arts & Ent.*', 43000, '#f66a2c', '17%' ],
        ['Prof. & Admin**', 34000, '#f66a2c', '13%'],
        ['Other Services***', 28000, '#f66a2c', '11%' ],
        ['Manufacturing', 25000, '#f66a2c', '10%' ],
      ],
      chart_title: 'Harris County (Houston)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)'
    },
    'Hidalgo': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 9000, '#f66a2c', '17%' ],
        ['Edu. & Health*', 8000, '#f66a2c', '14%' ],
        ['Retail Trade', 7000, '#f66a2c', '14%' ],
        ['Prof. & Admin**', 7000, '#f66a2c', '12%' ],
        ['Other Services***', 6000, '#f66a2c', '11%' ],
      ],
      chart_title: 'Hidalgo County (Edinburg)',
      chatter: '*Educational, health, and social services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)'
    },
    'Montgomery-Chambers-Liberty': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Arts & Ent.*', 5000, '#f66a2c', '24%' ],
        ['Construction', 3000, '#f66a2c', '17%' ],
        ['Prof. & Admin**', 3000, '#f66a2c', '13%' ],
      ],
      chart_title: 'Montgomery, Chambers, and Liberty Counties (Conroe, Anahuac, Liberty)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management'
    },
    'Tarrant': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 16000, '#f66a2c', '25%' ],
        ['Arts & Ent.*', 11000, '#f66a2c', '17%' ],
        ['Manufacturing', 9000, '#f66a2c', '14%' ],
        ['Prof. & Admin**', 9000, '#f66a2c', '14%' ],
        ['Other Services***', 5000, '#f66a2c', '7%' ],
      ],
      chart_title: 'Tarrant County (Fort Worth)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)'
    },
    'Travis': {
      chart_data: [
       ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
       ['Construction', 18000, '#f66a2c', '33%' ],
       ['Arts & Ent.*', 11000, '#f66a2c', '19%' ],
       ['Prof. & Admin**', 8000, '#f66a2c', '14%' ],
       ['Other Services***', 5000, '#f66a2c', '9%' ],
       ['Retail Trade', 4000, '#f66a2c', '7%' ],
      ],
      chart_title: 'Travis County (Austin)',
      chatter: '*Arts, entertainment, recreation, accommodation, and food services<br/>**Professional, scientific, management, administrative, and waste management<br/>***Other services (except public administration)'
    },
    'Webb': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 2000, '#f66a2c', '14%' ],
        ['Edu. & Health*', 2000, '#f66a2c', '13%' ],
        ['Arts & Ent.**', 2000, '#f66a2c', '13%' ],
        ['Transp. & Warehousing', 2000, '#f66a2c', '13%' ],
        ['Other Services***', 2000, '#f66a2c', '12%' ],
      ],
      chart_title: 'Webb County (Laredo)',
      chatter: 'Note: All industries total 2,000 unauthorized workers, but percentage of workers by industry varies.<br/><br/>*Educational, health, and social services<br/>**Arts, entertainment, recreation, accommodation, and food services<br/>***Other services (except public administration)'
    }
  }

  // function to update the viz -- argument is county name
  // redraws chart, higlights correct county SVG, loads new subhead/chatter
  function updateViz(county) {

    // bail if this county is already selected
    if (county === current_county) {
      return;
    }

    // otherwise, set new `current_county` value
    current_county = county;

    // empty chart div
    chart_div.innerHTML = '';

    // fetch record from counties object
    var record = counties[county];

    // chart data
    var data = google.visualization.arrayToDataTable(record.chart_data);
    
    // chart title -- set new title in options object, too
    var title = record.chart_title;
    chart_options.title = title;

    // make the chart
    var chart = new google.visualization.BarChart(chart_div);
    chart.draw(data, chart_options);

    // update chatter
    $map_desc.html(counties[county].chatter);

  }

  // set callback to draw first chart
  google.charts.setOnLoadCallback(function() {
    updateViz('Travis');
  });

  // click event for SVG els
  $regions.on('click', function(){
    var selected_region = $(this).attr('id');

    // handle one county
    $regions.css('fill', map_default_color);

    // handle mcl group, including path instead of polygon
    $regions.find('polygon').css('fill', map_default_color);
    $regions.find('path').css('fill', map_default_color);

    if (selected_region === 'Montgomery-Chambers-Liberty') {
      $(this).find('polygon').css('fill', map_highlight_color);
      $(this).find('path').css('fill', map_highlight_color);
    } else {
      $(this).css('fill', map_highlight_color);
    }

    updateViz(selected_region);
  });

  // click event for dropdown buttons
  $(".dropdown-button").on('click', function() {
    var $button = $(this);
    var $menu = $button.siblings(".dropdown-menu");

    $menu.toggleClass("show-menu");

    $menu.children("li").click(function() {

    var selected_county = $(this).attr('data-county');    

    updateViz(selected_county);

    // loop over regions and highlight the correct one

    // reset styles

    // handle one county
    $regions.css('fill', map_default_color);

    // handle mcl group, including path instead of polygon
    $regions.find('polygon').css('fill', map_default_color);
    $regions.find('path').css('fill', map_default_color);

    $regions.each(function(d) {
      // check for a match
      if ($(this).attr('id') === selected_county) {

        // handle if MCL
        if (selected_county === 'Montgomery-Chambers-Liberty') {
          $(this).find('polygon').css('fill', map_highlight_color);
          $(this).find('path').css('fill', map_highlight_color);
        } else {
          $(this).css('fill', map_highlight_color);
        }
      }
    });

    $menu.removeClass("show-menu");
    // $button.html($(this).html());

    });
  });

  $loading.hide();
  $interactive.show();

})(jQuery);