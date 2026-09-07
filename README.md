# VPetId

> Digital Identity for Pets

VPetId is a digital identity, safety, health, and tracking platform for pets.

The goal of VPetId is to give every pet a permanent digital identity that can connect:

- Pet identity
- Owner verification
- QR identification
- GPS tracking
- Lost & Found
- Nose biometric identity
- Microchip identity
- Veterinary verification
- Digital Pet Passport
- Health records
- Family sharing

---

# Product Vision

Every pet deserves a digital identity.

VPetId is designed to become a trusted identity and safety infrastructure for pets.

The platform should not be treated as a simple:

- QR code generator
- GPS tracker
- Pet social network
- Veterinary management system

Instead, VPetId combines multiple identity and safety layers into one platform.

---

# Core Identity Model

Every pet receives a permanent VPetId.

Example:

VPET-7F92A81C

Internally, the system uses UUIDs.

The human-readable Pet ID is only a public identifier.

A Pet can have:

- Pet ID
- QR Code
- Owner
- Family Members
- Nose Biometric Credential
- Microchip
- GPS Device
- Health Records
- Vaccinations
- Medical Documents
- Lost Reports
- Verification History

---

# Verification Model

VPetId uses multiple verification credentials.

## Level 1 — Registered

The owner creates a pet profile.

Includes:

- Pet profile
- Owner account
- Pet ID
- QR Code

Status:

Registered

---

## Level 2 — Owner Verified

The owner identity is verified.

Possible verification methods:

- Phone verification
- Email verification
- Identity verification

Status:

Owner Verified

---

## Level 3 — Pet Verified

The pet identity is verified through an authorized VPetId partner.

Possible evidence:

- Microchip
- Nose biometric
- Veterinary verification
- Physical pet verification

Status:

Verified Pet

---

# Biometric Identity

VPetId may support nose-print biometric identification.

The biometric system is an additional identity credential.

It must never be treated as the only source of truth.

The biometric system should support:

- Nose image capture
- Image quality assessment
- Nose detection
- Nose segmentation
- Feature extraction
- Biometric template
- Similarity matching
- Duplicate candidate detection
- Verification workflow

The system must NOT claim 100% biometric accuracy.

AI should return:

- similarity
- confidence
- candidate matches

Final identity verification may require human or veterinary verification.

---

# Microchip Identity

Microchip is treated as a physical identity credential.

Example:

985141234567890

Possible statuses:

- Owner Reported
- Pending Verification
- Vet Verified
- Already Registered
- Unknown

A VPetId partner can scan a microchip and associate it with a Pet ID.

Microchip is not GPS.

Microchip does not provide location tracking.

---

# GPS

VPetId may support GPS devices containing:

- GNSS/GPS
- 4G cellular connectivity
- SIM/eSIM
- Bluetooth
- Accelerometer
- Battery

GPS features:

- Current location
- Last known location
- Live tracking
- Location history
- Safe Zones
- Escape alerts
- Battery status
- Cellular status
- GPS status

The UI must clearly distinguish:

LIVE LOCATION

from:

LAST KNOWN LOCATION

Never present stale location data as live.

---

# Lost Mode

Lost Mode is a core VPetId feature.

When activated:

- Pet status becomes LOST
- GPS tracking can increase frequency
- Owner receives notifications
- Family members receive alerts
- Public QR profile changes to LOST
- Finder can contact the owner
- Lost Pet public page is generated
- QR scan events are recorded

The public profile must not expose private owner information.

---

# QR Identification

Every pet receives a unique QR code.

Example:

https://vpetid.com/p/VPET-7F92A81C

The QR code must not directly encode private information.

The public QR profile may show:

- Pet name
- Pet photo
- Breed
- Color
- Lost status
- Secure contact action

It must NOT expose:

- Owner home address
- Private phone number
- Family information
- Private location history

Finder contact must use a secure relay.

---

# Pet Passport

Each pet can have a digital Pet Passport.

Sections:

- Identity
- Owner
- Microchip
- Nose Biometric
- Vaccinations
- Medical Records
- Allergies
- Medications
- Documents
- Vet Records
- GPS Device
- Lost & Found History

Verified records should show:

- Verification date
- Verification source
- Partner clinic

---

# Family Sharing

A Pet can have multiple authorized family members.

Example permissions:

Owner:

- Full access

Family Member:

- View pet
- Track pet
- Lost Mode
- Notifications

Vet:

- Health records
- Verification

Finder:

- Temporary contact access

Permissions must be explicit.

---

# User Roles

## Owner

Can:

- Create pets
- Manage Pet ID
- Manage QR
- Track GPS
- Activate Lost Mode
- Manage health records
- Invite family
- Purchase devices

## Finder

Does not need an account.

Can:

- Scan QR
- View public pet profile
- Contact owner
- Share location

## Vet Partner

Can:

- Verify owner
- Verify pet
- Scan microchip
- Capture biometric data
- Update health records
- Verify vaccinations
- Issue verification certificates

## Admin

Can:

- Manage users
- Manage pets
- Manage Pet IDs
- Manage biometrics
- Manage microchips
- Manage GPS devices
- Manage partners
- Manage subscriptions
- Manage orders
- Manage lost pets
- View analytics

---

# Repository Architecture

```text
VPetId/
│
├── apps/
│   ├── web/
│   ├── mobile/
│   ├── admin/
│   ├── partner/
│   └── api/
│
├── services/
│   └── biometric/
│
├── packages/
│   ├── ui/
│   ├── shared/
│   ├── config/
│   └── types/
│
├── docs/
│   └── architecture/
│
├── infrastructure/
│   ├── docker/
│   └── deployment/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md# vpetid
