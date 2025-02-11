document.getElementById('upload-link').onclick = function () {
    document.getElementById('fileInput').click(); // Trigger the file input when the link is clicked
};

document.getElementById('fileInput').onchange = function () {
    // Ensure a file is selected
    if (this.files.length > 0) {
        const formData = new FormData();  // Create a FormData object
        formData.append('photo', this.files[0]);  // Append the selected file to FormData

        fetch('/users/uploadPhoto', {
            method: 'POST',
            body: formData,  // Send the FormData as the body of the POST request
        })
        
        .then(response => response.json())  // Expect a JSON response from the server
        .then(data => {
            if (data.success) {
                // If the upload is successful, update the user icon
                const userImageElement = document.querySelector('.dropdown-link img');
                userImageElement.src = `/images/${data.filename}`;  // Update the image source to the uploaded image

                // Also update the profile image on the page
                const userImageElementProfile = document.querySelector('.profile-img');  // Assuming you added a class 'profile-img' to the profile image in the page
                userImageElementProfile.src = `/images/${data.filename}`;  // Update profile image
                console.log('File uploaded successfully:', data);
            } else {
                alert('File upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
};


  



// televerser une image
document.getElementById('upload-link').onclick = function () {
    document.getElementById('fileInput').click(); // Trigger the file input when the link is clicked
};

document.getElementById('fileInput').onchange = function () {
    // Ensure a file is selected
    if (this.files.length > 0) {
        const formData = new FormData();  // Create a FormData object
        formData.append('photo', this.files[0]);  // Append the selected file to FormData

        fetch('/users/uploadPhoto', {
            method: 'POST',
            body: formData,  // Send the FormData as the body of the POST request
        })
        .then(response => response.json())  // Expect a JSON response from the server
        .then(data => {
            if (data.success) {
                // If the upload is successful, update the user icon
                const userImageElement = document.querySelector('.dropdown-link img');
                userImageElement.src = `/images/${data.filename}`;  // Update the image source to the uploaded image
                console.log('File uploaded successfully:', data);
            } else {
                alert('File upload failed');
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
};

    //---------------------------
