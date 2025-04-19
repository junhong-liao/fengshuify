# Feng Shui Your Room!

An educational web application that teaches the principles of Feng Shui through interactive learning and room simulation.

## Features

- Educational content about Feng Shui history and principles
- Interactive room simulator for practicing furniture placement
- Knowledge quiz to test understanding
- Responsive design works on desktop and mobile

## Technologies Used

- Flask (Python web framework)
- Jinja2 (Templating engine)
- Bootstrap 5 (UI Framework)
- jQuery and jQuery UI (JavaScript libraries)
- HTML5, CSS3, JavaScript

## Getting Started

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/feng-shui-your-room.git
cd feng-shui-your-room
```

2. Create a virtual environment (optional but recommended)
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```
pip install flask
```

4. Run the application
```
python app.py
```

5. Open your browser and navigate to `http://127.0.0.1:5000/`

## Project Structure

- `app.py` - Main Flask application
- `templates/` - HTML templates
- `static/` - Static assets (CSS, JavaScript, images)
  - `css/` - Custom CSS styles
  - `js/` - JavaScript files
  - `images/` - Images used in the application

## Missing Images

Note: This prototype requires the following images which need to be added to the `static/images` directory:

- `bagua_diagram.png` - The Feng Shui Bagua diagram shown on the homepage
- `feng_shui_village.jpg` - Image of an ancient Chinese village
- `qi_flow.jpg` - Diagram showing qi flow concept
- `modern_feng_shui.jpg` - Example of modern Feng Shui room
- `grid-bg.png` - Grid background for the room simulator 