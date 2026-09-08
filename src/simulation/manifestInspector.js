/**
 * Heuristic Manifest & Lockfile Dependency Inspector
 * Parses package.json, package-lock.json, requirements.txt, and poetry.lock
 * Flags known memory-sensitive package families to feed into the LLM Architecture Advisor.
 */

const KNOWN_MEMORY_LIBRARIES = {
  // Machine Learning & AI Frameworks
  torch: { category: 'ML / AI Framework', note: 'Can require 200MB (CPU small tensor) to 28GB+ RAM (7B+ model checkpoints)', impact: 'high' },
  pytorch: { category: 'ML / AI Framework', note: 'Can require 200MB (CPU small tensor) to 28GB+ RAM (7B+ model checkpoints)', impact: 'high' },
  tensorflow: { category: 'ML / AI Framework', note: 'Model weight memory footprint varies with model parameter size and batch size', impact: 'high' },
  transformers: { category: 'HuggingFace Transformers', note: 'Model inference weights require significant RAM/VRAM depending on model scale', impact: 'high' },
  onnxruntime: { category: 'ONNX ML Engine', note: 'Inference runtime memory depends on tensor graph shape & execution provider', impact: 'medium' },
  spacy: { category: 'NLP Library', note: 'Large language models (e.g. en_core_web_trf) load ~500MB–2GB into memory', impact: 'medium' },
  'faiss-cpu': { category: 'Vector Search Engine', note: 'Index memory usage scales linearly with vector count and dimension size', impact: 'medium' },

  // Headless Browsers & Heavy Image/Video Processing
  puppeteer: { category: 'Headless Browser', note: 'Chromium instances consume 150MB–500MB RAM per concurrent browser tab', impact: 'high' },
  'puppeteer-core': { category: 'Headless Browser', note: 'Chromium instances consume 150MB–500MB RAM per concurrent browser tab', impact: 'high' },
  playwright: { category: 'Headless Browser', note: 'Browser contexts consume 200MB+ RAM per concurrent worker', impact: 'high' },
  sharp: { category: 'Native Image Processing', note: 'Libvips image buffers require 100MB–1GB+ RAM during high-res image operations', impact: 'medium' },
  canvas: { category: 'Node Canvas Processing', note: '2D context buffers require memory per canvas instance', impact: 'medium' },
  'opencv-python': { category: 'Computer Vision', note: 'Matrix transformations and frame buffers scale with video resolution', impact: 'high' },

  // Data Processing & Analytics
  pandas: { category: 'Data Analysis', note: 'DataFrame memory usage scales with dataset size (10MB to 50GB+ in memory)', impact: 'medium' },
  polars: { category: 'Data Analysis', note: 'In-memory columnar data processing scales with dataset size', impact: 'medium' },
  pyarrow: { category: 'Columnar Data', note: 'In-memory Apache Arrow buffers scale with dataset size', impact: 'medium' },
  'scikit-learn': { category: 'Data Science', note: 'Model fitting loads dataset matrices into memory', impact: 'medium' },

  // Enterprise Runtimes
  'spring-boot-starter': { category: 'Enterprise Java', note: 'JVM heap baseline typically starts at 512MB–2GB+ RAM', impact: 'medium' },
  elasticsearch: { category: 'Search Engine Client', note: 'Search cluster indexing & JVM heap usage depend on document volume', impact: 'high' },
};

/**
 * Inspect raw manifest text (package.json, requirements.txt, etc.)
 */
export function inspectProjectManifest(content = '', filename = 'package.json') {
  const fileLower = filename.toLowerCase();
  const flaggedLibraries = [];
  const text = content.toLowerCase();

  // 1. JSON Manifest / Lockfile (package.json, package-lock.json)
  if (fileLower.endsWith('.json')) {
    try {
      const parsed = JSON.parse(content);
      const allDeps = {
        ...(parsed.dependencies || {}),
        ...(parsed.devDependencies || {}),
        ...(parsed.packages || {}), // package-lock v2/v3 support
      };

      // Search keys
      Object.keys(allDeps).forEach(depKey => {
        const cleanKey = depKey.replace(/^node_modules\//, '').toLowerCase();
        if (KNOWN_MEMORY_LIBRARIES[cleanKey]) {
          flaggedLibraries.push({
            name: cleanKey,
            ...KNOWN_MEMORY_LIBRARIES[cleanKey],
            isTransitive: fileLower.includes('lock')
          });
        }
      });
    } catch (e) {
      // String match fallback if invalid JSON snippet
    }
  }

  // 2. Python requirements.txt or poetry.lock fallback text parsing
  if (flaggedLibraries.length === 0) {
    Object.keys(KNOWN_MEMORY_LIBRARIES).forEach(lib => {
      if (text.includes(lib)) {
        flaggedLibraries.push({
          name: lib,
          ...KNOWN_MEMORY_LIBRARIES[lib],
          isTransitive: fileLower.includes('lock')
        });
      }
    });
  }

  // Remove duplicates
  const uniqueFlags = Array.from(new Map(flaggedLibraries.map(item => [item.name, item])).values());

  return {
    filename,
    totalFlags: uniqueFlags.length,
    flags: uniqueFlags,
    disclaimer: 'Memory estimates are based on common library usage patterns. Actual memory usage depends heavily on dataset size, model parameter count, and batch concurrency. Always profile runtime memory before production deployment.'
  };
}
