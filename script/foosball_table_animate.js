var s 

window.onload = function () {

s = Snap("#foosball_table");
Snap.load("foosball_table.svg", function(f) {
	s.append(f);
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


function rod_move(evt) {
	var step_size = 5
	var rod_name = evt.target.id.substring(0, 4);
	var rod_selector = "#"+rod_name+"_up,#"+rod_name+"_front,#"+rod_name+"_back";
	var arrow_clicked = s.select("#"+evt.target.id);
	

	
	switch (true) {
      case /away/.test(evt.target.id) && /P1/.test(evt.target.id): 
	  case /toward/.test(evt.target.id) && /P2/.test(evt.target.id):
        var direction = 1;
        break;
      case /toward/.test(evt.target.id) && /P1/.test(evt.target.id):
	  case /away/.test(evt.target.id) && /P2/.test(evt.target.id):
        var direction = -1;
        break;
      default:
        var direction = 0;
        break;
    };

	var table = s.select("#table");
	var bb_table = table.getBBox();
	
	$(rod_selector).each(function(i, rod) {
		
		var rod_svg = s.select("#"+rod.id);
		var matrix = rod_svg.transform().localMatrix
				
		matrix.f = matrix.f + step_size * direction
		rod_svg.transform(matrix);
	
		//check if further step is possible
		bb_rod = rod_svg.getBBox();
		
		// if (rod_svg.attr("display")=="inline" & bb_rod.Y2 + step_size * direction < bb_table.Y2 && bb_rod.Y + step_size * direction >bb_table.Y) {
		// arrow_clicked.attr({ display : "inline" });   	
		// } else {
		// arrow_clicked.attr({ display : "none" });   	
		// }
		
		
	});	
	
	if (/toward/.test(evt.target.id)) {
	var arrow_opposite = s.select("#" + rod_name + "_move_away");
	} else {
	var arrow_opposite = s.select("#" + rod_name + "_move_toward");
	};
	arrow_opposite.attr({ display : "inline" });   


};



 




