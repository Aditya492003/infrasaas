# ⚡ InfraSaaS — Interactive Cloud Infrastructure Simulator & AI Architecture Advisor

> **Design, stress-test, optimize, and simulate cloud infrastructure architectures visually with real-time performance analytics, cost estimation, and AI-driven recommendations.**

---

## 🌟 Overview

**InfraSaaS** is a full-featured web application designed to empower cloud engineers, architects, DevOps teams, and students to model, simulate, and optimize complex cloud infrastructure topologies before deploying to production. 

Built with **React 19**, **Vite**, **Tailwind CSS**, and **React Flow (`@xyflow/react`)**, InfraSaaS delivers a sleek, high-performance visual environment where users can construct cloud topologies, simulate heavy traffic spikes, discover system bottlenecks, optimize cloud spend, and receive intelligent architectural feedback.

---

## 🔥 Key Features

### 🎨 1. Interactive Visual Drag-and-Drop Canvas
- **Dynamic Topology Design**: Drag and drop nodes onto an interactive node graph canvas.
- **Rich Component Catalog**: Includes **Compute** (Servers, VMs, Containers, Serverless), **Network** (Load Balancers, API Gateways, CDNs), **Databases** (PostgreSQL, MySQL, MongoDB, Redis Cache), **Storage** (Object Storage, Block Storage, File Systems), and **Messaging** (SQS Queues, Kafka Brokers).
- **Wiring & Routing**: Connect components seamlessly with animated traffic edges and custom handle endpoints.
- **Canvas Controls**: Auto-alignment, grid toggling, zoom/pan, mini-map view, node duplication, and deletion.

### ⚡ 2. Real-Time Workload Simulation Engine
- **Discrete Traffic Load Modeling**: Simulate real-world workloads with configurable RPS (Requests Per Second), concurrent user loads, and request payload sizes.
- **Live System Analytics**: Calculate real-time metrics per node and across the entire graph:
  - 💻 **CPU & Memory Utilization**
  - ⏱️ **Latency Accumulation (ms)**
  - 🔄 **System Throughput (req/sec)**
  - ⚠️ **Error Rate (%)**
  - 💰 **Estimated Hourly & Monthly Cloud Cost ($)**
- **Live What-If Mode**: Observe dynamic metric recalibration in real-time as nodes are edited or workload sliders are adjusted.

### 🧠 3. AI Architecture Advisor & Multi-Pillar Rules Engine
- **Multi-Pillar Architectural Auditing**: Evaluates infrastructure against standard cloud pillars:
  - 🛡️ **Reliability & High Availability** (Multi-AZ failover, redundant load balancers, single points of failure).
  - 🚀 **Performance Efficiency** (Database caching, CDN distribution, read-replicas).
  - 💵 **Cost Optimization** (Over-provisioned compute, idle instances, reserved capacity).
  - 🔒 **Security Best Practices** (API Gateway throttling, public vs private subnets, SSL termination).
- **Architectural Health Score**: Real-time score (0–100%) with actionable improvement recommendations.

### 🚨 4. Automated Bottleneck & Failure Detection
- **Visual Failure Badges**: Highlights component bottlenecks directly on the visual graph.
- **Root Cause Analysis**: Pinpoints memory leaks, CPU saturation, bandwidth throttling, connection pool limits, and SPOFs.

### 🧪 5. Stress Testing & Chaos Controls
- **Traffic Multiplier Sliders**: Scale load smoothly from baseline to 10x peak volume.
- **Spike Test Triggers**: Inject sudden 5x–10x traffic surges to verify auto-scaling boundaries.
- **Failure Injection**: Simulate node crashes or cloud region outages to evaluate resilience and fault recovery.

### 🎯 6. Beginner Mode & Guided Setup Wizard
- **Questionnaire-Driven Setup**: Guided wizard to select target RPS, budget limits, cloud provider preferences, and SLA goals.
- **Pre-Built Template Gallery**: 
  - 🛒 **E-Commerce Platform** (Load Balancer, Web Servers, Redis Cache, PostgreSQL).
  - ⚡ **Serverless Microservices** (API Gateway, Serverless Functions, NoSQL Database).
  - 📊 **High-Throughput Streaming** (Kafka Event Broker, Worker Containers, Block Storage).
  - 🏢 **SaaS Multi-Tenant Backend** (CDN, API Gateway, Container Cluster, Relational DB).
  - 🤖 **AI Inference Pipeline** (GPU-backed Compute, Storage, Queues).

### 🎓 7. Interactive Onboarding Tutorial
- **Step-by-Step Guided Tour**: Onboarding modal introducing canvas manipulation, workload controls, running simulations, and interpreting AI recommendations.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **Node Graph & Canvas**: `@xyflow/react` (React Flow v12)
- **Styling**: Tailwind CSS v3, Vanilla CSS
- **Iconography**: Lucide React
- **Linter & Quality**: Oxlint

---

## 📁 Project Structure

```text
infrasaas/
├── public/                     # Static assets
├── src/
│   ├── components/             # UI Components
│   │   ├── AIAnalysisPanel/    # AI breakdown & audit findings
│   │   ├── ArchitectureAdvisor/# Multi-pillar architectural rule engine UI
│   │   ├── ArchitectureCanvas/ # React Flow interactive node canvas
│   │   ├── BeginnerMode/       # Guided wizard UI for non-experts
│   │   ├── ComponentSidebar/   # Infrastructure palette (Compute, DB, Storage...)
│   │   ├── NavigationSidebar/  # Mode switcher & app navigation drawer
│   │   ├── PropertiesPanel/    # Node specification configuration editor
│   │   ├── RequirementsPanel/  # Business goals, budget & SLA target inputs
│   │   ├── SimulationResults/  # Graphical metrics & simulation modal
│   │   ├── TopBar/             # Header bar with actions & simulation controls
│   │   ├── Tutorial/           # Guided interactive onboarding modal
│   │   └── WorkloadControls/   # Live traffic sliders & stress testing panel
│   ├── data/
│   │   ├── aiArchitect.js      # Natural language AI advisory logic
│   │   ├── defaultArchitecture.js # Default topology templates
│   │   └── infrastructureTypes.js # Infrastructure node definitions & specs
│   ├── pages/
│   │   ├── Landing.jsx         # Product landing page & feature showcase
│   │   ├── NewProject.jsx      # Project creation wizard & template selection
│   │   └── Simulator.jsx       # Main interactive architecture workspace
│   ├── simulation/
│   │   ├── architectureAdvisor.js # Multi-pillar evaluation rules & scoring engine
│   │   ├── resourceModels.js   # Resource cost & capacity calculation models
│   │   └── simulator.js        # Discrete event workload simulation logic
│   ├── App.jsx                 # Client-side router & state manager
│   ├── index.css               # Global styles & Tailwind directives
│   └── main.jsx                # Application entry point
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0 or later) and **npm** installed on your system.

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aditya492003/infrasaas.git
   cd infrasaas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL displayed in your terminal).

---

## 📜 Available Scripts

In the project directory, you can run:

| Script | Command | Description |
| :--- | :--- | :--- |
| **`npm run dev`** | `vite` | Starts the development server with Hot Module Replacement (HMR). |
| **`npm run build`** | `vite build` | Bundles the app for production in the `dist` folder. |
| **`npm run preview`** | `vite preview` | Locally previews the production build. |
| **`npm run lint`** | `oxlint` | Runs Oxlint code verification across the codebase. |

---

## 📊 How the Simulation Engine Works

1. **Graph Traversal**: The simulator traverses the visual node topology starting from entry points (CDNs, Load Balancers, API Gateways) through compute nodes down to database/storage layers.
2. **Load Propagation**: Workload (RPS & payload size) is split across parallel edges based on node instance counts and traffic distribution rules.
3. **Resource Saturation**: Each node evaluates its capacity (vCPUs, Memory, IOPS, Max Connections). When requested load exceeds node capacity, CPU/RAM utilization increases non-linearly, queuing delay builds up, and error rates rise.
4. **Cost Aggregation**: Monthly cost is computed using cloud tier formulas per resource specification (instance count, storage size in GB, IOPS provisioned, bandwidth egress).

---

## 🤝 Contributing

Contributions are welcome! If you would like to add new infrastructure node types, cloud providers, or simulation rules:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
