var magicui = {};
magicui.live = document.getElementById('live');

magicui.insert = function(arr){
	var html = "";
	arr.forEach(function(elem,index){
		var data = "";
		data+= "<div>";
		data += "<h2>" + index + " - " + elem.filename + "</h2>";
		data += "<h3>" + elem.user + "</h3>";
		data += "<p>" + elem.address + "</p>";
		data += "</div>";
		html += data;
	})
	magicui.live.innerHTML += html;
}

var socket = io.connect();

socket.on('connect',function() {
  console.log('Client has connected to the server!');
});

socket.on('live',function(data) {
	console.log(data);
  magicui.insert(data);
});

