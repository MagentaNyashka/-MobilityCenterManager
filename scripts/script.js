var Orders = [];
var Employees = [];
var Matches = [];

class Employee {
    constructor(id, current_station, status){
        this.id = id;
        this.current_station = current_station;
        this.status = status;
    }
}


class Order {
    constructor(id_order, id_user, station, order_time, order_status){
        this.id_order = id_order;
        this.id_user = id_user;
        this.station = station;
        this.order_time = order_time;
        this.order_status = order_status;
    }
}



function stableMarriage(orders, employees) {
    const unmatchedOrders = [...orders];
    const unmatchedEmployees = [...employees];

    const matches = [];

    while (unmatchedOrders.length > 0) {
        const order = unmatchedOrders.shift();

        unmatchedEmployees.sort((a, b) => {
            if (a.status === 'free' && b.status !== 'free') return -1;
            if (a.status !== 'free' && b.status === 'free') return 1;
            return a.current_station.localeCompare(order.station);
        });

        const bestMatch = unmatchedEmployees.shift();

        if (bestMatch) {
            matches.push({ order, employee: bestMatch });


            if (bestMatch.status === 'free') {
                bestMatch.status = 'working';
            }
        } else {
            console.warn(`No available employee for order ${order.id_order}`);
        }
    }

    return matches;
}


function fetch_orders(){
    fetch('database_fetch_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                console.error('Error:', data.error);
                return;
            }
            Orders = [];
            data.forEach(row => {
                Orders.push(new Order(row.id_order, row.id_user, row.station, row.order_time, row.order_status));
            });
        });
}

function fetch_employees(){
    fetch('database_fetch_employees.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                console.error('Error:', data.error);
                return;
            }
            Employees = [];
            data.forEach(row => {
                Employees.push(new Employee(row.id_employee, row.current_station, row.status));
            });
        });
}

function draw_orders(){
    const mainContainer = document.getElementById('data_container_orders');
    mainContainer.innerHTML = '<h1>ORDERS</h1>';
    Orders.forEach(row => {
        let color = '#ff0000';
        if (row.order_status === 'pending')
        {
            color = '#ffff00';
        }
        else if (row.order_status === 'completed')
        {
            color = '#00ff00';
        }
        const rowElement = document.createElement('div');
        rowElement.className = 'col';
        rowElement.style = `color: ${color}`;
        rowElement.innerHTML = `<p>${row.id_order} | ${row.id_user} | ${row.station} | ${row.order_time} | ${row.order_status}</p>`;
        mainContainer.appendChild(rowElement);
    });
}

function draw_employees(){
    const mainContainer = document.getElementById('data_container_employees');
    mainContainer.innerHTML = '<h1>EMPLOYEES</h1>';
    Employees.forEach(row => {
        let color = '#ff0000';
        if (row.status === 'free')
        {
            color = '#00ff00';
        }
        const rowElement = document.createElement('div');
        rowElement.className = 'col';
        rowElement.style = `color: ${color}`;
        rowElement.innerHTML = `<p>${row.id} | ${row.current_station} | ${row.status}</p>`;
        mainContainer.appendChild(rowElement);
    });
}

function draw_pairs(){
    const mainContainer = document.getElementById('data_container_pairs');
    mainContainer.innerHTML = '<h1>PAIRS</h1>';
    Matches.forEach(row => {
        let color = '#00ff00';
        const rowElement = document.createElement('div');
        rowElement.className = 'col';
        rowElement.style = `color: ${color}`;
        rowElement.innerHTML = `<p>${row.order.id_order} | ${row.employee.id} | ${row.order.id_user}</p>`;
        mainContainer.appendChild(rowElement);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    setInterval(() => {

        fetch_orders();
        fetch_employees();

        console.log(Orders);
        console.log(Employees);

        setTimeout(() => {
            Matches = stableMarriage(Orders, Employees);
            console.log('Matches:', Matches);
        }, 200);

        setTimeout(() => {
            draw_orders();
            draw_employees();
            draw_pairs();
        }, 200);

    }, 4000);
})