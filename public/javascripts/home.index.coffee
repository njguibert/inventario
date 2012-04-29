$ ->
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
