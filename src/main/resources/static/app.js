document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = form.name.value;
        const address = form.address.value;
        const age = form.age.value;

        const employee = {
            name,
            address,
            age
        };

        try {
            await saveEmployeeToIndexedDB(employee);
            displayEmployee(employee);
            form.reset();
            syncWithServer();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    });

    async function fetchEmployees() {
        try {
            const employees = await getEmployeesFromIndexedDB();
            employees.forEach(displayEmployee);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    }

    function displayEmployee(employee) {
        const employeeDiv = document.createElement('div');
        employeeDiv.className = 'card mb-3';
        employeeDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${employee.name}</h5>
                <p class="card-text"><strong>Address:</strong> ${employee.address}</p>
                <p class="card-text"><strong>Age:</strong> ${employee.age}</p>
            </div>
        `;
        employeeList.appendChild(employeeDiv);
    }

    async function syncWithServer() {
        if (navigator.onLine) {
            try {
                const employees = await getEmployeesFromIndexedDB();
                for (const employee of employees) {
                    const response = await fetch('/api/employees', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(employee)
                    });
                    if (response.ok) {
                        const savedEmployee = await response.json();
                        await deleteEmployeeFromIndexedDB(savedEmployee.id);
                    }
                }
            } catch (error) {
                console.error('Error syncing with server:', error);
            }
        }
    }

    window.addEventListener('online', syncWithServer);

    fetchEmployees();
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
}
