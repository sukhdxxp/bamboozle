"use client";
import { useAuthState } from "react-firebase-hooks/auth";

import { firebaseAuth } from "../../lib/data/firebase";

function UserPage() {
  const [user, loading] = useAuthState(firebaseAuth);

  if (loading) {
    return <div>Loading</div>;
  }
  if (!user) {
    return <div>User not logged in</div>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>Email Verified: {user.emailVerified.toString()}</p>
      <p>Is Anonymous: {user.isAnonymous.toString()}</p>
      <h3>Metadata</h3>
      <p>Creation Time: {user.metadata.creationTime}</p>
      <p>Last Sign-In Time: {user.metadata.lastSignInTime}</p>
      <h3>Provider Data</h3>
      <ul>
        {user.providerData.map((provider, index) => (
          <li key={index}>
            <p>Provider ID: {provider.providerId}</p>
            <p>Display Name: {provider.displayName}</p>
            <p>Email: {provider.email}</p>
            <p>Phone Number: {provider.phoneNumber}</p>
            <p>Photo URL: {provider.photoURL}</p>
          </li>
        ))}
      </ul>
      <p>Refresh Token: {user.refreshToken}</p>
      <p>Tenant ID: {user.tenantId}</p>
    </div>
  );
}

export default UserPage;
