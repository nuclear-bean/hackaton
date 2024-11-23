export function joinTextFields(jsonData) {
    // Initialize an empty array to store all text parts
    let textArray = [];

    // Iterate over each item in the jsonData array
    jsonData.forEach(item => {
        // Iterate over each candidate in the "candidates" array
        item.candidates.forEach(candidate => {
            // Iterate over each part in the "parts" array
            candidate.content.parts.forEach(part => {
                // Push the text of each part to the textArray
                textArray.push(part.text);
            });
        });
    });

    // Join the textArray into a single string and return it
    return textArray.join(' ');
}