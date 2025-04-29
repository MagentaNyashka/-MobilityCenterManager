var Orders = [];
var Employees = [];
var Matches = [];
var Stations = [];

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

class Station {
    constructor(id, station_from_id, station_to_id){
        this.id = id;
        this.station_from_id = station_from_id;
        this.station_to_id = station_to_id;
    }
}


function updateOrderStatus(orderId, newStatus) {
    fetch('database_update_order_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }
        console.log('Order status updated successfully:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function stableMarriage(orders, employees, stations) {
    const unmatchedOrders = [...orders.filter(order => order.order_status === 'pending')];
    const unmatchedEmployees = [...employees];

    const matches = [];

    while (unmatchedOrders.length > 0) {
        const order = unmatchedOrders.shift();

        unmatchedEmployees.sort((a, b) => {
            if (a.status === 'free' && b.status !== 'free') return -1;
            if (a.status !== 'free' && b.status === 'free') return 1;

            const pathA = findShortestPath(stations, a.current_station, order.station);
            const pathB = findShortestPath(stations, b.current_station, order.station);

            const distanceA = pathA ? pathA.length : Infinity;
            const distanceB = pathB ? pathB.length : Infinity;

            return distanceA - distanceB;
        });

        const bestMatch = unmatchedEmployees.shift();

        if (bestMatch) {
            matches.push({ order, employee: bestMatch });
            updateOrderStatus(order.id_order, 'completed');
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

function fetch_stations(){
    fetch('database_fetch_stations.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                console.error('Error:', data.error);
                return;
            }
            Stations = [];
            data.forEach(row => {
                Stations.push(new Station(row.id, row.station_from_id, row.station_to_id));
            });
        });
}

function draw_orders(){
    const mainContainer = document.getElementById('data_container_orders');
    mainContainer.innerHTML = '<h1>ORDERS</h1><h2>id_order | id_user | station | order_time | order_status</h2>';
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
    mainContainer.innerHTML = '<h1>EMPLOYEES</h1><h2>id | current_station | status</h2>';
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
    mainContainer.innerHTML = '<h1>PAIRS</h1><h2>id_order | employee.id | order.id_user</h2>';
    Matches.forEach(row => {
        let color = '#00ff00';
        const rowElement = document.createElement('div');
        rowElement.className = 'col';
        rowElement.style = `color: ${color}`;
        rowElement.innerHTML = `<p>${row.order.id_order} | ${row.employee.id} | ${row.order.id_user}</p>`;
        mainContainer.appendChild(rowElement);
    });
}

function findShortestPath(stations, start, end) {
    if (start === end) return [start];

    const graph = {};
    stations.forEach(station => {
        if (!graph[station.station_from_id]) {
            graph[station.station_from_id] = [];
        }
        graph[station.station_from_id].push(station.station_to_id);
    });

    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let station = path[path.length - 1];

        if (station === end) {
            return path;
        }

        if (!visited.has(station)) {
            visited.add(station);

            let neighbors = graph[station] || [];
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    queue.push([...path, neighbor]);
                }
            }
        }
    }

    return null;
}

document.addEventListener('DOMContentLoaded', function() {
    setInterval(() => {

        fetch_orders();
        fetch_employees();
        fetch_stations();

        setTimeout(() => {
            console.log('Orders:', Orders);
            console.log('Employees:', Employees);
            console.log('Stations:', Stations);
        }, 200);

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