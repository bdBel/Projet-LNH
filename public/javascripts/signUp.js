document.getElementById('signup-Form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

   
    const formData = new FormData(event.target);
    const data = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        email: formData.get('email'),
        password: formData.get('password').trim(),
    };

    console.log('Data to send:', data); 

    try {
        
        const response = await fetch('http://localhost:3000/users/signup', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('Server response:', response); 

        if (response.ok) {
            const result = await response.json();
            document.getElementById('confirmation').innerHTML = `Merci ${data.prenom}, pour votre inscription est confirmée.`;
        } else {
            const result = await response.json();
            alert(result.message || 'Une erreur s\'est produite, veuillez recommencer.');
        }

    } catch (error) {
        console.log('Error:', error);
        alert('An error occurred while signing up.');
    }
});