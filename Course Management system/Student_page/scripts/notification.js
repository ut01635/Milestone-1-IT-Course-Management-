document.addEventListener('DOMContentLoaded', () => {
    loadProfile(); 
});

const MessageInfo = document.querySelector(".MessageInfo");
const table = document.querySelector("table");

function loadProfile() {
    let notificationData = JSON.parse(localStorage.getItem('notification')) || [];
    let loggedStudent = JSON.parse(sessionStorage.getItem('loggedStudent')) || {};

    if (!loggedStudent) {
        console.error('No NIC number found in session storage.');
        return;
    }

    // Filter notifications for the logged-in student
    const studentNotifications = notificationData.filter(notification => notification.nicNumber === loggedStudent);

    if (studentNotifications.length === 0) {
        MessageInfo.innerHTML = `<tr class="notificationDetails"><td class="empty" colspan="3" align="center">No data available in table</td></tr>`;
        table.style.minWidth = "85%";
        return;
    }

    // Build the table rows for notifications using forEach
    let createElement = '';
    studentNotifications.forEach((notification, index) => {
        createElement += `
            <tr class="notificationDetails">
                <td>${notification.date}</td>
                
                <td class="dltBtn">
                ${notification.message}
                    <button onclick="deleteInfo(${index})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    MessageInfo.innerHTML = createElement;
    table.style.minWidth = "85%";
}

function deleteInfo(index) {
    let notifications = JSON.parse(localStorage.getItem('notification')) || [];
    notifications.splice(index, 1);
    localStorage.setItem('notification', JSON.stringify(notifications));
    loadProfile(); 
}