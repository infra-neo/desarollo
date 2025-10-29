# Visual Infrastructure Builder

A modern full-stack application for visually designing and deploying infrastructure to MicroCloud (LXD) clusters.

## Features

- **Visual Topology Editor**: Drag-and-drop interface for designing infrastructure
- **React Flow Canvas**: Interactive workspace for building infrastructure diagrams
- **Property Inspector**: Edit node configurations in real-time
- **JSON Export**: Export infrastructure as code
- **Deployment Planning**: Preview what will be created before deployment
- **Direct Deployment**: Deploy to MicroCloud LXD via Libcloud API

## Architecture

### Frontend
- **Framework**: React + TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: TailwindCSS (dark theme)
- **Canvas**: React Flow for visual topology
- **State Management**: Zustand
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn
- **Deployment**: Libcloud (compute + storage + network drivers)
- **Cluster**: MicroCloud LXD

## Project Structure

```
root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Sidebar.tsx      # Draggable blocks palette
│   │   │   ├── Workspace.tsx    # React Flow canvas
│   │   │   ├── InspectorPanel.tsx # Node property editor
│   │   │   └── InfraNode.tsx    # Custom node component
│   │   ├── flows/
│   │   │   └── nodePalette.ts   # Node definitions
│   │   ├── state/
│   │   │   └── flowStore.ts     # Zustand state management
│   │   ├── types/
│   │   │   └── nodes.ts         # TypeScript types
│   │   ├── lib/
│   │   │   └── utils.ts         # Utility functions
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── main.py                  # FastAPI application
│   └── requirements.txt         # Python dependencies
└── README.md
```

## Infrastructure Blocks

The application provides the following draggable infrastructure blocks:

### Infrastructure
- **Cluster**: MicroCloud LXD cluster configuration
- **Node Group**: Group of compute nodes

### Compute
- **VM Template**: Virtual machine configuration
- **Container Template**: Container configuration

### Storage
- **Image Store**: OS image repository

### Networking
- **Network Config**: Network configuration (subnet, gateway, DHCP)

### Security
- **Firewall Policies**: Security rules and policies
- **Users / Roles**: Access control management

### Operations
- **Scaling Rules**: Auto-scaling configuration

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- MicroCloud LXD cluster (optional for development)

### Installation

#### 1. Frontend Setup

```bash
cd frontend
npm install
```

#### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

#### Start the Backend (Terminal 1)

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

#### Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The UI will be available at `http://localhost:3000`

## Usage

### 1. Design Infrastructure

1. **Drag Blocks**: Drag infrastructure blocks from the left sidebar to the canvas
2. **Connect Nodes**: Draw connections between nodes to show relationships
3. **Configure Properties**: Click on a node to edit its properties in the right panel

### 2. Configure Node Properties

Each node type has specific properties:

#### VM Template Properties
- Name
- CPU Cores (1-32)
- RAM (e.g., 8GB)
- Disk (e.g., 50GB)
- Network
- Image (Ubuntu, Windows, etc.)
- Firewall Rules
- User
- Replicas (1-10)

#### Container Template Properties
- Name
- CPU Cores (1-16)
- RAM (e.g., 4GB)
- Network
- Image (Ubuntu, Alpine, etc.)
- Firewall Rules
- User
- Replicas (1-10)

### 3. Export and Deploy

1. **View JSON**: Click "View JSON" to see the configuration
2. **Export**: Click "Export" to download the JSON file
3. **Plan**: Click "Plan" to see a deployment preview
4. **Deploy**: Click "Deploy" to provision infrastructure

### Example JSON Output

```json
{
  "cluster": "microcloud-lxd",
  "resources": [
    {
      "type": "vm",
      "name": "web-server",
      "cpu": 4,
      "ram": "8GB",
      "disk": "50GB",
      "network": "internal-net",
      "image": "ubuntu-22.04",
      "firewall": ["ssh", "http", "https"],
      "user": "adminOps",
      "replicas": 3
    }
  ]
}
```

## API Endpoints

### POST /plan
Generate a deployment plan without making changes.

**Request Body**: DeploymentConfig JSON
**Response**: Human-readable deployment plan

### POST /deploy
Deploy infrastructure to the cluster.

**Request Body**: DeploymentConfig JSON
**Response**: Deployment status and created resources

### GET /health
Health check endpoint.

## Development

### Build Frontend for Production

```bash
cd frontend
npm run build
```

### Lint Frontend Code

```bash
cd frontend
npm run lint
```

### Run Backend with Auto-reload

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Configuration

### Frontend Proxy

The frontend is configured to proxy API requests to the backend. See `frontend/vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Backend CORS

CORS is configured to allow requests from the frontend. See `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deployment Notes

### Production Deployment

For production deployment with actual LXD cluster:

1. Configure LXD endpoint and credentials
2. Update `backend/main.py` with Libcloud driver configuration:

```python
from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

LXD = get_driver(Provider.LXD)
driver = LXD(
    'https://your-lxd-endpoint:8443',
    cert_file='/path/to/client.crt',
    key_file='/path/to/client.key'
)
```

3. Implement actual VM/container creation logic
4. Add network and firewall configuration
5. Implement error handling and rollback

### Security Considerations

- Use HTTPS in production
- Implement authentication and authorization
- Secure LXD credentials
- Validate all user inputs
- Implement rate limiting
- Add audit logging

## Troubleshooting

### Frontend Not Starting
- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 3000 availability

### Backend Not Starting
- Check Python version: `python --version` (should be 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 availability

### CORS Errors
- Ensure backend is running on port 8000
- Check CORS configuration in `backend/main.py`
- Verify frontend proxy configuration

## License

MIT License

## Author

Created for infrastructure automation and visual deployment workflows.
