if(sessionStorage.getItem("SessionID")){
    document.querySelector('#divLogin').classList.add('d-none')
    document.querySelector('#divDashboard').classList.remove('d-none')
}

const strBaseURL = 'https://swollenhippo.com/DS3870/Characters/api/'

document.querySelector('#btnRegister').addEventListener('click',() =>{
    const strEmail = document.querySelector('#txtEmail').value.trim()
    const strFirstName = document.querySelector('#txtFirstName').value.trim()
    const strLastName = document.querySelector('#txtLastName').value.trim()
    const strPassword = document.querySelector('#txtPassword').value

    //We should verify data is correct, then actually register
    let blnError = false
    let strError = ''
    //evaluate here
    if(blnError == false){
        //async await example

        /*
        async function getUsers(){
            try {
                const objResponse = await fetch(strBaseURL + 'users.php', 
                    {
                        method:'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body:
                            JSON.stringify({Email:strEmail,FirstName:strFirstName,LastName:strLastName,Password:strPassword})}
                )
                if(objResponse.ok){
                    const objData = await objResponse.json()
                    if(objData.Outcome){
                        Swal.fire({
                            title: "Fantastic, your account has been created!",
                            icon: "success",
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            title: "Oh no, something went wrong!",
                            icont:"error",
                            text:data.Error
                        })
                    }
                }
            } catch (objError) {
                Swal.fire({
                    title: "Oh no, something went wrong!",
                    icont:"error",
                    text:data.Error
                })
            }
        }
        getUsers()
        */

        async() =>{
            try {
                const objResponse = await fetch(strBaseURL + 'users.php', 
                    {
                        method:'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body:
                            JSON.stringify({Email:strEmail,FirstName:strFirstName,LastName:strLastName,Password:strPassword})}
                )
                if(objResponse.ok){
                    const objData = await objResponse.json()
                    if(objData.Outcome){
                        Swal.fire({
                            title: "Fantastic, your account has been created!",
                            icon: "success",
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            title: "Oh no, something went wrong!",
                            icont:"error",
                            text:data.Error
                        })
                    }
                }
            } catch (objError) {
                Swal.fire({
                    title: "Oh no, something went wrong!",
                    icont:"error",
                    text:data.Error
                })
            }
        }

        fetch(strBaseURL + 'users.php', 
            {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({Email:strEmail,FirstName:strFirstName,LastName:strLastName,Password:strPassword})}
        )
        .then(result => {
            if(result.ok){
                return result.json()
            } else {
                throw new Error(result.status)
            }
        })
        .then(data => {
            if(data.Outcome){
                Swal.fire({
                    title: "Fantastic, your account has been created!",
                    icon: "success",
                    timer: 1500
                })
            } else {
                Swal.fire({
                    title: "Oh no, something went wrong!",
                    icont:"error",
                    text:data.Error
                })
            }
        })
    } else {
        //throw error
    }
}
)

document.querySelector('#btnLogin').addEventListener('click',() =>
{
    const strEmail = document.querySelector('#txtLoginEmail').value.trim()
    const strPassword = document.querySelector('#txtLoginPassword').value
    
    // error handling for inputs

    fetch(strBaseURL + 'sessions.php', 
            {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({Email:strEmail,PassWord:strPassword})}
        )
    .then(response => {
        //if response good then we are going to do this
        return response.json()
    })
    .then(data => {
        if(data.SessionID){
            sessionStorage.setItem("SessionID", data.SessionID)
            $('#divLogin').slideUp(function(){
                $('#divDashboard').slideDown()
            })
        }
    })
})

document.querySelector('#btnBackToRegister').addEventListener('click',()=>{
    //document.querySelector('#divLogin').style = "display:none"
    //document.querySelector('#divRegister').style = "display:block"
    $('#divLogin').slideUp(function(){
        $('#divRegister').slideDown()
    })
})
document.querySelector('#btnBackToLogin').addEventListener('click',()=>{
    $('#divRegister').slideUp(function(){
        $('#divLogin').slideDown()
    })
})

document.querySelector('#imgHippo').addEventListener('click',() =>{
    $('#divLogin').slideUp(function(){
        $('#divRegister').slideDown()
    })
})