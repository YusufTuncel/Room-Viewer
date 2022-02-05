var isDown = false;
function onClick(event){
	const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)
	var i = intersects_any({name:"", rect: new Rect(x, y, 1, 1)});
	var old = seleted_index
	
	if (i != -1){
		isDown = true;
		
		seleted_index = i;
		draw_all();
		delete_button.disabled = false;
		set_properties.disabled = false;
		
		properties.name.value = rects[seleted_index].name
		properties.x.value = rects[seleted_index].rect.x
		properties.y.value = rects[seleted_index].rect.y
		properties.w.value = rects[seleted_index].rect.w
		properties.h.value = rects[seleted_index].rect.h
		properties.r.value = rects[seleted_index].rect.angle
	} else {
		seleted_index = null;
		delete_button.disabled = true;
		set_properties.disabled = true;
		properties.name.value = ""
		properties.x.value = ""
		properties.y.value = ""
		properties.w.value = ""
		properties.h.value = ""
		properties.r.value = ""
	}
	
	if (old!=null)
		draw_all();
	
}
function onClickUp(event){
	//console.log(event);
	isDown = false;
}
function onMove(event){
	if (isDown && seleted_index!=null){
		saved = false;
		document.title = "Room Planner *"
		
		const rect = canvas.getBoundingClientRect()
		const x = ((event.clientX - rect.left)) - (rects[seleted_index].rect.w/2)
		const y = ((event.clientY - rect.top)) - (rects[seleted_index].rect.h/2)
		
		console.log(seleted_index);
	
		rects[seleted_index].rect.x = x;
		rects[seleted_index].rect.y = y;
		properties.x.value = x
		properties.y.value = y
		
		draw_all();
	}
}
function onKey(event){
	console.log(event.key)
	if (event.key === "Enter")
		setProperties();
	else if (event.key === "ArrowUp"){
		if (seleted_index!=null)
			rects[seleted_index].rect.y -= 1
		draw_all();
	} else if (event.key === "ArrowDown"){
		if (seleted_index!=null)
			rects[seleted_index].rect.y += 1
		draw_all();
	} else if (event.key === "ArrowLeft"){
		if (seleted_index!=null)
			rects[seleted_index].rect.x -= 1
		draw_all();
	} else if (event.key === "ArrowRight"){
		if (seleted_index!=null)
			rects[seleted_index].rect.x += 1
		draw_all();
	}
	
}


function onFileSelect(event){
	console.log(event, upload.files[0]);
	up_load(upload.files[0])
}


function create_square(){
	create_popup.style.display = "block";
	
	new_properties.name.value = "New Object";
	new_properties.x.value = "0";
	new_properties.y.value = "0";
	new_properties.w.value = "100";
	new_properties.h.value = "100";
	new_properties.r.value = "0";
}

function delete_square(){
	saved = false;
	document.title = "Room Planner *"
	if (seleted_index != null){
		rects.splice(seleted_index, 1);
		seleted_index = null;
		delete_button.disabled = true;
		draw_all();
	}
}

function create_new(){
	saved = false;
	document.title = "Room Planner *"
	create_popup.style.display = "none";
	
	try{
		rects.push({name: new_properties.name.value, rect: new Rect(validate_number(new_properties.x.value), validate_number(new_properties.y.value), validate_number(new_properties.w.value), validate_number(new_properties.h.value), validate_number(new_properties.r.value))})
	}catch{
		alert("Invalid input")
	}
	draw_all();
}
function create_new_room(){
	ctx.canvas.width = document.getElementById('room_w').value;
	ctx.canvas.height = document.getElementById('room_h').value;
	open_popup.style.display = 'none';
	document.getElementById('new_room').style.display='none';
	save_id = new_id();
	save_index = null;
	
	for (var id of ["new", "create", "save", "download"])
		document.getElementById(id).disabled = false;
	
	draw_all();
}

function setProperties(){
	saved = false;
	document.title = "Room Planner *"
	if (seleted_index!=null){
		try{
			rects[seleted_index].name = properties.name.value
			rects[seleted_index].rect.x = validate_number(properties.x.value)
			rects[seleted_index].rect.y = validate_number(properties.y.value)
			rects[seleted_index].rect.w = validate_number(properties.w.value)
			rects[seleted_index].rect.h = validate_number(properties.h.value)
			rects[seleted_index].rect.angle = validate_number(properties.r.value)
		}catch{
			alert("Invalid input")
		}
		
		draw_all();
	}
}
var regex = /[0-9\+\*\/\-\.]+/;
function validate_number(string){
	var s = string.toUpperCase().replaceAll("X", "*").replaceAll("DIV", "/").replaceAll("MOD", "%").replaceAll("^", "**");
	if (s.match(regex)[0] === s){
		return eval(s)
	}
	throw new Error("Invalid string")
}