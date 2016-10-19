var bowlersTemplate = '\
<tr>\
  <td>{{name}}</td>\
  <td>{{overs}}</td>\
  <td>{{maidens}}</td>\
  <td>{{runs}}</td>\
  <td>{{wickets}}</td>\
  <td>{{economy_rate}}</td>\
  <td>{{0s}}</td>\
  <td>{{4s}}</td>\
  <td>{{6s}}</td>\
</tr>\
'

var batsmenTemplate = '\
<tr>\
  <td>{{name}}</td>\
  <td>{{runs}}</td>\
  <td>{{balls}}</td>\
  <td>{{4s}}</td>\
  <td>{{6s}}</td>\
  <td>{{strike_rate}}</td>\
</tr>\
'

var teamSummary = '\
<h2>{{name}}</h2>\
<h3>{{runs}}/{{wicket}} ({{over_played}} Ov)</h3>\
'

var liveMatch = '\
<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">\
  <a href="{{scorecardURL}}">\
    <div class="card card-default z-depth card-wp">\
      <div class="card-body">\
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
          <div>{{team_a}}</div>\
          <div>{{team_a_require}}</div>\
          <div>{{team_a_summary}}</div>\
        </div>\
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
          <div>{{team_b}}</div>\
          <div>{{team_b_require}}</div>\
          <div>{{team_b_summary}}</div>\
        </div>\
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
          <span>{{result}}</span>\
        </div>\
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
          <span class="pull-left">{{match_start_time}}, </span>\
          <span>{{overs}} overs</span>\
          <span id="matchStatus" class="pull-right btn-danger">LIVE</span>\
        </div>\
      </div>\
    </div>\
  </a>\
</div>\
'
var upcomingMatch = '\
<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">\
  <div class="card card-default z-depth card-wp">\
    <div class="card-body">\
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
        <div>{{team_a}}</div>\
      </div>\
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
        <div>{{team_b}}</div>\
      </div>\
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
        Match scheduled to beign at {{time}}\
      </div>\
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
        <span class="pull-left">{{match_start_time}}, </span>\
        <span>{{overs}} overs</span>\
        <span class="pull-right btn-warning">UPCOMING</span>\
      </div>\
    </div>\
  </div>\
</div>\
'

var pastMatch = '\
<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">\
  <div class="card card-default z-depth card-wp">\
    <div class="card-body">\
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
        <div>{{team_a}}</div>\
        <div>{{team_a_summary}}</div>\
      </div>\
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\
        <div>{{team_b}}</div>\
        <div>{{team_b_summary}}</div>\
      </div>\
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
        <span>{{result}}</span>\
      </div>\
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\
        <span class="pull-left">{{match_start_time}}, </span>\
        <span>{{overs}} overs</span>\
        <span id="matchStatus" class="pull-right btn-success">PAST</span>\
      </div>\
    </div>\
  </div>\
</div>\
'
