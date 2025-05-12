from flask import Flask, render_template, jsonify, request, url_for

app = Flask(__name__)

learn_sections = [
    {
        "title": "What is Feng Shui?",
        "summary": "Feng shui 风水 is a type of geomancy originating from ancient Chinese farming villages." +
                " In these villages, people believed that along with other intangible forces, their ancestors'" +
                " spirits were at work in their daily lives.",
        "image": "/static/images/village.png",
        "alt": "Painting of ancient Chinese farming village",
        "secondary": "In order to appease these forces into positively impacting their lives, the people " +
                "took to arranging their burial grounds in specific ways the spirits would find pleasing."
    },
    {
        "title": "Feng Shui 风水",
        "summary": "The actual concept of feng shui involves qì 气, the flow of energy throughout the universe.",
        "image": "/static/images/diagram.png",
        "alt": "Diagram depicting energy flow in feng shui",
        "secondary": "The goal of feng shui is to manipulate the environment to maximize this good energy " +
                "flow and be in \"harmony\" with the universe."
    },
    {
        "title": "Feng Shui and Interior Design",
        "summary": "Likewise, we can manipulate our homes in certain ways to maximize good qì flow. " +
                "With good feng shui, your furniture placement and room orientation can significantly boost " +
                "your own mental and physical state as well!",
        "image": "/static/images/floorplan.png",
        "alt": "Floor plan of a building signaling energy flow through feng shui",
        "secondary": "Let's check out 5 major ways to apply feng shui to interior design!"
    }
]

lessons = [
    {
        "title": "1. Front Door (Entryway)",
        "summary": "When choosing a home, the front door is one of the most significant elements of design." +
                " It should be:",
        "points": ["The largest door in a house", "In a brightly lit and open entryway",
                "Unobscured by items or walls"],
        "image": "/static/images/frontdoor.jpg",
        "alt": "Room diagram depicting front door placement in accordance with feng shui",
        "secondary": "This prevents qì blockages when the door opens up to a cramped area!"
    },
    {
        "title": "2. Bed Placement",
        "summary": "In Chinese culture, coffins are carried out of the house feet-first, so sleeping " +
                "with your feet to the door is bad luck! Your bed should:",
        "points": ["Not have the foot pointed at the door", "But still have a clear view of the door",
                "Not be placed against the window"],
        "image": "/static/images/bedplacement.png",
        "alt": "Room diagram depicting bed placement in accordance with feng shui",
        "secondary": "This ensures good energy is maintained around your bed and does not immediately " +
                "flow out through the window. Additionally, you have a clear view of the door, which provides" +
                " peace of mind and better sleep."
    },
    {
        "title": "3. Mirrors",
        "summary": "Mirrors are tricky tools as they can reflect, emit, and channel energy in " +
                "specific directions! Mirrors should:",
        "points": ["Not face your bed", "Not face the bedroom door", "Not be hung right above your bed"],
        "image": "/static/images/mirrorplacement.png",
        "alt": "Room diagram depicting mirror placement in accordance with feng shui",
        "secondary": "Mirror in unwanted places can bounce energy all around the room and affect your sleep!"
    },
    {
        "title": "4. Sharp vs. Round Corners",
        "summary": "Since feng shui is just as much about placement as it is about shape and form, " +
                "you want to pay attention to round vs. sharp corners in your room:",
        "points": ["Rounded furniture is generally preferable as corners can interfere with qì",
                "Furniture with sharp corners should especially not be pointed towards the bed"],
        "image": "/static/images/corners.png",
        "alt": "Room diagram depicting sharp furniture in accordance with feng shui",
        "secondary": "Sharp corners can act as arrows, deflecting qì!"
    },
    {
        "title": "5. Clutter",
        "summary": "Clutter is not only a visual drain on your mental energy, but it also blocks the" +
                " flow of qì around your room. Try to reduce messes and cut down on " +
                "large furniture items that may not be necessary!",
        "points": ["Minimize extra chairs", "Avoid stuffing items underneath the bed",
                "Footboards and benches at the end of the bed are often unnecessary",
                "Avoid large amounts of electronics!"],
        "image": "/static/images/clutter.png",
        "alt": "Room diagram depicting clutter",
        "secondary": "Large amounts of clutter and extraneous items, particularly electronic devices, can" +
                " disrupt good energy and prevent restful sleep."
    },
]

orientation_games = {
    "1": {
        "section_name": "Front Door Placement",
        "game_instruction": "Choose the correct front door placement for optimal feng shui energy flow:",
        "choices": [
            {
                "id": "a",
                "label": "Small door opening to a narrow hallway",
                "image_url": "/static/images/door1.jpg",  # To be filled later with actual image paths
                "alt": "Small door opening to a narrow hallway"
            },
            {
                "id": "b",
                "label": "Large door opening to a spacious, well-lit entryway",
                "image_url": "/static/images/door2.jpg",
                "alt": "Large door opening to a spacious, well-lit entryway"
            },
            {
                "id": "c",
                "label": "Door opening directly to a staircase",
                "image_url": "/static/images/door3.jpg",
                "alt": "Door opening directly facing a staircase"
            }
        ],
        "correct": "b",
        "correct_label": "Large door opening to a spacious, well-lit entryway",
        "explanation": "A large door that opens to a spacious, well-lit entryway allows positive qi energy to flow freely into the home. This creates an inviting entrance and prevents energy blockages."
    },
    "2": {
        "section_name": "Bed Placement",
        "game_instruction": "Select the optimal bed placement according to feng shui principles:",
        "choices": [
            {
                "id": "a",
                "label": "Bed with foot pointing directly at the door",
                "image_url": "/static/images/bed1.png",
                "alt": "Bed with foot pointing directly at the door"
            },
            {
                "id": "b",
                "label": "Bed placed directly under a window",
                "image_url": "/static/images/bed2.png",
                "alt": "Bed placed directly under a window"
            },
            {
                "id": "c",
                "label": "Bed with solid wall behind headboard and clear view of the door",
                "image_url": "/static/images/bed3.png",
                "alt": "Bed with solid wall behind headboard and clear view of the door"
            }
        ],
        "correct": "c",
        "correct_label": "Bed with solid wall behind headboard and clear view of the door",
        "explanation": "The optimal bed placement has a solid wall behind the headboard for support and stability, while having a clear view of the door provides security. The foot of the bed should not point directly at the door as this is considered the 'death position' in Feng Shui."
    },
    "3": {
        "section_name": "Mirror Placement",
        "game_instruction": "Choose the correct mirror placement for good feng shui:",
        "choices": [
            {
                "id": "a",
                "label": "Mirror facing the bed",
                "image_url": "/static/images/mirror1.jpg",
                "alt": "Mirror facing the bed"
            },
            {
                "id": "b",
                "label": "Mirror above bed",
                "image_url": "/static/images/mirror2.jpg",
                "alt": "Mirror above bed"
            },
            {
                "id": "c",
                "label": "Mirror on side wall, not facing bed or door",
                "image_url": "/static/images/mirror3.jpg",
                "alt": "Mirror on side wall, not facing bed or door"
            }
        ],
        "correct": "c",
        "correct_label": "Mirror on side wall, not facing bed or door",
        "explanation": "Mirrors above the bed can disturb sleep by reflecting energy, and shouldn't face the door as they can bounce energy back out. The best placement is on a side wall where it won't reflect the bed or door."
    },
    "4": {
            "section_name": "Sharp vs. Round Corners",
            "game_instruction": "Choose which room has the best feng shui given the energy characteristics of round vs. hard corners.",
            "choices": [
                {
                    "id": "a",
                    "label": "Bedroom with many rounded surfaces",
                    "image_url": "/static/images/corner1.jpg",
                    "alt": "Bedroom with many rounded surfaces"
                },
                {
                    "id": "b",
                    "label": "Bedroom with many sharp corners",
                    "image_url": "/static/images/corners2.png",
                    "alt": "Bedroom with many sharp corners"
                },
                {
                    "id": "c",
                    "label": "Bedroom with a lot of rectangular furniture",
                    "image_url": "/static/images/corners3.jpa.jpg",
                    "alt": "Bedroom with many sharp corners"
                }
            ],
            "correct": "a",
            "correct_label": "Bedroom with many rounded surfaces",
            "explanation": "Rounded surfaces are always preferable to hard, perpendicular ones as they do not deflect and break the flow of qì."
    },
    "5": {
                "section_name": "Clutter",
                "game_instruction": "Choose which room is the most free of unnecessary clutter, which allows the most space for qì flow.",
                "choices": [
                    {
                        "id": "a",
                        "label": "Room with clothes strewn about",
                        "image_url": "/static/images/clutter1.png",
                        "alt": "Messy room"
                    },
                    {
                        "id": "b",
                        "label": "Clean minimalist bedroom",
                        "image_url": "/static/images/clutter2.png",
                        "alt": "Clean minimalist bedroom"
                    },
                    {
                        "id": "c",
                        "label": "Bed with footboard and a table at the end of the bed",
                        "image_url": "/static/images/clutter3.png",
                        "alt": "Bed with footboard and a table at the end of the bed"
                    }
                ],
                "correct": "b",
                "correct_label": "Clean minimalist bedroom",
                "explanation": "The idea room is both tidy and devoid of unnecessary furniture items that would obstruct qì flow."
    }
}


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

@app.route('/orientation_game/<section>')
def orientation_game(section):
    if section not in orientation_games:
        return "Game not found", 404
    
    game_data = orientation_games[section]
    
    return render_template('orientation_game.html', 
                          section=section,
                          section_name=game_data["section_name"],
                          game_instruction=game_data["game_instruction"],
                          choices=game_data["choices"])

# API endpoint to check orientation game answers
@app.route('/check_orientation', methods=['POST'])
def check_orientation():
    section = request.form.get('section')
    choice = request.form.get('choice')
    
    if section not in orientation_games:
        return jsonify({"error": "Invalid section"}), 400
    
    game_data = orientation_games[section]
    is_correct = choice == game_data["correct"]
    
    return jsonify({
        "correct": is_correct,
        "explanation": game_data["explanation"],
        "correct_label": game_data["correct_label"]
    })

# stores user's quiz answers
@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    correct_answers = {
        'q1': 'b',
        'q2': 'a',
        'q3': 'c',
        'q4': 'b',
        'q5': 'c'
    }
    
    # Question texts and answer choices to provide better feedback
    questions = {
        'q1': {
            'text': 'What is the main goal of Feng Shui?',
            'a': 'To decorate a room in traditional Chinese style',
            'b': 'To manipulate the environment to maximize good energy flow',
            'c': 'To organize furniture in a symmetrical pattern'
        },
        'q2': {
            'text': 'According to Feng Shui principles, how should the front door be positioned?',
            'a': 'It should be the largest door in the house and in a brightly lit, open entryway',
            'b': 'It should be small and dark to prevent negative energy from entering',
            'c': 'It should always face north to align with magnetic energy'
        },
        'q3': {
            'text': 'According to Feng Shui principles, how should a bed be positioned?',
            'a': 'With the foot of the bed pointed directly at the door for proper energy flow',
            'b': 'Directly under a window to maximize natural light',
            'c': 'Not with the foot pointed at the door, but with a clear view of the door'
        },
        'q4': {
            'text': 'How should mirrors be placed according to Feng Shui principles?',
            'a': 'Directly facing the bed to reflect positive energy',
            'b': 'Not facing the bed or bedroom door, and not hung right above the bed',
            'c': 'Opposite the door to bounce energy back into the room'
        },
        'q5': {
            'text': 'What does the concept of qì (气) represent in Feng Shui?',
            'a': 'The color scheme used in interior design',
            'b': 'The arrangement of furniture in a room',
            'c': 'The flow of energy throughout the universe'
        }
    }
    
    user_answers = request.form
    score = 0
    incorrect = []
    
    # Check if all questions are answered
    all_answered = all(q in user_answers for q in correct_answers.keys())
    
    if not all_answered:
        return jsonify({
            'score': score,
            'total': len(correct_answers),
            'message': "Please answer all questions to get accurate results.",
            'incorrect': []
        })
    
    for q, correct_ans in correct_answers.items():
        if q in user_answers:
            user_choice = user_answers[q]
            is_correct = user_choice == correct_ans
            
            if is_correct:
                score += 1
            else:
                incorrect.append({
                    'question': questions[q]['text'],
                    'user_answer': questions[q][user_choice],
                    'correct_answer': questions[q][correct_ans]
                })
    
    # Create appropriate message based on score
    if score == 5:
        message = "Perfect! You've mastered Feng Shui principles!"
    elif score >= 3:
        message = "Good job! You have a solid understanding of Feng Shui."
    else:
        message = "You might want to review the Feng Shui lessons again."
    
    return jsonify({
        'score': score,
        'total': len(correct_answers),
        'message': message,
        'incorrect': incorrect
    })

@app.route('/validate_placement', methods=['POST'])
def validate_placement():
    # Get placement data from request
    placement = request.json
    
    # Validation feedback
    feedback = []
    
    # Define grid size
    grid_rows, grid_cols = 8, 8
    
    # Required unique items
    required = ['door', 'bed', 'desk', 'mirror']
    for req in required:
        if req not in placement:
            feedback.append(f"You must place a {req} in the room.")
    
    # If missing required items, return early
    if feedback:
        return jsonify({ 'valid': False, 'feedback': feedback })
    
    door = placement['door']
    bed = placement['bed']
    desk = placement['desk']
    mirror = placement['mirror']
    
    # 1. Door must be on perimeter (exterior wall)
    dr, dc = door['row'], door['col']
    if not (dr == 0 or dr == grid_rows-1 or dc == 0 or dc == grid_cols-1):
        feedback.append("The door must sit on an exterior wall (room perimeter).")
    
    # 2. Bed should not be directly aligned (facing) with the door
    if is_aligned(bed, door):
        feedback.append("The bed should not be directly aligned with the door.")
    
    # 3. Mirror should not face the bed
    if is_facing(mirror, bed):
        feedback.append("The mirror should not face the bed.")
    
    # 4. Mirror should not face the door (prevents qi bouncing out)
    if is_facing(mirror, door):
        feedback.append("The mirror should not face the door.")
    
    # 5. Desk should have a clear view of the door (within 5 cells)
    if not has_clear_view(desk, door):
        feedback.append("The desk should have a clear view of the door.")
    
    # If no negative feedback, add positive message
    if not feedback:
        feedback.append("Great job! Your room has good Feng Shui energy flow. You've successfully learned the basic concepts of Feng Shui!")
    
    return jsonify({
        'valid': len(feedback) == 1 and "Great job" in feedback[0],
        'feedback': feedback
    })

def is_facing(item1, item2):
    # Check if items are facing each other
    # In our simplified model, we'll just check if they're on the same row or column
    return (item1['row'] == item2['row'] or item1['col'] == item2['col'])

def is_aligned(item1, item2):
    # Check if items are directly aligned
    # This would mean foot of bed pointing to door
    return (item1['row'] == item2['row'] or item1['col'] == item2['col'])

def has_clear_view(item1, item2):
    # Check if item1 has clear view of item2
    # In our simplified model, this means they're not too far apart
    max_distance = 5  # Define maximum distance for "clear view"
    row_dist = abs(item1['row'] - item2['row'])
    col_dist = abs(item1['col'] - item2['col'])
    return row_dist <= max_distance and col_dist <= max_distance

if __name__ == '__main__':
    app.run(debug=True, port=5001)