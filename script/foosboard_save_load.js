var s
var mirror_positions = new Array;

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
			saved_positions_table_addrow(this_pos.id, this_pos.name, this_pos.getAttribute("player_id"));
		};
		
	});

	$('#btn_save_pos').click( function() {
		btn_pos_save_click(this);
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

function btn_pos_save_click () {
	
	var pos_name = $('#inputSavePosName').val();
	
	if ($('#player_id_save').is(':checked')) {
		var player_id = "P2";
	} else {
		var player_id = "P1";
	};
	position_save (pos_name, player_id);
	
	saved_position_init();
	
};

function position_save(pos_name,player_id){
	var d = new Date();
	var pos_id = "saved_pos_" + d.getTime();
	
	var new_boardpos = document.createElement('board_position');
	new_boardpos.name = pos_name;
	new_boardpos.id = pos_id;
	new_boardpos.setAttribute('player_id',player_id);
	$('board_positions').append(new_boardpos);
	
	
	var rod_id = ['1','2','5','3'];

		
	
	for (var i = 0; i < rod_id.length; i++) {
		var this_rodpos = document.createElement('rod_position');
		var this_rod_id = player_id + '_' + rod_id[i]
		this_rodpos.id = pos_id + "_" + this_rod_id;
		this_rodpos.setAttribute('rod', this_rod_id);
		this_rodpos.setAttribute('tilt', tilt_positions_get(this_rod_id));
		this_rodpos.setAttribute('tilt_bak', tilt_positions_get(this_rod_id, true));
		this_rodpos.innerHTML = rod_position_get(this_rod_id);
	
		new_boardpos.append(this_rodpos);
	};
	
	
	
};

function saved_positions_table_addrow(new_id, new_name, player_id) {
	var clonedRow = $('tbody tr:first').clone();

	clonedRow.attr('id', "#tr_" + new_id)
	clonedRow.data('savedpos', new_id)
	
	clonedRow.find('th:first').addClass(player_id);

	clonedRow.find('td:first').text(new_name);
	$('#saved_positions_table').find($('tbody')).append(clonedRow);
	
	
	clonedRow.show();
};

function btn_row_set_click(btn) {
	var savedpos_tr = btn.closest( "tr" );
	var savedpos_id = savedpos_tr.id.replace('#tr_', '');
	
	player_id = $( '#'+savedpos_id).attr('player_id');
	
	
	var roddata_id = savedpos_id+"_" + player_id + "_";
	
	$( '[id^=' + roddata_id +']' ).each(function(i, this_roddata) {
		var roddata_val = parseFloat(this_roddata.innerHTML);
		var roddata_tilt = this_roddata.getAttribute('tilt');
		var roddata_tilt_bak = this_roddata.getAttribute('tilt_bak');
		if ($.inArray(savedpos_id, mirror_positions)==0) {
			var mirror_position = false
		} else  {
			var mirror_position = true
		};
		var rod_id = this_roddata.getAttribute('rod');;
		
		if ($.isFunction(rod_position_set)) {
			rod_position_set(rod_id, roddata_val, roddata_tilt, roddata_tilt_bak, mirror_position);
		};
	});
};

function btn_row_set_mirror(btn) {
	var savedpos_tr = btn.closest( "tr" );
	var savedpos_id = savedpos_tr.id.replace('#tr_', ''); 
	
	if ($.inArray(savedpos_id, mirror_positions)==0) {
		mirror_positions.splice($.inArray(savedpos_id, mirror_positions),1);
		console.log("not mirroring: " + savedpos_id);
	} else {
		mirror_positions.push(savedpos_id);
		console.log("now mirroring: " + savedpos_id);
	};
};

function btn_row_set_delete(btn) {
	var savedpos_tr = btn.closest( "tr" );
	var savedpos_id = savedpos_tr.id.replace('#tr_', '');
	
	$( "#" + savedpos_id).remove();
	btn.closest( "tr" ).remove();
	
	console.log("delete: " + btn.innerText);
};
	

	

