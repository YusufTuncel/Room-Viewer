//globals
const canvas = document.getElementById('canvas');
const canvas_div = document.getElementById("canvas_div")
const ctx = canvas.getContext('2d');
const pixel_unit = 5;

const delete_button = document.getElementById("delete")
const create_popup = document.getElementById("create_square")
const set_properties = document.getElementById("set_properties")
const proj_name = document.getElementById("proj_name")
const files_list = document.getElementById('files');
const open_popup = document.getElementById('open_room');

const upload = document.getElementById('upload');

const properties = {
	name: document.getElementById("name"),
	x: document.getElementById("x"),
	y: document.getElementById("y"),
	w: document.getElementById("w"),
	h: document.getElementById("h"),
	r: document.getElementById("r")
}
const new_properties = {
	name: document.getElementById("new_name"),
	x: document.getElementById("new_x"),
	y: document.getElementById("new_y"),
	w: document.getElementById("new_w"),
	h: document.getElementById("new_h"),
	r: document.getElementById("new_r")
}

var saved = true;
var seleted_index = null;
var rects = [];

function onload(){
	//Create events
	canvas.addEventListener("mousedown", onClick);
	canvas.addEventListener("mousemove", onMove);
	canvas.addEventListener("mouseup", onClickUp);
	window.addEventListener("keyup", onKey)
    window.addEventListener("beforeunload", function (e) {
		saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
		if (saves == null){
			localStorage.setItem("RoomPlannerSaves", "[]")
			saves = []
		}
		if (!saved){
			if (save_index!=null){
				saves[save_index].open = false;
				localStorage.setItem("RoomPlannerSaves", JSON.stringify(saves))
			}
			
		}
		
        if (saved)
			return undefined;
		
        var confirmationMessage = 'Unsaved conent will be lost';
		if (confirm(confirmationMessage)){
			delete e['returnValue'];
		}else{
			e.preventDefault();
			e.returnValue = '';
		}
    });
	
	upload.onchange = onFileSelect
	
	var onKeyPress = (event) => {return event.charCode === 0 || /[0-9x\+\-\*\/\%\.]/.test(String.fromCharCode(event.charCode));};
	var i = 0;
	for (const [key, value] of Object.entries(properties)){
		if (i==0){i++;continue}
		value.onkeypress = onKeyPress
		value.onpaste = event => false;
	}
	i = 0
	for (const [key, value] of Object.entries(new_properties)){
		if (i==0){i++;continue}
		value.onkeypress = onKeyPress
		value.onpaste = event => false;
	}
	
	document.getElementById("new_room").style.display="block"
	

    
}
