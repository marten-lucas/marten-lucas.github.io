var s

function init_save_load () {
	s = Snap("#foosball_table");
	$( '#btn_save_board' ).click( function() {
			saveBoard_btn_click();
		});

	$( '#btn_export_board' ).click( function() {
			exportBoard_btn_click();
		});
		
	$( '#btn_reset_board' ).click( function() {
			resetBoard_btn_click();
		});
	
	saved_position_init();
};

function resetBoard_btn_click () {
	location.reload(false); 
};

function exportBoard_btn_click() {
	board_export_png();
};

function saveBoard_btn_click() {
	var foosball_table = Snap('#foosball_table');
	download_SVG(foosball_table.toString(), 'foosboard.svg');
};


function download_SVG(content, fileName)
{
  var svgURL = blobURL(content, 'image/svg+xml');
  var newElem = document.createElement('a');
  newElem.href = svgURL;
  newElem.setAttribute('download', fileName);
  document.body.appendChild(newElem);
  newElem.click();
  document.body.removeChild(newElem);
}

function blobURL(content, contentType)
{
  var blob = new Blob([content], {type: contentType});
  return (window.URL || window.webkitURL).createObjectURL(blob);
}

function rods_hide() {
	
	$('[id*=_move_]').each(function(i, this_rod) {
		this_rod_svg = s.select("#" + this_rod.id);
		this_rod_svg.attr({ display : "none" });  
	});	
};

function rods_show() {
	
	$('[id*=_move_]').each(function(i, this_rod) {
		this_rod_svg = s.select("#" + this_rod.id);
		this_rod_svg.attr({ display : "inline" });  
	});	
};

var export_canvas = document.getElementById("export_canvas");

function board_export_png() {
	export_canvas.style.display="inline";
	rods_hide()
	
	var svgText = document.getElementById("foosball_table").outerHTML;
	var ctxt = export_canvas.getContext("2d");
	drawInlineSVG(ctxt, svgText, save_URL_local);
	
	rods_show()
	export_canvas.style.display="none";
};

var save_URL_local = function () {
	// Construct the <a> element
  var link = document.createElement("a");
  link.download = "foosboard_export.png";
  // Construct the uri
  link.href = export_canvas.toDataURL();
  document.body.appendChild(link);
  link.click();
  // Cleanup the DOM
  document.body.removeChild(link);
};

function drawInlineSVG(ctx, rawSVG, callback) {

    var svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svg),
        img = new Image;
    
    img.onload = function () {
		bb_table = s.getBBox();
		
		// @@TODO image is not sized correctly
		export_canvas.width = bb_table.width
		export_canvas.height = bb_table.height
		
        ctx.drawImage(this, 0, 0);     
        domURL.revokeObjectURL(url);
        callback(this);
    };
    
    img.src = url;
;}

function saved_position_init() {
	
	if (!$( "board_position" ).length) {
		$('#saved_positions_table').hide();
	};
	
	$( "board_position" ).each(function(i, this_pos) {
		var this_selector = "#tr_" + this_pos.id
		
		var this_tr = $(this_selector);
		//@@TODO: does not work! although item with id exists it is still cloned (can be tested with test init button)
		if (this_tr.length == 0) {
			saved_positions_table_addrow(this_pos.id);
		};
		
	});

	$('.btn_savedpos_set').click( function() {
		btn_row_set_click(this);
	});	
	
	$('.btn_savedpos_mirror').click( function() {
		btn_row_set_mirror(this);
	});
	
	$('.btn_savedpos_delete').click( function() {
		btn_row_set_delete(this);
	});
	

};

function saved_positions_table_addrow(new_id) {
	var clonedRow = $('tbody tr:first').clone();

	clonedRow.attr('id', "#tr_" + new_id)
	clonedRow.data('savedpos', new_id)
	$('#saved_positions_table').find($('tbody')).append(clonedRow);
	var btn_in_row = clonedRow.find($("button"));
	
	//@@TODO: update naming
	
	clonedRow.show();
};

function btn_row_set_click(btn) {
	var savedpos_tr = btn.closest( "tr" );
	var savedpos_id = savedpos_tr.id.replace('#tr_', '');
	
	if (btn.classList.contains( "btn_savedpos_setP1" )) {
		var player_id = "P1";
	} else {
		var player_id = "P2";
	};
	
	var roddata_id = savedpos_id+"_" + player_id + "_";
	
	$( '[id^=' + roddata_id +']' ).each(function(i, this_roddata) {
		var roddata_val = parseFloat(this_roddata.innerHTML);
		var roddata_tilt = this_roddata.getAttribute('tilt');
		var roddata_tilt_bak = this_roddata.getAttribute('tilt_bak');
		var mirror_position = false
		var rod_id = this_roddata.getAttribute('rod');;
		
		if ($.isFunction(rod_position_set)) {
			rod_position_set(rod_id, roddata_val, roddata_tilt, roddata_tilt_bak, mirror_position);
		};
	});
};

function btn_row_set_mirror(btn) {
	console.log("mirror: " + btn.innerText);
};

function btn_row_set_delete(btn) {
	console.log("delete: " + btn.innerText);
};
	

	

