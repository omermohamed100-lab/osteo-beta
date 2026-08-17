// Node 24 can intermittently fail os.userInfo() on Windows before tsx starts.
// tsx prefers geteuid() when available, so provide the harmless missing API.
if (process.platform === 'win32' && typeof process.geteuid !== 'function') {
  Object.defineProperty(process, 'geteuid', {
    value: () => 0,
    configurable: true,
  });
}
