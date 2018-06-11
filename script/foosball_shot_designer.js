var number_goalpositions 
var s
var visible_goalposition_svg
var visible_goalposition_id
var svg_shotlayer 
var edit_mode_active = false
var svg_shotline_selected

function init_shotdesigner () {
	s = Snap("#foosball_table");
	
	svg_shotlayer = s.select("#shots");
	
	$( '[id^=btn_addshot_]' ).click( function() {
			addShot_btn_click(this);
		});
	
	$( '[id^=btntoggle_goalpos]' ).click( function() {
			goal_position_toggle(this);
		});
		
	$( '[id^=btn_save_shot]' ).click( function() {
			saveShot_btn_click(this);
		});
		
	$( '[id^=btn_save_shot]' ).hide();
	
	goalposition_set("3", true);
	
	s.select('#lineend').drag (lineend_move, lineend_start, lineend_stop )
	
	s.select('#linestart').drag (linestart_move, linestart_start, linestart_stop )
	
	
};




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
	

	
	
}


function addShot_btn_click(btn) {
	var shot_type = btn.id.replace("btn_addshot_","");
	svg_default_shot = shot_defaultadd(shot_type);
	
	shotline_select(svg_default_shot);
	
};


function saveShot_btn_click(btn) {
	if (edit_mode_active) {
		shotline_deselect();
	};
};

var  shotline_clicked = function() {
	
	shotline_select(this)
	
};

function shotline_deselect () {
	edit_mode_active = false
	
	var svg_goal_p1 = s.select("#P1_goal_" + number_goalpositions + "pos");
	svg_goal_p1.attr({ display : "none" });      
	
	var svg_goal_p2 = s.select("#P2_goal_" + number_goalpositions + "pos");
	svg_goal_p2.attr({ display : "none" });  

	svg_shotline_selected.attr({ "stroke-dasharray" :  "none" });    	
	
	var svg_lineend = s.select("#lineend");
	svg_lineend.attr({ display : "none" });   
	
	var svg_lineend = s.select("#linestart");
	svg_lineend.attr({ display : "none" });   	
	
	$( '[id^=btn_save_shot]' ).hide();
};

function shotline_select(trigger_shot) {
	
	edit_mode_active = true
	
	var svg_goal_p1 = s.select("#P1_goal_" + number_goalpositions + "pos");
	svg_goal_p1.attr({ display : "inline" });      
	
	var svg_goal_p2 = s.select("#P2_goal_" + number_goalpositions + "pos");
	svg_goal_p2.attr({ display : "inline" });   	
	
	
	trigger_shot.attr({ "stroke-dasharray" :  "15, 5" });   
	
	var svg_lineend = s.select("#lineend");
	svg_lineend.attr({ display : "inline" });   	
	lineend_position_set(trigger_shot)

	var svg_lineend = s.select("#linestart");
	svg_lineend.attr({ display : "inline" });   	
	linestart_position_set(trigger_shot)
	
	svg_shotline_selected = trigger_shot
	
	
	$( '[id^=btn_save_shot]' ).show();

};

function lineend_position_set(svg_shotline) {
	
	var svg_lineend = s.select("#lineend");
	var bb_lineend = svg_lineend.getBBox();
	
	var new_x = svg_shotline.attr("x2")
	var new_y = svg_shotline.attr("y2")
	var dx = new_x - bb_lineend.cx ;
	var dy = new_y - bb_lineend.cy;
	var origTransform = svg_lineend.transform().local
	
	svg_lineend.attr({
						transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
					});
};

function linestart_position_set(svg_shotline) {
	
	var svg_linestart = s.select("#linestart");
	var bb_linestart = svg_linestart.getBBox();
	
	var new_x = svg_shotline.attr("x1")
	var new_y = svg_shotline.attr("y1")
	var dx = new_x - bb_linestart.cx ;
	var dy = new_y - bb_linestart.cy;
	var origTransform = svg_linestart.transform().local
	
	svg_linestart.attr({
						transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
					});
};

function shot_defaultadd(shot_type) {
	
	var ball_zone = ball_zone_id_get();
	var goal_id = default_targetgoal_id_get(ball_zone) 
	
	var target_position = 3
	var svg_ball = s.select("#ball")
	var bb_ball = svg_ball.getBBox();
	var ball_diameter = bb_ball.height
	
	var targetbox_name = goal_id + "_" + target_position
	
	var svg_taget = s.select("#" + targetbox_name);
	var bb_target = svg_taget.getBBox();

	// MAGIC VALUE!!!!
	var target_y = bb_target.cy - 50
	

	if (goal_id.substring(0,2)=="P1") {
		var target_x = bb_target.x + 40
	} else {
		var target_x = bb_target.x2 + 20
	};
		
	var svg_shotline = svg_shotlayer.line(bb_ball.cx,bb_ball.cy, target_x, target_y);
    svg_shotline.attr({strokeWidth:ball_diameter,stroke:"yellow",strokeLinecap:"butt"});
	
	var unique_id = "user_shot_" + svg_shotline.id;
	
	svg_shotline.id = unique_id;
	
	svg_shotline.click(shotline_clicked)
	
	console.log("create shot on Pos." +target_position + " of " + goal_id);
	
	return svg_shotline
	
};



function default_targetgoal_id_get(ball_zone) {
	if (ball_zone.substring(0,2)=="P1") {
		var oppenent_id = "P2"
	} else {
		var oppenent_id = "P1"
	};
		
	return oppenent_id + "_goal_" + number_goalpositions + "pos"
};


var lineend_move = function(dx,dy,x,y) {
	if (edit_mode_active) {   
		var clientX, clientY;
		if( (typeof dx == 'object') && ( dx.type == 'touchmove') ) {
			clientX = dx.changedTouches[0].clientX;
			clientY = dx.changedTouches[0].clientY;
			dx = clientX - this.data('ox');
			dy = clientY - this.data('oy');
		}
		
		var new_x = x - this.data('shiftX') ;
		var new_y =	y - this.data('shiftY');
		
		var bb_svg = s.getBBox();
		
		
		if ( new_x - this.data('radius') >= bb_svg.x && new_x + this.data('radius') <= bb_svg.x2 ) {
			var allow_move_x = true;
		} else {
			var allow_move_x = false;	
		};
		
		if ( new_y - this.data('radius') >= bb_svg.y && new_y + this.data('radius') <= bb_svg.y2 ) {
			var allow_move_y = true;
		} else {
			var allow_move_y = false;	
		};

		if (allow_move_x && allow_move_y) {
			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
			});
			
			svg_shotline_selected.attr({
				x2 : new_x ,
				y2 : new_y 
			});
		};
	};
};

var lineend_start = function( x, y, ev) {
	if (edit_mode_active) {
	
		if( (typeof x == 'object') && ( x.type == 'touchstart') ) {
			x.preventDefault();
			this.data('ox', x.changedTouches[0].clientX );
			this.data('oy', x.changedTouches[0].clientY );  
		}
		var lineend_svg = s.select("#lineend");
		var bb_lineend = lineend_svg.getBBox();
		
		let shiftX = x - bb_lineend.cx;
		let shiftY = y - bb_lineend.cy;
		this.data('shiftX', shiftX);
		this.data('shiftY', shiftY);
		this.data('radius', bb_lineend.width/2);
		this.data('origTransform', this.transform().local );
		
		
		var table_svg = s.select("#table_field");
		var bb_table = table_svg.getBBox();
		
		this.data('tableinside_left',bb_table.x );
		this.data('tableinside_right',bb_table.x2 );
		this.data('tableinside_top', bb_table.y);
		this.data('tableinside_buttom', bb_table.y2);
	
	};
};

var lineend_stop = function() {
	
	console.log("lineend moved")
	
};

var linestart_move = function(dx,dy,x,y) {
	if (edit_mode_active) {   
		var clientX, clientY;
		if( (typeof dx == 'object') && ( dx.type == 'touchmove') ) {
			clientX = dx.changedTouches[0].clientX;
			clientY = dx.changedTouches[0].clientY;
			dx = clientX - this.data('ox');
			dy = clientY - this.data('oy');
		}
		
		var new_x = x - this.data('shiftX') ;
		var new_y =	y - this.data('shiftY');
		
		var bb_svg = s.getBBox();
		
		
		if ( new_x - this.data('radius') >= bb_svg.x && new_x + this.data('radius') <= bb_svg.x2 ) {
			var allow_move_x = true;
		} else {
			var allow_move_x = false;	
		};
		
		if ( new_y - this.data('radius') >= bb_svg.y && new_y + this.data('radius') <= bb_svg.y2 ) {
			var allow_move_y = true;
		} else {
			var allow_move_y = false;	
		};

		if (allow_move_x && allow_move_y) {
			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
			});
			
			svg_shotline_selected.attr({
				x1 : new_x ,
				y1 : new_y 
			});
		};
	};
};

var linestart_start = function( x, y, ev) {
	if (edit_mode_active) {
	
		if( (typeof x == 'object') && ( x.type == 'touchstart') ) {
			x.preventDefault();
			this.data('ox', x.changedTouches[0].clientX );
			this.data('oy', x.changedTouches[0].clientY );  
		}
		var linestart_svg = s.select("#linestart");
		var bb_linestart = linestart_svg.getBBox();
		
		let shiftX = x - bb_linestart.cx;
		let shiftY = y - bb_linestart.cy;
		this.data('shiftX', shiftX);
		this.data('shiftY', shiftY);
		this.data('radius', bb_linestart.width/2);
		this.data('origTransform', this.transform().local );
		
		
		var table_svg = s.select("#table_field");
		var bb_table = table_svg.getBBox();
		
		this.data('tableinside_left',bb_table.x );
		this.data('tableinside_right',bb_table.x2 );
		this.data('tableinside_top', bb_table.y);
		this.data('tableinside_buttom', bb_table.y2);
	
	};
};

var linestart_stop = function() {
		console.log("linestart moved")
	
};