// Fitness function to evaluate a single task
const fitnessFunction = (task) => {
    // Exclude completed tasks from scheduling
    if (task.status === "Completed") {
        return -Infinity; // Assign a very low score to completed tasks
    }

    // Check if the task is overdue
    const currentDate = new Date();
    if (new Date(task.endDate) < currentDate) {
        return -Infinity; // Exclude overdue tasks from scheduling
    }

    // Time until deadline in hours, closer deadlines should have a higher score
    const timeUntilDeadline = (new Date(task.endDate) - currentDate) / (1000 * 60 * 60);
    const deadlineScore = 1 / timeUntilDeadline; // Invert so closer deadlines get a higher score

    // Score based on priority
    const priorityScore = task.priority === "High" ? 10 : task.priority === "Medium" ? 5 : 1;

    // Adjust score based on task status
    let statusScore;
    if (task.status === "In Progress") {
        statusScore = 5; // Increase the score slightly for tasks in progress
    } else { // Not Started
        statusScore = 10; // Boost score for not started tasks, indicating higher urgency
    }

    // Combine the scores
    return deadlineScore + priorityScore + statusScore; // Add all scores together
};

// Function to optimize tasks using only the fitness function
const optimizeTasks = (tasks) => {
    // Score each task using the fitness function
    const scoredTasks = tasks.map(task => ({
        ...task,
        fitnessScore: fitnessFunction(task), // Add fitness score to each task
    })).filter(task => task.fitnessScore !== -Infinity); // Exclude completed and overdue tasks

    // Sort tasks based on fitness score in descending order (higher score = more important)
    const optimizedTasks = scoredTasks.sort((a, b) => b.fitnessScore - a.fitnessScore);
    
    // Return the sorted list of tasks, excluding the fitness score from the final result
    return optimizedTasks.map(({ fitnessScore, ...task }) => task);
};

// Export the fitness-based optimization and the genetic algorithm for future use
module.exports = {
    optimizeTasks, // Exported for immediate use
};
