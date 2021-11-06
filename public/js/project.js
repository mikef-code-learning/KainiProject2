$(document).ready(function() {
    const jobFormModal = new bootstrap.Modal(document.getElementById('newjobmodal'), {
        backdrop: 'static',
        keyboard: false,
        focus: true
    })

    $('#joblist').DataTable({
        "ajax": "/api/jobs/getall",
        "columns": [
            { "data": "companyname" },
            { "data": "position" },
            { "data": "status" },
            { "data": "targetsalary" }
        ]
    });

    $("body").on('click', '#testjobs', function(e){
        e.preventDefault();
        $.ajax({
            url: '/api/jobs/getall',
            type: 'GET'
        }).done(function(resp){
            console.log('test complete. resp:');
            console.log(resp);
        });
    });
    
    $("body").on('click', '#logoutbtn', function(e){
        e.preventDefault();
        $.ajax({
            url: '/api/account/logout',
            type: 'GET'
        }).done(function(resp){
            location.reload();
        });
    });

    // show the new job modal
    $("body").on('click', '#newjobmodalbtn', function(e){
        e.preventDefault();
        jobFormModal.show();
    });

    // add a new job after form filled out, and close the new job modal
    $("body").on('click', '#addjob', function(e){
        e.preventDefault();
        
        const jobInputs = $("#job-form").find($('input'));
        let newJobData = {};
        for (let i = 0; i < jobInputs.length; i++) {
            const idString = $(jobInputs[i]).attr('id');
            const inputValue = $(jobInputs[i]).val().trim();
            if (idString.charAt(0) != '_' && inputValue != '') {
                newJobData[idString] = inputValue
            }
        }
        
        const addressFields = $(".company-address");
        let addressString = '';
        for (let j = 0; j < addressFields.length; j++) {
            const addressVal = $(addressFields[j]).val();
            if (addressVal != '') {
                addressString += addressVal + ' ';
            } else if ($(addressFields[j]).attr('id') == '_compAddress2'){
                continue;
            } else {
                addressString = '';
                break;
            }
        }
        if (addressString.length > 0) {
            newJobData.companyaddress = addressString.trim();
        };
        newJobData.status = parseInt($("#status").val())
        if (newJobData.targetsalary != undefined) {
            let updatedNum = parseFloat(newJobData.targetsalary);
            newJobData.targetsalary = updatedNum;
        }
        if (newJobData.salaryoffered != undefined) {
            let updatedNum = parseFloat(newJobData.salaryoffered);
            newJobData.salaryoffered = updatedNum;
        }
    
        $.ajax({
            url: `/api/jobs/create`,
            type: 'POST',
            data: newJobData
        }).done(function(response) {
            if (response.id) {
                jobFormModal.hide();
                $('#job-form').trigger('reset');
                location.reload();
            }
        }).fail(function(response) {
            alert(response.responseJSON.error);
        })
    })
});