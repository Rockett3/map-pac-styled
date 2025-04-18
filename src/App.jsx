// ... (tout le reste reste identique)
<div style={{ marginBottom: '1rem', textAlign: 'right' }}>
  {user ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          {user.displayName?.charAt(0).toUpperCase() || '?'}
        </div>
        <div style={{ fontSize: '0.9rem' }}>Bonjour, <strong>{user.displayName}</strong></div>
      </div>
      <button onClick={handleSignOut} style={{ marginLeft: '0.5rem' }}>Déconnexion</button>
    </div>
  ) : (
    <button onClick={handleSignIn}>Se connecter avec Google</button>
  )}
</div>
// ... (tout le reste reste identique)
