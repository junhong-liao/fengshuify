from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn')
def learn():
    return render_template('learn.html')

@app.route('/simulator')
def simulator():
    return render_template('simulator.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    # Process quiz answers and provide score
    correct_answers = {
        'q1': 'b',
        'q2': 'a',
        'q3': 'c'
    }
    
    user_answers = request.form
    score = 0
    for q, ans in correct_answers.items():
        if q in user_answers and user_answers[q] == ans:
            score += 1
            
    return jsonify({
        'score': score,
        'total': len(correct_answers),
        'message': "Good job!" if score >= 2 else "Try again!"
    })

@app.route('/validate_placement', methods=['POST'])
def validate_placement():
    # Simple validation for furniture placement
    placement = request.json
    
    # Example validation rules
    feedback = []
    
    if 'bed' in placement and 'mirror' in placement:
        if is_facing(placement['mirror'], placement['bed']):
            feedback.append("Mirror should not face the bed.")
        
    if 'bed' in placement and 'door' in placement:
        if is_aligned(placement['bed'], placement['door']):
            feedback.append("Bed should not be directly aligned with the door.")
    
    if not feedback:
        feedback.append("Good job! :D")
    
    return jsonify({
        'valid': len(feedback) == 1 and "Good job" in feedback[0],
        'feedback': feedback
    })

def is_facing(item1, item2):
    # Simplified check - in a real app, this would involve coordinates and orientation
    return False

def is_aligned(item1, item2):
    # Simplified check - in a real app, this would involve coordinates
    return False

if __name__ == '__main__':
    app.run(debug=True) 