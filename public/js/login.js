// login event
$("body").on('click', '#accountlogin', function(e){
    console.log('logging in...');
    e.preventDefault();
    const loginData = {
        emailaddress: $('#emailaddress').val().trim(),
        password: $('#password').val().trim()
    };
    $.ajax({
        url: '/api/account/login',
        type: 'POST',
        data: loginData
    });
});