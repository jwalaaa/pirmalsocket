// Initialize the SurveyJS model
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
        console.log('Sending validation request');

        // Webhook API call with the validation link
        const webhookUrl = 'https://automation.quickwork.co/staticwebhook/api/http_app/notify/646f45a7262b940cb8de7543/channel_partner_validator';
        const apiBody = {
            channelCode: selectedValue,
            link: "http://127.0.0.1:5500/socket-server/validate.html" // Local validation link
        };

        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiBody)
        })
        .then(response => response.text())
        .then(text => {
            console.log('Webhook response text:', text);

            // Show loader and wait for WebSocket response
            const loader = document.getElementById('loader');
            loader.style.display = 'block';

            // Listen for the validation result from WebSocket
            socket.once('validationResult', (data) => {
                loader.style.display = 'none'; // Hide loader

                if (data.success) {
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
        })
        .catch(error => {
            console.error('Error in webhook call:', error);
        });
    } else {
        alert('Please select a value before validating.');
    }
}
