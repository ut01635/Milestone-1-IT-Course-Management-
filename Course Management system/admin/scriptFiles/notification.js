// Retrieve Students Data
let Students = JSON.parse(localStorage.getItem('students')) || [];
let form = document.getElementById('notificationForm');
let message = document.getElementById('message');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const notificationNIC = document.getElementById('notificationNIC').value;
    const notificationText = document.getElementById('notificationText').value;
    let notifications = JSON.parse(localStorage.getItem('notification')) || [];

    // Find the student by NIC number
    let student = Students.find(student => student.nicNumber === notificationNIC);

    if (student) {
        // If student is found, create a notification object with the current date
        let newNotification = {
            nicNumber: notificationNIC,
            message: notificationText,
            date: new Date().toLocaleDateString() // Store the current date in local format
        };

        // Add the new notification to the notifications array
        notifications.push(newNotification);

        // Store the updated notifications array in localStorage
        localStorage.setItem('notification', JSON.stringify(notifications));

        // Show success message
        message.innerHTML = "Message sent";
        message.style.color = "green";
    } else {
        // If student is not found, show error message
        message.innerHTML = "NIC Number not found";
        message.style.color = "red";
    }

    // Reset the form
    form.reset();
});
