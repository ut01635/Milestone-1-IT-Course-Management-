let newStudentAddBtn = document.querySelector('.addCourseBtn'),
    darkBg = document.querySelector('.popup-window'),
    popupForm = document.querySelector('.popup'),
    crossBtn = document.querySelector('.closeBtn'),
    submitBtn = document.querySelector('.submitBtn'),
    modalTitle = document.querySelector('.modalTitle'),
    popupFooter = document.querySelector('.popupFooter'),
    form = document.querySelector('form'),
    formInputFields = document.querySelectorAll('form input'),
    courseId = document.getElementById('courseId'),
    courseName = document.getElementById("courseName"),
    category = document.getElementById("category"),
    duration = document.getElementById("duration"),
    courseFee = document.getElementById("courseFee"),
    entries = document.querySelector(".showEntries"),
    tabSize = document.getElementById("table_size"),
    courseInfo = document.querySelector(".courseInfo"),
    table = document.querySelector("table")
filterData = document.getElementById("search")

let originalData = localStorage.getItem('course') ? JSON.parse(localStorage.getItem('course')) : []
let getData = [...originalData]
let followCourses = JSON.parse(localStorage.getItem('followedCourse')) || []
let loggedStudent = JSON.parse(sessionStorage.getItem('loggedStudent')) || [];  

// let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()

crossBtn.addEventListener('click', () => {
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

function preLoadCalculations() {
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if ((arrayLength % tableSize) > 0) {
        maxIndex++
    }
}



function displayIndexBtn() {
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for (let i = 1; i <= maxIndex; i++) {
        pagination.innerHTML += '<button onclick= "paginationBtn(' + i + ')" index="' + i + '">' + i + '</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}


function highlightIndexBtn() {
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if (endIndex > arrayLength) {
        endIndex = arrayLength
    }

    if (maxIndex >= 2) {
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if (btn.getAttribute('index') === currentIndex.toString()) {
            btn.classList.add('active')
        }
    })


    showInfo()
}




function showInfo() {
    document.querySelectorAll(".courseDetails").forEach(info => info.remove())

    let tab_start = startIndex - 1
    let tab_end = endIndex

    if (getData.length > 0) {
        for (let i = tab_start; i < tab_end; i++) {
            let course = getData[i]


            if (course) {
                let createElement = `<tr class = "courseDetails">
                <td>${course.courseId}</td>
                <td>${course.courseName}</td>
                <td>${course.category}</td>
                <td>${course.duration + " Months"}</td>
                <td>${course.courseFee + ".00"}</td>
                <td>
                    <button onclick="readInfo('${course.courseId}','${course.courseName}', '${course.category}', '${course.duration}', '${course.courseFee}')"><i class="fa-regular fa-eye"></i></button>


                    <button onclick="follow(${i})"><i class="fa-regular fa-plus"></i></button>
                </td>
            </tr>`

                courseInfo.innerHTML += createElement
                table.style.minWidth = "100%"
            }
        }
    }


    else {
        courseInfo.innerHTML = `<tr class="courseDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`
        table.style.minWidth = "100%"
    }
}

showInfo()


function readInfo(CourseId, CourseName, Category, Duration, CourseFee) {
    courseId.value = CourseId
    courseName.value = CourseName
    category.value = Category
    duration.value = Duration + " Months"
    courseFee.value = CourseFee + ".00"

    darkBg.classList.add('active')
    popupForm.classList.add('active')
    modalTitle.innerHTML = "Course Details"
    formInputFields.forEach(input => {
        input.disabled = true
    })
}


function follow(index) {
    let course = getData[index]; 

    if (!course) return; 

    let followCourse = {
        nicNumber: loggedStudent,
        courseId: course.courseId,
        courseName: course.courseName,
        category: course.category,
        duration: course.duration,
        courseFee: course.courseFee
    };

    // Check if the course is already followed by this student
    let alreadyFollowed = followCourses.some(followed => 
        followed.nicNumber === loggedStudent && followed.courseId === course.courseId
    );

    if (alreadyFollowed) {
        alert("You have already followed this course.");
        return; 
    }

    // Add the course to the followed courses list
    followCourses.push(followCourse);
    localStorage.setItem('followedCourse', JSON.stringify(followCourses));
    alert("Please settled your first month course fee before month end")
}






function next() {
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if (currentIndex <= maxIndex - 1) {
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if (currentIndex > maxIndex - 1) {
        nextBtn.classList.remove("act")
    }
}


function prev() {
    var prevBtn = document.querySelector('.prev')

    if (currentIndex > 1) {
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if (currentIndex < 2) {
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i) {
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if (currentIndex > maxIndex - 1) {
        nextBtn.classList.remove('act')
    }
    else {
        nextBtn.classList.add("act")
    }


    if (currentIndex > 1) {
        prevBtn.classList.add("act")
    }

    if (currentIndex < 2) {
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', () => {
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", () => {
    const searchTerm = filterData.value.toLowerCase().trim()

    if (searchTerm !== "") {

        const filteredData = originalData.filter((item) => {
            const courseName = item.courseName.toLowerCase()
            const courseId = item.courseId.toLowerCase()
            const category = item.category.toLowerCase()

            return (
                courseName.includes(searchTerm) ||
                courseId.includes(searchTerm) ||
                category.includes(searchTerm)
            )
        })

        // Update the current data with filtered data
        getData = filteredData
    }

    else {
        getData = JSON.parse(localStorage.getItem('course')) || []
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})


displayIndexBtn()