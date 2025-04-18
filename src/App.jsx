import React, { useState, useEffect } from 'react';
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
  storageBucket: "map-pac-c3843.appspot.com",
  messagingSenderId: "341137715933",
  appId: "1:341137715933:web:356fe0cf7b24368695a134"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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
  const [recherche, setRecherche] = useState('');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [filtres, setFiltres] = useState(CATEGORIES);
  const [ville, setVille] = useState('');

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
  const handleFiltreChange = (e) => {
    const { value, checked } = e.target;
    setFiltres((prev) => checked ? [...prev, value] : prev.filter((cat) => cat !== value));
  };

  const handleCitySearch = async () => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ville}`);
    const data = await response.json();
    if (data[0]) {
      const { lat, lon } = data[0];
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    }
  };

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
          email: user.email,
          photoURL: user.photoURL || null
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

      <h2>Chercher un article</h2>
      <input type="text" placeholder="Recherche..." value={recherche} onChange={(e) => setRecherche(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }} />

      <div>
        <strong>Prix</strong>
        <div style={{ display: 'flex', gap

