$(document).ready(function(){
    const accountFormModal = new bootstrap.Modal(document.getElementById('createAccountModal'), {
        backdrop: 'static',
        keyboard: false,
        focus: true
    });

    // show the new account modal
    $("body").on('click', '#createAccountModalLink', function(e){
        e.preventDefault();
        accountFormModal.show();
    });

    //add a new account after form filled out, and close the new modal
    $("body").on('click', '#createaccount', function(e){
        e.preventDefault();
        let newAccountData = {
            firstname: $('#first-name').val().trim(),
            lastname: $('#last-name').val().trim(),
            emailaddress: $('#modalemailaddress').val(),
            password: $('#modalpassword').val(),
        };

        $.ajax({
            url: "/api/account/create",
            type:"POST",
            data: newAccountData
        }).done(function(resp){
            if (resp.status =="OK"){
                accountFormModal.hide();
                $(".CreateAccount").trigger('reset'); 
                alert(resp.message);
            }else{
                alert("Fail to create account, please check the form and try again!");
            }
        }).fail(function(response){
            alert("There is a problem creating your account, please try again later!")
        })
    });

    // login event
    $("body").on('click', '#accountlogin', function(e){
        e.preventDefault();
        const loginData = {
            emailaddress: $('#emailaddress').val().trim(),
            password: $('#password').val().trim()
        };
        $.ajax({
            url: '/api/account/login',
            type: 'POST',
            data: loginData
        }).done(function(resp){
            if (resp.status === 'ok') {
                location.reload();
            } else {
                alert('Login failed.  Please try again.');
            }
        });
    });
});