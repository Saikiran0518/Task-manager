from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Set up the SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    due_date = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='Pending')

    def __repr__(self):
        return f'<Task {self.title}>'

# Route to get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'status': task.status
    } for task in tasks])

# Route to create a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()

    # Validate that all required fields are provided
    if not data.get('title') or not data.get('description') or not data.get('due_date'):
        return jsonify({'error': 'Missing required fields'}), 400

    new_task = Task(
        title=data['title'],
        description=data['description'],
        due_date=data['due_date'],
        status=data.get('status', 'Pending')  # Default status is 'Pending'
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        'id': new_task.id,
        'title': new_task.title,
        'description': new_task.description,
        'due_date': new_task.due_date,
        'status': new_task.status
    }), 201

# Route to delete a task
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': f'Task with ID {id} has been deleted successfully'}), 200

# Route to update a task
@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if task is None:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()

    # Check for toggle status
    if 'toggle_status' in data and data['toggle_status'] is True:
        # Toggle the task status between 'Pending' and 'Completed'
        task.status = 'Completed' if task.status == 'Pending' else 'Pending'
    
    # Update other task fields if provided
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.due_date = data.get('due_date', task.due_date)

    db.session.commit()

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date,
        'status': task.status
    }), 200

# Initialize the database (run once to create tables) - We are not using `before_first_request` here.
def init_db():
    with app.app_context():
        db.create_all()

# Run the database initialization on startup.
init_db()

if __name__ == '__main__':
    app.run(debug=True)
