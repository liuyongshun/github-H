$('form').submit(function(ev){
    ev.preventDefault()
    
    var formData = $(this).serialize()

    $.post('/api/answer', formData, function(res){
        $('.modal-body').text(res.message)
        $('.modal').modal('show')
        .on('hidden.bs.modal', function (e) {
            if(res.code == 'success'){
                location.href = '/'
            }
        })
    }, 'json')
})