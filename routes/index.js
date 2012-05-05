
/*
 * GET home page.
 */
var _ = require('underscore'); 


var Sequelize =require("sequelize");

var sequelize = new Sequelize('inventario', 'root', 'root', {
			  host: "190.160.190.1",
			  port: 3306
			})
var Cliente = sequelize.define('cliente',{
				nombre: Sequelize.STRING,
				tel: Sequelize.INTEGER,
				direccion:Sequelize.STRING,
			})
var Usuario = sequelize.define('usuario',{
				mail: Sequelize.STRING,
				psw: Sequelize.STRING,
			})
var Dispositivo = sequelize.define('dispositivo',{
				nombre: Sequelize.STRING,
				descripcion: Sequelize.STRING,
			})
var Caracteristica = sequelize.define('caracteristica',{
				dato: Sequelize.STRING,
				valor: Sequelize.STRING,
			})
//Cliente.hasOne(Usuario,{as:'tecnico'});
Usuario.hasMany(Cliente,{as:'clientes'});
Dispositivo.hasMany(Caracteristica,{as:'caracteristicas'})
//Caracteristica.sync();
Dispositivo.sync();
//Caracteristica.create();
//Dispositivo.create();
Cliente.sync();
Usuario.sync();
//Cliente.create();
//Usuario.create();

console.log("Finalize la creacion del modelo");

var usuarios = [
  {
     email: 'njguibert@gmail.com',
     password: 'guibert',
  }  ];

var Popciones = [
  {
    nombre: 'Clientes',
    accion: 'clientes/ver',
  },
  {
    nombre: 'Dispositivos',
    accion: 'dispositivos/ver',
  },  
];
exports.index = function(req,res){
	var nombres= usuarios.map(function(p){ return p.email;});
	res.render('index',{usuarios:nombres})
};
exports.email = function  (req,res) {
	res.json(usuarios);
};

exports.home = function  (req,res) {
	var nombres=[];
	Usuario.find({where:{mail:req.session.user}}).success(function(u){
		u.getClientes().success(function(clientes) {
			res.render('home/index',{
				locals:{clientes:clientes,opciones:Popciones}});
		});
	});	
	
};
exports.getview = function  (req,res) {
	console.log("recibi la vista:" + req.params.viewname);
	res.render(req.params.viewname,{opciones:Popciones});
};

exports.login = function  (req,res) {
	console.log('Datos del Request:\n');
	console.log(req.body.email);
	console.log("\n");
	console.log(req.body.password);
	//Busco si existe el usuario
	var existe=false;
	Usuario.find({where:{mail:req.body.email,psw:req.body.password}}).success(function(u){
		if (u!=null) {
			//Guardo en la variable de sesion el usuario
			req.session.user = req.body.email;
			existe=true;
		}
		//Retorno false si no existe y true si existe
		res.json(existe);
	});	
};

exports.logout = function  (req,res) {
	req.session.destroy();
	console.log("Me deslogueo");
	var estado=true;
	res.json(estado);
	};

exports.guardardispositivos= function (req,res){
	//Obtengo la coleccion a guardar
	coleccion= req.body;
	//console.log("coleccino:"+coleccion.length);
	tamanocoleccion=coleccion.length;
	var contador=1;
	//console.log ("tamanocoleecion:" + tamanocoleccion)
	//console.log ("tamanocontador:" + contador)
	for (d in coleccion){
		console.log("\ndispositivo:" + d);
		//Datos del Producto
		var estado=false;
		var pnombre=coleccion[d].nombre;
		var	pdescripcion=coleccion[d].descripcion;
		var pcaracteristicas=[];
		pcaracteristicas=coleccion[d].caracteristicas[0];
		//console.log("\nCaracteristicas:" + caracteristicas);
		//Creo un nuevo dispositivo con los datos del producto
		nuevodispositivo= Dispositivo.build({
			nombre:pnombre,
			descripcion:pdescripcion,
		});
		 //Persisto el dispositivo en la BD
		/*nuevodispositivo.save().success(function(){
						  		console.log("Nueva dispositivo agregado correctamente:");							  		
						  	}).error(function(){
								console.log("Error en la accion: Nuevo dispositivo");
						  	}.on('success'),function(gg){
						  		console.log("evento:" + gg.nombre);
						  	});	*/
		nuevodispositivo.save().on('success',function (gg){
						  		estado=true;
								//Recorro las caracteristicas de un producto
								  for (c in pcaracteristicas){
								  	//Datos de una caracteristica
								  	var cdato=pcaracteristicas[c].dato;
								  	var cvalor=pcaracteristicas[c].valor;
								  	//Creo una nueva caracteristicas con los datos anteriores
								  	nuevacaracteristica=Caracteristica.build({
								  		dato:cdato,
								  		valor:cvalor,
								  	});
								  	console.log("\nCaracteristica:" + nuevacaracteristica.dato);
								  	console.log("\nDispositivo2:" + gg.nombre);
								  	gg.addCaracteristica(nuevacaracteristica);

								  }

		});  
	
	}
};
exports.getmodels = function (req,res){
	//Obtengo el modelo a listar
	modelname=req.params.modelname;
	switch (modelname){
		case 'clientes': //RETORNO LOS CLIENTES DEL USUARIO LOGUEADO
			var user= req.session.user;
			var clients=[];
			console.log("\nRetorno clientes del usuario:" +user);
			Usuario.find({where:{mail:user}}).success(function(u){
				u.getClientes().success(function(clientes) {
					for (c in clientes) {
						clients.push({nombre: clientes[c].nombre,tel:clientes[c].tel});
						console.log("for");
					}
					res.json(clients);
				});
			});	
		break;
	}
};
exports.clientenew = function  (req,res) {
	var estado=false;
	console.log("Agrego el nuevo cliente a la bd\n");
	//Busco el usuario logueado
	Usuario.find({where:{mail:req.session.user}}).success(function(u){
		if (u!=null) {
			//Creo un nuevo objeto con los datos del formulario
			var nuevocliente = Cliente.build({
						nombre:req.body.nombre,
						tel:parseInt(req.body.tel),
						direccion:req.body.dir,
		            });
			    //Seteo el nuevo cliente al tecnico
			 	u.addCliente(nuevocliente);
				//Persisto el objeto en la BD
				nuevocliente.save().success(function(){
			                console.log("Nuevo Cliente agregado correctamente");
			                estado=true;
			                res.json(estado);
			            }).error(function(){
			                console.log("Error en la accion: Nuevo Cliente");
			                estado=false;
			                res.json(estado);
			            });  
			//});
			console.log("usuario:" + u);

		}
		//Retorno false si el usuario no esta logueado
		else{
		res.json(existe);
		}
	});	     
	};
