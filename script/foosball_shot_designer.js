var number_goalpositions 
var s
var visible_goalposition_svg
var visible_goalposition_id
var svg_shots 
var shot_count = 0;
var svg_shot_selected 

function init_shotdesigner () {
	s = Snap("#foosball_table");
	
	svg_shots = s.select("#shots");
	
	$( '[id^=btn_addshot_pos]' ).click( function() {
			addShot_btn_click(this);
		});
	
	$( '[id^=btntoggle_goalpos]' ).click( function() {
			goal_position_toggle(this);
		});
	
	$('#check_5goalpos').change(function() {
      goal_position_toggle()
    })
	
	$(".dropdown-menu li a").click(function(){
		var selText = $(this).text();
		$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
});
	
	
	goalposition_set("3", true);
	
	
	
	shotlist_visible_set();
	
};

var shot_clicked = function () {
   svg_shot_selected_set(this)
};

function svg_shot_selected_set ( select_me ) {
	
	// deselect
	
	// select new
	svg_shot_selected = select_me
	
	
}

function shotlist_visible_set() {
	// if (shot_count > 0 ) {
		// $('#select_shots').show();
	// } else {
		// $('#select_shots').hide();
	// };
	
}

function goal_position_toggle() {
	if ($('#check_5goalpos').prop('checked')) {
		var number_pos = "5";
		
	} else{
		var number_pos = "3";
	};
	goalposition_set(number_pos);
};
			
function goalposition_show( zone_id ) {
	var player_id = zone_id.substr(0,2);
	var opposite_player_id
	
	if (player_id=="P1") {
		opposite_player_id = "P2";
	} else {
		opposite_player_id = "P1";
	};
	
	var layer_name = opposite_player_id + "_goal_" + number_goalpositions + "pos"
	
	var goal_position_svg = s.select("#" + layer_name);
	goal_position_svg.attr({ display : "inline" });     
	visible_goalposition_svg = goal_position_svg;
	visible_goalposition_id = layer_name;
}

function goalposition_hide() {
	visible_goalposition_svg.attr({ display : "none" });   
	visible_goalposition_svg = "undefined";
	visible_goalposition_id	= "undefined";
}

function goalposition_set( positions, force_toggle ) {
	force_toggle = force_toggle || false;
	
	number_goalpositions = positions;
	
	if (positions=="5") {
		$('#btn_addshot_pos2').show();
		$('#btn_addshot_pos4').show();
		if (force_toggle) {$('#check_5goalpos').bootstrapToggle('on')};
	} else {
		$('#btn_addshot_pos2').hide();
		$('#btn_addshot_pos4').hide();
		if (force_toggle) {$('#check_5goalpos').bootstrapToggle('off')};
	};
	
	
	
}

$('#dropdown_addshot').on('show.bs.dropdown', function () {
   goalposition_show( ball_zone_id_get() );
});


$('#dropdown_addshot').on('hide.bs.dropdown', function () {
  goalposition_hide();
});

function addShot_btn_click(btn) {
	var target_pos = btn.id.slice(-1);
	var goal_id = visible_goalposition_id
	shot_add(target_pos,goal_id );
};

function shot_add(target_position, goal_id) {
	
	var svg_ball = s.select("#ball")
	var bb_ball = svg_ball.getBBox();
	var ball_diameter = bb_ball.height
	
	var targetbox_name = goal_id+"_"+target_position
	
	var svg_taget = s.select("#" + targetbox_name);
	var bb_target = svg_taget.getBBox();
	
	var target_y = bb_target.cy - 50
	
	// MAGIC VALUE!!!!
	if (goal_id.substring(0,2)=="P1") {
		var target_x = bb_target.x + 40
	} else {
		var target_x = bb_target.x2 + 20
	};
	

	
	var svg_shotline = svg_shots.line(bb_ball.cx,bb_ball.cy, target_x, target_y);
    svg_shotline.attr({strokeWidth:ball_diameter,stroke:"yellow",strokeLinecap:"butt"});
	
	console.log("create shot on Pos." +target_position + " of " + goal_id);
	
	shot_count = shot_count + 1;
	
	svg_shotline.click( shot_clicked );
	
	shotlist_visible_set();
	
	
};


