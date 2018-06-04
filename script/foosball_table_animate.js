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
			rod_tilt(this);
		});
	});
	
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
	
	// get bounding box of table
	var table = s.select("#table");
	var bb_table = table.getBBox();
	
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



function rod_tilt(rod_clicked, new_tilt) {
	// new_tilt as optional argument
	new_tilt = new_tilt || 'automatic';
	
	// get id of clicked arrow	
	var rod_id = rod_id_get(rod_clicked)
	
	// set position of all tilts equal to the clicked
	var rod_clicked_svg = s.select("#"+rod_id);
	var matrix_visible = rod_clicked_svg.transform().localMatrix;
	var rod_selector=rod_selector_string(rod_id);
	
	$(rod_selector).each(function(i, rod_display) {
		var tilt_svg = s.select("#" + rod_display.id);
		var matrix = tilt_svg.transform().localMatrix
		
		// matrix.f = matrix_visible.f 
		
		// tilt_svg.transform(matrix);
	});
		
	// if no new_tilt is given determine new tilt
	if (new_tilt == "automatic") {
		var re_isup = new RegExp("_up");
		var re_isfront = new RegExp("_front");
		if (re_isup.test(rod_id)) {
			new_tilt = rod_clicked.substring(0, 4)+"back";
		} else {
			if (re_isfront.test(rod_id)) {			
				new_tilt = rod_id.substring(0, 4)+"_back";
			} else {
				new_tilt = rod_id.substring(0, 4)+"_front";
			};
		};
	};
	
	var new_tilt_svg = s.select("#" + new_tilt);
		
	// hide clicked and show new_tilt
	rod_clicked_svg.attr({ display : "none" });   
	new_tilt_svg.attr({ display : "inline" });   
	
	
};