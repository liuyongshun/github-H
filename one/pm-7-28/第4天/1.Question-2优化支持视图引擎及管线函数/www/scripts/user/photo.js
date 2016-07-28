$('form').submit(function(ev){
    ev.preventDefault()
    
    var data = new FormData(this)
    
    $.post({
        url: '/api/user/photo',
        data: data,
        contentType : false,
        processData: false,
        success: function(res){
            if(res.code == 'success'){
                location.href = '/'
            }
            else{
                $('.modal-body').text(res.message)
                $('.modal').modal('show')
            }
        }
    })
})