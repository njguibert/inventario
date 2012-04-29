$(function(){

//clientes.add([c]);

$('#frmnuevocliente').modal('hide');

$('#agregar').click(function() {
	 var c=new cliente({nombre:$('#nombre').val(),tel:$('#tel').val(),dir:$('#dir').val()});
	 //personas.add([p]);
	 c.save("",{
       success: function(usr){
       	alert("agregado a la bd");
	  }});
	 //listapersona.render();
});


});