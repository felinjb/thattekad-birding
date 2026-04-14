document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('booking-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', (e) => {
        // Prevent the page from refreshing
        e.preventDefault();

        // Get the values the user typed in
        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;

        // Hide the form and show a success message
        form.style.display = 'none';
        messageDiv.textContent = `Thank you, ${name}! Your booking request for ${date} has been received. We will contact you shortly to confirm.`;
        messageDiv.className = 'success-msg';
    });
});
