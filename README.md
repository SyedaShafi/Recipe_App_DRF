
# RecipeRealm 
RecipeRealm is a web application that allows users to share and discover recipes. Users can sign up, log in, post their recipes, comment on others' recipes, and edit or delete their recipes and comments.

## Features
1. User Authentication: Sign up and log in functionality for users.
2. Recipe Management: Users can post, edit, and delete their recipes.
3. Comment System: Users can comment on and discuss recipes, with the ability to edit and delete their comments.
4. User Reviews: User reviews are displayed using Swiffy Slider for an enhanced UI experience.

## Technologies Used
1. Backend: Django Rest Framework
2. Frontend: HTML, CSS, Bootstrap, JavaScript
3. UI Enhancements: Swiffy Slider
4. Deployment: Render


### Installation
1. Clone the repository:
````bash
git clone https://github.com/SyedaShafi/Recipe_App_DRF
cd RecipeRealm
````
2. Create and activate a virtual environment:
````bash
python -m venv venv
source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
````
3. Install the dependencies:
````bash
pip install -r requirements.txt
````
4. Apply migrations:
````bash
python manage.py migrate
````

5. Create a superuser:
````bash
python manage.py createsuperuser
````
6. Run the development server:
````bash
python manage.py runserver
````
7. Open your browser and navigate to http://127.0.0.1:8000 to see the application.

## Contact
Email - syedashafi4@gmail.com

Project Link: https://recipe-app-drf.onrender.com/
