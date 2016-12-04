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
  var $map_header = $('.region-map-header');
  var $map_desc = $('.region-map-desc');

  // a var to keep track of currently selected county
  var current_county;

  // default chart options
  var chart_options = {
    chartArea: {width: '50%'},
    legend: 'none',
    hAxis: {
      title: 'Eligible unauthorized workers',
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
      chatter: ''
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
      chatter: ''
    },
    'Cameron': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Edu. & Health****', 3000, '#f66a2c', '17%' ],
        ['Construction', 3000, 'f66a2c', '15%' ],
        ['Prof. & admin.**', 2000, '#f66a2c', '12%' ],
        ['Other services***', 2000, '#f66a2c', '12%' ],
        ['Arts & Ent. *', 2000, 'color: #f66a2c', '11%' ]
      ],
      chart_title: 'Cameron County (Brownsville)',
      chatter: ''
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
      chatter: ''
    },
    'Denton': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Prof. & Admin**', 4000, '#f66a2c', '22%' ],
        ['Arts & Ent.*', 2000, 'color: #f66a2c', '19%' ],
        ['Construction', 2000, 'color: #f66a2c', '13%' ],
      ],
      chart_title: 'Denton County (Denton)',
      chatter: ''
    },
    'El Paso': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Arts & Ent.*', 4000, '#f66a2c', '17%' ],
        ['Prof. & admin.**', 4000, 'f66a2c', '15%' ],
        ['Construction', 3000, '#f66a2c', '12%' ],
        ['Retail Trade', 2000, '#f66a2c', '12%' ],
      ],
      chart_title: 'El Paso County (McKinney)',
      chatter: ''
    },
    'Fort Bend': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 3000, '#f66a2c', '19%' ]
      ],
      chart_title: 'Fort Bend County (Richmond)',
      chatter: ''
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
      chatter: ''
    },
    'Hidalgo': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 9000, '#f66a2c', '17%' ],
        ['Edu. & Health****', 8000, '#f66a2c', '14%' ],
        ['Retail Trade', 7000, '#f66a2c', '14%' ],
        ['Prof. & Admin**', 7000, '#f66a2c', '12%' ],
        ['Other Services***', 6000, '#f66a2c', '11%' ],
      ],
      chart_title: 'Hidalgo County (Edinburg)',
      chatter: ''
    },
    'Montgomery-Chambers-Liberty': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Arts & Ent.*', 5000, '#f66a2c', '24%' ],
        ['Construction', 3000, '#f66a2c', '17%' ],
        ['Prof. & Admin**', 3000, '#f66a2c', '13%' ],
      ],
      chart_title: 'Montgomery, Chambers, and Liberty Counties (Conroe, Anahuac, Liberty)',
      chatter: ''
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
      chatter: ''
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
      chatter: ''
    },
    'Webb': {
      chart_data: [
        ['Industry', '', { role: 'style' }, { role: 'annotation' } ],
        ['Construction', 2000, '#f66a2c', '14%' ],
        ['Edu. & Health****', 2000, '#f66a2c', '13%' ],
        ['Arts & Ent.*', 2000, '#f66a2c', '13%' ],
        ['Transp. & Warehousing', 2000, '#f66a2c', '13%' ],
        ['Other Services***', 2000, '#f66a2c', '12%' ],
      ],
      chart_title: 'Webb County (Laredo)',
      chatter: ''
    }
  }

  console.log(counties);

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
  }

  // set callback to draw first chart
  google.charts.setOnLoadCallback(function() {
    updateViz('Travis');
  });

  // click event for SVG els
  $regions.on('click', function(){
    var selected_region = $(this).attr('id');

    $regions.find('polygon').css('fill','#a9a9a9');
    $(this).find('polygon').css('fill','#194256');

    $map_header.html(selected_region);
    $map_desc.html(counties[selected_region].chatter);

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

    $menu.removeClass("show-menu");
    // $button.html($(this).html());

    });
  });

  $loading.hide();
  $interactive.show();

})(jQuery);