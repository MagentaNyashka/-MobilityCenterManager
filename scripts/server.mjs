import fetch from 'node-fetch';

let Orders = [];
let Employees = [];
let Matches = [];
let Stations = [];
let Pairs = [];
let Graph = {};

class Employee {
    constructor(id, current_station, status, end_time) {
        this.id = id;
        this.current_station = current_station;
        this.status = status;
        this.end_time = end_time;
    }
}

class Order {
    constructor(id_order, id_user, station, destination, order_time, order_status, employees_required) {
        this.id_order = Number(id_order);
        this.id_user = Number(id_user);
        this.station = Number(station);
        this.destination = Number(destination);
        this.order_time = order_time;
        this.order_status = Number(order_status);
        this.employees_required = Number(employees_required);
    }
}

class Station {
    constructor(id, station_from_id, station_to_id, travel_time) {
        this.id = Number(id);
        this.station_from_id = Number(station_from_id);
        this.station_to_id = Number(station_to_id);
        this.travel_time = Number(travel_time);
    }
}

class Pair {
    constructor(id, order, employee, order_time, end_time) {
        this.id = Number(id);
        this.order = Number(order);
        this.employee = Number(employee);
        this.order_time = order_time;
        this.end_time = end_time;
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

async function fetchOrders() {
    console.log("Fetching orders...");
    const response = await fetch('http://localhost/database_fetch_orders.php');
    const data = await response.json();

    if (data.error) {
        console.error('Error fetching orders:', data.error);
        return;
    }

    Orders = [];
    data.forEach(row => {
        Orders.push(new Order(row.id_order, row.id_user, row.station, row.destination, row.order_time, row.order_status, row.employees_required));
    });
}

async function fetchEmployees() {
    console.log("Fetching employees...");
    const response = await fetch('http://localhost/database_fetch_employees.php');
    const data = await response.json();

    if (data.error) {
        console.error('Error fetching employees:', data.error);
        return;
    }

    Employees = [];
    data.forEach(row => {
        Employees.push(new Employee(row.id_employee, row.current_station, row.status, row.end_time));
    });
}

async function fetchStations() {
    console.log("Fetching stations...");
    const response = await fetch('http://localhost/database_fetch_stations.php');
    const data = await response.json();

    if (data.error) {
        console.error('Error fetching stations:', data.error);
        return;
    }

    Stations = [];
    data.forEach(row => {
        Stations.push(new Station(row.id, row.station_from_id, row.station_to_id, row.travel_time));
    });

    Graph = buildGraph(Stations);
    console.log("Graph:", Graph);
}

async function fetchPairs() {
    console.log("Fetching pairs...");
    const response = await fetch('http://localhost/database_fetch_pairs.php');
    const data = await response.json();

    if (data.error) {
        console.error('Error fetching pairs:', data.error);
        return;
    }

    Pairs = [];
    data.forEach(row => {
        Pairs.push(new Pair(row.id, row.order_id, row.employee_id, row.order_time, row.end_time));
    });
}


async function updatePairs() {
    console.log("Updating pairs...");
    const now = new Date();

    for (const pair of Pairs) {
        const endTime = new Date(pair.end_time.replace(' ', 'T'));
        if (now > endTime) {
            console.log(`Completing order: ${pair.order}`);
            await completeOrder(pair.order);
        }
    }
}

async function completeOrder(orderId) {
    console.log(`Completing order ${orderId}...`);
    const response = await fetch('http://localhost/database_complete_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
    });

    const data = await response.json();
    if (data.error) {
        console.error(`Error completing order ${orderId}:`, data.error);
    } else {
        console.log(`Order ${orderId} completed successfully.`);
    }
}

async function fillPairs(match) {
    console.log("Filling pairs...");

    const response = await fetch('http://localhost/database_update_pairs.php', {
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
    });

    const data = await response.json();
    if (data.error) {
        console.error('Error filling pairs:', data.error);
        return;
    }
}

function resetObjects(){
    console.log("Reseting objects...");
    Orders = [];
    Employees = [];
    Matches = [];
    Stations = [];
    Pairs = [];
}

async function stableMarriage(orders, employees) {
    const unmatchedOrders = [...orders];
    const unmatchedEmployees = [...employees];

    const matches = [];

    while (unmatchedOrders.length > 0) {
        const order = unmatchedOrders.shift();
        console.log(`Finding match for ${order.id_order}`);
        console.log(unmatchedEmployees.length, order.employees_required);

        while (unmatchedEmployees.length > 0 && order.employees_required > 0) {
            unmatchedEmployees.sort((a, b) => {
                if (a.status === 'free' && b.status !== 'free') return -1;
                if (a.status !== 'free' && b.status === 'free') return 1;

                const pathA = pathTime(findShortestPath(a.current_station, order.station));
                const pathB = pathTime(findShortestPath(b.current_station, order.station));

                const distanceA = pathA ? pathA : Infinity;
                const distanceB = pathB ? pathB : Infinity;

                return distanceA - distanceB;
            });

            const bestMatch = unmatchedEmployees.shift();

            if (bestMatch) {
                console.log(`Found best match for ${order.id_order} -> ${bestMatch.id}`);
                order.employees_required -= 1;
                matches.push({ order, employee: bestMatch });
            } else {
                console.warn(`No available employee for order ${order.id_order}`);
            }
        }

        if (order.employees_required === 0) {
            Matches.push(...matches);
        }
    }
}

async function makePairs(){
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

async function run() {
    console.log("Starting execution...");
    try {
        await fetchEmployees();
        await fetchOrders();
        await fetchStations();

        console.log("Orders:", Orders);
        console.log("Employees:", Employees);
        console.log("Stations:", Stations);
        console.log("Pairs:", Pairs);

        if(Orders.length > 0) {
            await stableMarriage(Orders, Employees);
        }

        await makePairs();

        await resetObjects();

        await fetchPairs();
        await updatePairs();

        console.log("Execution completed.");
    } catch (error) {
        console.error("Error during execution:", error);
    }

    // Call the function again after a delay (e.g., 5 seconds)
    setTimeout(run, 5000);
}

// Start the infinite loop
run();