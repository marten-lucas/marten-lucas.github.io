var s

function init_save_load () {
	s = Snap("#foosball_table");
	$( '#btn_save_board' ).click( function() {
			saveBoard_btn_click();
		});
};


function saveBoard_btn_click() {
	rods_hide()
	var foosball_table = Snap('#foosball_table');
	download_SVG(foosball_table.toString(), 'foosboard.svg');
	rods_show()
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