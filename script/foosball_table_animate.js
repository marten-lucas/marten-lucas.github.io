var s;



window.onload = function () {

s = Snap("#foosball_table");
	Snap.load("foosball_table.svg", function(f) {
		s.append(f);
		
		// add onclick function to wildcard ids "_move_"
		$( '[id*=_move_]' ).click( function() {
			console.log("moved: " +  this.id );
			rod_move(this);
		});
		
		$( '[id$=_up], [id$=_back], [id$=_front]' ).click( function() {
			console.log("tilt :" + this.id );
			rod_tilt_auto(this);
		});
		
		s.select('#ball').drag (ball_move, ball_start, ball_stop )
	});
	
};

var ball_move = function(dx,dy,x,y) {
    var clientX, clientY;
    if( (typeof dx == 'object') && ( dx.type == 'touchmove') ) {
        clientX = dx.changedTouches[0].clientX;
        clientY = dx.changedTouches[0].clientY;
        dx = clientX - this.data('ox');
        dy = clientY - this.data('oy');
    }
	
	var new_x = x - this.data('shiftX') ;
	var new_y =	y - this.data('shiftY');
	
	
	
	if ( new_x - this.data('radius') >= this.data('tableinside_left') && new_x + this.data('radius') <= this.data('tableinside_right') ) {
		var allow_move_x = true;
	} else {
		var allow_move_x = false;	
	};
	if ( new_y - this.data('radius') >= this.data('tableinside_top') && new_y + this.data('radius') <= this.data('tableinside_buttom') ) {
		var allow_move_y = true;
	} else {
		var allow_move_y = false;	
	};

	if (allow_move_x && allow_move_y) {
		this.attr({
						transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
					});
	};
	
};

var ball_start = function( x, y, ev) {
	if( (typeof x == 'object') && ( x.type == 'touchstart') ) {
        x.preventDefault();
        this.data('ox', x.changedTouches[0].clientX );
        this.data('oy', x.changedTouches[0].clientY );  
    }
	var ball_svg = s.select("#ball");
	var bb_ball = ball_svg.getBBox();
	
	let shiftX = x - bb_ball.cx;
	let shiftY = y - bb_ball.cy;
	this.data('shiftX', shiftX);
	this.data('shiftY', shiftY);
	this.data('radius', bb_ball.width/2);
	this.data('origTransform', this.transform().local );
	
	
	var table_svg = s.select("#table_field");
	var bb_table = table_svg.getBBox();
	
	this.data('tableinside_left',bb_table.x );
	this.data('tableinside_right',bb_table.x2 );
	this.data('tableinside_top', bb_table.y);
	this.data('tableinside_buttom', bb_table.y2);
};

var ball_stop = function() {
	// determine Zone
	var ball_svg = s.select("#ball");
	var bb_ball = ball_svg.getBBox();
		
	var field_zone_id = field_zone_id_get(bb_ball.cx,bb_ball.cy);
	
	// switch(field_zone_id) {
    // case "P1_1_zone":
	// case "P1_2_zone":
        // text = "Banana is good!";
        // break;
    // case "P1_5_zone":
	// case "P1_3_zone":    
		// text = "Banana is good!";
        // break;
	// case "P2_1_zone":
	// case "P2_2_zone":
        // text = "Banana is good!";
        // break;
    // case "P2_5_zone":
	// case "P2_3_zone":
		// text = "Banana is good!";
        // break;
    // } 
	
	var player1 = ["back","back","back","back"];
	var player2 = ["front","front","up","up"];
	
	tilt_rods(player1,player2);
};

function tilt_rods( player1 , player2 ) {
	
	var rods = ["1","2","5","3"];
	var tilts = ["up","back","front"];
	var player_arg = ["player1","player2"];
	var player_name = ["P1","P2"];
	
	
	for (var k = 0; k < player_name.length; k++) {
		for (var i = 0; i < rods.length; i++) {
			var new_tilt = eval(player_arg[k] + "[i]");
			if (tilts.includes(new_tilt)) {
				var rod_name = "P1_" + rods[i];
				rod_tilt_manual(rod_name, new_tilt);
			
			};
		
		};
	};
	
};

function field_zone_id_get(x,y) {
	var zone_id 
	$('[id$=_zone]').each(function(i, zone) {
	var zone_svg = s.select("#" + zone.id);
	var zone_bb = zone_svg.getBBox()
	if (Snap.path.isPointInsideBBox( zone_bb , x, y)) {
			zone_id = zone.id;
		};
	});	
	return zone_id;
};

function toggle_guides() {
	var checkbox_guides = document.getElementById("checkbox_toggle_guides");

    var guides = s.select('#guides')
	
	if (checkbox_guides.checked) {
		guides.attr({ display : "inline" });      
	} else {       
        guides.attr({ display : "none" });      
    }
}


function rod_selector_string(rod_id) {
	//get Player and rod from clicked arrow
	var rod_name = rod_id.substring(0, 4);
	// built selector for all layers of rod
	return "#" + rod_name + "_up,#" + rod_name + "_front,#" + rod_name + "_back";
}

function rod_id_get(rod) {
	// get id of clicked arrow	
	if (typeof(rod.id)== "undefined") {
		return rod_id = rod.target.id;
	} else {
		return rod_id = rod.id;
	};
	
};

function player_get(rod_id) {
	return rod_id.substr(0,2);
};

function is_P1 (rod_id) {
	var re_P1 = new RegExp("P1"); 	
	return re_P1.test(rod_id);
};

function is_P2 (rod_id) {
	var re_P2 = new RegExp("P2"); 	
	return re_P2.test(rod_id);
};

function rod_move(rod_arrow) {
	
	var rod_id = rod_id_get(rod_arrow); 
		
	var step_size = 3.75;
	//get Player and rod from clicked arrow
	var rod_selector = rod_selector_string(rod_id);
	// get svg of clicked arrow
	var arrow_clicked = s.select("#"+rod_id);
	
	var re_rod_direction = new RegExp("(away|toward)$");
	var rod_direction = rod_id.match(re_rod_direction)[1];
	
	
	
	// determine direction_factorfrom player and away/toward 
	if (rod_direction=="away" && is_P1(rod_id)) {
		var direction_factor= 1;
	};
	if (rod_direction=="toward" && is_P2(rod_id)) {
		var direction_factor= 1;
	};
	
	if (rod_direction=="away" && is_P2(rod_id)) {
		var direction_factor= -1;
	};
	if (rod_direction=="toward" && is_P1(rod_id)) {
		var direction_factor= -1;
	};
	
	// get bounding box of table field
	var svg_table = s.select("#table_field");
	var bb_table = svg_table.getBBox();
	
	// move visible tilt and set visibility of arrow clicked
	$(rod_selector).each(function(i, rod) {
		// check if rod is "active" 
		if (s.select("#"+rod.id).attr("display")=="inline"){
			// move rod
			var rod_svg = s.select("#"+rod.id);
			var matrix = rod_svg.transform().localMatrix
			
			matrix.f = matrix.f + step_size * direction_factor
			
			rod_svg.transform(matrix);
		
			//if further step would leave the field, hide the clicked arrow
			bb_rod = rod_svg.getBBox();
			
			if (( bb_rod.y2 + step_size * direction_factor ) < bb_table.y2 && (bb_rod.y + step_size * direction_factor ) > bb_table.y) {
				arrow_clicked.attr({ display : "inline" });   	
			} else {
				arrow_clicked.attr({ display : "none" });   	
			}
		}
		
	});	
	
	// move invisible tilts
	$(rod_selector).each(function(i, rod) {
		// check if rod is "active" 
		if (s.select("#"+rod.id).attr("display")=="none"){
			// move rod
			var rod_svg = s.select("#"+rod.id);
			var matrix = rod_svg.transform().localMatrix
			
			matrix.f = matrix.f + step_size * direction_factor
			
			rod_svg.transform(matrix);
		}
		
	});	
	
	// make the opposite arrow visible (step always possible) 
	var rod_name = rod_id.substring(0, 4)
	if (rod_direction == "toward" ) {
	var arrow_opposite = s.select("#" + rod_name + "_move_away");
	} else {
	var arrow_opposite = s.select("#" + rod_name + "_move_toward");
	};
	arrow_opposite.attr({ display : "inline" });   


};

function rod_tilt_manual( rod_name , new_tilt ) {
	var rod_selector = rod_selector_string(rod_name);
	$(rod_selector).each(function(i, tilt) {
		
		var tilt_svg = s.select("#" + tilt.id);
		
		if (tilt.id == new_tilt) {
			tilt_svg.attr({ display : "inline" }); 
		} else {
			tilt_svg.attr({ display : "none" });   
		};
	});
};

function rod_tilt_auto(rod_visible) {
	
	var new_tilt
	// get id of clicked arrow	
	var rod_id = rod_id_get(rod_visible)
	var rod_visible_svg = s.select("#"+rod_id);

	// if no new_tilt is given determine new tilt
	var re_isup = new RegExp("_up");
	var re_isfront = new RegExp("_front");
	if (re_isup.test(rod_id)) {
		new_tilt = rod_visible.id.substring(0, 4)+"_back";
	} else {
		if (re_isfront.test(rod_id)) {			
			new_tilt = rod_id.substring(0, 4)+"_back";
		} else {
			new_tilt = rod_id.substring(0, 4)+"_front";
		};
	};
	
	var new_tilt_svg = s.select("#" + new_tilt);
		
	// hide clicked and show new_tilt
	rod_visible_svg.attr({ display : "none" });   
	new_tilt_svg.attr({ display : "inline" });   
	
	
};