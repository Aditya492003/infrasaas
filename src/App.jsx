import React, { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Simulator } from './pages/Simulator';
import { NewProject } from './pages/NewProject';

export default function App() {
  const getPath = () => {
    const p = window.location.pathname;
    if (p.startsWith('/new')) return '/new';
    if (p.startsWith('/simulate')) return '/simulate';
    return '/';
  };

  const [currentPath, setCurrentPath] = useState(getPath());
  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleSelectProject = (newProject) => {
    setProjectData(newProject);
    navigateTo('/simulate');
  };

  if (currentPath === '/new') {
    return (
      <NewProject
        onSelectProject={handleSelectProject}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  if (currentPath === '/simulate') {
    return (
      <Simulator
        onNavigateLanding={() => navigateTo('/')}
        onNavigateNewProject={() => navigateTo('/new')}
        projectData={projectData}
      />
    );
  }

  return (
    <Landing
      onNavigateSimulator={() => navigateTo('/simulate')}
      onNavigateNewProject={() => navigateTo('/new')}
    />
  );
}
