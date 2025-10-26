# TaskForge – "Task Management System"

TaskForge is a full-stack task management platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It empowers teams to collaborate efficiently, track progress, and manage tasks with clarity and precision.

> BSc CSIT 7th Semester Project  
> Prepared by: Jenisha, Sanam and Swechhya

---

## Live Deployment

[View TaskForge Online](https://task-forge-tms-xln6.vercel.app/login)

---

## Features

- **User Dashboard** – View assigned tasks, track progress, and get task insights
- **Task Management** – Create, update, and track tasks with due dates and priorities
- **Automated Status Updates** – Task status changes automatically based on checklist completion
- **Team Collaboration** – Assign tasks to multiple users and monitor completion
- **Priority & Progress Tracking** – Categorize tasks by priority and visualize progress
- **Task Report Downloads** – Export task data for analysis and tracking
- **Attachments Support** – Add and access task-related file links easily
- **Mobile Responsive UI** – Seamless experience across desktop, tablet, and mobile

---

## Tech Stack

| Layer        | Technology                |
| ------------ | ------------------------- |
| Frontend     | React, Vite, Tailwind CSS |
| Backend      | Node.js, Express.js       |
| Database     | MongoDB (Mongoose)        |
| Auth         | JWT Authentication        |
| Styling      | Tailwind CSS              |
| File Uploads | Multer                    |
| Deploy       | Vercel                    |



## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sanam-Shrestha04/TaskForge.git
cd Taskforge
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd backend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside `/backend` based on the following template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Acknowledgements

Special thanks to our mentor Mr. Sanjay Niraula sir, faculty and peers who supported us. TaskForge reflects our passion for building scalable, user-friendly software.

```

---
```
