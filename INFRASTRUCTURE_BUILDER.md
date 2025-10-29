# Visual Infrastructure Builder

A complete full-stack visual infrastructure builder for MicroCloud (LXD) provisioning.

## 🎯 Project Overview

This repository contains a modern SaaS-style application for visually designing and deploying infrastructure to MicroCloud LXD clusters. The application features a drag-and-drop interface where users can design infrastructure topologies and deploy them with a single click.

## 📁 Project Structure

```
desarollo/
├── frontend/              # React + TypeScript visual builder
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── flows/        # React Flow configuration
│   │   ├── state/        # Zustand state management
│   │   └── types/        # TypeScript definitions
│   └── README.md         # Detailed frontend documentation
│
├── backend/              # FastAPI Python backend
│   ├── main.py          # API endpoints and Libcloud integration
│   └── requirements.txt # Python dependencies
│
└── README.md            # This file
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API available at http://localhost:8000
```

## ✨ Features

- **Visual Topology Editor**: Drag-and-drop infrastructure design
- **React Flow Canvas**: Interactive workspace with zoom and pan
- **Property Inspector**: Edit node configurations in real-time
- **JSON Export**: Download infrastructure as code
- **Deployment Planning**: Preview changes before deployment
- **Direct Deployment**: One-click infrastructure provisioning

## 📖 Documentation

For detailed setup instructions, API documentation, and usage examples, see:
- [Frontend README](./frontend/README.md) - Complete frontend documentation
- [Backend API](./backend/main.py) - API endpoint documentation

## 🎨 Technology Stack

**Frontend:**
- React 18 + TypeScript
- React Flow (visual topology)
- Zustand (state management)
- TailwindCSS (styling)
- shadcn/ui (components)
- Lucide React (icons)

**Backend:**
- FastAPI (Python 3.11+)
- Uvicorn (ASGI server)
- Apache Libcloud (cloud API)
- Pydantic (validation)

## 🔧 Development

### Build Frontend
```bash
cd frontend
npm run build
```

### Lint Frontend
```bash
cd frontend
npm run lint
```

### Test Backend
```bash
cd backend
python main.py
```

## 📸 Screenshots

See the [PR description](https://github.com/infra-neo/desarollo/pull/XXX) for screenshots of the application in action.

## 📝 License

See LICENSE file for details.

## 👤 Author

Ing. Benjamín Frías — DevOps & Cloud Specialist

---

**Note**: This is a new addition to the repository alongside the existing infrastructure automation tools.
