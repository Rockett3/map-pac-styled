import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOazVUze0UZUUEZreswoAzf0g4Mfy0ZEY",
  authDomain: "map-pac-c3843.firebaseapp.com",
  projectId: "map-pac-c3843",
  storageBucket: "map-pac-c3843.firebasestorage.app",
  messagingSenderId: "341137715933",
  appId: "1:341137715933:web:356fe0cf7b24368695a134"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORIES = ['À donner', 'Bébé', 'Auto', 'Meubles', 'Jouets', 'Vêtements'];

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [mapCenter, setMapCenter] = useState([45.5017, -73.5673]);
  const [formVisible, setFormVisible] = useState(false);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else setUser(null);
    });
    getRedirectResult(auth).catch(console.error);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter([latitude, longitude]);
        },
        () => {
          setMapCenter([45.5017, -73.5673]);
        }
      );
    }
  }, []);

  const handleSignIn = () => signInWithRedirect(auth, provider);
  const handleSignOut = () => { signOut(auth); setUser(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'annonces'), {
        titre,
        description,
        prix: parseFloat(prix),
        categorie,
        position: { lat: mapCenter[0], lng: mapCenter[1] },
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email
        },
        createdAt: serverTimestamp()
      });
      setConfirmation('Annonce ajoutée avec succès !');
      setTitre(''); setDescription(''); setPrix(''); setCategorie(CATEGORIES[0]);
      setTimeout(() => setConfirmation(''), 4000);
      setFormVisible(false);
    } catch (error) {
      console.error('Erreur Firestore :', error);
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
      </MapContainer>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '320px', background: '#ffffffee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000 }}>
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          {user ? (
            <>
              <div style={{ fontSize: '0.9rem' }}>Connecté : <strong>{user.displayName}</strong></div>
              <button onClick={handleSignOut}>Déconnexion</button>
            </>
          ) : (
            <button onClick={handleSignIn}>Se connecter avec Google</button>
          )}
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
