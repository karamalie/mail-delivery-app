const graphlib = require("graphlib");

// Input data
const stations = ["A", "B", "C", "D", "E"];
const edges = [
  { name: "E1", source: "A", target: "B", time: 30 },
  { name: "E2", source: "B", target: "C", time: 10 },
  { name: "E3", source: "C", target: "D", time: 40 },
  { name: "E4", source: "D", target: "E", time: 15 },
];
const deliveries = [
  { name: "K1", weight: 1, location: "A", destination: "D" },
  { name: "K2", weight: 2, location: "C", destination: "E" },
  { name: "K3", weight: 4, location: "B", destination: "D" },
];
const trains = [
  { name: "Q1", capacity: 4, startingNode: "C", load: [] },
  { name: "Q2", capacity: 5, startingNode: "B", load: [] },
];

let Graph = graphlib.Graph;

// Create a new graph
let g = new Graph();

// Add nodes to the graph
for (let station of stations) {
  g.setNode(station);
}

// Add edges to the graph
for (let edge of edges) {
  let { name, source, target, time } = edge;
  g.setEdge(source, target, time);
  g.setEdge(target, source, time);
}

function calculateDeliveryMoves(nodes, edges, deliveries, trains) {
  let moves = [];
  let time = 0;

  // Iterate over the trains and packages
  for (delivery of deliveries) {
    for (train of trains) {
      if (train.capacity >= delivery.weight) {
        // Find the shortest path to the package and to its destination
        let pathToPackage = graphlib.alg.dijkstra(
          g,
          train.startingNode,
          (e) => g.edge(e.v, e.w),
          (v) => g.nodeEdges(v)
        );
        console.log(pathToPackage);
        console.log("------------------");
        let pathToDestination = graphlib.alg.dijkstra(
          g,
          delivery.location,
          (e) => g.edge(e.v, e.w),
          (v) => g.nodeEdges(v)
        );

        // Check if the train has enough capacity to pick up the package

        // Update the train's load and capacity
        train.load.push(delivery.name);
        train.capacity -= delivery.weight;

        // Update the time and moves
        time +=
          pathToPackage[delivery.location].distance +
          pathToDestination[delivery.destination].distance;
        moves.push(
          `Time=${time}, Train Name=${train.name}, Starting Station=${
            train.startingNode
          }, P1=[${delivery.name}], Delivery Destination=${
            delivery.destination
          }, P2=[${delivery.name}], Load=[${train.load.join(",")}]`
        );

        // Update the train's starting node
        train.startingNode = delivery.destination;
      }
    }
  }

  return { moves, solutionTime: time };
}

// Calculate moves and solution time
const result = calculateDeliveryMoves(stations, edges, deliveries, trains);
console.log(result.moves);

console.log(`Solution time is: ${result.solutionTime}`);
