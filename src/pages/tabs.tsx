import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { playCircle, people } from 'ionicons/icons';

// Import your page components
import AdsPage from './Home'; // Your Ads page component
import UsersPage from './users'; // Your Users page component

const Layout: React.FC = () => {
  const tabs = [
    { tab: "ads", href: "/ads", label: "Ads", icon: playCircle },
    { tab: "users", href: "/users", label: "Users", icon: people },
  ];

  return (
    <IonTabs>
      {/* Router outlet to define page components */}
      <IonRouterOutlet>
        <Route path="/ads" component={AdsPage} exact />
        <Route path="/users" component={UsersPage} exact />
        <Redirect from="/" to="/ads" exact />
      </IonRouterOutlet>

      {/* Tab bar for navigation */}
      <IonTabBar slot="bottom">
        {tabs.map((item, index) => (
          <IonTabButton key={index} tab={item.tab} href={item.href}>
            <IonIcon icon={item.icon} />
            <IonLabel>{item.label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};

export default Layout;
