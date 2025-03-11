# Android Chatbot Project - Simplified Guide for Beginners

## I. Overall Goal:

Create an Android chatbot that allows users to sign up/sign in, chat with Google Gemini, and have their chat history saved and associated with their account.

## II. Simplified Steps:

### Backend (Express.js with MongoDB):

**Purpose:** Handles user authentication (signup/signin), stores chat data, interacts with the Gemini API, and provides data to the Android app.

**Key Components:**

*   **Express.js:** A web framework for Node.js. It handles routing, middleware, and API endpoints.
*   **MongoDB:** A NoSQL database to store user accounts and chat messages.
*   **Mongoose:** A MongoDB object modeling tool for Node.js. It simplifies database interactions.
*   **JWT (JSON Web Token):** A standard for securely transmitting information between parties as a JSON object. Used for authentication.
*   **bcrypt:** A library for hashing passwords securely.
*   **Google Gemini API:** The API you'll use to interact with the Gemini chatbot.

**Simplified Tasks:**

*   [x] **Set up Express.js:** Create a basic Express.js server.
*   [x] **Connect to MongoDB:** Connect your Express.js server to a MongoDB database (e.g., using MongoDB Atlas, which is a cloud-based service).
*   [x] **Define Mongoose Models:** Create Mongoose models for `User`, `ChatMessage`, and `ChatSession`.
    *   The `User` model will store user information (email, name, password - hashed!).
    *   The `ChatMessage` model will store chat messages, linking them to a specific user and chat session.
    *   The `ChatSession` model will store information about each chat session (e.g., start time, name).
*   [x] **Implement Signup/Signin:** Create API endpoints for user registration (`/signup`) and login (`/signin`). Use `bcrypt` to hash passwords before storing them in the database. Upon successful login, generate a JWT and send it back to the Android app.
*   [ ] **Create Chat Endpoints:**
    *   [x] `/chat/start`: Creates a new chat session.
    *   [x] `/chat/send`: Receives a message from the Android app, sends it to the Gemini API, stores both the user's message and Gemini's response in the database, and returns Gemini's response to the Android app.
    *   [x] `/chat/history`: Returns the chat history for a specific chat session.
    *   [ ] `/chat/sessions`: Returns a list of chat sessions for a user.
    *   [ ] `/chat/rename`: Allows the user to rename a chat session.
*   [x] **Protect Endpoints with JWT:** Use middleware to protect the `/chat` endpoints, requiring a valid JWT to access them.
*   [x] **Handle Gemini API:** Make the Gemini API calls from your backend, not from the Android app. This is crucial for security.

**Simplified Data Flow:**

1.  Android app sends signup/signin request to backend.
2.  Backend authenticates user and sends back a JWT.
3.  Android app sends chat messages to backend, including the JWT.
4.  Backend verifies the JWT, stores the messages, sends the message to Gemini, receives the response, stores the response, and sends the response back to the Android app.
5.  Android app requests chat history from backend, including the JWT.
6.  Backend verifies the JWT and retrieves the chat history from the database.

### Android App (Frontend):

**Purpose:** Provides the user interface for the chatbot, handles user input, displays chat messages, and communicates with the backend.

**Key Components:**

*   **Android Studio:** The IDE (Integrated Development Environment) for Android development.
*   **Java/Kotlin:** The programming language you'll use to write the app. (Java is fine for a beginner project).
*   **Retrofit:** A library for making HTTP requests to your backend.
*   **RecyclerView:** A UI element for displaying lists of data (e.g., chat messages, chat sessions).
*   **Android Keystore:** A secure storage system for storing the JWT.

**Simplified Tasks:**

*   [x] **Set up Android Studio:** Install Android Studio and create a new project.
*   [] **Design UI:** Create the UI for the signup/signin screens, the chat screen, and the chat history screen.
*   [] **Implement Signup/Signin:** Implement the logic to send signup/signin requests to your backend using Retrofit. Store the JWT securely in the Android Keystore after successful login.
*   [ ] **Implement Chat Interface:**
    *   [ ] Display chat messages in a RecyclerView.
    *   [ ] Send chat messages to your backend using Retrofit, including the JWT in the Authorization header.
    *   [ ] Receive Gemini's responses from your backend and display them in the RecyclerView.
*   [ ] **Implement Chat History:**
    *   [ ] Fetch the list of chat sessions from your backend using Retrofit, including the JWT in the Authorization header.
    *   [ ] Display the list of chat sessions in a RecyclerView.
    *   [ ] When the user selects a chat session, fetch the chat history for that session from your backend using Retrofit, including the JWT in the Authorization header.
    *   [ ] Display the chat history in the RecyclerView.
*   [ ] **Handle JWT:** Store the JWT securely in the Android Keystore. Include the JWT in the Authorization header of every request to your backend that requires authentication. Handle token expiration and logout.

**Simplified Data Flow:**

1.  User interacts with the UI (e.g., enters signup information, types a chat message).
2.  Android app sends HTTP requests to the backend using Retrofit.
3.  Android app receives HTTP responses from the backend and updates the UI accordingly.

## III. Key Technologies and Concepts:

*   **REST APIs:** Understand the basics of RESTful APIs (HTTP methods, URLs, request/response formats).
*   **JSON:** Understand the JSON data format.
*   **Asynchronous Programming:** Understand how to make asynchronous API calls (using Retrofit's `enqueue()` method) and handle the responses.
*   **Object-Oriented Programming (OOP):** Understand the basics of OOP (classes, objects, inheritance, polymorphism).
*   **Threading:** Understand how to perform network operations on background threads to avoid blocking the main thread.
*   **Security:** Understand the importance of security and how to protect user data (e.g., by hashing passwords and storing JWTs securely).

## IV. Project Structure (Example):

### Backend (Express.js):

* server.js (main server file)
* routes/ (contains route definitions)
*   auth.js (authentication routes: signup, signin)
*   chat.js (chat routes: send, history, sessions, rename)
* models/ (contains Mongoose models)
*   User.js
*   ChatMessage.js
*   ChatSession.js
* middleware/ (contains middleware functions)
*   auth.js (JWT verification middleware)
* config/ (contains configuration settings)
*   database.js (MongoDB connection)
* .env (environment variables: database URL, JWT secret)

### Andorid APP

* MainActivity.java (main activity)
* LoginActivity.java (login activity)
* SignupActivity.java (signup activity)
* ChatActivity.java (chat screen activity)
* ChatHistoryActivity.java (chat history screen activity)
* adapters/ (contains RecyclerView adapters)
*   ChatMessageAdapter.java
*   ChatSessionAdapter.java
* models/ (contains data models)
*   User.java
*   ChatMessage.java
*   ChatSession.java
* api/ (contains Retrofit API interface and client)
*   YourApiService.java
*   RetrofitClient.java
* utils/ (contains utility classes)
*   TokenManager.java (JWT storage and retrieval)
 
