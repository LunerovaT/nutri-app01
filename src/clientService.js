// src/clientService.js
// Veškeré operace s databází klientů.
// Každý terapeut vidí pouze své vlastní klienty –
// záznamy jsou vázané na userId přihlášeného uživatele.

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Název kolekce v Firestore
const CLIENTS_COLLECTION = 'clients';

// ─────────────────────────────────────────────
// NAČTENÍ VŠECH KLIENTŮ přihlášeného terapeuta
// ─────────────────────────────────────────────
export async function getClients(userId) {
  const q = query(
    collection(db, CLIENTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ─────────────────────────────────────────────
// ULOŽENÍ NOVÉHO KLIENTA
// ─────────────────────────────────────────────
// clientData obsahuje: name, email, phone + základní údaje (věk, váha…)
// mealPlan   obsahuje vygenerovaný jídelníček

export async function saveClient(userId, clientData, mealPlan) {
  const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
    userId,
    // Kontaktní údaje
    name: clientData.name,
    email: clientData.email || '',
    phone: clientData.phone || '',
    notes: clientData.notes || '',
    // Fyzické údaje (pro rychlý přístup v seznamu klientů)
    age: clientData.age,
    weight: clientData.weight,
    height: clientData.height,
    gender: clientData.gender,
    goal: clientData.goal,
    // Celý formData – potřebný pro regeneraci PDF kdykoliv
    clientData,
    // Jídelníček
    mealPlan,
    targetCalories: mealPlan.targetKcal ?? mealPlan.targetCalories ?? 0,
    // Metadata
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─────────────────────────────────────────────
// AKTUALIZACE EXISTUJÍCÍHO KLIENTA
// ─────────────────────────────────────────────
export async function updateClient(clientId, clientData, mealPlan) {
  const docRef = doc(db, CLIENTS_COLLECTION, clientId);
  await updateDoc(docRef, {
    name: clientData.name,
    email: clientData.email || '',
    phone: clientData.phone || '',
    notes: clientData.notes || '',
    age: clientData.age,
    weight: clientData.weight,
    height: clientData.height,
    gender: clientData.gender,
    goal: clientData.goal,
    mealPlan,
    targetCalories: mealPlan.targetCalories,
    updatedAt: serverTimestamp(),
  });
}

// ─────────────────────────────────────────────
// SMAZÁNÍ KLIENTA
// ─────────────────────────────────────────────
export async function deleteClient(clientId) {
  await deleteDoc(doc(db, CLIENTS_COLLECTION, clientId));
}
