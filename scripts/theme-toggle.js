(function(){
  const STORAGE_KEY = 'preferred-theme';
  const root = document.documentElement;
  const getSystemPref = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  function applyTheme(theme){
    if(theme === 'light'){
      root.setAttribute('data-theme','light');
    } else {
      root.setAttribute('data-theme','dark');
    }
    // update button state(s)
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const isLight = theme === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      const icon = btn.querySelector('.theme-toggle__icon');
      const label = btn.querySelector('.theme-toggle__label');
      if(icon){ icon.textContent = isLight ? '☀️' : '🌙'; }
      if(label){ label.textContent = isLight ? 'Light' : 'Dark'; }
    });
  }

  function init(){
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored || getSystemPref();
    applyTheme(initial);

    // Listen for system changes
    if(window.matchMedia){
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      if(mq.addEventListener){
        mq.addEventListener('change', e => {
          const storedNow = localStorage.getItem(STORAGE_KEY);
          if(!storedNow){
            applyTheme(e.matches ? 'light' : 'dark');
          }
        });
      } else if(mq.addListener){
        mq.addListener(e => {
          const storedNow = localStorage.getItem(STORAGE_KEY);
          if(!storedNow){
            applyTheme(e.matches ? 'light' : 'dark');
          }
        });
      }
    }

    // Event delegation for all buttons
    document.addEventListener('click', function(e){
      const btn = e.target.closest('.theme-toggle');
      if(!btn) return;
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
