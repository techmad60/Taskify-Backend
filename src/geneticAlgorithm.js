const Task = require('./models/Task'); // Adjust the path to your Task model

// Function to generate a random order of tasks
const generateRandomOrder = (tasks) => {
    const shuffledTasks = [...tasks];
    //Fisher-Yates Algorithm
    for (let i = shuffledTasks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTasks[i], shuffledTasks[j]] = [shuffledTasks[j], shuffledTasks[i]];
    }
    return shuffledTasks;
};

// Fitness function to evaluate task orders
const fitnessFunction = (taskOrder) => {
    let score = 0;
    taskOrder.forEach(task => {
        const deadlineScore = (new Date(task.endDate) - new Date()) / (1000 * 60 * 60); // Time until deadline in hours
        const priorityScore = task.priority === "High" ? 10 : task.priority === "Medium" ? 5 : 1; // Assign scores based on priority
        score += deadlineScore + priorityScore; // Add both scores
    });
    return score;
};

// Select parents based on fitness scores
const selectParents = (population) => {
    const sortedPopulation = population.sort((a, b) => fitnessFunction(b) - fitnessFunction(a));
    return sortedPopulation.slice(0, Math.floor(population.length * 0.2)); // Select top 20% of the population
};

// Crossover function to create new individuals
const crossover = (parent1, parent2) => {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    return [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
};

// Mutation function to introduce random changes
const mutate = (taskOrder) => {
    const mutatedOrder = [...taskOrder];
    const index1 = Math.floor(Math.random() * mutatedOrder.length);
    const index2 = Math.floor(Math.random() * mutatedOrder.length);
    [mutatedOrder[index1], mutatedOrder[index2]] = [mutatedOrder[index2], mutatedOrder[index1]]; // Swap tasks
    return mutatedOrder;
};

// Main function to run the genetic algorithm
const runGeneticAlgorithm = (tasks, generations = 100) => {
    let population = Array.from({ length: 100 }, () => generateRandomOrder(tasks));

    for (let i = 0; i < generations; i++) {
        const parents = selectParents(population);
        const nextGeneration = [];

        while (nextGeneration.length < population.length) {
            const parent1 = parents[Math.floor(Math.random() * parents.length)];
            const parent2 = parents[Math.floor(Math.random() * parents.length)];
            let child = crossover(parent1, parent2);
            if (Math.random() < 0.1) { // 10% mutation chance
                child = mutate(child);
            }
            nextGeneration.push(child);
        }
        population = nextGeneration;
    }

    return selectParents(population)[0]; // Return the best solution found
};

// Export the function for use in your routes
module.exports = {
    runGeneticAlgorithm,
};
