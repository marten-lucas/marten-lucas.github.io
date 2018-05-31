

function move_rod(id,dir){
	alert("jetze");
}

function guides_off(){
	document.getElementById("guides").setAttribute("visibility","hidden");
}

function toggle_guides() {
	var checkbox_guides = document.getElementById("checkbox_toggle_guides");
    
    if (checkbox_guides.checked) {
        document.getElementById("guides").setAttribute("visibility","hidden");
    } else {       
        document.getElementById("guides").setAttribute("visibility","visible");  
    }
}