const Task = require('./models/Task'); // Adjust the path to your Task model

// Define the fitness function
const fitnessFunction = (taskOrder) => {
    let score = 0;
    // Calculate score based on task deadlines, priority, and duration
    // You can prioritize tasks that are close to their deadlines
    taskOrder.forEach(task => {
        const deadlineScore = (new Date(task.endDate) - new Date()) / (1000 * 60 * 60); // Time until deadline in hours
        score += deadlineScore; // You can also add priority weight here
    });
    return score;
};

// Define the genetic algorithm function
const geneticAlgorithm = async () => {
    const tasks = await Task.find(); // Get all tasks from DB
    let population = generateInitialPopulation(tasks);

    for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
        // Evaluate fitness
        population.forEach(individual => {
            individual.fitness = fitnessFunction(individual);
        });

        // Selection
        const selected = selectBestIndividuals(population);

        // Crossover
        const offspring = crossover(selected);

        // Mutation
        mutate(offspring);

        // Replacement
        population = replacePopulation(population, offspring);
    }

    // Return the best solution found
    return population.sort((a, b) => b.fitness - a.fitness)[0];
};

// Helper functions
const generateInitialPopulation = (tasks) => {
    // Create initial random task orders
    return [...Array(POPULATION_SIZE)].map(() => shuffleArray(tasks));
};

// Add other helper functions like selectBestIndividuals, crossover, mutate, replacePopulation, etc.

module.exports = geneticAlgorithm;
