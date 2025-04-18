import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  { id: 2, titre: 'Poussette', description: 'Très bon état', position: [45.503, -73.57], categorie: 'Bébé', prix: 30 },
];

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function App() {
  const [recherche, setRecherche] = useState('');
  const [filtres, setFiltres] = useState(CATEGORIES);
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [donGratuit, setDonGratuit] = useState(false);
  const [mapCenter, setMapCenter] = useState([45.5017, -73.5673]);
  const [ville, setVille] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const mapRef = useRef();

  const handleFiltreChange = (
