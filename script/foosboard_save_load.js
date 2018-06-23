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
};

function resetBoard_btn_click () {
	location.reload(false); 
};

function exportBoard_btn_click() {
	board_export_png();
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

