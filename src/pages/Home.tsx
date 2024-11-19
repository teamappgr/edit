import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonToast,
  IonButton,
} from '@ionic/react';
import { isPlatform } from '@ionic/react';

import './Home.css'; // Optional: Add custom styles if needed

interface Ad {
  id: string;
  title: string;
  description: string;
  created_at: string;
  min: number;
  max: number;
  date: string;
  time: string;
  verified: boolean;
  available: boolean;
  info: string;
}

const Main: React.FC = () => {
  const [platform, setPlatformState] = useState<string>('ios'); // Set to 'ios' by default
  const [ads, setAds] = useState<Ad[]>([]); // State for ads
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch ads from the server
  useEffect(() => {
    if (isPlatform('ios')) {
      setPlatformState('ios');
    } else if (isPlatform('android')) {
      setPlatformState('android');
    } else {
      setPlatformState('web');
    }
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:5000/ads'); // Update with your backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch ads');
        }
        const data = await response.json();
        setAds(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Verify an ad
  const verifyAd = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/ads/${id}/verify`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to verify ad');
      }
      const updatedAd = await response.json();
      setAds(ads.map(ad => (ad.id === id ? { ...ad, verified: true } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  // Reject an ad
  const rejectAd = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/ads/${id}/reject`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to reject ad');
      }
      const updatedAd = await response.json();
      setAds(ads.map(ad => (ad.id === id ? { ...ad, verified: false } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ads</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <div className="loading">
            <IonSpinner name="crescent" />
            <p>Loading ads...</p>
          </div>
        ) : error ? (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            onDidDismiss={() => setError(null)}
          />
        ) : (
          ads.map((ad) => (
            <IonCard key={ad.id}>
              <IonCardHeader>
                <IonCardTitle>{ad.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p><strong>Description:</strong> {ad.description}</p>
                <p><strong>Min:</strong> {ad.min}</p>
                <p><strong>Max:</strong> {ad.max}</p>
                <p><strong>Date:</strong> {ad.date}</p>
                <p><strong>Time:</strong> {ad.time}</p>
                <p><strong>Verified:</strong> {ad.verified ? 'Yes' : 'No'}</p>
                <p><strong>Available:</strong> {ad.available ? 'Yes' : 'No'}</p>
                <p><strong>Info:</strong> {ad.info}</p>
                <p><small>Created at: {new Date(ad.created_at).toLocaleString()}</small></p>
                <IonButton color="success" onClick={() => verifyAd(ad.id)} disabled={ad.verified}>
                  Verify
                </IonButton>
                <IonButton color="danger" onClick={() => rejectAd(ad.id)} disabled={!ad.verified}>
                  Reject
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Main;
