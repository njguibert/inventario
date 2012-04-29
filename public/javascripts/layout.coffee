$ ->
  cleaninput =() ->
    alert "limpio los selectores"

  $('#login').click ->
    mail=$('#email').val()
    psw=$('#password').val()
    $.post('/login/',{email:mail,password:psw},(data) ->
      if data
        window.location.href = "/home"
    )