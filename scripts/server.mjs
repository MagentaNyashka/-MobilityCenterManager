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

async function run() {
    console.log("Starting execution...");
    try {
        await fetchEmployees();
        await fetchOrders();
        await fetchStations();
        await fetchPairs();

        console.log("Orders:", Orders);
        console.log("Employees:", Employees);
        console.log("Stations:", Stations);
        console.log("Pairs:", Pairs);

        // Add additional logic here if needed
        console.log("Execution completed.");
    } catch (error) {
        console.error("Error during execution:", error);
    }

    // Call the function again after a delay (e.g., 5 seconds)
    setTimeout(run, 5000);
}

// Start the infinite loop
run();