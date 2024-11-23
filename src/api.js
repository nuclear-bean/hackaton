// Simulating API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendMessage = async (message) => {
    // Simulate API call delay
    await delay(1000);

    // Mock response based on user input
    if (message.toLowerCase().includes('hello')) {
        return "Hello! How can I assist you today?";
    } else if (message.toLowerCase().includes('bye')) {
        return "Goodbye! Have a great day!";
    } else {
        return "I'm sorry, I didn't understand that. Can you please rephrase?";
    }
};

