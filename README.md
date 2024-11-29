# Pings 💬  
Pings is a collaborative messaging platform enabling real-time communication within dynamic, user-created chat rooms. Designed for seamless scalability and user experience, Pings includes robust API endpoints and a feature-rich front-end for a modern chat application.

## Features ✨  
- **Real-Time Messaging**: Leverages WebSockets for instant message updates.  
- **User Authentication**: Secure login and signup with token-based authentication.  
- **Room Management**: Create, join, and leave rooms dynamically.  
- **Media Uploads**: Supports image uploads with Cloudinary integration.  
- **Profile Updates**: Personalized user profile management.  

---

## Project Setup 🛠️  

### Prerequisites  
- Node.js >= 14  
- MongoDB (local or cloud instance)  
- Cloudinary Account for image storage  
- Environment variables set up in `.env` file  

### Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/hardick1907/pings.git  
   cd pings  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Set up the `.env` file with the following keys:  
   ```env  
   MONGO_URI=<your-mongodb-connection-string>  
   JWT_SECRET=<your-jwt-secret>  
   CLOUDINARY_NAME=<your-cloudinary-name>  
   CLOUDINARY_API=<your-cloudinary-api-key>  
   CLOUDINARY_SECRET=<your-cloudinary-secret>  
   PORT=3000  
   ```  
4. Start the development server:  
   ```bash  
   npm run dev  
   ```  

---

## API Endpoints 📡  

### User Routes  
| Method | Endpoint          | Description               | Auth Required |  
|--------|-------------------|---------------------------|---------------|  
| POST   | `/api/user/signup` | Create a new user         | ❌             |  
| POST   | `/api/user/login`  | Authenticate a user       | ❌             |  
| GET    | `/api/user/logout` | Logout user               | ✅             |  
| PUT    | `/api/user/update` | Update profile picture    | ✅             |  
| GET    | `/api/user/checkAuth` | Check authentication  | ✅             |  

### Room Routes  
| Method | Endpoint               | Description                              | Auth Required |  
|--------|------------------------|------------------------------------------|---------------|  
| POST   | `/api/room/createRoom` | Create a new chat room                   | ✅             |  
| GET    | `/api/room/getAllRooms`| Retrieve all available chat rooms        | ✅             |  
| POST   | `/api/room/:roomId/join` | Join a specific room                   | ✅             |  
| POST   | `/api/room/:roomId/leave` | Leave a specific room                  | ✅             |  
| POST   | `/api/room/:roomId/messages` | Send a message to a room             | ✅             |  
| GET    | `/api/room/:roomId/messages` | Get messages from a specific room    | ✅             |  

---

## Development Guide 👨‍💻  

### Folder Structure  
- **`controllers/`**: Contains logic for user and room management.  
- **`routes/`**: API endpoint definitions.  
- **`models/`**: Mongoose schemas for users, rooms, and messages.  
- **`lib/`**: Utilities for Cloudinary, database, and socket configuration.  

### Key Technologies  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Real-Time Updates**: Socket.IO  
- **Media Management**: Cloudinary  
- **Frontend**: React (integrated in `/frontend` for front-end development)  

---

## Additional Notes 📋  
1. **Security**: Protect routes using middleware to ensure authenticated access.  
2. **Scalability**: Built to handle multiple users and rooms simultaneously using efficient database operations.  
3. **Customizable**: Extend the system with additional room-level settings or message types (e.g., videos or files).  

---

## Contributing 🤝  
Feel free to fork this repository, submit pull requests, or file issues. Contributions are always welcome to enhance the platform's functionality and performance.

---
