/**
 * Lazy loader for Vertex AI SDK
 * This file is separated to prevent Turbopack from analyzing the import
 * when the SDK is not installed
 */

export async function loadVertexAI() {
  try {
    // Construct module name dynamically to prevent static analysis
    const parts = ['@google-cloud', '/', 'vertexai'];
    const moduleName = parts.join('');
    
    // Use Function constructor to create a dynamic import
    // This prevents Turbopack from statically analyzing the import
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const dynamicImport = new Function('moduleName', 'return import(moduleName)');
    const module = await dynamicImport(moduleName);
    return module;
  } catch (error) {
    return null;
  }
}

