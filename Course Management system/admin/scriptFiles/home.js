let  StudentsData = JSON.parse(localStorage.getItem('students')) || [];
let  CoursesData = JSON.parse(localStorage.getItem('course')) || [];
let EnrollmentData = JSON.parse(localStorage.getItem('followedCourse'))|| [];

let totalStudent = document.getElementById('countStudents')
let totalCourses = document.getElementById('countCourse');
let totalEnrollment = document.getElementById('enrollmetCourse')

// countStudents = length(StudentsData)
// countCourse = count(CoursesData)

console.log(StudentsData.length);

totalStudent.innerHTML = StudentsData.length
totalCourses.innerHTML = CoursesData.length
totalEnrollment.innerHTML = EnrollmentData.length