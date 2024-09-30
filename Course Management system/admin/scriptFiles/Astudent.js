// Function to simulate password encryption (for demonstration purposes)
function encryptPassword(password) {
    return btoa(password);
}


var newStudentAddBtn = document.querySelector('.addStudentBtn'),
darkBg = document.querySelector('.popup-window'),
passwordField = document.getElementById('passwordField')
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
  password = document.getElementById('password'),
  entries = document.querySelector(".showEntries"),
  tabSize = document.getElementById("table_size"),
 userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table")
 filterData = document.getElementById("search")

let originalData = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : []
let getData = [...originalData]


let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()


newStudentAddBtn.addEventListener('click', ()=> {
    isEdit = false
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"
    popupFooter.style.display = "block"
    darkBg.classList.add('active')
    popupForm.classList.add('active')
    
    // pwdField.add('active')
})

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})


function preLoadCalculations(){
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if((arrayLength % tableSize) > 0){
        maxIndex++
    }
}



function displayIndexBtn(){
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick= "paginationBtn('+i+')" index="'+i+'">'+i+'</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}


function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if(endIndex > arrayLength){
        endIndex = arrayLength
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active')
        }
    })


    showInfo()
}




function showInfo(){
    document.querySelectorAll(".studentDetails").forEach(info => info.remove())

    var tab_start = startIndex - 1
    var tab_end = endIndex

    if(getData.length > 0){
        for(var i=tab_start; i<tab_end; i++){
            var student = getData[i]


            if(student){
                let createElement = `<tr class = "studentDetails">
                <td>${i+1}</td>
                <td>${student.nicNumber}</td>
                <td>${student.fName + " " + student.lName}</td>
                <td>${student.ageVal}</td>
                <td>${student.dobVal}</td>
                <td>${student.phoneVal}</td>
                <td>
                    <button onclick="readInfo('${student.nicNumber}','${student.fName}', '${student.lName}', '${student.ageVal}', '${student.dobVal}', '${student.phoneVal}')"><i class="fa-regular fa-eye"></i></button>

                    <button onclick="editInfo('${i}','${student.nicNumber}' , '${student.fName}', '${student.lName}', '${student.ageVal}', '${student.dobVal}','${student.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>


                    <button onclick = "deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`

                userInfo.innerHTML += createElement
                table.style.minWidth = "100%"
            }
        }
    }


    else{
        userInfo.innerHTML = `<tr class="studentDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`
        table.style.minWidth = "100%"
    }
}

showInfo()


function readInfo(NicNumber, fname, lname, Age,Dob, Phone){
    nicNumber.value =  NicNumber
    fName.value = fname
    lName.value = lname
    age.value = Age
    dob.value = Dob
    phone.value = Phone

    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "none"
    modalTitle.innerHTML = "Profile"
    formInputFields.forEach(input => {
        input.disabled = true
    })
}

function editInfo(id,NicNumber, fname, lname, Age,Dob, Phone){
    isEdit = true
    editId = id

    // Find the index of the item to edit in the original data based on id
    const originalIndex = originalData.findIndex(item => item.id === id)

    // Update the original data
    originalData[originalIndex] = {
        id: id,
        nicNumber :NicNumber,
        fName: fname,
        lName: lname,
        ageVal: Age,
        dob : Dob,
        phoneVal: Phone
    }

    nicNumber.value= NicNumber
    fName.value = fname
    lName.value = lname
    age.value = Age
    dob.value = Dob
    phone.value = Phone


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "block"
    modalTitle.innerHTML = "Update the Form"
    submitBtn.innerHTML = "Update"

    formInputFields.forEach(input => {
        input.disabled = false
    })

}



function deleteInfo(index){
    if(confirm("Aer you sure want to delete?")){
        originalData.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(originalData));
        
        // Update getData after deleting the record
        getData = [...originalData];

        preLoadCalculations()

        if(getData.length === 0){
            currentIndex = 1
            startIndex = 1
            endIndex = 0
        }
        else if(currentIndex > maxIndex){
            currentIndex = maxIndex
        }

        showInfo()
        highlightIndexBtn()
        displayIndexBtn()

        var nextBtn = document.querySelector('.next')
        var prevBtn = document.querySelector('.prev')

        if(Math.floor(maxIndex) > currentIndex){
            nextBtn.classList.add("act")
        }
        else{
            nextBtn.classList.remove("act")
        }


        if(currentIndex > 1){
            prevBtn.classList.add('act')
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nicNumberValue = nicNumber.value.trim();
    const fNameValue = fName.value.trim();
    const lNameValue = lName.value.trim();
    const ageValue = age.value.trim();
    const dobValue = dob.value.trim();
    const phoneValue = phone.value.trim();
    const passwordValue = password.value.trim();

    // Check for duplicate NIC number
    const isDuplicate = originalData.some(student => student.nicNumber === nicNumberValue && student.id !== (isEdit ? originalData[editId].id : null));

    if (isDuplicate) {
        alert('A student with this NIC number already exists.');
        return;
    }

    const information = {
        id: Date.now(),
        nicNumber: nicNumberValue,
        fName: fNameValue,
        lName: lNameValue,
        ageVal: ageValue,
        dobVal: dobValue,
        phoneVal: phoneValue,
        password: encryptPassword(passwordValue),
    };

    if (!isEdit) {
        originalData.unshift(information);
    } else {
        originalData[editId] = information;
    }
    getData = [...originalData];
    localStorage.setItem('students', JSON.stringify(originalData));

    submitBtn.innerHTML = "Submit";
    modalTitle.innerHTML = "Fill the Form";

    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();

    highlightIndexBtn();
    displayIndexBtn();
    showInfo();

    var nextBtn = document.querySelector(".next");
    var prevBtn = document.querySelector(".prev");
    if (Math.floor(maxIndex) > currentIndex) {
        nextBtn.classList.add("act");
    } else {
        nextBtn.classList.remove("act");
    }

    if (currentIndex > 1) {
        prevBtn.classList.add("act");
    }
});



function next(){
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if(currentIndex <= maxIndex - 1){
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act")
    }
}


function prev(){
    var prevBtn = document.querySelector('.prev')

    if(currentIndex > 1){
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}


function paginationBtn(i){
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act')
    }
    else{
        nextBtn.classList.add("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", ()=> {
    const searchTerm = filterData.value.toLowerCase().trim()

    if(searchTerm !== ""){

        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.lName).toLowerCase()
            const nicNumber = item.nicNumber.toLowerCase()

            return(
                fullName.includes(searchTerm) ||
                nicNumber.includes(searchTerm)
            )
        })

        // Update the current data with filtered data
        getData = filteredData
    }

    else{
        getData = JSON.parse(localStorage.getItem('students')) || []
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})


displayIndexBtn()