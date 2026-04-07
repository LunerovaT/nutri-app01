// App.jsx
import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { getClients, saveClient, deleteClient } from './clientService';
import { generateMealPlan } from './calculations';

import LoginScreen from './components/LoginScreen';
import ClientForm from './components/ClientForm';
import MealPlanView from './components/MealPlanView';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [screen, setScreen] = useState('list');
  const [mealPlan, setMealPlan] = useState(null);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const loadClients = useCallback(async () => {
    if (!user) return;
    setDbLoading(true);
    try {
      const data = await getClients(user.uid);
      setClients(data);
    } catch (err) {
      console.error('Chyba při načítání klientů:', err);
    } finally {
      setDbLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadClients();
    else setClients([]);
  }, [user, loadClients]);

  const handleFormSubmit = async (formData) => {
    const plan = generateMealPlan(formData);
    setMealPlan(plan);
    setClientData(formData);
    try {
      await saveClient(user.uid, formData, plan);
      await loadClients();
    } catch (err) {
      console.error('Chyba při ukládání:', err);
    }
    setScreen('plan');
  };

  const handleOpenClient = (client) => {
    setMealPlan(client.mealPlan);
    setClientData(client.clientData ?? null); // načte uložená data z Firestore
    setScreen('plan');
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Opravdu chcete smazat tohoto klienta?')) return;
    try {
      await deleteClient(clientId);
      await loadClients();
    } catch (err) {
      console.error('Chyba při mazání:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setScreen('list');
    setMealPlan(null);
  };

  if (authLoading) return <LoadingScreen text="Načítám aplikaci…" />;
  if (!user) return <LoginScreen />;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f4f1',
        fontFamily: 'sans-serif',
      }}
    >
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: 24 }}>🥗</span>
          <span style={s.headerTitle}>NutriApp</span>
        </div>
        <div style={s.headerRight}>
          {screen !== 'list' && (
            <button onClick={() => setScreen('list')} style={s.breadcrumb}>
              ← Seznam klientů
            </button>
          )}
          <span style={s.headerEmail}>{user.email}</span>
          <button onClick={handleSignOut} style={s.signOutBtn}>
            Odhlásit
          </button>
        </div>
      </header>

      <main style={{ padding: '24px 16px' }}>
        {screen === 'list' && (
          <div style={s.container}>
            <div style={s.listHeader}>
              <h2 style={s.listTitle}>Moji klienti</h2>
              <button onClick={() => setScreen('form')} style={s.newBtn}>
                + Nový klient
              </button>
            </div>

            {dbLoading && <p style={s.hint}>Načítám…</p>}

            {!dbLoading && clients.length === 0 && (
              <div style={s.emptyState}>
                <p style={{ fontSize: 40 }}>👤</p>
                <p style={{ color: '#888' }}>Zatím nemáte žádné klienty.</p>
                <button onClick={() => setScreen('form')} style={s.newBtn}>
                  Přidat prvního klienta
                </button>
              </div>
            )}

            {clients.map((client) => (
              <div key={client.id} style={s.clientCard}>
                <div
                  style={s.clientInfo}
                  onClick={() => handleOpenClient(client)}
                >
                  <div style={s.clientName}>{client.name}</div>
                  <div style={s.clientMeta}>
                    {client.age} let · {client.weight} kg · {client.height} cm
                    {client.email && ` · ${client.email}`}
                  </div>
                  <div style={s.clientKcal}>
                    Cílový příjem:{' '}
                    <strong>
                      {client.mealPlan?.targetKcal || client.targetCalories}{' '}
                      kcal
                    </strong>
                  </div>
                </div>
                <div style={s.clientActions}>
                  <button
                    onClick={() => handleOpenClient(client)}
                    style={s.viewBtn}
                  >
                    Zobrazit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    style={s.deleteBtn}
                  >
                    Smazat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'form' && <ClientForm onSubmit={handleFormSubmit} />}

        {screen === 'plan' && mealPlan && (
          <MealPlanView
            plan={mealPlan}
            clientData={clientData}
            onReset={() => setScreen('list')}
            onNewClient={() => setScreen('form')}
          />
        )}
      </main>
    </div>
  );
}

function LoadingScreen({ text }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f4f1',
        color: '#2d6a4f',
        fontSize: 16,
      }}
    >
      {text}
    </div>
  );
}

const s = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#2d6a4f',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  headerTitle: { color: '#fff', fontWeight: 700, fontSize: 18 },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  headerEmail: { color: '#c8e6d4', fontSize: 13 },
  breadcrumb: {
    padding: '6px 14px',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.4)',
    color: '#fff',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  signOutBtn: {
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid #c8e6d4',
    color: '#fff',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  container: { maxWidth: 700, margin: '0 auto' },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  listTitle: { margin: 0, color: '#2d6a4f', fontSize: 22 },
  newBtn: {
    padding: '10px 20px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  clientCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    borderRadius: 10,
    padding: '16px 20px',
    marginBottom: 10,
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    flexWrap: 'wrap',
    gap: 12,
  },
  clientInfo: { flex: 1, cursor: 'pointer' },
  clientName: {
    fontWeight: 700,
    fontSize: 16,
    color: '#1a3d2b',
    marginBottom: 4,
  },
  clientMeta: { fontSize: 13, color: '#888', marginBottom: 2 },
  clientKcal: { fontSize: 13, color: '#555' },
  clientActions: { display: 'flex', gap: 8 },
  viewBtn: {
    padding: '7px 14px',
    background: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '7px 14px',
    background: 'transparent',
    color: '#c0392b',
    border: '1px solid #c0392b',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
  },
  hint: { color: '#888', fontSize: 14, textAlign: 'center' },
};
