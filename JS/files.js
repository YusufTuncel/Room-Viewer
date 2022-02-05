function to_save_format(list_of_rects){
	var new_obj = []
	for (var obj of list_of_rects)
		new_obj.push({name: obj.name, rect: [obj.rect.x, obj.rect.y, obj.rect.w, obj.rect.h ,obj.rect.angle]})
	return {w: ctx.canvas.width, h: ctx.canvas.height, name: proj_name.value, rects: new_obj}
}
function from_save_format(object){
	for (var i = 0; i < object.rects.length; i++)
		object.rects[i].rect = new Rect(...object.rects[i].rect)
	return object
}



function new_id(){
	id = Math.random();
	
	/*
	Math.random() shouldn't realy repeat (its such a large range)
	Comment this if speed is very slow saveing
	*/
	
	saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
	if (saves == null){
		localStorage.setItem("RoomPlannerSaves", "[]")
		saves = []
	}
	else 
		for (var save of saves)
			if (save !== null)
				if (save.id == id)
					return new_id();
	
	return id
}

function load_room(file){
	create_new_room()
	if (file === undefined){
		if (files_list.value!=""){
			saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
			
			save_index = parseInt(files_list.value)
			save_id = saves[save_index].id
			
			file = from_save_format(saves[save_index])
		}
	}
		
	rects = file.rects
	proj_name.value = file.name
	
	ctx.canvas.width = file.w
	ctx.canvas.height = file.h
	
	draw_all();
}

var save_index = null;
var save_id = Math.random();
function load(){
	if (!saved && !confirm('Unsaved conent will be lost')){
		return;
	}
	
	saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
	if (saves == null){
		localStorage.setItem("RoomPlannerSaves", "[]")
		saves = []
	}
	
	if (saves.length == 0){
		alert("No save files to load")
		return;
	}
	
	files_list.textContent = '';
	
	for (var i = 0; i < saves.length; i++){
		if (saves[i]!=null){
			var opt = document.createElement('option');
			opt.value = i;
			opt.innerHTML = saves[i].name;
			files_list.appendChild(opt);
		}
	}
	
	open_popup.style.display = 'block';
}
function save(){
	saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
	if (saves == null){
		localStorage.setItem("RoomPlannerSaves", "[]")
		saves = []
	}
	if (!saved){
		s = to_save_format(rects);
		
		if (save_index==null){
			save_id = new_id();
			s.id = save_id
			
			index = saves.findIndex((value) => {return value===null})
			console.log("found index at:", index)
			if (index==-1){
				save_index = saves.length
				saves.push(s)
			} else {
				save_index = index
				saves[save_index] = s
			}
		}else{
			s.id = save_id
			if (saves[save_index].id != save_id){
				if (!confirm("Save needs to overwite another save\nOveride (Ok)\nCreate new ID (Cancel)")){
					save_index = saves.length
					saves.push(s)
				}
			}
			saves[save_index] = s
		}
		
		localStorage.setItem("RoomPlannerSaves", JSON.stringify(saves))
		saved = true;
		
		document.title = "Room Planner - saved"
	}
}


function up_load(file){
	try{
		const reader = new FileReader()
		reader.onload = (event) => {
			load_room(from_save_format(JSON.parse(event.target.result)))
			
			saved = false;
			document.title = "Room Planner *"
		}
		reader.onerror = (error) => alert("Cannot open file, error: "+e)
		reader.readAsText(file)
	}catch (e){
		alert("Cannot open file, error: "+e)
		return
	}
}
function down_load(){
	var a = document.createElement("a");
    var file = new Blob([JSON.stringify(to_save_format(rects))], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = proj_name.value+".json";
    a.click();
}
function delete_room(){
	index = parseInt(files_list.value)
	saves = JSON.parse(localStorage.getItem("RoomPlannerSaves"))
	console.log(index, saves, index !== "")
	if (index!=="")
		if (confirm("Delete save file: '"+saves[index].name+"' (this operation cannot be undone)")){
			saves[index] = null;
			localStorage.setItem("RoomPlannerSaves", JSON.stringify(saves))
			location.reload();
		}
}