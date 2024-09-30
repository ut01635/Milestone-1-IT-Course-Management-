// DOM elements
const popupWindow = document.querySelector('.popup-window');
const popup = document.querySelector('.popup');
const closeBtn = document.querySelector('.closeBtn');
const form = document.querySelector('form');
const courseInfo = document.querySelector('.courseInfo');
const filterData = document.getElementById('search');
const tableSizeSelect = document.getElementById('table_size');

const confirmationPopupWindow = document.querySelector('.confirmation-popup-window');
const confirmationPopup = document.querySelector('.confirmation-popup');
const closeConfirmBtn = document.querySelector('.closeConfirmBtn');
const confirmBtn = document.querySelector('.confirmBtn');
const cancelBtn = document.querySelector('.cancelBtn');
const confirmationMessage = document.getElementById('confirmationMessage');

let originalFollowedData = JSON.parse(localStorage.getItem('followedCourse')) || [];
let displayedData = [...originalFollowedData];
let editIndex = null;
let courseIdToUnfollow = null;

function showPopup() {
    popupWindow.classList.add('active');
    popup.classList.add('active');
}

function hidePopup() {
    popupWindow.classList.remove('active');
    popup.classList.remove('active');
    form.reset();
}

function showConfirmationPopup(courseId) {
    confirmationPopupWindow.style.display = "block"
    // confirmationPopupWindow.classList.add('active');
    courseIdToUnfollow = courseId;
}

function hideConfirmationPopup() {
    confirmationPopupWindow.style.display = "none"

    // confirmationPopupWindow.classList.remove('active');
    // confirmationPopup.classList.remove('active');
    courseIdToUnfollow = null;
}

function viewCourse(courseId) {
    const course = displayedData.find(item => item.courseId === courseId);
    if (course) {
        document.getElementById('courseId').value = course.courseId;
        document.getElementById('courseName').value = course.courseName;
        document.getElementById('category').value = course.category;
        document.getElementById('duration').value = course.duration;
        document.getElementById('courseFee').value = course.courseFee;

        showPopup();
        isEdit = true;
        editIndex = displayedData.indexOf(course);
    }
}

function unfollowCourse(courseId) {
    displayedData = displayedData.filter(item => item.courseId !== courseId);
    localStorage.setItem('followedCourse', JSON.stringify(displayedData));
    loadProfile(); // Reloads the followed courses list
}

function loadProfile() {
    const studentId = JSON.parse(sessionStorage.getItem('loggedStudent')) || '';

    const followedCourses = displayedData.filter(course => course.nicNumber === studentId);

    if (followedCourses.length === 0) {
        courseInfo.innerHTML = `<tr class="courseDetails"><td class="empty" colspan="6" align="center">No data available in table</td></tr>`;
    } else {
        courseInfo.innerHTML = '';
        followedCourses.forEach(course => {
            courseInfo.innerHTML += `
                        <tr class="courseDetails">
                            <td>${course.courseId}</td>
                            <td>${course.courseName}</td>
                            <td>${course.category}</td>
                            <td>${course.duration} Months</td>
                            <td>${course.courseFee}.00</td>
                            <td>
                                <button onclick="viewCourse('${course.courseId}')"><i class="fa-regular fa-eye"></i></button>
                                <button onclick="showConfirmationPopup('${course.courseId}')"><img class="icons" src="./styles/icons8-minus-96.png" alt=""></button>
                            </td>
                        </tr>
                    `;
        });
    }
}

filterData.addEventListener('input', () => {
    const searchTerm = filterData.value.toLowerCase().trim();
    displayedData = originalFollowedData.filter(item =>
        item.courseId.toLowerCase().includes(searchTerm) ||
        item.courseName.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    loadProfile();
});

closeBtn.addEventListener('click', hidePopup);
closeConfirmBtn.addEventListener('click', hideConfirmationPopup);

confirmBtn.addEventListener('click', () => {
    if (courseIdToUnfollow) {
        unfollowCourse(courseIdToUnfollow);
        hideConfirmationPopup();
    }
});

cancelBtn.addEventListener('click', hideConfirmationPopup);

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});