# Salahli - Repair Service Platform

Salahli is a platform that connects clients who need repair services with repair professionals. The platform allows clients to find repair professionals, submit repair requests, and rate the services they receive.

## Features

- **User Management**: Separate signup flows for clients and repair professionals
- **Repair Request System**: Clients can create repair requests with descriptions and images
- **Rating System**: Clients can rate repair professionals (1-5 stars)
- **Search Functionality**: Search for repair professionals by skills and rating
- **API Documentation**: Swagger and ReDoc documentation for the API

## Technology Stack

- **Backend**: Django, Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite (development), PostgreSQL (production)
- **Image Handling**: Pillow
- **API Documentation**: drf-yasg (Swagger/OpenAPI)

## Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/salahli.git
   cd salahli
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

7. Access the API documentation:
   - Swagger UI: http://localhost:8000/swagger/
   - ReDoc: http://localhost:8000/redoc/

## API Endpoints

### Authentication
- `POST /api/token/`: Obtain JWT token
- `POST /api/token/refresh/`: Refresh JWT token

### Users
- `POST /api/repair-signup/`: Register a repair professional
- `POST /api/client-signup/`: Register a client
- `GET /api/repairs/`: List repair professionals (with filtering and search)

### Repair Requests
- `GET /api/repair-requests/`: List repair requests
- `POST /api/repair-requests/`: Create a repair request
- `GET /api/repair-requests/{id}/`: Retrieve a repair request
- `PUT /api/repair-requests/{id}/`: Update a repair request
- `DELETE /api/repair-requests/{id}/`: Delete a repair request

### Ratings
- `GET /api/ratings/`: List ratings
- `POST /api/ratings/`: Create a rating
- `GET /api/ratings/{id}/`: Retrieve a rating
- `PUT /api/ratings/{id}/`: Update a rating
- `DELETE /api/ratings/{id}/`: Delete a rating

## License

This project is licensed under the BSD License - see the LICENSE file for details. 