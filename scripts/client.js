function fetchAndDisplayOrders() {
    fetch('database_fetch_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching orders:', data.error);
                return;
            }

            const mainContainer = document.getElementById('data_container_orders');
            mainContainer.innerHTML = '<h1>ORDERS</h1><h2>id_order | id_user | station | order_time | order_status</h2>';

            data.forEach(row => {
                let color = '#ff0000';
                if (row.order_status === 'pending') {
                    color = '#ffff00';
                } else if (row.order_status === 'completed') {
                    color = '#00ff00';
                }

                const rowElement = document.createElement('div');
                rowElement.className = 'col';
                rowElement.style = `color: ${color}`;
                rowElement.innerHTML = `<p>${row.id_order} | ${row.id_user} | ${row.station} | ${row.order_time} | ${row.order_status}</p>`;
                mainContainer.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchAndDisplayEmployees() {
    fetch('database_fetch_employees.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error fetching employees:', data.error);
                return;
            }

            const mainContainer = document.getElementById('data_container_employees');
            mainContainer.innerHTML = '<h1>EMPLOYEES</h1><h2>id | current_station | status</h2>';

            data.forEach(row => {
                let color = '#ff0000';
                if (row.status === 'free') {
                    color = '#00ff00';
                }

                const rowElement = document.createElement('div');
                rowElement.className = 'col';
                rowElement.style = `color: ${color}`;
                rowElement.innerHTML = `<p>${row.id_employee} | ${row.current_station} | ${row.status}</p>`;
                mainContainer.appendChild(rowElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

function fetchAndDisplayPairs() {
    fetch('database_fetch_pairs.php')
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
    fetchAndDisplayPairs();
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Fetching and displaying data...');
    fetchAndDisplayAll();

    setInterval(fetchAndDisplayAll, 5000);
});