var Orders = [];
var Employees = [];
var Matches = [];
var Stations = [];
var Pairs = [];

class Employee {
    constructor(id, current_station, status, end_time){
        this.id = id;
        this.current_station = current_station;
        this.status = status;
        this.end_time = end_time;
    }
}

class Order {
    constructor(id_order, id_user, station, order_time, order_status, employees_required){
        this.id_order = id_order;
        this.id_user = id_user;
        this.station = station;
        this.order_time = order_time;
        this.order_status = order_status;
        this.employees_required = employees_required;
    }
}

class Station {
    constructor(id, station_from_id, station_to_id){
        this.id = id;
        this.station_from_id = station_from_id;
        this.station_to_id = station_to_id;
    }
}

class Pair {
    constructor(id, order, employee, order_time){
        this.id = id;
        this.order = order;
        this.employee = employee;
        this.order_time = order_time;
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
            // console.error('Error:', data.error);
            return;
        }
        // console.log('Order status updated successfully:', data);
    })
    .catch(error => {
        // console.error('Error:', error);
    });
}

function fillPairs(match) {
    console.log("Filling pairs...");
    fetch('database_update_pairs.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            orderId: match.order.id_order, 
            employeeId: match.employee.id,
            orderTime: match.order.order_time
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // console.error('Error:', data.error);
            return;
        }
        // console.log('Order status updated successfully:', data);
    })
    .catch(error => {
        // console.error('Error:', error);
    });
}

function stableMarriage(orders, employees, stations) {
    const unmatchedOrders = [...orders];
    const unmatchedEmployees = [...employees];

    const matches = [];

    while (unmatchedOrders.length > 0) {
        const order = unmatchedOrders.shift();
        console.log(`Finding match for ${order.id_order}`);
        while(unmatchedEmployees.length > 0 && order.employees_required > 0){
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
                console.log(`Found best match for ${order.id_order} -> ${bestMatch.id}`)
                order.employees_required -= 1;
                matches.push({ order, employee: bestMatch });
            } else {
                // console.warn(`No available employee for order ${order.id_order}`);
            }
        }
    }

    Matches = matches;
}

function fetch_orders(){
    console.log("Fetching orders...");
    fetch('database_fetch_orders.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                // console.error('Error:', data.error);
                return;
            }
            Orders = [];
            if(data.length > 0 && data[0][0] != -1){
                data.forEach(row => {
                    Orders.push(new Order(row.id_order, row.id_user, row.station, row.order_time, row.order_status, row.employees_required));
                });
            }
        });
}

function fetch_employees(){
    console.log("Fetching employees...");
    fetch('database_fetch_employees.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                // console.error('Error:', data.error);
                return;
            }
            Employees = [];
            data.forEach(row => {
                Employees.push(new Employee(row.id_employee, row.current_station, row.status));
            });
        });
}

function fetch_stations(){
    console.log("Fetching stations...");
    fetch('database_fetch_stations.php')
        .then(response => response.json())
        .then(data => {
            if (data.error){
                // console.error('Error:', data.error);
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
    Pairs.forEach(row => {
        let color = '#00ff00';
        const rowElement = document.createElement('div');
        rowElement.className = 'col';
        rowElement.style = `color: ${color}`;
        rowElement.innerHTML = `<p>${row.order} | ${row.employee} | ${row.order_time}</p>`;
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

function fetchPairs() {
    console.log("Fetching pairs...");
    fetch('database_fetch_pairs.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // console.error('Error:', data.error);
                return;
            }
            Pairs = [];
            data.forEach(row => {
                Pairs.push(new Pair(row.id, row.order_id, row.employee_id, row.order_time));
            });
            // console.log('Pairs:', Pairs);
        });
}

function completeOrder(orderId) {
    fetch('database_complete_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // console.error('Error:', data.error);
            return;
        }
        // console.log('Order completed successfully:', data);
    })
    .catch(error => {
        // console.error('Error:', error);
    });
}

function makePairs(){
    console.log("Making pairs...");
    if(Matches.length > 0){
        Matches.forEach(match => { 
            fillPairs(match);                
        });
    }
    else{
        // console.warn('No orders to process');
    }
}
    
function updatePairs(){
    console.log("Updating pairs...");
    Pairs.forEach(pair => {
        const orderTime = new Date(pair.order_time.replace(' ', 'T'));
        if(new Date() > orderTime) {
            // console.log("Completing order:", pair.order);
            completeOrder(pair.order);
        }
    });
}

function resetObjects(){
    console.log("Reseting objects...");
    Orders = [];
    Employees = [];
    Matches = [];
    Stations = [];
    Pairs = [];
}

document.addEventListener('DOMContentLoaded', function() {
    setInterval(() => {

        fetch_orders();
        fetch_employees();
        fetch_stations();      
        
        console.log("Orders: ", Orders);
        console.log("Employees: ", Employees);

        if(Orders.length > 0){
            stableMarriage(Orders, Employees, Stations);
        }

        console.log("Matches: ", Matches);
        
        makePairs();

        resetObjects();

        fetchPairs();

        setTimeout(() => {
            updatePairs();
        }, 200);

    }, 1500);
})