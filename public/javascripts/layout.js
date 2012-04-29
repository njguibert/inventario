$(function(){
$('.dropdown-toggle').dropdown();
 /* $('#login').click(function() {
    var mail=$('#email').val();
    var psw=$('#password').val();
    $.post('/login/' , {email:mail,password:psw}, function(data) {
    	if (data) {
        //hs("#frmlogin","#menu1");
        window.location.href = "/home";
    	}
     });
    return false;	
  });
  $('#logout').click(function() {
    //hs("#menu1","#frmlogin");
    $.post('/logout/', function(data) {
      window.location.href = "/";
     });    
  });  
  function hs(ocultar,mostrar){
    $(ocultar).hide(1000,function(){
    $(mostrar).show(); 
    });    
  }
*/
  //#################################################################################################################################
  //          MODELO
  //#################################################################################################################################
  cliente = Backbone.Model.extend({
    url: '/cliente/new',
  });
  var ClienteColeccion  = Backbone.Collection.extend({
    model: cliente
  });

});