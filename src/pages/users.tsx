import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonButton, IonImg, IonToast } from '@ionic/react';

const UsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Show the current user
  const currentUser = users[currentUserIndex];

  // Handle Next and Previous buttons
  const showNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prevIndex => prevIndex + 1);
    }
  };

  const showPreviousUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(prevIndex => prevIndex - 1);
    }
  };

  // Handle Verify action
  const verifyUser = async (id: string) => {
    try {
      const response = await fetch(`https://edit-9und.onrender.com/${id}/verify`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to verify user');
      }

      // Update the user list by setting the user as verified
      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? { ...user, verified: true } : user
        )
      );

      setError('User verified successfully');
    } catch (error: any) {
      setError(error.message || 'An error occurred while verifying the user');
    }
  };

  // Handle Reject action
  const rejectUser = async (id: string) => {
    try {
      const response = await fetch(`https://edit-9und.onrender.com/${id}/reject`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }

      // Update the user list by setting the user as rejected
      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedUser.id ? { ...user, verified: false } : user
        )
      );

      setError('User rejected successfully');
    } catch (error: any) {
      setError(error.message || 'An error occurred while rejecting the user');
    }
  };

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
        ) : error ? (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            onDidDismiss={() => setError(null)}
          />
        ) : users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          <>
            <IonCard key={currentUser.id}>
              <IonCardHeader>
                <IonCardTitle>{currentUser.first_name} {currentUser.last_name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {/* Display Image */}
                {currentUser.image_url && (
                  <IonImg
                    src={currentUser.image_url}
                    alt={`${currentUser.first_name} ${currentUser.last_name}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
                  />
                )}

                {/* Display User Info */}
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Phone:</strong> {currentUser.phone}</p>
                <p><strong>Instagram:</strong> {currentUser.instagram_account}</p>
                <p><strong>University:</strong> {currentUser.university}</p>
                <p><strong>Gender:</strong> {currentUser.gender}</p>
                <p><strong>Verified:</strong> {currentUser.verified ? 'Yes' : 'No'}</p>
                
                {/* Verify and Reject buttons */}
                <IonButton color="success" onClick={() => verifyUser(currentUser.id)}>
                  Verify
                </IonButton>
                <IonButton color="danger" onClick={() => rejectUser(currentUser.id)}>
                  Reject
                </IonButton>
              </IonCardContent>
            </IonCard>

            <div className="navigation-buttons">
              <IonButton onClick={showPreviousUser} disabled={currentUserIndex === 0}>
                Previous
              </IonButton>
              <IonButton onClick={showNextUser} disabled={currentUserIndex === users.length - 1}>
                Next
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UsersPage;
