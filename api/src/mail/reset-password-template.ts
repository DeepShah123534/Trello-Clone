export default function resetPasswordTemplate(token, id)  {
    return `
        <html> 
        
            <h1>Password Reset Email</h1>
            <p> Click <a href="http://localhost:3001/reset-password/${token}/${id}" target="-blank" >Here </a> </p>
            

        <\html>
    `
}