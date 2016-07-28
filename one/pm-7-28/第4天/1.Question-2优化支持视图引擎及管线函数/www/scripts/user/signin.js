$('form').submit(function(ev){
    ev.preventDefault()
    
    var data = $(this).serialize()
    
    $.post('/api/user/signin', data, function(res){
        if(res.code == 'success'){
            location.href = '/'
        }
        else{
            $('.modal-body').text(res.message)
            $('.modal').modal('show')
        }
    })
})