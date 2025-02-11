document.getElementById('upload-link').onclick = function () {
    document.getElementById('fileInput').click(); 
};

document.getElementById('fileInput').onchange = function () {
    
    if (this.files.length > 0) {

        const formData = new FormData();  
        formData.append('photo', this.files[0]);  // Ajoute le fichier sélectionné à FormData

        fetch('/users/uploadPhoto', {
            method: 'POST',
            body: formData,  
        })
        .then(response => response.json())  
        .then(data => {
            if (data.success) {
                // injecter l'image utilisateur 
                const userImageElement = document.querySelector('.dropdown-link img');
                userImageElement.src = `/images/${data.filename}`;  // Mettez à jour la source de l'image avec l'image téléchargée
                console.log('Fichier téléchargé avec succès:', data);
            } else {
                alert('Le téléchargement du fichier a échoué');
            }
        })
        .catch(error => {
            console.error('Erreur lors du téléchargement du fichier:', error);
        });
    }
};
