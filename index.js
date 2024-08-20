const survey = new Survey.Model(json);

// Show or hide the "Validate" button based on the dropdown selection
survey.onValueChanged.add((sender, options) => {
    if (options.name === "question1" && options.value) {
        const validateButton = document.getElementById('validateBtn');
        if (validateButton) {
            validateButton.style.display = 'block';
        }
    } else {
        const validateButton = document.getElementById('validateBtn');
        if (validateButton) {
            validateButton.style.display = 'none';
        }
    }
});

// Handle survey completion
survey.onComplete.add((sender, options) => {
    console.log('Survey completed:', JSON.stringify(sender.data, null, 3));
});

// Render the survey
$("#surveyElement").Survey({ model: survey });

// Initialize socket.io connection
const socket = io('http://127.0.0.1:3000'); // Ensure this URL matches your server's URL

socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

function validateSelection() {
    const selectedValue = survey.getValue('question1');
    console.log(`Selected Value: ${selectedValue}`);

    if (selectedValue) {
        console.log('Emitting validation request');
        socket.emit('validate', { value: selectedValue });

        // Listen for the validation result
        socket.once('validationResult', (response) => {
            console.log('Validation result received:', response);
            if (response.success) {
                // Show success message
                const successContainer = document.getElementById('successContainer');
                if (successContainer) {
                    successContainer.style.display = 'block';
                }
                // Hide the "Validate" button
                const validateButton = document.getElementById('validateBtn');
                if (validateButton) {
                    validateButton.style.display = 'none';
                }
            } else {
                alert('Validation failed!');
            }
        });
    } else {
        alert('Please select a value before validating.');
    }
}
