$(document).ready(function() {
    const statusList = [
        "Not Yet Applied",
        "Applied",
        "Interview Scheduled",
        "Interviews Complete",
        "Awaiting Offer",
        "Offer Made"
    ]

    let jobFormModalElement = document.getElementById('newjobmodal');

    const jobFormModal = new bootstrap.Modal(jobFormModalElement, {
        backdrop: 'static',
        keyboard: false,
        focus: true
    })

    $('#joblist').DataTable({
        "ajax": "/api/jobs/getall",
        "columns": [
            { "data": "companyname" },
            { "data": "position" },
            {
                "data": "status",
                render: function( data, type, row, meta) {
                    return `${statusList[data]}`
                }
            },
            { "data": "targetsalary" },
            {
                data: null,
                orderable: false,
                className: "dt-center",
                render: function ( data, type, row, meta ) {
                    return `<i class="fa fa-pencil editjob" data-id="${data.id}"></i>`
                }
            },
            {
                data: null,
                orderable: false,
                className: "dt-center",
                render: function ( data, type, row, meta ) {
                    return `<i class="fa fa-archive archivejob" data-id="${data.id}"></i>`
                }
            }
        ]
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

    //show the job form modal for edit
    $("body").on("click", ".editjob", function(e){
        e.preventDefault();
        var id = $(this).data("id");
        $.ajax({
            url: '/api/jobs/get/' + id,
            type: 'GET',
        }).then(function(resp){
            $("#newjobmodalLabel").text('Edit Job');
            $("#companyname").val(resp.companyname);
            $("#position").val(resp.position);
            $("#companyaddress").val(resp.companyaddress);
            $("#targetsalary").val(resp.targetsalary);
            $("#status").val(resp.status);
            $("#pocname").val(resp.pocname);
            $("#pocemailaddress").val(resp.pocemailaddress);
            $("#pocphonenumber").val(resp.pocphonenumber);
            $('#addjob').text('Update');
            $('#addjob').attr('id', 'updatejob');
        })
        jobFormModal.show();
    })

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
            // if (idString.charAt(0) != '_' && inputValue != '') {
            if (inputValue != '') {
                newJobData[idString] = inputValue
            }
        }
        
        // const addressFields = $(".company-address");
        // let addressString = '';
        // for (let j = 0; j < addressFields.length; j++) {
        //     const addressVal = $(addressFields[j]).val();
        //     if (addressVal != '') {
        //         addressString += addressVal + ' ';
        //     } else if ($(addressFields[j]).attr('id') == '_compAddress2'){
        //         continue;
        //     } else {
        //         addressString = '';
        //         break;
        //     }
        // }
        // if (addressString.length > 0) {
        //     newJobData.companyaddress = addressString.trim();
        // };
        newJobData.status = parseInt($("#status").val())
        if (newJobData.targetsalary != undefined) {
            let updatedNum = parseFloat(newJobData.targetsalary);
            newJobData.targetsalary = updatedNum;
        }
        if (newJobData.salaryoffered != undefined) {
            let updatedNum = parseFloat(newJobData.salaryoffered);
            newJobData.salaryoffered = updatedNum;
        }
        newJobData.archived = false;
    
        $.ajax({
            url: `/api/jobs/create`,
            type: 'POST',
            data: newJobData
        }).done(function(response) {
            if (response.id) {
                jobFormModal.hide();
            }
        }).fail(function(response) {
            alert(response.responseJSON.error);
        })
    });

    // refresh page when job modal is hidden
    jobFormModalElement.addEventListener('hidden.bs.modal', function(e){
        e.preventDefault();
        $('#job-form').trigger('reset');
        location.reload();
    })
});