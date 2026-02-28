# 🧠 AI Prompt Studio

> A modern full-stack AI Prompt Management platform built with Next.js and Express.js.

---

## ✨ Overview

AI Prompt Studio is a full-stack web application designed to help users create, organize, and manage AI prompts efficiently.  

The project follows a clean architecture with separate **frontend** and **backend** layers.

This project is currently in active development.

---

## 🏗️ Architecture

Client (Next.js)  
  ↓  
REST API (Express.js)  
  ↓  
MongoDB Database  

---

## 🚀 Tech Stack

### 🎨 Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide Icons

### 🧩 Backend
- Node.js
- Express.js (v4)
- MongoDB (Mongoose)
- JWT Authentication
- Zod Environment Validation
- bcrypt Password Hashing

---


---

## 🔐 Authentication

- JWT stored in HTTP-only cookies
- Password hashing using bcrypt
- Protected routes middleware
- Environment variable validation via Zod

---

## ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder:
 - MONGODB_URI=your_mongodb_connection_string
 - JWT_SECRET=your_long_random_secret_key
 - OPENAI_API_KEY=your_openai_api_key
 - PORT=5000


⚠️ Do not commit your `.env` file to GitHub.

---
