$ ->
  ########################################################################################################################
  #          MODELO
  ########################################################################################################################
  class Caracteristica extends Backbone.RelationalModel
    initialize: ->
      #alert "Se creo una Caracteristica"

  class CaracteristicaCollection extends Backbone.Collection
    model: Caracteristica
    initialize: ->
      #alert "Se creo una coleccion de caracteristicas"
      #this.bind('add', (c) ->
      #  vistacaracteristicas.render(c)  # Renderizo la nueva caracteristica
      #)

  class DispositivoCollection extends Backbone.Collection
    model: Dispositivo
    initialize: ->
      #alert "Se creo una coleccion de dispositivos"
      this.bind('add', (c) ->
        vistadispositivos.render(c)
        alert "Producto Agregado"
      )


  class Dispositivo extends Backbone.RelationalModel
    initialize: ->
      #alert "Se creo un Dispositivo"
    relations:[
      type: Backbone.HasMany
      key: 'caracteristicas'
      relatedModel: Caracteristica
      collectionType: CaracteristicaCollection
    ]
  Caracteristicas=new CaracteristicaCollection
  Dispositivos=new DispositivoCollection
  ########################################################################################################################
  #          VISTA
  ########################################################################################################################
  class VistaCaracteristicas extends Backbone.View
    el: "#pluslist"
    render: (data) ->
      $("#pluslist").append ->
          "<li>" + data.get("dato") + " - " + data.get("valor") + "</li>"
    listarHTML: (data) ->
      html=''
      data.each (c) ->
        html=html +  "<li>" +c.get("dato") + " : " + c.get("valor") + "</li>"
      return html
    vaciar: ->
      $("#pluslist").empty()



  class VistaDispositivos extends Backbone.View
    el: "#devicelist"
    render: (data) ->
      $("#devicelist").append ->
          #"<li>" + data.get("nombre") + " - " + data.get("descripcion") + "</li>"
          "<a class='btn' style='margin:10px;' id='" + data.get("nombre") + "'>" + data.get("nombre") + "</a>"
      $('#' + data.get("nombre")).popover
        placement: 'right'
        title:  'Caracteristicas'
        content: vistacaracteristicas.listarHTML(Caracteristicas)

  vistacaracteristicas=new VistaCaracteristicas
  vistadispositivos=new VistaDispositivos

  $('#agregar').click ->
    dispositivo=new Dispositivo #<--------------Creo el Nuevo Dispositivo
      nombre:$('#nombre').val()
      descripcion:$('#descripcion').val()
      caracteristicas:[Caracteristicas] #<------Agrego las Caracteristicas
    Dispositivos.add(dispositivo)#<-------------Agrego el dispositivo a la coleccion 
    Caracteristicas.reset()
    vistacaracteristicas.vaciar()
    $('#plusform').toggle()



  $('#newplus').click ->
    caracteristica=new Caracteristica
      dato:$('#dato').val()
      valor:$('#valor').val()
    Caracteristicas.add(caracteristica)
    $('#dato').val("")
    $('#valor').val("")
    vistacaracteristicas.render(caracteristica)

  $('#newcaracteristica').click ->
   $('#plusform').toggle()

  #c1= new Caracteristica({id:101,dato:'Socket',valor:'775'})
  #c2= new Caracteristica({id:102,dato:'Velocidad BUS',valor:'1066Mhz'})
  #d= new Dispositivo
  #  id:1
  #  caracteristicas:[101]

  #alert "Caracateristica 1: " + d.get("caracteristicas").at(0).get("dato")
  #d.get("caracteristicas").add(c2)
  #alert "Caracateristica 1: " + d.get("caracteristicas").at(1).get("dato")