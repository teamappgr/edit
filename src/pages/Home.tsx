import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonSpinner,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { isPlatform } from '@ionic/react';
import Layout from './tabs'; // Import the Layout component

interface Ad {
  id: string;
  title: string;
  description: string;
  created_at: string;
  min: number;
  max: number;
  date: string; // Should be in "YYYY-MM-DD" format
  time: string;
  verified: boolean;
  available: boolean;
  info: string;
}

const Main: React.FC = () => {
  const [platform, setPlatformState] = useState<string>('ios');
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('https://edit-9und.onrender.com/ads');
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
  }, []); // No dependencies, runs once
  

  const filteredAndSortedAds = ads
    .filter((ad) => {
      const today = new Date();
      const adDate = new Date(ad.date);
      return adDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  const currentAd = filteredAndSortedAds[currentIndex];

  const showNextAd = () => {
    if (currentIndex < filteredAndSortedAds.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const showPreviousAd = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const verifyAd = async (id: string) => {
    try {
      const response = await fetch(`https://edit-9und.onrender.com/ads/${id}/verify`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to verify ad');
      }
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, verified: true } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  const rejectAd = async (id: string) => {
    try {
      const response = await fetch(`https://edit-9und.onrender.com/ads/${id}/reject`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to reject ad');
      }
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, verified: false } : ad)));
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <IonPage>
            <IonHeader>
        <IonToolbar>
          <IonTitle>Events</IonTitle>
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
        ) : filteredAndSortedAds.length === 0 ? (
          <p>No upcoming ads available.</p>
        ) : (
          <>
            <IonCard key={currentAd.id}>
              <IonCardHeader>
                <IonCardTitle>{currentAd.title}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  <strong>Description:</strong> {currentAd.description}
                </p>
                <p>
                  <strong>Min:</strong> {currentAd.min}
                </p>
                <p>
                  <strong>Max:</strong> {currentAd.max}
                </p>
                <p>
                  <strong>Date:</strong> {currentAd.date}
                </p>
                <p>
                  <strong>Time:</strong> {currentAd.time}
                </p>
                <p>
                  <strong>Verified:</strong> {currentAd.verified ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Available:</strong> {currentAd.available ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Info:</strong> {currentAd.info}
                </p>
                <p>
                  <small>Created at: {new Date(currentAd.created_at).toLocaleString()}</small>
                </p>
                <IonButton color="success" onClick={() => verifyAd(currentAd.id)}>
                  Verify
                </IonButton>
                <IonButton color="danger" onClick={() => rejectAd(currentAd.id)}>
                  Reject
                </IonButton>
              </IonCardContent>
            </IonCard>

            <div className="navigation-buttons">
              <IonButton onClick={showPreviousAd} disabled={currentIndex === 0}>
                Previous
              </IonButton>
              <IonButton
                onClick={showNextAd}
                disabled={currentIndex === filteredAndSortedAds.length - 1}
              >
                Next
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
      </IonPage>
  );
};

export default Main;
