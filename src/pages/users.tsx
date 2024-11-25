import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonImg } from '@ionic/react';

const UsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch your users data
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://your-backend-url.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Users</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          users.map((user) => (
            <IonCard key={user.id}>
              <IonCardHeader>
                <IonCardTitle>{user.first_name} {user.last_name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {/* Display Image */}
                {user.imageurl && (
                  <IonImg src={user.imageurl} alt={`${user.first_name} ${user.last_name}`} style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }} />
                )}
                
                {/* Display User Info */}
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Instagram:</strong> {user.instagram_account}</p>
                <p><strong>University:</strong> {user.university}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default UsersPage;
