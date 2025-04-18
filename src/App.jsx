return (
  <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
    <MapContainer center={mapCenter} zoom={13} style={{ flex: 1 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ChangeView center={mapCenter} />
    </MapContainer>

    <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '320px', background: '#ffffffee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000 }}>
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {user.displayName?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <div style={{ fontSize: '0.9rem' }}>Bonjour, <strong>{user.displayName}</strong></div>
            </div>
            <button onClick={handleSignOut} style={{ marginLeft: '0.5rem' }}>Déconnexion</button>
          </div>
        ) : (
          <div>
            <button onClick={handleSignIn}>Se connecter avec Google</button>
            <div style={{ color: 'red', fontWeight: 'bold', marginTop: '1rem' }}>
              ❗ Vous devez vous connecter pour vendre un article ou voir votre profil.
            </div>
          </div>
        )}
      </div>
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <MapContainer center={mapCenter} zoom={13} style={{ flex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ChangeView center={mapCenter} />
      </MapContainer>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '320px', background: '#ffffffee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000 }}>
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user.displayName?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem' }}>Bonjour, <strong>{user.displayName}</strong></div>
              </div>
              <button onClick={handleSignOut} style={{ marginLeft: '0.5rem' }}>Déconnexion</button>
            </div>
          ) : (
            <button onClick={handleSignIn}>Se connecter avec Google</button>
          )}
        </div>

        <h2>Chercher un article</h2>
        <input type="text" placeholder="Recherche..." value={recherche} onChange={(e) => setRecherche(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }} />

        <div>
          <strong>Prix</strong>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input type="number" placeholder="Min" value={prixMin} onChange={(e) => setPrixMin(e.target.value)} style={{ width: '50%' }} />
            <input type="number" placeholder="Max" value={prixMax} onChange={(e) => setPrixMax(e.target.value)} style={{ width: '50%' }} />
          </div>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <strong>Catégories</strong>
          {CATEGORIES.map((cat) => (
            <label key={cat} style={{ display: 'block' }}>
              <input type="checkbox" value={cat} checked={filtres.includes(cat)} onChange={handleFiltreChange} /> {cat}
            </label>
          ))}
        </div>

        <hr />
        <div>
          <strong>📍 Ville</strong>
          <input type="text" placeholder="Ville ou code postal" value={ville} onChange={(e) => setVille(e.target.value)} style={{ width: '100%', marginTop: '0.5rem' }} />
          <button onClick={handleCitySearch} style={{ marginTop: '0.5rem' }}>🔎 Rechercher</button>
        </div>

        {user && (
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button onClick={() => setFormVisible(!formVisible)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#007bff', color: 'white', border: 'none' }}>
              ➕ Vendre un article
            </button>
          </div>
        )}

        {confirmation && <div style={{ marginTop: '1rem', color: 'green' }}>{confirmation}</div>}
      </div>

      {formVisible && (
        <div style={{ position: 'absolute', top: '6rem', right: '1rem', width: '320px', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <h3>Nouvelle annonce</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required style={{ width: '100%', marginBottom: '0.5rem' }} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', marginBottom: '0.5rem' }} />
            <input type="number" placeholder="Prix" value={prix} onChange={(e) => setPrix(e.target.value)} required style={{ width: '100%', marginBottom: '0.5rem' }} />
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="submit" style={{ width: '100%' }}>Publier</button>
          </form>
        </div>
      )}
    </div>
  );
}
