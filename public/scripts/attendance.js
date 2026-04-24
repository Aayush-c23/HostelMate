document.addEventListener('DOMContentLoaded', async () => {
    const user = checkAuth();
    if(user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    const dateInput = document.getElementById('attendanceDate');
    const tbody = document.getElementById('attendanceList');

    dateInput.valueAsDate = new Date();
    await renderTable();

    dateInput.addEventListener('change', async () => {
        await renderTable();
    });

    async function renderTable() {
        tbody.innerHTML = '';

        try {
            // Get students from API
            const studentsResponse = await fetch('/api/students');
            const students = await studentsResponse.json();

            if(students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">No students registered yet.</td></tr>';
                return;
            }

            // Get attendance for selected date
            const selectedDate = dateInput.value;
            const attendanceResponse = await fetch(`/api/attendance/${selectedDate}`);
            const attendanceData = await attendanceResponse.json();
            
            const savedStatuses = attendanceData.records || [];
            const statusMap = {};
            savedStatuses.forEach(record => {
                statusMap[record.studentId] = record.status;
            });

            students.forEach(student => {
                const status = statusMap[student._id] || 'Present';

                const row = `
                    <tr data-email="${student.email}">
                        <td style="font-weight:600; display:flex; align-items:center; gap:10px;">
                            <img src="assets/images/login-student.png" style="width:30px; height:30px; border-radius:50%;">
                            ${student.name}
                        </td>
                        <td>${student.room || 'N/A'}</td>
                        <td>
                            <label style="margin-right:15px; cursor:pointer;">
                                <input type="radio" name="status-${student._id}" value="Present" ${status === 'Present' ? 'checked' : ''}> 
                                <span style="color:#10B981; font-weight:bold; margin-left:5px;">Present</span>
                            </label>
                            <label style="cursor:pointer;">
                                <input type="radio" name="status-${student._id}" value="Absent" ${status === 'Absent' ? 'checked' : ''}> 
                                <span style="color:#EF4444; font-weight:bold; margin-left:5px;">Absent</span>
                            </label>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Error loading data</td></tr>';
        }
    }

    window.saveAttendance = async () => {
        const date = dateInput.value;
        const rows = tbody.querySelectorAll('tr');
        const records = [];

        try {
            const studentsResponse = await fetch('/api/students');
            const students = await studentsResponse.json();

            students.forEach(student => {
                const checkedRadio = document.querySelector(`input[name="status-${student._id}"]:checked`);
                if(checkedRadio) {
                    records.push({
                        studentId: student._id,
                        studentName: student.name,
                        status: checkedRadio.value
                    });
                }
            });

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, records })
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || `Attendance saved for ${date}!`);
            } else {
                alert('Error saving attendance');
            }
        } catch (error) {
            alert('Error saving attendance');
        }
    };
});