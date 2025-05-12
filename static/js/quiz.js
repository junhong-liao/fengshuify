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
                
                // Display incorrect answers if any
                const incorrectAnswers = $("#incorrect-answers");
                incorrectAnswers.empty();
                
                if (response.score === response.total) {
                    incorrectAnswers.append('<div class="alert alert-success">All answers are correct! Great job!</div>');
                } else {
                    if (response.incorrect && response.incorrect.length > 0) {
                        incorrectAnswers.append('<h4 class="mb-3">Questions to Review:</h4>');
                        
                        response.incorrect.forEach(function(item) {
                            const card = $('<div class="card mb-3 border-danger"></div>');
                            const cardBody = $('<div class="card-body"></div>');
                            
                            cardBody.append(`<p class="card-title fw-bold">${item.question}</p>`);
                            cardBody.append(`<p class="text-danger">Your answer: ${item.user_answer}</p>`);
                            cardBody.append(`<p class="text-success">Correct answer: ${item.correct_answer}</p>`);
                            
                            card.append(cardBody);
                            incorrectAnswers.append(card);
                        });
                    } else {
                        // If no answers were provided or some other issue
                        incorrectAnswers.append('<div class="alert alert-warning">Please answer all questions to see detailed feedback.</div>');
                    }
                }

                // Hide form and show results
                $("#quizForm").hide();
                $("#results").show();
            }
        });
    });
    
    // Retry quiz button
    $("#retryQuiz").click(function() {
        $("#results").hide();
        $("#quizForm").trigger("reset");
        $("#quizForm").show();
    });
});