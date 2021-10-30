$(document).on('click', '#addjob', function(e){
    e.preventDefault();
    
    // TODO: Input validation


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
    }).fail(function(response) {
        alert(response.responseJSON.error);
    })
})