var Orders = [];
var Employees = [];
var Matches = [];
var Stations = [];
var Pairs = [];
var Graph = {};

class Employee {
    constructor(id, current_station, status, end_time){
        this.id = id;
        this.current_station = current_station;
        this.status = status;
        this.end_time = end_time;
    }
}

class Order {
    constructor(id_order, id_user, station, destination, order_time, order_status, employees_required){
        this.id_order = Number(id_order);
        this.id_user = Number(id_user);
        this.station = Number(station);
        this.destination = Number(destination)
        this.order_time = order_time;
        this.order_status = Number(order_status);
        this.employees_required = Number(employees_required);
    }
}

class Station {
    constructor(id, station_from_id, station_to_id, travel_time){
        this.id = Number(id);
        this.station_from_id = Number(station_from_id);
        this.station_to_id = Number(station_to_id);
        this.travel_time = Number(travel_time);
    }
}

class Pair {
    constructor(id, order, employee, order_time, end_time){
        this.id = Number(id);
        this.order = Number(order);
        this.employee = Number(employee);
        this.order_time = order_time;
        this.end_time = end_time;
    }
}

class Path {
    constructor(path, travel_time){
        this.path = path;
        this.travel_time = travel_time;
    }
}


function pathTime(path){
    let time = 0;

    try{
    for(let i = 0; i < path.length; i++){
        const station = Graph[path[i]];
        station.forEach(node => {
            if(node.to === path[i+1]){
                time += node.travel_time;
            }
        })
    }

    return time;
    }
    catch(error){
        return Infinity;
    }
}


function buildGraph(stations) {
    const graph = {};

    stations.forEach(station => {
        if (!graph[station.station_from_id]) {
            graph[station.station_from_id] = [];
        }
        if (!graph[station.station_from_id].some(conn => conn.to === station.station_to_id)) {
            graph[station.station_from_id].push({
                to: Number(station.station_to_id),
                travel_time: Number(station.travel_time)
            });
        }

        if (!graph[station.station_to_id]) {
            graph[station.station_to_id] = [];
        }
        if (!graph[station.station_to_id].some(conn => conn.to === station.station_from_id)) {
            graph[station.station_to_id].push({
                to: Number(station.station_from_id),
                travel_time: Number(station.travel_time)
            });
        }
    });

    return graph;
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
            orderTime: match.order.order_time,
            endTime: pathTime(findShortestPath(match.order.station, match.order.destination))
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

 function stableMarriage(orders, employees) {
    const unmatchedOrders = [...orders];
    const unmatchedEmployees = [...employees];

    const matches = [];

    while (unmatchedOrders.length > 0) {
        const order = unmatchedOrders.shift();
        console.log(`Finding match for ${order.id_order}`);
        console.log(unmatchedEmployees.length, order.employees_required)
        while(unmatchedEmployees.length > 0 && order.employees_required > 0){
            unmatchedEmployees.sort((a, b) => {
                if (a.status === 'free' && b.status !== 'free') return -1;
                if (a.status !== 'free' && b.status === 'free') return 1;

                const pathA = findShortestPath(a.current_station, order.station).length;
                const pathB = findShortestPath(b.current_station, order.station).length;

                const distanceA = pathA ? pathA : Infinity;
                const distanceB = pathB ? pathB : Infinity;

                return distanceA - distanceB;
            });

            const bestMatch = unmatchedEmployees.shift();

            if (bestMatch) {
                console.log(`Found best match for ${order.id_order} -> ${bestMatch.id}`)
                order.employees_required -= 1;
                matches.push({ order, employee: bestMatch });
            } else {
                console.warn(`No available employee for order ${order.id_order}`);
            }
        }
    }

    Matches = matches;
}

 function fetch_orders() {
    console.log("Fetching orders...");
    fetch('database_fetch_orders.php')
    .then(response => response.json())
    .then(data => {
    if (data.error) {
        console.error('Error:', data.error);
        return;
    }

    Orders = [];
    if (data.length > 0 && data[0][0] != -1) {
        data.forEach(row => {
            Orders.push(new Order(row.id_order, row.id_user, row.station, row.destination, row.order_time, row.order_status, row.employees_required));
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
                Employees.push(new Employee(row.id_employee, row.current_station, row.status, row.end_time));
            });
        });
}

function fetch_stations() {
    console.log("Fetching stations...");
    fetch('database_fetch_stations.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            Stations = [];
            data.forEach(row => {
                Stations.push(new Station(row.id, row.station_from_id, row.station_to_id, row.travel_time));
            });

            Graph = buildGraph(Stations);
            console.log("Graph:", Graph);
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

function findShortestPath(start, end) {
    if (!Graph[start] || !Graph[end]) {
        console.error(`Invalid start (${start}) or end (${end}) node`);
        return null;
    }

    const distances = {};
    const previous = {};
    const priorityQueue = [];

    for (const node in Graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;
    priorityQueue.push({ node: start, distance: 0 });

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: currentNode } = priorityQueue.shift();

        if (currentNode === end) {
            const path = [];
            let current = end;
            while (current) {
                path.unshift(current);
                current = previous[current];
            }
            return path;
        }

        for (const neighbor of Graph[currentNode]) {
            const { to: neighborNode, travel_time } = neighbor;
            const newDistance = distances[currentNode] + parseFloat(travel_time);

            if (newDistance < distances[neighborNode]) {
                distances[neighborNode] = newDistance;
                previous[neighborNode] = currentNode;
                priorityQueue.push({ node: neighborNode, distance: newDistance });
            }
        }
    }

    console.warn(`No path found from ${start} to ${end}`);
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
                Pairs.push(new Pair(row.id, row.order_id, row.employee_id, row.order_time, row.end_time));
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
        const orderTime = new Date(pair.end_time.replace(' ', 'T'));
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

let isRunning = false;

async function run() {
    if (isRunning) {
        return;
    }

    isRunning = true;

    try {
        // console.clear();
        console.log("Starting execution...");
        resetObjects();

        fetch_employees();
        fetch_orders();
        fetch_stations();


        setInterval(() => {
            console.log("Stations: ", Stations);
            console.log("Orders: ", Orders);
            console.log("Employees: ", Employees);

            if (Orders.length > 0) {
                stableMarriage(Orders, Employees, Stations);
            }

            console.log("Matches: ", Matches);
            makePairs();
            resetObjects();
            fetchPairs();
            setInterval(() => {
                if(Pairs.length > 0){
                    updatePairs();
                }
            }, 1000);
        }, 1000);
        console.log("Execution completed.");
    } catch (error) {
        console.error("Error during execution:", error);
    } finally {
        isRunning = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Document loaded");
    setInterval(() => {
        run();
    }, 1500);
});