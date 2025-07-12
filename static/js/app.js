const employeeListEl = document.getElementById('employeeList');
const searchInputEl = document.getElementById('searchInput');

const addBtn = document.getElementById('addEmployeeBtn')
const formContainer = document.getElementById('employeeFormContainer')
const formEl = document.getElementById('employeeForm')
const cancelBtn = document.getElementById('cancelBtn')

const sortSelectEl = document.getElementById('sortSelect')

const paginationEl = document.getElementById('paginationContainer');

const filterBtn = document.querySelector('.filter-button');
const filterSection = document.getElementById('filterSection');
const filterDepartment = document.getElementById('filterDepartment');
const filterRole = document.getElementById('filterRole');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const resetFilterBtn = document.getElementById('resetFilterBtn');



const rowsPerPageSelectEl = document.getElementById('rowsPerPageSelect');
let currentPage = 1;
let rowsPerPage = parseInt(rowsPerPageSelectEl.value);

let currentFilteredEmployees = [...mockEmployees];

filterBtn.addEventListener('click', () => {
    filterSection.classList.toggle('hidden');
});

applyFilterBtn.addEventListener('click', () => {
    const department = filterDepartment.value;
    const role = filterRole.value;

    const filtered = mockEmployees.filter(emp => {
        return (department === '' || emp.department === department) &&
            (role === '' || emp.role === role);
    });

    renderEmployees(filtered, 1);
});

resetFilterBtn.addEventListener('click', () => {
    filterDepartment.value = '';
    filterRole.value = '';
    renderEmployees(mockEmployees, 1);
});



function handleDelete(empId) {
    const confirmed = confirm('Are you sure you want to delete this employee?')
    if (confirmed) {
        const index = mockEmployees.findIndex(emp => emp.id === empId)
        if (index !== -1) {
            mockEmployees.splice(index, 1)
            renderEmployees(mockEmployees)
        }
    }
}

addBtn.addEventListener('click', () => {
    formContainer.classList.remove('hidden')
})

cancelBtn.addEventListener('click', () => {
    formEl.reset()
    formContainer.classList.add('hidden')
})

rowsPerPageSelectEl.addEventListener('change', () => {
    rowsPerPage = parseInt(rowsPerPageSelectEl.value);
    renderEmployees(currentFilteredEmployees, 1);
});




formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const newEmployee = {
        id: Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value
    }

    mockEmployees.push(newEmployee)
    renderEmployees(mockEmployees)
    formEl.reset()
    formContainer.classList.add('hidden')
})


function renderEmployees(employees = currentFilteredEmployees, page = 1) {
    currentFilteredEmployees = employees
    employeeListEl.innerHTML = '';
    currentPage = page;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = employees.slice(start, end);

    if (paginatedItems.length === 0) {
        employeeListEl.innerHTML = '<p>No employees found.</p>';
        return;
    }

    paginatedItems.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'employee-card';

        card.innerHTML = `
      <div class="employee-list-card">
        <div>
          <h3>${emp.firstName} ${emp.lastName}</h3>
          <p><span class="span">Email:</span> ${emp.email}</p>
          <p><span class="span">Department:</span> ${emp.department}</p>
          <p><span class="span">Role:</span> ${emp.role}</p>
        </div>
        <div class="employee-card-btn-container">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

        card.querySelector('.delete-btn').addEventListener('click', () => handleDelete(emp.id));
        card.querySelector('.edit-btn').addEventListener('click', () => alert(`Edit ${emp.firstName}`));

        employeeListEl.appendChild(card);
    });

    renderPagination(employees);
}


function renderPagination(employees) {


    const pageCount = Math.ceil(employees.length / rowsPerPage);
    paginationEl.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');

        btn.addEventListener('click', () => {
            renderEmployees(employees, i);
        });

        paginationEl.appendChild(btn);
    }
}






sortSelectEl.addEventListener('change', () => {
    const selectedValue = sortSelectEl.value

    let sortedEmployees = [...mockEmployees] // Clone array

    if (selectedValue === 'firstName') {
        sortedEmployees.sort((a, b) => a.firstName.localeCompare(b.firstName))
    } else if (selectedValue === 'department') {
        sortedEmployees.sort((a, b) => a.department.localeCompare(b.department))
    }

    renderEmployees(sortedEmployees, 1)
})


searchInputEl.addEventListener('input', () => {
    const keyword = searchInputEl.value.toLowerCase();

    const filtered = mockEmployees.filter(emp =>
        emp.firstName.toLowerCase().includes(keyword) ||
        emp.lastName.toLowerCase().includes(keyword) ||
        emp.email.toLowerCase().includes(keyword)
    );

    renderEmployees(filtered, 1);
});

renderEmployees(mockEmployees);
