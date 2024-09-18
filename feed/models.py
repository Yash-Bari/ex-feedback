from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    attendance_issue = db.Column(db.String(200))
    study_issue = db.Column(db.String(200))
    improvement_suggestion = db.Column(db.String(200))
    event_issue = db.Column(db.String(200))
