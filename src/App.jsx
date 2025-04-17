import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORIES = ['Bébé', 'Auto', 'Meubles', 'Jouets', 'Vêtements'];

const annoncesDeTest = [
  { id: 1, titre: 'Chaise', description: 'Meuble à donner', position: [45.5017, -73.5673], categorie: 'Meubles', prix: 0 },
  { id: 2, titre: 'Poussette', description: 'En très bon état', position: [45.503, -73.57], categorie: 'Bébé', prix: 30 },
  { id: 3, titre: 'T-shirt enfant', description: 'Jamais porté', position: [45.504, -73.565], categorie: 'Vêtements', prix: 5 },
];

export default function App() {
  const [recherche, setRecherche] = useState('');
  const [filtres, setFiltres] = useState(CATEGORIES);
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [donGratuit, setDonGratuit] = useState(false);

  const handleFiltreChange = (e) => {
    const { value, checked } = e.target;
    setFiltres((prev) => checked ? [...prev, value] : prev.filter((cat) => cat !== value));
  };

  const annoncesFiltrees = annoncesDeTest.filter((a) => {
    const matchCategorie = filtres.includes(a.categorie);
    const matchTexte = a.titre.toLowerCase().includes(recherche.toLowerCase());
    const matchPrixMin = prixMin === '' || a.prix >= parseFloat(prixMin);
    const matchPrixMax = prixMax === '' || a.prix <= parseFloat(prixMax);
    const matchDon = !donGratuit || a.prix === 0;
    return matchCategorie && matchTexte && matchPrixMin && matchPrixMax && matchDon;
  });

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <MapContainer center={[45.5017, -73.5673]} zoom={13} style={{ flex: 1, zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {annoncesFiltrees.map((a) => (
          <Marker key={a.id} position={a.position}>
            <Popup>
              <strong>{a.titre}</strong><br />{a.description}<br /><em>{a.prix === 0 ? 'Gratuit' : a.prix + ' $'}</em>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '320px', background: '#ffffffee', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000 }}>
        <h2 style={{ marginTop: 0 }}>Chercher un article</h2>
        <input
          type="text"
          placeholder="Ex : jouet, t-shirt, auto..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <input
            type="checkbox"
            checked={donGratuit}
            onChange={(e) => setDonGratuit(e.target.checked)}
          /> {' '}Afficher seulement les articles à donner
        </label>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Prix</strong>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="number"
              placeholder="Min"
              value={prixMin}
              onChange={(e) => setPrixMin(e.target.value)}
              style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <input
              type="number"
              placeholder="Max"
              value={prixMax}
              onChange={(e) => setPrixMax(e.target.value)}
              style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div>
          <strong>Catégories</strong>
          {CATEGORIES.map((cat) => (
            <div key={cat} style={{ marginTop: '4px' }}>
              <label>
                <input
                  type="checkbox"
                  value={cat}
                  checked={filtres.includes(cat)}
                  onChange={handleFiltreChange}
                /> {' '}{cat}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
