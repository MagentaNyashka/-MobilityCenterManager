function fetchAndDisplayOrders() {
    fetch('/client_fetch_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching orders:', data.error);
                return;
            }

            const mainContainer = document.getElementById('orders-table-body');
            if(mainContainer === null) {
                return;
            }
            mainContainer.innerHTML = '';

            data.forEach(row => {
                const rowElement = document.createElement('tr');
                let status;
                if(row.order_status === 'pending') {
                    status = 'Pending';
                }
                else if(row.order_status === 'in_progress') {
                    status = 'In Progress';
                }
                else if(row.order_status === 'completed') {
                    status = 'Completed';
                } else {
                    status = 'Unknown';
                }
                rowElement.innerHTML = `
                <td>${row.id_order}</td>
                <td>${row.id_user}</td>
                <td>${row.station}</td>
                <td>${row.order_time}</td>
                <td>${status}</td>
                `;
                mainContainer.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchAndDisplayEmployees() {
    fetch('/client_fetch_employees.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching employees:', data.error);
                return;
            }

            const mainContainer = document.getElementById('employees-table-body');
            if(mainContainer === null) {
                return;
            }
            mainContainer.innerHTML = '';

            data.forEach(row => {
                let color = '#ff0000';
                if (row.status === 'free') {
                    color = '#00ff00';
                }

                const rowElement = document.createElement('tr');
                let status;
                if(row.status === 'free') {
                    status = 'Free';
                }
                else if(row.status === 'busy') {
                    status = 'Busy';
                }
                else if(row.status === 'on_break') {
                    status = 'On Break';
                } else {
                    status = 'Unknown';
                }
                rowElement.innerHTML = `
                <td>${row.id_employee}</td>
                <td>${row.current_station}</td>
                <td>${row.status}</td>
                `;
                mainContainer.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchAndDisplayPairs() {
    fetch('/database_fetch_pairs.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching pairs:', data.error);
                return;
            }

            const mainContainer = document.getElementById('data_container_pairs');
            mainContainer.innerHTML = '<h1>PAIRS</h1><h2>id_order | employee_id | order_time | end_time</h2>';

            data.forEach(row => {
                const rowElement = document.createElement('div');
                rowElement.className = 'col';
                rowElement.style = 'color: #00ff00';
                rowElement.innerHTML = `<p>${row.order_id} | ${row.employee_id} | ${row.order_time} | ${row.end_time}</p>`;
                mainContainer.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchAndDisplayAll() {
    console.log('Fetching and displaying all data...');
    fetchAndDisplayOrders();
    fetchAndDisplayEmployees();
    // fetchAndDisplayPairs();
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Fetching and displaying data...');
    fetchAndDisplayAll();

    setInterval(fetchAndDisplayAll, 1000);
});