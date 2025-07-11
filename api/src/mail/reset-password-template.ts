export default function resetPasswordTemplate(token, id)  {
    return `
        <html> 
        
            <h1>Password Reset Email</h1>
            <p> To reset you password click <a href="http://localhost:3001/reset-password/${token}/${id}" target="-blank" >here </a> </p>
            

        <\html>
    `
}