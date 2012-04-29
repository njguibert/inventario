$ ->
  #Envio el ajax que retornara a los clientes del usuario
  #alert "area clientes"
  $.post('/getmodels/clientes'
    (data) ->
      _.each data, (d) ->
          Clientes.add(d)  #Agrego a la coleccion los clientes obtenidos
      ListadoClientes.render()
      #alert "zzz"
  )

  $('#agregar').click ->
    c= new cliente({nombre:$('#nombre').val(),tel:$('#tel').val(),dir:$('#dir').val()})
    c.save {},
      success:(usr) ->
        if usr
          alert "Se Agrego a la BD:"
          $('#nombre').val("")
          $('#tel').val("")
          $('#dir').val("")
        else
          alert "Error al Guardar"  
  ########################################################################################################################
  #          MODELO
  ########################################################################################################################
  class cliente extends Backbone.Model
    url: '/cliente/new'

  class ClienteColeccion extends Backbone.Collection
    model: cliente

  Clientes = new ClienteColeccion
  ########################################################################################################################
  #          VISTA
  ########################################################################################################################
  class ListClientesView extends Backbone.View
    el: '#listclientes'
    initialize: ->
      @render()

    render: ->
      #alert "renderizo la vista"
      Clientes.each (cliente) ->
        $('#listclientes').append ->
          '<li>' + cliente.get("nombre")

  ListadoClientes= new ListClientesView