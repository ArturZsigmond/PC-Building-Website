# 💻 PC Builder Web App

This is a full-stack **PC Building Web App** that allows users to build and customize their dream PC by selecting components like CPU, GPU, RAM, and Case. The app also provides filtering, sorting, price calculation, and dynamic display of statistics with charts and pagination.

## ✨ Features

- Build and save custom PC configurations
- Hover previews for component selection
- Filtering by CPU manufacturer
- Sorting by RAM size
- Real-time price calculation
- Paginated PC builds list
- Bar chart showing GPU type distribution
- Master/Detail UI design
- Fully in-memory CRUD operations

## 🛠️ Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js (Express) *(if applicable)*
- **Testing:** Jest / Playwright *(if applicable)*
- **Charting:** Recharts

## 🚀 Running the Project

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/pc-builder.git
cd pc-builder
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:  
👉 `http://localhost:3000`

### 3. Start the Backend (if used)

```bash
cd backend
npm install
npm run dev
```

Backend will run at:  
👉 `http://localhost:5000` (or whichever port you configured)

> If this is a fully in-memory app with no backend, you can skip this step.

## 🔄 Run on Two PCs Simultaneously (Dev Mode)

To test on multiple devices or with multiple users:

1. Make sure both PCs are on the same Wi-Fi/network.
2. On **PC A (Host)**:
    - Run the app as usual (`npm run dev`)
    - Get the local IP address (e.g., `192.168.1.5`)
    - If backend is used, make sure it listens on `0.0.0.0`
3. On **PC B (Client)**:
    - Open a browser and go to `http://192.168.1.5:3000` (replace with actual IP)

> You may need to allow firewall access on PC A.

## 📂 Folder Structure

```
pc-builder/
│
├── frontend/          # Next.js + Tailwind frontend
│   └── pages/
│   └── components/
│   └── styles/
│
├── backend/           # Node.js backend (optional)
│   └── routes/
│   └── controllers/
│
├── tests/             # Unit & integration tests
└── README.md
```

## 📜 License

MIT License – Free to use and modify.
