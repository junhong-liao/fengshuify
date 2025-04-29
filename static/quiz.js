$(document).ready(function() {
    $("#quizForm").submit(function(event) {
        event.preventDefault();

        // Get form data
        const formData = $(this).serializeArray();

        // Submit quiz
        $.ajax({
            url: "/submit_quiz",
            method: "POST",
            data: formData,
            success: function(response) {
                // Display results
                $("#score").text(`You scored ${response.score} out of ${response.total}!`);
                $("#feedback").text(response.message);

                // Hide form and show results
                $("#quizForm").hide();
                $("#results").show();
            }
        });
    });
});