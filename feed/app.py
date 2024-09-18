from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Feedback
from config import Config
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin_login'

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # Get form data
        attendance_issue = request.form.get('attendance_issue')
        study_issue = request.form.get('study_issue')
        improvement_suggestion = request.form.get('improvement_suggestion')
        event_issue = request.form.get('event_issue')
        
        # Store the anonymous response
        feedback = Feedback(
            attendance_issue=attendance_issue,
            study_issue=study_issue,
            improvement_suggestion=improvement_suggestion,
            event_issue=event_issue
        )
        db.session.add(feedback)
        db.session.commit()
        return redirect(url_for('thanks'))
    return render_template('feedback_form.html')

@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('view_responses'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username == 'admin' and check_password_hash(generate_password_hash('tic#rudy^'), password):
            login_user(User(username))
            flash('Logged in successfully.', 'success')
            return redirect(url_for('view_responses'))
        else:
            flash('Invalid credentials', 'error')
    return render_template('admin_login.html')

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    flash('Logged out successfully.', 'success')
    return redirect(url_for('home'))

@app.route('/admin/responses')
@login_required
def view_responses():
    feedbacks = Feedback.query.all()
    return render_template('admin_responses.html', feedbacks=feedbacks)

if __name__ == '__main__':
    app.run(debug=True)