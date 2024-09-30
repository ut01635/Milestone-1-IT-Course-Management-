
let darkBg = document.querySelector('.popup-window'),
    paymentwindow = document.getElementById('paymentwindow')
    popupForm = document.querySelector('.popup'),
    paymentpopup = document.querySelector('.paymentPopup'),
    body = document.querySelector('body')
    crossBtn = document.querySelector('.closeBtn'),
    closeBtn = document.getElementById('closeBtn')
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
    table = document.querySelector("table"),
    filterData = document.getElementById("search");

// Initialize data
let originalData = JSON.parse(localStorage.getItem('course')) || [];
let getData = [...originalData];
let loggedStudent = JSON.parse(sessionStorage.getItem('loggedStudent')) || null;
let payment = JSON.parse(localStorage.getItem('payment'))|| [] ;

let isEdit = false, editId;

let arrayLength = 0;
let tableSize = 10;
let startIndex = 1;
let endIndex = 0;
let currentIndex = 1;
let maxIndex = 0;

// Show profile
loadProfile();

crossBtn.addEventListener('click', () => {
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();
});

closeBtn.addEventListener('click',()=>{
    paymentwindow.classList.remove('active');
    paymentpopup.classList.remove('active');
    form.reset();
})


function preLoadCalculations() {
    arrayLength = getData.length;
    maxIndex = Math.ceil(arrayLength / tableSize);
}

function readInfo(CourseId, CourseName, Category, Duration, CourseFee) {
    courseId.value = CourseId;
    courseName.value = CourseName;
    category.value = Category;
    duration.value = Duration + " Months";
    courseFee.value = CourseFee + ".00";

    darkBg.classList.add('active');
    popupForm.classList.add('active');
    modalTitle.innerHTML = "Course Details";
    formInputFields.forEach(input => input.disabled = true);
}

filterData.addEventListener("input", () => {
    const searchTerm = filterData.value.toLowerCase().trim();

    if (searchTerm !== "") {
        getData = originalData.filter(item => {
            const courseName = item.courseName.toLowerCase();
            const courseId = item.courseId.toLowerCase();
            const category = item.category.toLowerCase();

            return courseName.includes(searchTerm) || courseId.includes(searchTerm) || category.includes(searchTerm);
        });
    } else {
        getData = [...originalData];
    }

    currentIndex = 1;
    startIndex = 1;
    displayIndexBtn();
});



function loadProfile() {
    if (!loggedStudent) {
        console.error('No logged student found.');
        return;
    }

    let Courses = JSON.parse(localStorage.getItem('followedCourse')) || [];
    let followedCourses = Courses.filter(course => course.nicNumber === loggedStudent);
    
    // Fetch payments from local storage
    let payments = JSON.parse(localStorage.getItem('payment')) || [];

    if (followedCourses.length === 0) {
        courseInfo.innerHTML = `<tr class="courseDetails"><td class="empty" colspan="6" align="center">No data available in table</td></tr>`;
        table.style.minWidth = "100%";
    } else {
        courseInfo.innerHTML = "";
        followedCourses.forEach((course, i) => {
            // Calculate total amount paid for the course
            let totalPaid = payments
                .filter(payment => payment.courseId === course.courseId)
                .reduce((total, payment) => total + parseFloat(payment.amount), 0);

            // Calculate pending amount
            totalPaid = payment.amount|| 0
            console.log(totalPaid);
            console.log(course.courseFee);
            let pendingAmount = course.courseFee - totalPaid//totalPaid;
            console.log(pendingAmount)

            // Format the amount
            // pendingAmount = pendingAmount.toFixed(2);

            // Create table row for the course
            let createElement = `<tr class="courseDetails">
                <td>${course.courseId}</td>
                <td>${course.courseName}</td>
                <td>${course.courseFee}</td>
                <td>${pendingAmount}</td>
                <td>
                    <button onclick="readInfo('${course.courseId}','${course.courseName}', '${course.category}', '${course.duration}', '${course.courseFee}')"><i class="fa-regular fa-eye"></i></button>
                    <button onclick="paycoursefee(${i})"><img class="icons" src="./styles/payment.png" alt="img"></i></button>
                </td>
            </tr>`;

            courseInfo.innerHTML += createElement;
        });
        table.style.minWidth = "100%";
    }
}


function paycoursefee(index) {
    let Courses = JSON.parse(localStorage.getItem('followedCourse')) || [];
    let course = Courses[index];

    // Display the payment popup
    paymentwindow.classList.add('active');
    paymentpopup.classList.add('active');
    modalTitle.innerHTML = "Payment Form";

    // Create payment form dynamically
    popupFooter.innerHTML = `
        <form id="paymentForm">
             <div class="form_control">
                    <label for="courseFee">Course Fee:</label>
                     <input type="text" id="courseFeeInput" value="${course.courseFee}" disabled />
             </div>
             <div class="form_control">   
            <label for="paymentPlan">Payment Plan:</label>
            <select id="paymentPlan">
                <option value="full">Full Payment</option>
                <option value="divide">Divide by Duration</option>
            </select>
            </div>
            <div class="form_control">
            <div id="paymentAmountContainer">
                <label for="paymentAmount">Payment Amount:</label>
                <input type="text" id="paymentAmount" value="${course.courseFee}" disabled />
            </div>
            </div>
            
            <button type="button" id="submitPayment">Submit Payment</button>
        </form>
    `;

    // Update payment amount based on selected plan
    const paymentPlanSelect = document.getElementById('paymentPlan');
    const paymentAmountInput = document.getElementById('paymentAmount');
    const submitPaymentBtn = document.getElementById('submitPayment');
    
    paymentPlanSelect.addEventListener('change', () => {
        const selectedPlan = paymentPlanSelect.value;
        let amountToPay;

        if (selectedPlan === 'full') {
            amountToPay = course.courseFee;
        } else if (selectedPlan === 'divide') {
            amountToPay = (course.courseFee / course.duration).toFixed(2);
        }

        paymentAmountInput.value = amountToPay + ".00";
    });

    // Handle payment submission
    submitPaymentBtn.addEventListener('click', () => {
        const selectedPlan = paymentPlanSelect.value;
        let amountToPay;

        if (selectedPlan === 'full') {
            amountToPay = course.courseFee;
        } else if (selectedPlan === 'divide') {
            amountToPay = (course.courseFee / course.duration).toFixed(2);
        }

        // Create a payment entry
        const paymentEntry = {
            nicNumber: loggedStudent,
            courseId: course.courseId,
            amount: amountToPay,
            plan: selectedPlan,
            date: new Date().toISOString()
        };

        // Retrieve existing payments and add the new entry
        let payments = JSON.parse(localStorage.getItem('payment')) || [];
        payments.push(paymentEntry);
        alert("Payment Succsesfull")
        localStorage.setItem('payment', JSON.stringify(payments));

        // Remove the course from followedCourses
        let updatedCourses = Courses.filter((_, i) => i !== index);
        localStorage.setItem('followedCourse', JSON.stringify(updatedCourses));
        loadProfile(); 

        // Hide the payment form
        paymentwindow.classList.remove('active');
        paymentpopup.classList.remove('active');
    });

    // Close button functionality
    const closeBtn = document.querySelector('#paymentpopup .closeBtn');
    closeBtn.addEventListener('click', () => {
        paymentwindow.classList.remove('active');
        paymentpopup.classList.remove('active');
    });
}
