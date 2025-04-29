from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# TODO fill in data finalized ver.
learn_sections = [
    {
        "title": "What is Feng Shui?",
        "summary": "Feng shui 风水 is a type of geomancy originating from ancient Chinese farming villages." +
                " In these villages, people believed their ancestors’ spirits (and other intangible forces)" +
                " were at work in their lives.",
        "image": "/static/images/village.jpg",
        "alt": "Painting of ancient Chinese farming village",
        "secondary": "In order to appease these forces, the people arranged their burial grounds in specific" +
                " ways the spirits would find suitable (like image on right)."
    },
    {
        "title": "Feng Shui 风水",
        "summary": "The actual concept of feng shui involves qì 气, the flow of energy throughout the universe.",
        "image": "/static/images/diagram.jpg",
        "alt": "Diagram depicting energy flow in feng shui",
        "secondary": "The goal of feng shui is to manipulate the environment to maximize this good energy " +
                "flow and be in “harmony” with the universe."
    },
    {
        "title": "Feng Shui and Interior Design",
        "summary": "Likewise, we can manipulate our homes in certain ways to maximize good qì flow. " +
                "Your furniture placement and room orientation can significantly affect your own" +
                 " mental and physical state!",
        "image": "/static/images/floorplan.jpg",
        "alt": "Floor plan of a building signaling energy flow through feng shui",
        "secondary": "Let’s check out 5 major ways to apply feng shui to interior design!"
    }
]

lessons = [
    {
        "title": "1. Front Door (Entryway)",
        "summary": "When choosing a home, the front door is one of the most impactful elements." +
                " It should be:",
        "points": ["The largest door in a house", "In a brightly lit and open entryway"],
        "image": "/static/images/frontdoor.jpg",
        "alt": "Room diagram depicting front door placement in accordance with feng shui",
        "secondary": "This prevents qì blockages when the door opens up to a cramped area!"
    },
    {
        "title": "2. Bed Placement",
        "summary": "In Chinese culture, coffins are carried out of the house feet-first, so sleeping " +
                "with your feet to the door is bad luck! Your bed should:",
        "points": ["Not have the foot pointed at the door", "But have a clear view of the door",
                "Not be against the window"],
        "image": "/static/images/bedplacement.jpg",
        "alt": "Room diagram depicting bed placement in accordance with feng shui",
        "secondary": ""
    },
    {
        "title": "3. Mirrors",
        "summary": "Mirrors are tricky tools as they can reflect, emit, and channel energy in " +
                "specific directions! Mirrors should:",
        "points": ["Not face your bed", "Not face the bedroom door", "Not be hung right above your bed"],
        "image": "/static/images/mirrorplacement.jpg",
        "alt": "Room diagram depicting mirror placement in accordance with feng shui",
        "secondary": "Mirror in unwanted places can bounce energy all around the room and affect your sleep!"
    },
    {
        "title": "4. (Concept)",
        "summary": "",
        "points": [""],
        "image": "",
        "alt": "",
        "secondary": ""
    },
    {
        "title": "5. (Concept)",
        "summary": "",
        "points": [""],
        "image": "",
        "alt": "",
        "secondary": ""
    },
]


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/learn/overview')
def learn_overview():
    return render_template('learn_overview.html')

@app.route('/learn/<lesson>')
def learn(lesson):
    return render_template('learn.html', lesson=lesson,
        learn_sections=learn_sections, lessons=lessons)

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/mini_simulator/<part>')
def mini_simulator(part):
    return render_template('mini_simulator.html', part=part)

@app.route('/simulator')
def simulator():
    return render_template('simulator.html')

@app.route('/about')
def about():
    return render_template('about.html')

# stores user's quiz answers
@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
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

# TODO
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
    app.run(debug=True, port=5001)