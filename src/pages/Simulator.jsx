import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNodesState, useEdgesState, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { TopBar } from '../components/TopBar/TopBar';
import { ComponentSidebar } from '../components/ComponentSidebar/ComponentSidebar';
import { ArchitectureCanvas } from '../components/ArchitectureCanvas/ArchitectureCanvas';
import { PropertiesPanel } from '../components/PropertiesPanel/PropertiesPanel';
import { RequirementsPanel } from '../components/RequirementsPanel/RequirementsPanel';
import { WorkloadControls } from '../components/WorkloadControls/WorkloadControls';
import { SimulationResultsModal } from '../components/SimulationResults/SimulationResultsModal';
import { AIAnalysisPanel } from '../components/AIAnalysisPanel/AIAnalysisPanel';
import { BeginnerWorkspace } from '../components/BeginnerMode/BeginnerWorkspace';
import { NavigationSidebar } from '../components/NavigationSidebar/NavigationSidebar';
import { TutorialModal } from '../components/Tutorial/TutorialModal';
import { ArchitectureAdvisor } from '../components/ArchitectureAdvisor/ArchitectureAdvisor';
import { IacExportModal } from '../components/IacExportModal/IacExportModal';
import { LoadTestModal } from '../components/LoadTestModal/LoadTestModal';
import { analyzeArchitecture } from '../simulation/architectureAdvisor';
import { DEFAULT_NODES, DEFAULT_EDGES } from '../data/defaultArchitecture';
import { getComponentDef } from '../data/infrastructureTypes';
import { runSimulation } from '../simulation/simulator';

const SimulatorWorkspace = ({ onNavigateLanding, onNavigateNewProject, projectData }) => {
  const [architectureName, setArchitectureName] = useState(projectData?.name || 'Untitled Architecture');
  const [nodes, setNodes, onNodesChange] = useNodesState(projectData?.nodes || DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(projectData?.edges || DEFAULT_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Workload state
  const [workload, setWorkload] = useState(projectData?.workload || {
    concurrentUsers: 10000,
    requestsPerSecond: 1200,
    trafficMultiplier: 1,
    requestSize: 100, // KB
  });

  // Simulation & Modal states
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [liveWhatIf, setLiveWhatIf] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isIacModalOpen, setIsIacModalOpen] = useState(false);
  const [isLoadTestModalOpen, setIsLoadTestModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');
  const [mode, setMode] = useState('architect'); // 'architect' | 'beginner'

  // Derive selected node object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Simulation execution engine
  const executeSimulation = useCallback((currentNodes, currentEdges, currentWorkload) => {
    setIsSimulating(true);

    const result = runSimulation({
      nodes: currentNodes,
      edges: currentEdges,
      workload: currentWorkload,
    });

    setSimulationResult(result);
    setHasSimulated(true);

    // Annotate nodes with calculated metrics and bottleneck badge
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          metrics: result.nodeMetrics[node.id] || null,
          isBottleneck: result.bottleneck?.nodeId === node.id,
        },
      }))
    );

    setTimeout(() => {
      setIsSimulating(false);
    }, 200);
  }, [setNodes]);

  // Live What-If re-evaluation when workload or graph changes
  useEffect(() => {
    if (liveWhatIf && hasSimulated) {
      const result = runSimulation({
        nodes,
        edges,
        workload,
      });
      setSimulationResult(result);

      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            metrics: result.nodeMetrics[node.id] || null,
            isBottleneck: result.bottleneck?.nodeId === node.id,
          },
        }))
      );
    }
  }, [workload, liveWhatIf, hasSimulated]);

  // Sync projectData when new project is chosen
  useEffect(() => {
    if (projectData) {
      if (projectData.name) setArchitectureName(projectData.name);
      if (projectData.nodes) setNodes(projectData.nodes);
      if (projectData.edges) setEdges(projectData.edges);
      if (projectData.workload) setWorkload(projectData.workload);
      setSimulationResult(null);
      setHasSimulated(false);
      setSelectedNodeId(null);
    }
  }, [projectData, setNodes, setEdges]);

  // Trigger manual simulation run
  const handleRunSimulation = () => {
    executeSimulation(nodes, edges, workload);
  };

  // Node selection callback
  const handleSelectNode = useCallback((node) => {
    setSelectedNodeId(node ? node.id : null);
  }, []);

  // Update node config from Properties Panel
  const handleUpdateNodeConfig = useCallback((nodeId, newConfig) => {
    setNodes((nds) => {
      const updated = nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              name: newConfig.name || node.data.name,
              config: { ...newConfig },
            },
          };
        }
        return node;
      });

      // If already simulated, re-run simulation with updated node configs
      if (hasSimulated) {
        executeSimulation(updated, edges, workload);
      }
      return updated;
    });
  }, [edges, workload, hasSimulated, executeSimulation, setNodes]);

  // Delete node
  const handleDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  // Add component by clicking from sidebar
  const handleAddComponent = useCallback((type) => {
    const compDef = getComponentDef(type);
    const count = nodes.filter((n) => n.data?.type === type).length + 1;
    const newNodeId = `${type}-${Date.now().toString().slice(-4)}`;

    // Place new node in a visible area
    const offset = (nodes.length % 5) * 40;
    const newNode = {
      id: newNodeId,
      type: 'infrastructure',
      position: { x: 300 + offset, y: 250 + offset },
      data: {
        type,
        name: `${compDef.name} ${count}`,
        category: compDef.category,
        config: { ...compDef.defaultConfig },
        metrics: null,
      },
    };

    setNodes((nds) => nds.concat(newNode));
    setSelectedNodeId(newNodeId);
  }, [nodes, setNodes]);

  // Add suggested components from Requirements Parser
  const handleAddSuggestedNodes = useCallback((suggestedItems) => {
    let startY = 280;
    const newNodes = [];

    suggestedItems.forEach((item, index) => {
      const newNodeId = `${item.type}-sugg-${Date.now().toString().slice(-4)}-${index}`;
      newNodes.push({
        id: newNodeId,
        type: 'infrastructure',
        position: { x: 150 + index * 180, y: startY + (index % 2) * 50 },
        data: {
          type: item.type,
          name: item.name,
          category: item.category,
          config: { ...item.config },
          metrics: null,
        },
      });
    });

    setNodes((nds) => nds.concat(newNodes));
  }, [setNodes]);

  // One-click remediation action
  const handleRemediate = useCallback((action) => {
    if (action === 'upgrade_db') {
      // Find database node and upgrade to db.r5.large
      setNodes((nds) => {
        const updated = nds.map((node) => {
          if (['postgresql', 'mysql', 'mongodb'].includes(node.data?.type)) {
            return {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  instanceType: 'db.r5.large',
                  maxConnections: 400,
                  iops: 6000,
                },
              },
            };
          }
          return node;
        });
        executeSimulation(updated, edges, workload);
        return updated;
      });
    } else if (action === 'add_redis') {
      // Add Redis node and wire it into the architecture
      const redisDef = getComponentDef('redis');
      const redisId = `redis-${Date.now().toString().slice(-4)}`;
      const redisNode = {
        id: redisId,
        type: 'infrastructure',
        position: { x: 420, y: 500 },
        data: {
          type: 'redis',
          name: 'Redis Cache',
          category: 'database',
          config: { ...redisDef.defaultConfig },
          metrics: null,
        },
      };

      setNodes((nds) => {
        const updatedNodes = nds.concat(redisNode);
        setEdges((eds) => {
          const newEdges = [
            ...eds,
            { id: `e-s2-redis`, source: 'server-2', target: redisId },
            { id: `e-redis-db`, source: redisId, target: 'db-1' },
          ];
          executeSimulation(updatedNodes, newEdges, workload);
          return newEdges;
        });
        return updatedNodes;
      });
    } else if (action === 'scale_servers') {
      // Scale server instances
      setNodes((nds) => {
        const updated = nds.map((node) => {
          if (node.data?.type === 'server') {
            return {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  instances: (node.data.config.instances || 1) + 2,
                },
              },
            };
          }
          return node;
        });
        executeSimulation(updated, edges, workload);
        return updated;
      });
    } else if (action === 'upgrade_server_type') {
      // Upgrade servers to t3.xlarge
      setNodes((nds) => {
        const updated = nds.map((node) => {
          if (node.data?.type === 'server') {
            return {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  instanceType: 't3.xlarge',
                  vcpu: 4,
                  memory: 16,
                },
              },
            };
          }
          return node;
        });
        executeSimulation(updated, edges, workload);
        return updated;
      });
    }
  }, [edges, workload, executeSimulation, setNodes, setEdges]);

  // Reset to default architecture
  const handleResetArchitecture = useCallback(() => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setSelectedNodeId(null);
    setSimulationResult(null);
    setHasSimulated(false);
  }, [setNodes, setEdges]);

  // Architecture Advisor real-time linting & anti-pattern analysis
  const advisorSuggestions = useMemo(() => {
    return analyzeArchitecture({ nodes, edges });
  }, [nodes, edges]);

  // Handle Architecture Advisor Quick Fixes
  const handleApplyAdvisorFix = useCallback((quickFix) => {
    if (!quickFix) return;
    const { action } = quickFix;

    if (action === 'connect_orphan') {
      const targetNode = nodes.find(n => n.id === quickFix.targetId);
      if (!targetNode) return;

      let sourceNodeId = 'client-1';
      const lb = nodes.find(n => ['load_balancer', 'api_gateway'].includes(n.data?.type));
      const server = nodes.find(n => ['server', 'vm', 'container'].includes(n.data?.type));

      if (['server', 'vm', 'container'].includes(targetNode.data?.type)) {
        sourceNodeId = lb ? lb.id : 'client-1';
      } else if (['postgresql', 'mysql', 'mongodb', 'redis', 'object_storage'].includes(targetNode.data?.type)) {
        sourceNodeId = server ? server.id : (lb ? lb.id : 'client-1');
      }

      setEdges(eds => [
        ...eds,
        { id: `e-fix-${Date.now()}`, source: sourceNodeId, target: targetNode.id, animated: true }
      ]);
    } else if (action === 'fix_client_db_direct') {
      const sDef = getComponentDef('server');
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;
      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 320 },
        data: {
          type: 'server',
          name: 'Application Server',
          category: 'compute',
          config: { ...sDef.defaultConfig, instances: 2 },
          metrics: null
        }
      };
      setNodes(nds => nds.concat(newServer));
      setEdges(eds => [
        ...eds.filter(e => e.id !== quickFix.edgeId),
        { id: `e-client-${sId}`, source: 'client-1', target: sId, animated: true },
        { id: `e-${sId}-${quickFix.dbId}`, source: sId, target: quickFix.dbId }
      ]);
    } else if (action === 'add_load_balancer') {
      const lbDef = getComponentDef('load_balancer');
      const lbId = `lb-fix-${Date.now().toString().slice(-4)}`;
      const newLb = {
        id: lbId,
        type: 'infrastructure',
        position: { x: 380, y: 220 },
        data: {
          type: 'load_balancer',
          name: 'Load Balancer',
          category: 'network',
          config: { ...lbDef.defaultConfig },
          metrics: null
        }
      };
      setNodes(nds => nds.concat(newLb));
      setEdges(eds => {
        const client = nodes.find(n => n.data?.type === 'client');
        const servers = nodes.filter(n => ['server', 'vm', 'container'].includes(n.data?.type));
        const newEds = eds.filter(e => e.source !== (client?.id || 'client-1'));
        newEds.push({ id: `e-client-lb`, source: client?.id || 'client-1', target: lbId, animated: true });
        servers.forEach(s => {
          newEds.push({ id: `e-lb-${s.id}`, source: lbId, target: s.id, animated: true });
        });
        return newEds;
      });
    } else if (action === 'add_server_for_db' || action === 'add_basic_server') {
      const sDef = getComponentDef('server');
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;
      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 340 },
        data: {
          type: 'server',
          name: 'Application Server',
          category: 'compute',
          config: { ...sDef.defaultConfig, instances: 2 },
          metrics: null
        }
      };
      setNodes(nds => nds.concat(newServer));
      const lb = nodes.find(n => ['load_balancer', 'api_gateway'].includes(n.data?.type));
      setEdges(eds => [
        ...eds,
        { id: `e-upstream-${sId}`, source: lb ? lb.id : 'client-1', target: sId, animated: true },
        ...(quickFix.dbId ? [{ id: `e-${sId}-db`, source: sId, target: quickFix.dbId }] : [])
      ]);
    } else if (action === 'add_primary_db') {
      const dbDef = getComponentDef('postgresql');
      const dbId = `db-fix-${Date.now().toString().slice(-4)}`;
      const newDb = {
        id: dbId,
        type: 'infrastructure',
        position: { x: 260, y: 520 },
        data: {
          type: 'postgresql',
          name: 'PostgreSQL Primary',
          category: 'database',
          config: { ...dbDef.defaultConfig },
          metrics: null
        }
      };
      setNodes(nds => nds.concat(newDb));
      const server = nodes.find(n => ['server', 'vm', 'container'].includes(n.data?.type));
      if (server) {
        setEdges(eds => [...eds, { id: `e-${server.id}-${dbId}`, source: server.id, target: dbId }]);
      }
    } else if (action === 'add_queue_worker') {
      const cDef = getComponentDef('container');
      const wId = `worker-fix-${Date.now().toString().slice(-4)}`;
      const newWorker = {
        id: wId,
        type: 'infrastructure',
        position: { x: 580, y: 520 },
        data: {
          type: 'container',
          name: 'Queue Worker',
          category: 'compute',
          config: { ...cDef.defaultConfig, taskCount: 2 },
          metrics: null
        }
      };
      setNodes(nds => nds.concat(newWorker));
      if (quickFix.queueId) {
        setEdges(eds => [...eds, { id: `e-${quickFix.queueId}-${wId}`, source: quickFix.queueId, target: wId, animated: true }]);
      }
    } else if (action === 'fix_client_server_direct') {
      // Connect website directly to server without LB or DB:
      // Insert Load Balancer between client & server, and add PostgreSQL to server
      const lbDef = getComponentDef('load_balancer');
      const dbDef = getComponentDef('postgresql');
      const lbId = `lb-fix-${Date.now().toString().slice(-4)}`;
      const dbId = `db-fix-${Date.now().toString().slice(-4)}`;

      const newLb = {
        id: lbId,
        type: 'infrastructure',
        position: { x: 380, y: 190 },
        data: {
          type: 'load_balancer',
          name: 'Load Balancer',
          category: 'network',
          config: { ...lbDef.defaultConfig },
          metrics: null
        }
      };

      const newDb = {
        id: dbId,
        type: 'infrastructure',
        position: { x: 380, y: 520 },
        data: {
          type: 'postgresql',
          name: 'PostgreSQL Database',
          category: 'database',
          config: { ...dbDef.defaultConfig },
          metrics: null
        }
      };

      setNodes(nds => nds.concat([newLb, newDb]));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.clientId && e.target === quickFix.serverId));
        return [
          ...filtered,
          { id: `e-client-lb-${Date.now()}`, source: quickFix.clientId, target: lbId, animated: true },
          { id: `e-lb-server-${Date.now()}`, source: lbId, target: quickFix.serverId, animated: true },
          { id: `e-server-db-${Date.now()}`, source: quickFix.serverId, target: dbId }
        ];
      });
    } else if (action === 'insert_server_for_redis') {
      const sDef = getComponentDef('server');
      const dbDef = getComponentDef('postgresql');
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;
      const dbId = `db-fix-${Date.now().toString().slice(-4)}`;

      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 220 },
        data: {
          type: 'server',
          name: 'Application Server',
          category: 'compute',
          config: { ...sDef.defaultConfig, instances: 2 },
          metrics: null
        }
      };

      const newDb = {
        id: dbId,
        type: 'infrastructure',
        position: { x: 260, y: 520 },
        data: {
          type: 'postgresql',
          name: 'PostgreSQL Primary',
          category: 'database',
          config: { ...dbDef.defaultConfig },
          metrics: null
        }
      };

      setNodes(nds => nds.concat([newServer, newDb]));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.clientId && e.target === quickFix.redisId));
        return [
          ...filtered,
          { id: `e-client-server-${Date.now()}`, source: quickFix.clientId, target: sId, animated: true },
          { id: `e-server-redis-${Date.now()}`, source: sId, target: quickFix.redisId },
          { id: `e-server-db-${Date.now()}`, source: sId, target: dbId }
        ];
      });
    } else if (action === 'insert_api_gateway_for_queue') {
      const gwDef = getComponentDef('api_gateway');
      const gwId = `gw-fix-${Date.now().toString().slice(-4)}`;
      const newGw = {
        id: gwId,
        type: 'infrastructure',
        position: { x: 380, y: 220 },
        data: {
          type: 'api_gateway',
          name: 'API Gateway',
          category: 'network',
          config: { ...gwDef.defaultConfig },
          metrics: null
        }
      };

      setNodes(nds => nds.concat(newGw));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.clientId && e.target === quickFix.queueId));
        return [
          ...filtered,
          { id: `e-client-gw-${Date.now()}`, source: quickFix.clientId, target: gwId, animated: true },
          { id: `e-gw-queue-${Date.now()}`, source: gwId, target: quickFix.queueId, animated: true }
        ];
      });
    } else if (action === 'reroute_cdn_to_lb') {
      const lbDef = getComponentDef('load_balancer');
      const sDef = getComponentDef('server');
      const lbId = `lb-fix-${Date.now().toString().slice(-4)}`;
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;

      const newLb = {
        id: lbId,
        type: 'infrastructure',
        position: { x: 380, y: 240 },
        data: { type: 'load_balancer', name: 'Load Balancer', category: 'network', config: { ...lbDef.defaultConfig }, metrics: null }
      };
      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 380 },
        data: { type: 'server', name: 'Application Server', category: 'compute', config: { ...sDef.defaultConfig }, metrics: null }
      };

      setNodes(nds => nds.concat([newLb, newServer]));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.cdnId && e.target === quickFix.dbId));
        return [
          ...filtered,
          { id: `e-cdn-lb-${Date.now()}`, source: quickFix.cdnId, target: lbId, animated: true },
          { id: `e-lb-server-${Date.now()}`, source: lbId, target: sId, animated: true },
          { id: `e-server-db-${Date.now()}`, source: sId, target: quickFix.dbId }
        ];
      });
    } else if (action === 'insert_server_between_lb_db') {
      const sDef = getComponentDef('server');
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;
      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 360 },
        data: { type: 'server', name: 'Application Server', category: 'compute', config: { ...sDef.defaultConfig }, metrics: null }
      };

      setNodes(nds => nds.concat(newServer));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.lbId && e.target === quickFix.dbId));
        return [
          ...filtered,
          { id: `e-lb-server-${Date.now()}`, source: quickFix.lbId, target: sId, animated: true },
          { id: `e-server-db-${Date.now()}`, source: sId, target: quickFix.dbId }
        ];
      });
    } else if (action === 'insert_server_between_lb_redis') {
      const sDef = getComponentDef('server');
      const sId = `server-fix-${Date.now().toString().slice(-4)}`;
      const newServer = {
        id: sId,
        type: 'infrastructure',
        position: { x: 380, y: 360 },
        data: { type: 'server', name: 'Application Server', category: 'compute', config: { ...sDef.defaultConfig }, metrics: null }
      };

      setNodes(nds => nds.concat(newServer));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.lbId && e.target === quickFix.redisId));
        return [
          ...filtered,
          { id: `e-lb-server-${Date.now()}`, source: quickFix.lbId, target: sId, animated: true },
          { id: `e-server-redis-${Date.now()}`, source: sId, target: quickFix.redisId }
        ];
      });
    } else if (action === 'insert_worker_between_queue_db') {
      const cDef = getComponentDef('container');
      const wId = `worker-fix-${Date.now().toString().slice(-4)}`;
      const newWorker = {
        id: wId,
        type: 'infrastructure',
        position: { x: 420, y: 460 },
        data: { type: 'container', name: 'Queue Worker', category: 'compute', config: { ...cDef.defaultConfig, taskCount: 2 }, metrics: null }
      };

      setNodes(nds => nds.concat(newWorker));
      setEdges(eds => {
        const filtered = eds.filter(e => !(e.source === quickFix.queueId && e.target === quickFix.dbId));
        return [
          ...filtered,
          { id: `e-queue-worker-${Date.now()}`, source: quickFix.queueId, target: wId, animated: true },
          { id: `e-worker-db-${Date.now()}`, source: wId, target: quickFix.dbId }
        ];
      });
    } else if (action === 'reroute_storage_db') {
      setEdges(eds => eds.filter(e => !(e.source === quickFix.storageId && e.target === quickFix.dbId)));
      const server = nodes.find(n => ['server', 'vm', 'container'].includes(n.data?.type));
      if (server) {
        setEdges(eds => [
          ...eds.filter(e => !(e.source === quickFix.storageId && e.target === quickFix.dbId)),
          { id: `e-server-storage-${Date.now()}`, source: server.id, target: quickFix.storageId }
        ]);
      }
    } else if (action === 'fix_dual_db') {
      setEdges(eds => eds.filter(e => !(e.source === quickFix.sourceDbId && e.target === quickFix.targetDbId)));
      const server = nodes.find(n => ['server', 'vm', 'container'].includes(n.data?.type));
      if (server) {
        setEdges(eds => [
          ...eds.filter(e => !(e.source === quickFix.sourceDbId && e.target === quickFix.targetDbId)),
          { id: `e-server-db1-${Date.now()}`, source: server.id, target: quickFix.sourceDbId },
          { id: `e-server-db2-${Date.now()}`, source: server.id, target: quickFix.targetDbId }
        ]);
      }
    } else if (action === 'add_redis_cache') {
      handleRemediate('add_redis');
    }
  }, [nodes, setNodes, setEdges, handleRemediate]);

  // Build standard website architecture from tutorial
  const handleBuildTutorialArchitecture = useCallback(() => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    setArchitectureName('Standard Website Architecture');
    setWorkload({
      concurrentUsers: 10000,
      requestsPerSecond: 1200,
      trafficMultiplier: 1,
      requestSize: 100,
    });
    executeSimulation(DEFAULT_NODES, DEFAULT_EDGES, {
      concurrentUsers: 10000,
      requestsPerSecond: 1200,
      trafficMultiplier: 1,
      requestSize: 100,
    });
  }, [setNodes, setEdges, executeSimulation]);

  // Load project from recent / blueprints drawer
  const handleLoadProject = useCallback((project) => {
    if (!project) return;
    if (project.name) setArchitectureName(project.name);
    if (project.nodes) setNodes(project.nodes);
    if (project.edges) setEdges(project.edges);
    if (project.workload) setWorkload(project.workload);
    setSimulationResult(null);
    setHasSimulated(false);
    setSelectedNodeId(null);
  }, [setNodes, setEdges]);

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Top Bar */}
      <TopBar
        architectureName={architectureName}
        setArchitectureName={setArchitectureName}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
        hasSimulated={hasSimulated}
        systemStatus={simulationResult?.status || 'idle'}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        onResetArchitecture={handleResetArchitecture}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenIacExport={() => setIsIacModalOpen(true)}
        onOpenLoadTest={() => setIsLoadTestModalOpen(true)}
        onNavigateLanding={onNavigateLanding}
        onNavigateNewProject={onNavigateNewProject}
        onOpenNavSidebar={() => setIsNavSidebarOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        mode={mode}
        setMode={setMode}
      />

      {/* Main Workspace Body */}
      {mode === 'beginner' ? (
        <BeginnerWorkspace
          nodes={nodes}
          workload={workload}
          setWorkload={setWorkload}
          simulationResult={simulationResult}
          onRunSimulation={handleRunSimulation}
          isSimulating={isSimulating}
          onRemediate={handleRemediate}
          onUpdateNodeConfig={handleUpdateNodeConfig}
          onAddComponent={handleAddComponent}
        />
      ) : (
        <>
          {/* Main Workspace: Sidebar + Canvas + Properties Panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Component Library */}
            <ComponentSidebar onAddComponent={handleAddComponent} />

            {/* Center Architecture Canvas with Requirements & Results overlays */}
            <div className="flex-1 h-full relative overflow-hidden">
              {/* Collapsible Requirements Parser Overlay */}
              <RequirementsPanel onAddSuggestedNodes={handleAddSuggestedNodes} />

              {/* Floating Real-time Architecture Advisor / Anti-pattern Linter */}
              <ArchitectureAdvisor
                suggestions={advisorSuggestions}
                onApplyFix={handleApplyAdvisorFix}
              />

              {/* Floating Simulation Results Card */}
              {hasSimulated && (
                <SimulationResultsModal
                  simulationResult={simulationResult}
                  onRemediate={handleRemediate}
                  onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
                  onClose={() => setSimulationResult(null)}
                />
              )}

              {/* Interactive React Flow Canvas */}
              <ArchitectureCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                setNodes={setNodes}
                setEdges={setEdges}
                onSelectNode={handleSelectNode}
                selectedNodeId={selectedNodeId}
                advisorSuggestions={advisorSuggestions}
              />
            </div>

            {/* Right Properties Inspector */}
            <PropertiesPanel
              selectedNode={selectedNode}
              onUpdateNodeConfig={handleUpdateNodeConfig}
              onDeleteNode={handleDeleteNode}
            />
          </div>

          {/* Bottom Workload Controls */}
          <WorkloadControls
            workload={workload}
            setWorkload={setWorkload}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
            liveWhatIf={liveWhatIf}
            setLiveWhatIf={setLiveWhatIf}
          />
        </>
      )}

      {/* AI Analysis Slide-over Assistant */}
      <AIAnalysisPanel
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        nodes={nodes}
        edges={edges}
        workload={workload}
        simulationResult={simulationResult}
        onRemediate={handleRemediate}
      />

      {/* Deployable Infrastructure as Code (IaC) Export Modal */}
      <IacExportModal
        isOpen={isIacModalOpen}
        onClose={() => setIsIacModalOpen(false)}
        nodes={nodes}
        edges={edges}
        architectureName={architectureName}
      />

      {/* Load Test Generator & Benchmark Validation Modal */}
      <LoadTestModal
        isOpen={isLoadTestModalOpen}
        onClose={() => setIsLoadTestModalOpen(false)}
        nodes={nodes}
        workload={workload}
        simulationResult={simulationResult}
      />

      {/* Navigation App Drawer (Recent Creations, Pricing, Blueprints, Guides) */}
      <NavigationSidebar
        isOpen={isNavSidebarOpen}
        onClose={() => setIsNavSidebarOpen(false)}
        onLoadProject={handleLoadProject}
        onNavigateNewProject={onNavigateNewProject}
      />

      {/* Interactive Website Infrastructure Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onBuildTutorialArchitecture={handleBuildTutorialArchitecture}
      />
    </div>
  );
};

export const Simulator = ({ onNavigateLanding, onNavigateNewProject, projectData }) => {
  return (
    <ReactFlowProvider>
      <SimulatorWorkspace 
        onNavigateLanding={onNavigateLanding} 
        onNavigateNewProject={onNavigateNewProject}
        projectData={projectData}
      />
    </ReactFlowProvider>
  );
};

