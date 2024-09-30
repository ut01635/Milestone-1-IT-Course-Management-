document.addEventListener('DOMContentLoaded', () => {

    // Function to generate and display the report based on type and filter
    function generateReport() {
        const reportType = document.getElementById('reportType').value;
        const searchFilter = document.getElementById('searchFilter').value.trim();
        const reportContainer = document.getElementById('reportContainer');

        // Hide all reports initially
        reportContainer.innerHTML = '';

        // Retrieve data from localStorage
        const enrollments = JSON.parse(localStorage.getItem('followedCourse')) || [];
        const payments = JSON.parse(localStorage.getItem('payment')) || [];
        const students = JSON.parse(localStorage.getItem('students')) || [];

        // Helper function to get student names
        // function getStudentName(nicNumber) {
        //     const student = students.find(student => student.nicNumber === nicNumber);
        //     return student ? student.studentName : 'Unknown';
        // }

        function getStudentName(nicNumber) {
            console.log('Searching for student with NIC:', nicNumber);
            const student = students.find(student => student.nicNumber === nicNumber);
            if (student) {
                console.log('Found student:', student);
                return student.fName +" "+ student.lName;
            } else {
                console.log('Student not found for NIC:', nicNumber);
                return 'Unknown';
            }
        }
        

        // Helper function to get course details by NIC number
        function getCourseDetailsByNIC(nicNumber) {
            return enrollments.filter(enrollment => enrollment.nicNumber === nicNumber);
        }
        
function generateCourseReport() {
    let html = '<table class="report-table">';
    html += '<thead><tr><th>NIC Number</th><th>Student Name</th><th>Course ID</th><th>Course Name</th><th>Course Fee</th></tr></thead><tbody>';

    enrollments
        .filter(enrollment => 
            (searchFilter === '' || enrollment.nicNumber.includes(searchFilter) || enrollment.courseId.includes(searchFilter))
        )
        .forEach(enrollment => {
            const studentName = getStudentName(enrollment.nicNumber); 
            html += `<tr>
                        <td>${enrollment.nicNumber}</td>
                        <td>${studentName}</td>
                        <td>${enrollment.courseId}</td>
                        <td>${enrollment.courseName}</td>
                        <td>${enrollment.courseFee}</td>
                    </tr>`;
        });

    html += '</tbody></table>';
    reportContainer.innerHTML = html;
}


        // Function to generate Payment Report
        function generatePaymentReport() {
            let html = '<table class="report-table">';
            html += '<thead><tr><th>NIC Number</th><th>Course Name(s)</th><th>Course Fee(s)</th><th>Paid Amount</th><th>Pending Fee</th><th>Date</th><th>Plan</th></tr></thead><tbody>';
        
            // Group payments by NIC number
            const paymentsByNIC = payments.reduce((acc, payment) => {
                if (!acc[payment.nicNumber]) {
                    acc[payment.nicNumber] = { totalPaid: 0, payments: [] };
                }
                acc[payment.nicNumber].totalPaid += parseFloat(payment.paidAmount || 0); // Ensure 'paidAmount' is a number
                acc[payment.nicNumber].payments.push(payment);
                return acc;
            }, {});
        
            // Iterate over enrollments and calculate the outstanding amount
            enrollments
                .filter(enrollment => 
                    (searchFilter === '' || enrollment.nicNumber.includes(searchFilter) || enrollment.courseId.includes(searchFilter))
                )
                .forEach(enrollment => {
                    const paymentInfo = paymentsByNIC[enrollment.nicNumber] || { totalPaid: 0, payments: [] };
                    // const paidAmount = paymentInfo.amount;
                    // const pendingFee = enrollment.courseFee -  payments.amount;
        
                    // Filter payments related to the current enrollment
                    const enrollmentPayments = paymentInfo.payments.filter(payment => payment.courseId === enrollment.courseId);
        
                    enrollmentPayments.forEach(payment => {
                        // Debug output to check payment details
                        console.log('Payment details:', payment);
        
                        // Ensure date is valid and format it
                        const date = new Date(payment.date);
                        const formattedDate = isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
        
                        // Ensure plan is defined
                        const plan = payment.plan || 'Not Available';
                        
                        html += `<tr>
                                    <td>${enrollment.nicNumber}</td>
                                    <td>${enrollment.courseName}</td>
                                    <td>${enrollment.courseFee.toFixed(2)}</td>
                                    <td>${parseFloat(payment.amount || 0).toFixed(2)}</td>
                                    <td>${enrollment.courseFee - payment.amount}</td>
                                    <td>${formattedDate}</td>
                                    <td>${plan}</td>
                                </tr>`;
                    });
                });
        
            html += '</tbody></table>';
            reportContainer.innerHTML = html;
        }
        

        // Generate the appropriate report based on the selection
        if (reportType === 'courseEnrollment') {
            generateCourseReport();
        } else if (reportType === 'payment') {
            generatePaymentReport();
        }
    }

    // Add event listener to the button
    document.getElementById('generateReport').addEventListener('click', generateReport);
});
