export type CredentialEvidence = {
  credentialType?: string | null;
  credentialNumber?: string | null;
  credentialIssuer?: string | null;
  credentialStatus?: string | null;
  credentialVerifiedAt?: Date | string | null;
  credentialExpiresAt?: Date | string | null;
};

export function hasCompleteCredentialEvidence(evidence: CredentialEvidence) {
  const verifiedAt = evidence.credentialVerifiedAt ? new Date(evidence.credentialVerifiedAt) : null;
  return Boolean(
    evidence.credentialType?.trim()
      && evidence.credentialNumber?.trim()
      && evidence.credentialIssuer?.trim()
      && verifiedAt
      && !Number.isNaN(verifiedAt.getTime()),
  );
}

export function getPublicCredentialStatus(
  evidence: CredentialEvidence,
  now = new Date(),
): 'unverified' | 'verified' | 'expired' {
  if (!hasCompleteCredentialEvidence(evidence)) return 'unverified';
  if (evidence.credentialStatus === 'expired') return 'expired';
  if (evidence.credentialStatus !== 'verified') return 'unverified';

  const expiresAt = evidence.credentialExpiresAt ? new Date(evidence.credentialExpiresAt) : null;
  return expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt < now
    ? 'expired'
    : 'verified';
}
