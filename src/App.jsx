import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// === Configuration Firebase (à personnaliser avec tes vraies infos Firebase plus tard) ===
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:XXXXXXX"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// === Leaflet icon fix ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// === Catégories ===
const CATEGORIES = ['À donner', 'Bébé', 'Auto', 'Meubles', 'Jouets', 'Vêtements'];

// === Annonces de test ===
const annoncesDeTest = [
  { id: 1, titre: 'Chaise', description: 'Meuble à donner', position: [45.5017, -73.5673], categorie: 'Meubles', prix: 0 },
  { id: 2, titre: 'Poussette', description: 'Très bon état', position: [45.503, -73.57], categorie: 'Bébé', prix: 30 },
];

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [filtres, setFiltres] = useState(CATEGORIES);
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [mapCenter, setMapCenter] = useState([45.5017, -73.5673]);
  const [ville, setVille] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleFiltreChange = (e) => {
    const { value, checked } = e.target;
    setFiltres((prev) => checked ? [...prev, value] : prev.filter((cat) => cat !== value));
  };

  const annoncesFiltrees = annoncesDeTest.filter((a) => {
    const matchCategorie = filtres.includes('À donner') && a.prix === 0
      ? true
      : filtres.includes(a.categorie);
    return (
      matchCategorie &&
      a.titre.toLowerCase().includes(recherche.toLowerCase()) &&
      (prixMin === '' || a.prix >= parseFloat(prixMin)) &&
      (prixMax === '' || a.prix <= parseFloat(prixMax))
    );
  });

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
      });
    }
  };

  const handleCitySearch = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ville}`);
    const data = await response.json();
    if (data[0]) {
      const { lat, lon } = data[0];
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <MapContainer center={mapCenter} zoom={13} style={{ flex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ChangeView center={mapCenter} />
        {annoncesFiltrees.map((a) => (
          <Marker key={a.id} position={a.position}>
            <Popup>
              <strong>{a.titre}</strong><br />{a.description}<br />
              <em>{a.prix === 0 ? 'Gratuit' : a.prix + ' $'}</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '320px', background: '#ffffffee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000 }}>
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          {user ? (
            <>
              <div style={{ fontSize: '0.9rem' }}>Connecté en tant que <strong>{user.displayName}</strong></div>
              <button onClick={handleSignOut}>Se déconnecter</button>
            </>
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
          <strong>📍 Localisation</strong><br />
          <button onClick={handleGeolocate} style={{ marginTop: '0.5rem' }}>📍 Me localiser</button>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <input type="text" placeholder="Nom de ville ou code postal" value={ville} onChange={(e) => setVille(e.target.value)} style={{ width: '100%' }} />
          <button onClick={handleCitySearch} style={{ marginTop: '0.5rem' }}>🔎 Rechercher</button>
        </div>

        {user && (
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button onClick={() => setFormVisible(!formVisible)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#007bff', color: 'white', border: 'none' }}>
              ➕ Vendre un article
            </button>
          </div>
        )}
      </div>

      {formVisible && (
        <div style={{ position: 'absolute', top: '6rem', right: '1rem', width: '320px', background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <h3>Nouvelle annonce</h3>
          <p><em>(Fonctionnalité à venir)</em></p>
          <button onClick={() => setFormVisible(false)} style={{ marginTop: '0.5rem' }}>Fermer</button>
        </div>
      )}
    </div>
  );
}
