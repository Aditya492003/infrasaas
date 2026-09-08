# ⚡ InfraSaaS — Interactive Cloud Infrastructure Simulator & AI Architecture Advisor

> **Design, stress-test, optimize, simulate, export IaC, and benchmark cloud infrastructure visually with real-time AWS pricing, true LLM reasoning, and automated k6/Locust load testing.**

---

## 🌟 Overview

**InfraSaaS** is a full-featured, **100% free** web platform built for cloud engineers, DevOps architects, site reliability engineers (SREs), and developers to design, simulate, benchmark, and deploy cloud infrastructure topologies.

Unlike traditional diagramming tools, InfraSaaS turns visual architecture graphs into:
1. **Live AWS Price Models** grounded in real regional cloud pricing feeds.
2. **Deployable Infrastructure as Code (IaC)** (Terraform HCL & AWS CloudFormation).
3. **True LLM Architecture Auditing** using Google Gemini 1.5, Localhost Ollama, or built-in AI synthesis.
4. **Custom Load Testing Scripts (k6 & Locust)** with automated **Simulated vs. Real Benchmark Accuracy Validation**.

---

## 🚀 Key Uniqueness & Feature Highlights

### 📊 1. Live AWS Pricing API Sync (Grounded in Real Data)
- **Multi-Region Support**: Select between AWS Regions (`us-east-1`, `ap-south-1` Mumbai, `eu-central-1` Frankfurt, `us-west-2`, `ap-southeast-1`).
- **Real Rate Fetching**: Dynamically queries AWS pricing feeds for EC2 compute, RDS databases, ElastiCache Redis, S3 storage, and CloudFront bandwidth.
- **Transparent Spend Breakdown**: Calculates hourly and monthly cloud cost with regional cost multipliers.

### 🛠️ 2. Deployable Infrastructure as Code (IaC Export)
- **HashiCorp Terraform HCL**: Exports complete, modular HCL files (`main.tf`, `variables.tf`, `outputs.tf`) containing VPCs, subnets, Security Groups, EC2 instances, ALB target groups, ECS Fargate services, Lambda functions, RDS databases, ElastiCache clusters, S3 buckets, and SQS queues.
- **AWS CloudFormation YAML**: Generates valid CloudFormation templates (`template.yaml`) ready for `aws cloudformation deploy`.
- **1-Click Actions**: Syntax-highlighted code modal with copy-to-clipboard and `.tf` / `.yaml` file download buttons.

### 🧠 3. True LLM AI Architecture Advisor
- **Deep Topology Reasoning**: Passes the visual graph JSON, workload parameters, latency bottlenecks, single points of failure (SPOFs), and cost metrics into LLMs.
- **100% Free Engine Selection**:
  - **Google Gemini 1.5 Flash** (via Free Gemini API key).
  - **Localhost Ollama** (`http://localhost:11434` running Llama3 or Mistral).
  - **Built-in Local AI Synthesizer** (runs client-side with zero configuration).

### 🧪 4. Load Test Generator & Real Benchmark Validator (k6 & Locust)
- **Automated Script Generation**: Exports production-ready **k6 JavaScript (`script.js`)** and **Locust Python (`locustfile.py`)** test scripts configured with VU ramp-up stages, stress thresholds, and endpoint payloads matching your visual topology.
- **Simulator vs. Real Load Test Validator**: Input real measured test results (Latency ms, Throughput RPS, Error Rate %) from your actual benchmark run to compute **Prediction Accuracy Score (%)** and variance deltas.

### 🎨 5. Interactive Visual Canvas & Discrete Event Simulator
- **Node Graph Workbench**: Powered by `@xyflow/react` with animated traffic routing, custom handle connections, auto-alignment, grid controls, and mini-map.
- **Non-Linear Queueing Engine**: Models system hockey-stick latency curves when utilization crosses 85% capacity.
- **Stress & Chaos Testing**: Trigger 5x–10x traffic spikes or inject simulated node crashes to verify fault recovery.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **Node Graph & Canvas**: `@xyflow/react` (React Flow v12)
- **IaC Code Compiler**: Custom HCL & CloudFormation AST compiler
- **LLM Engine**: Google Gemini API & Ollama HTTP client
- **Benchmark Generator**: k6 & Locust script compiler
- **Styling**: Tailwind CSS v3, Vanilla CSS
- **Iconography**: Lucide React
- **Quality**: Oxlint

---

## 📁 Project Structure

```text
infrasaas/
├── public/                     # Static assets
├── src/
│   ├── components/             # UI Components
│   │   ├── AIAnalysisPanel/    # LLM Architecture Advisor slide-over
│   │   ├── ArchitectureAdvisor/# Multi-pillar rule engine UI
│   │   ├── ArchitectureCanvas/ # React Flow interactive node canvas
│   │   ├── BeginnerMode/       # Guided wizard UI for non-experts
│   │   ├── ComponentSidebar/   # Infrastructure palette (Compute, DB, Storage...)
│   │   ├── IacExportModal/     # Terraform HCL & CloudFormation code exporter modal
│   │   ├── LoadTestModal/      # k6/Locust generator & benchmark accuracy modal
│   │   ├── NavigationSidebar/  # App drawer for templates & project loading
│   │   ├── PropertiesPanel/    # Node spec inspector & editor
│   │   ├── RequirementsPanel/  # Business goals & SLA targets input panel
│   │   ├── SimulationResults/  # Graphical simulation analytics modal
│   │   ├── TopBar/             # Header bar with AWS region picker & IaC/Load Test triggers
│   │   ├── Tutorial/           # Guided interactive onboarding tour
│   │   └── WorkloadControls/   # Live traffic sliders & stress testing panel
│   ├── data/
│   │   ├── aiArchitect.js      # Natural language topology generator
│   │   ├── defaultArchitecture.js # Pre-built architecture blueprints
│   │   └── infrastructureTypes.js # Infrastructure node definitions
│   ├── pages/
│   │   ├── Landing.jsx         # Product landing page & feature showcase
│   │   ├── NewProject.jsx      # Project creation wizard & template selection
│   │   └── Simulator.jsx       # Main interactive architecture workspace
│   ├── simulation/
│   │   ├── architectureAdvisor.js # Rule engine auditing rules
│   │   ├── iacExporter.js      # Terraform HCL & CloudFormation generator
│   │   ├── livePricingApi.js   # Live AWS Pricing API & multi-region lookup
│   │   ├── llmAdvisor.js       # Gemini/Ollama/Local LLM reasoning client
│   │   ├── loadTestBench.js    # k6/Locust generator & accuracy scoring
│   │   ├── resourceModels.js   # Resource capacity & queueing models
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

Ensure you have **Node.js** (v18.0 or later) and **npm** installed.

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
   Navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **`npm run dev`** | `vite` | Starts the local dev server with HMR. |
| **`npm run build`** | `vite build` | Builds the production bundle in `dist/`. |
| **`npm run preview`** | `vite preview` | Previews the production build locally. |
| **`npm run lint`** | `oxlint` | Runs Oxlint code verification. |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new infrastructure nodes, cloud providers, or IaC exporter targets.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
