// Password encrypt function
function encryptPassword(password) {
    return btoa(password);
}

let editbtn = document.getElementById('edit'),
    darkBg = document.querySelector('.popup-window'),
    popupForm = document.querySelector('.popup'),
    crossBtn = document.querySelector('.closeBtn'),
    submitBtn = document.querySelector('.submitBtn'),
    modalTitle = document.querySelector('.modalTitle'),
    popupFooter = document.querySelector('.popupFooter'),
    form = document.querySelector('form'),
    formInputFields = document.querySelectorAll('form input'),
    nicNumber = document.getElementById('nicNumber'),
    fName = document.getElementById("fName"),
    lName = document.getElementById("lName"),
    age = document.getElementById("age"),
    city = document.getElementById("city"),
    dob = document.getElementById("sDate"),
    email = document.getElementById("email"),
    phone = document.getElementById("phone"),
    password = document.getElementById('password')
    originalData =JSON.parse(localStorage.getItem('students')) || [];
    loggedStudent = JSON.parse(sessionStorage.getItem('loggedStudent')) || [];  



    loadProfile()

    editbtn.addEventListener('click', ()=> {
        
        submitBtn.innerHTML = "Submit"
        modalTitle.innerHTML = "Update Details"
        popupFooter.style.display = "block"
        darkBg.classList.add('active')
        popupForm.classList.add('active')

    })
    crossBtn.addEventListener('click', ()=>{
        darkBg.classList.remove('active')
        popupForm.classList.remove('active')
        form.reset()
    })


function loadProfile() {
    if (!loggedStudent) {
        console.error('No NIC found in session storage.');
        return;
    }

    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.nicNumber === loggedStudent);

    if (!student) {
        console.error('No student found with the NIC:', loggedStudent);
        return;
    }

    // Display the profile information
    document.getElementById('nicNumber').innerHTML = student.nicNumber;
    document.getElementById('fname').innerHTML = student.fName;
    document.getElementById('lname').innerHTML = student.lName;
    document.getElementById('age').innerHTML = student.ageVal;
    document.getElementById('dob').innerHTML = student.dobVal;
    document.getElementById('phone').innerHTML = student.phoneVal;

    // Populate form fields for editing
    nicNumber.value = student.nicNumber
    fName.value = student.fName;
    lName.value = student.lName;
    age.value = student.ageVal;
    dob.value = student.dobVal;
    phone.value = student.phoneVal;

    // NIC Number should be shown but not editable
    document.getElementById('nicNumber').value = student.nicNumber; 
}


function updateProfile() {
    // Collect data from the form
    const updatedNicNumber = document.getElementById('nicNumber').innerHTML; 
    const updatedFName = fName.value.trim();
    const updatedLName = lName.value.trim();
    const updatedAge = age.value;
    const updatedDob = dob.value.trim();
    const updatedPhone = phone.value.trim();
    const updatedPassword = password.value.trim(); 

    // Retrieve the current student data
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const studentIndex = students.findIndex(student => student.nicNumber === updatedNicNumber);

    if (studentIndex === -1) {
        console.error('No student found with the NIC:', updatedNicNumber);
        return;
    }

    // Update student details (excluding NIC Number)
    students[studentIndex] = {
        ...students[studentIndex],
        fName: updatedFName,
        lName: updatedLName,
        ageVal: updatedAge,
        dobVal: updatedDob,
        phoneVal: updatedPhone,
        password: encryptPassword(updatedPassword) 
    };

    // Save updated students data back to localStorage
    localStorage.setItem('students', JSON.stringify(students));

    
    loadProfile();

    // Close the popup form
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
}

// Handle form submission
submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); 
    updateProfile();
});
